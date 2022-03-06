const mongoose = require('mongoose');

// schema
const CartSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, '유저ID']
  },
  name: {
    type: String,
    required: [true, '이름'],
    trim: true
  },
  ptTitle: {
    type: String,
    required: [true, 'PT프로그램 한글'],
    trim: true
  },
  ptEngTitle: {
    type: String,
    required: [true, 'PT프로그램 영문'],
    trim: true
  },
  category: {
    type: String,
    required: [true, '카테고리']
  },
  purchaseAt: {
    type: Date,
    default: Date.now
  },
  img: {
    type: String,
    required: [true, '이미지 파일 경로']
  },
  mlUrl: {
    type: String,
    required: [true, '머신러닝 페이지로 가는 경로']
  }
});

// model & export
var Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;