const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const util = {};
const html2canvas = require('html2canvas');
var User = require('../models/User');
var PtShop = require('../models/PtShop');
var Cart = require('../models/Cart');

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
  console.log("로그인 여부 : " + req.isAuthenticated());
  if (req.isAuthenticated()) {
    // 로그인 상태
    res.render('home/welcome', { cart: true });
  } else {
    // 비로그인 상태
    res.render('home/welcome', { cart: false });
  }
});

// 예시: 어깨 자세
router.get('/edge', function (req, res) {
  res.render('ml/edge');
})

// router.post('/capture', function (req, res) {

// })

// Login
router.get('/login', function (req, res) {
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('home/login', {
    username: username,
    errors: errors
  });
});

router.get('/fetch', function (req, res) {
  res.json(200, {
    name: 1,
    age: 2,
    fetch상태: "정상"
  })
})

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

// 로그인 안하고 채팅들어갈 때의 처리
router.get("/socket", function (req, res) {
  if (!req.isAuthenticated()) {
    req.flash("errors", { login: "로그인을 먼저 해주세요!" });
    res.redirect("/login");
  }
});

// 구매
// https://beausty23.tistory.com/68
// 로그인 후 passport로 저장된? 세션 정보는 req.user로 읽을 수 있다.
router.post('/:onlinePg/purchase', function (req, res) {
  console.log("구매완료");
  const onlinePg = req.params.onlinePg;
  User.findOne({ username: req.user.username }).exec(function (err, user) {
    const name = user.name;
    const uname = req.user.username;

    PtShop.findOne({ engTitle: onlinePg }).exec(function (err, ptShop) {
      // console.log(ptShop);
      const ptTitle = ptShop.title;
      const img = ptShop.img;
      const category = ptShop.body;

      let cart = new Cart({
        username: uname,
        name: name,
        ptTitle: ptTitle,
        ptEngTitle: onlinePg,
        img: img,
        category: category,
        mlUrl: "/onlinept/ml/" + onlinePg
      })
      cart.save();

    })
    res.send(`<script>alert('결제가 완료되었습니다.');location.href='/users/${uname}/cart';</script>`);
  })
});

// router.get('/purchaseSuccess', function (req, res) {
//   console.log(req.user);
// })

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
      const pt = ptShop[0]
      res.render('home/purchase_page', { pt: pt });
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
  console.log("/onlinept/:onlinePg " + result);
  PtShop.find({ engTitle: result }, (err, ptShop) => {
    if (err) return res.json(err);
    const pt = ptShop[0]
    res.render('onlinePt/onlinePg', { pt: pt });
  })
});





// 실제 운동하는 머신러닝 페이지
router.get('/onlinept/ml/squat', function (req, res) {
  res.render('ml/squat');
});

router.get('/onlinept/ml/lunge', function (req, res) {
  res.render('ml/lunge');
});

router.get('/onlinept/ml/pullup', function (req, res) {
  res.render('ml/pullup');
});

router.get('/onlinept/ml/vraise', function (req, res) {
  res.render('ml/vraise');
});

router.get('/onlinept/ml/sidelr', function (req, res) {
  res.render('ml/sidelr');
});

router.get('/onlinept/ml/shoulder', function (req, res) {
  res.render('ml/shoulder');
});

router.get('/onlinept/ml/jumpingjack', function (req, res) {
  res.render('ml/jumpingjack');
});

router.get('/onlinept/ml/plank', function (req, res) {
  res.render('ml/plank');
});

router.get('/onlinept/ml/wallsquat', function (req, res) {
  res.render('ml/wallsquat');
});

// // AI PT
// router.get('/aipt', function (req, res) {
//   PtShop.find({}, function (err, ptShop) {
//     Cart.find({ username: req.params.username }, function (err, cart) {
//       if (err) return res.json(err);
//       res.render('home/aipt', { cart: cart });
//     });
//   });
// });


module.exports = router;

// if(req.isAuthenticated()){
//   res.render('home/purchase_two')
// } else {
//   req.flash('errors', {login:'로그인을 먼저 해주세요!'});
//   res.redirect('/login');
// }