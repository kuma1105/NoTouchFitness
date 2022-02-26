const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

// serialize & deserialize User
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findOne({ _id: id }, function (err, user) {
    done(err, user);
  });
});

// local strategy
passport.use('local-login',
  new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: true, // 세션에 저장하겠다는 의미 (정)
    passReqToCallback: true
  },
    function (req, username, password, done) {
      // DB에서 입력한 username과 같은 username을 하나 찾는다.
      User.findOne({ username: username })
        .select({ password: 1 })
        .exec(function (err, user) {
          if (err) return done(err);

          if (user && user.authenticate(password)) {
            return done(null, user);
          }
          else {
            req.flash('username', username);
            req.flash('errors', { login: '아이디 혹은 패스워드가 틀립니다!' });
            return done(null, false);
          }
        });
    }
  )
);

module.exports = passport;