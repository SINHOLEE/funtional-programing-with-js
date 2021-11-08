const { groupLog, lg } = require("../utils");

function test(a, b, c) {
  lg({ a, b, c });
  lg("this: ", this);
  lg({ arguments });
}
// 함수실행과 인자 그리고 점 다시보기
groupLog("() 다시보기")(() => {
  test(10);
});
groupLog("인자 다시보기")(() => {
  function test1(a, b) {
    lg(arguments);
    b = 10;
    lg(arguments);
  }
  test1(1, 2); // [Arguments] { '0': 1, '1': 10 }
  // arguments는 내부에서 변경이 가능한 변수이다.
  function test2(a, b) {
    arguments[1] = 55;
    lg(a, b);
  }
  test2(1, 2); // 반대로 arguments를 변경해도 인자의 a,b에 영향을 끼칠 수 있다.
});
groupLog("this 다시 보기")(function () {
  var obj = { k: 1, v: 2 };
  obj.test = test.bind(this);
  obj.test(5, 6, 7); // this === global

  obj.test = test;
  obj.test(5, 6, 7); // this === obj

  var arr = [1, 2, 3];
  arr.test = test;
  arr.test(6, 7, 8); // this === arr

  var obj_test = obj.test;
  obj_test(10, 11, 12); // this === global
  // 즉 .으로 접근했기 때문에 this가 바뀐것이다.
  // 그러므로 어디에 붙어있는 함수인것보다, 어떻게 실행되는 함수인지가 중요하다!
  // js에서는 어떻게 선언했느냐, 어떻게 실행했느냐 두가지가 중요하다.
  // 1 어떻게 선언했느냐는 클로저와 스코프에 관련된 내용
  // 2 어떻게 실행했느냐는 this와 arguments를 결정한다.
});

groupLog("call, apply 다시보기")(() => {
  test.call(null, 1, 2, 3); //함수로서 실행
  test.call(undefined, 1, 2, 3); //함수로서 실행
  test.call(void 0, 1, 2, 3); //함수로서 실행

  var o1 = { a: 2 };
  test.call(o1, "a", "b", "c"); // 메서드로서 실행

  o1.test = test;

  o1.test.call(null, 5, 6, 7); // 함수로서 실행
  o1.test(7, 8, 9); // 메서드로서 실행
});
