const mongoose = require('mongoose');

// schema
const PtShopSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, '제목을 입력해주세요!']
    },
    engTitle:{
        type: String,
        required: [true, 'title의 영문, url 파라미터에 사용']
    },
    body: {
        type: String,
        required: [true, '내용을 입력해주세요!']
    },
    img: {
        type: String,
        required: [true, '이미지 경로']
    },
    price: {
        type: Number,
        required: [true, '가격']
    },
    remain: {
        type: Number,
        required: [true, '남은 자리']
    },
    dc: {
        type: Number,
        required: [true, '할인율']
    },
    url: {
        type: String,
        required: [true, '프로그램 url']
    },
    mp4Url: {
        type: String,
        required: [true, '프로그램 동영상 url']
    }
});

// model & export
var PtShop = mongoose.model('PtShop', PtShopSchema);
module.exports = PtShop;