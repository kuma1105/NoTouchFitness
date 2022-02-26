const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const util = {};
var User = require('../models/User');
const PtShop = require('../models/PtShop');

util.isLoggedin = function (req, res, next) {
  //req.isAuthenticated()는 passport에서 제공하는 함수로, 현재 로그인이 되어있는지 아닌지를true,false로 return합니다.
  if (req.isAuthenticated()) {
    next();
  }
  else {
    req.flash('errors', { login: '로그인을 먼저 해주세요!' });
    res.redirect('/login');
  }
}

function checkPermission(req, res, next) {
  User.findOne({ username: req.params.username }, function (err, user) {
    if (err) return res.json(err);
    if (user.id != req.user.id) return util.noPermission(req, res);

    next();
  });
}


// Home
router.get('/', function (req, res) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    // 로그인 상태
    res.render('home/welcome', { cart: true });
  } else {
    // 비로그인 상태
    res.render('home/welcome', { cart: false });
  }
});


// Login
router.get('/login', function (req, res) {
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('home/login', {
    username: username,
    errors: errors
  });
});


// Post Login
router.post('/login',
  function (req, res, next) {
    var errors = {};
    var isValid = true;

    if (!req.body.username) {
      isValid = false;
      errors.username = '아이디를 입력해주세요!';
    }
    if (!req.body.password) {
      isValid = false;
      errors.password = '비밀번호를 입력해주세요!';
    }

    if (isValid) {
      next();
    }
    else {
      req.flash('errors', errors);
      res.redirect('/login');
    }
  },
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login'
  }
  ));

// Logout
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// 구매
// https://beausty23.tistory.com/68
// 로그인 후 passport로 저장된? 세션 정보는 req.user로 읽을 수 있다.
router.post('/purchase', function (req, res) {
  console.log("구매완료");
  User.findOne({ username: req.user.username }, function (err, user) {
    const username = req.user.username;
    res.send(`<script>alert('결제가 완료되었습니다.');location.href='/users/${username}/cart';</script>`);
  });
});

router.get('/purchaseSuccess', function (req, res) {
  console.log(req.user);
})

// 온라인PT nav 메뉴
router.get('/onlinept', function (req, res) {
  PtShop.find({}, (err, ptShop) => {
    if (err) return res.json(err);
    res.render('onlinePt/onPtPrograms', { ptShop: ptShop });
  })
});

// 구매 페이지
router.get('/onlinept/:onlinePg/purchase', function (req, res) {
  if (req.isAuthenticated()) {
    // [0] will be empty since routes start with '/'
    const path = req.path.split('/');
    // console.log(path[1]);
    // console.log(path[2]);
    // console.log(path[3]);
    PtShop.find({ engTitle: path[2] }, (err, ptShop) => {
      if (err) return res.json(err);
      // console.log(ptShop);
      const title = ptShop[0].title;
      // console.log(title);
      res.render('home/purchase_page', { title: title });
    })
  } else {
    req.flash('errors', { login: '로그인을 먼저 해주세요!' });
    res.redirect('/login');
  }
})

// 온라인PT 프로그램들
router.get('/onlinept/:onlinePg', function (req, res) {
  const pathArray = req.path.split('/');
  const pos1 = pathArray[2].indexOf('Pg');
  const result = pathArray[2].slice(0, pos1);
  console.log(result);
  res.render('onlinePt/' + result + 'Pg');
});





// 실제 운동하는 머신러닝 페이지
router.get('/onlinept/ml/squat', function (req, res) {
  res.render('ml/squat');
});

router.get('/onlinept/ml/lunge', function (req, res) {
  res.render('ml/lunge');
});


module.exports = router;

// if(req.isAuthenticated()){
//   res.render('home/purchase_two')
// } else {
//   req.flash('errors', {login:'로그인을 먼저 해주세요!'});
//   res.redirect('/login');
// }