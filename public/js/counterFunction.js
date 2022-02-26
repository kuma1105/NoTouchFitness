{/* <span id="Counter" class="counter">0</span>번. */}

var status = "stand"
var count = 0

async function predict() {
  // ...
  // 수정할 부분
  // prediction[0] = Lunge_Stand
  // prediction[1] = Lunge_Seat
  if (prediction[0].probability.toFixed(2) > 0.90) {
    if (status == "seat") {
      count++;
      counterUp();
      var audio = new Audio(count % 10 + '.mp3');
      audio.play();
    } else {
      status = "stand"
    }
  } else if (prediction[1].probability.toFixed(2) > 0.90) {
    status = "seat"
  }

  // 출력내용 : "클래스 이름 : 0.00 ~ 1.00"
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
  // ...
}

var hits = 0;
var countElement2 = document.getElementById("Counter");

// 카운터 테스트용 함수
document.body.onkeyup = function (e) {
  if (e.keyCode == 32) { // 스페이스 바
    addHit();
  }
}

var counterUp = function () {
  addHit();
}

var addHit = function () {
  hits++;
  renderHits();
}

var renderHits = function () {
  countElement.innerHTML = hits;
  countElement2.innerHTML = hits;
}

var resetHits = function () {
  hits = 0;
  renderHits();
}

//  수정 필요