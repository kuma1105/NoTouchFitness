

let circle1 = document.querySelector('.circle1');
let circle2 = document.querySelector('.circle2');
let isCrash = document.getElementById('isCrash');

// 움직이는 너비
let moveBy = 20;

// JS에는 px 개념이 없으니 + 'px'를 붙여줌
// 원들의 스폰 위치 지정
window.addEventListener('load', () => {
  // 초록 원
  circle1.style.position = 'absolute';
  circle1.style.left = 800 + 'px';
  circle1.style.top = 400 + 'px';

  // 빨간 원
  circle2.style.position = 'absolute';
  circle2.style.left = 1000 + 'px';
  circle2.style.top = 400 + 'px';
});

// 방향키로 초록 원 움직이기
window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      circle1.style.left = parseInt(circle1.style.left) - moveBy + 'px';
      break;
    case 'ArrowRight':
      circle1.style.left = parseInt(circle1.style.left) + moveBy + 'px';
      break;
    case 'ArrowUp':
      circle1.style.top = parseInt(circle1.style.top) - moveBy + 'px';
      break;
    case 'ArrowDown':
      circle1.style.top = parseInt(circle1.style.top) + moveBy + 'px';
      break;
  }
});

function count(type) {
  // 결과를 표시할 element
  const resultElement = document.getElementById('result');

  // 현재 화면에 표시된 값
  let number = resultElement.innerText;

  // 더하기/빼기
  if (type === 'plus') {
    number = parseInt(number) + 1;
  }
  // else if (type === 'minus') {
  //   number = parseInt(number) - 1;
  // }

  // 화면에 출력
  resultElement.innerText = number;

  let preNumber = 0;

  if (preNumber != number) {
    preNumber = number;
    console.log("오른쪽으로 " + moveBy + "px 움직임");
    circle1.style.left = parseInt(circle1.style.left) + moveBy + 'px';

    // 충돌체크는 x좌표 끼리 계산함
    var circle1Right = circle1.getBoundingClientRect().right;
    var circle2Left = circle2.getBoundingClientRect().left;

    console.log(circle1Right);
    console.log(circle2Left);
    if (circle2Left - circle1Right <= 0) {
      console.log("CRASH");
      isCrash.innerText = "CRASH!!!";
    }
  }

}

