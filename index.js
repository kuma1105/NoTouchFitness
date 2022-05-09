const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport');
const app = express();
const util = require('./util');
const https = require('https');
const path = require('path');
const fs = require('fs');

const SocketIO = require('socket.io');

// DB setting
const db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/NoTouchFitness');

db.once('open', function () {
  console.log('DB connected');
});
db.on('error', function (err) {
  console.log('DB ERROR : ', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({ secret: 'MySecret', resave: true, saveUninitialized: true }));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use('/', require('./routes/home'));
app.use('/posts', util.getPostQueryString, require('./routes/posts'));
app.use('/users', require('./routes/users'));
app.use('/comments', util.getPostQueryString, require('./routes/comments'));

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);

const { Server } = require("socket.io");
const io = new Server(sslServer);

sslServer.listen(3000, () =>
  console.log(
    "Secure server 🎊 on port 3000(주소앞에 https:// 추가해주어야 합니다!)"
  )
);

io.on("connection", function (socket) {
  // 홍기형꺼
  socket.on("chatting", (data) => {
    const { name, msg } = data;
    io.emit("chatting", {
      name,
      msg,
      time: new Date().getHours() + "시 " + new Date().getMinutes() + "분",
    });
  });

  // 규혁이꺼
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});





// Port setting const port = 3000; app.listen(port, function(){
// console.log('server on! http://localhost:'+port); });

// 20220418
// const sslServer = https.createServer({
//   key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//   cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
// }, app)

// sslServer.listen(
//   3000,
//   () => console.log('Secure server 🎊 on port 3000(주소앞에 https:// 추가해주어야 합니다!)')
// );
