const express = require('express');
const router = express.Router();
var User = require('../models/User');
var Cart = require('../models/Cart');
var PtShop = require('../models/PtShop');
var util = require('../util');

// New
router.get('/new', function (req, res) {
  var user = req.flash('user')[0] || {};
  var errors = req.flash('errors')[0] || {};
  res.render('users/new', { user: user, errors: errors });
});

// create
router.post('/', function (req, res) {
  User.create(req.body, function (err, user) {
    if (err) {
      req.flash('user', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/users/new');
    }
    res.redirect('/');
  });
});

// show 내정보확인
// /users/qweasd123
// {/* <a href="/users/<%= currentUser.username %>" */}
// 이렇게 링크를 설정하면 서버로 파라미터 형태로 전달된다.
// currentUser?? 이거 로직이 어떻게...
router.get('/:username', util.isLoggedin, checkPermission, function (req, res) {
  User.findOne({ username: req.params.username }, function (err, user) {
    if (err) return res.json(err);
    res.render('users/show', { user: user });
  });
});

// edit
router.get('/:username/edit', util.isLoggedin, checkPermission, function (req, res) {
  var user = req.flash('user')[0];
  var errors = req.flash('errors')[0] || {};
  if (!user) {
    User.findOne({ username: req.params.username }, function (err, user) {
      if (err) return res.json(err);
      res.render('users/edit', { username: req.params.username, user: user, errors: errors });
    });
  }
  else {
    res.render('users/edit', { username: req.params.username, user: user, errors: errors });
  }
});


// 내 BMI 정보 수정 페이지
router.get('/:username/editBMI', util.isLoggedin, checkPermission, function (req, res) {
  var user = req.flash('user')[0];
  var errors = req.flash('errors')[0] || {};
  if (!user) {
    User.findOne({ username: req.params.username }, function (err, user) {
      if (err) return res.json(err);
      res.render('users/editBMI', { username: req.params.username, user: user, errors: errors });
    });
  }
  else {
    res.render('users/editBMI', { username: req.params.username, user: user, errors: errors });
  }
});

// 내 BMI 정보 수정 update
// user.age = req.body.username[0];
// user.height = req.body.username[1];
// user.weight = req.body.username[2];
router.post('/:username/editBMI', util.isLoggedin, checkPermission, function (req, res, next) {
  User.findOne({ username: req.params.username })
    .exec(function (err, user) {
      if (err) return res.json(err);

      user.age = req.body.username[0];
      user.height = req.body.username[1];
      user.weight = req.body.username[2];
      user.bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);
      console.log(user);

      // save updated user
      user.save(function (err, user) {
        if (err) {
          // req.flash('user', req.body);
          // req.flash('errors', util.parseError(err));
          return res.redirect('/users/' + req.params.username + '/editBMI');
        }
        res.redirect('/users/' + user.username);
      });
    });
});

// 장바구니 페이지
router.get('/:username/cart', util.isLoggedin, checkPermission, function (req, res) {
  PtShop.find({}, function (err, ptShop) {
    Cart.find({ username: req.params.username }, function (err, cart) {
      if (err) return res.json(err);
      res.render('users/cart', { cart: cart });
    });
  });
});

// update
router.put('/:username', util.isLoggedin, checkPermission, function (req, res, next) {
  User.findOne({ username: req.params.username })
    .select('password')
    .exec(function (err, user) {
      if (err) return res.json(err);

      // update user object
      user.originalPassword = user.password;
      user.password = req.body.newPassword ? req.body.newPassword : user.password;
      for (var p in req.body) {
        user[p] = req.body[p];
      }

      // save updated user
      user.save(function (err, user) {
        if (err) {
          req.flash('user', req.body);
          req.flash('errors', util.parseError(err));
          return res.redirect('/users/' + req.params.username + '/edit');
        }
        res.redirect('/users/' + user.username);
      });
    });
});

// 수업 페이지
router.get('/:username/ptClass', util.isLoggedin, checkPermission, function (req, res) {
  res.render('users/ptClass');
});

// 채팅 페이지
router.get(
  "/:username/chatting",
  util.isLoggedin,
  checkPermission,
  function (req, res) {
    var user = req.flash("user")[0];
    var errors = req.flash("errors")[0] || {};
    if (!user) {
      User.findOne({ username: req.params.username }, function (err, user) {
        if (err) return res.json(err);
        res.render("users/chatting", {
          username: req.params.username,
          user: user,
          errors: errors,
        });
      });
    } else {
      res.render("users/chatting", {
        username: req.params.username,
        user: user,
        errors: errors,
      });
    }
  }
);

module.exports = router;

// private functions
function checkPermission(req, res, next) {
  User.findOne({ username: req.params.username }, function (err, user) {
    if (err) return res.json(err);
    if (user.id != req.user.id) return util.noPermission(req, res);

    next();
  });
}
