const { groupLog, lg } = require("../utils");
// if else || && 삼항연산자
// 괄호안에서는 비동기 통신을 할 수 없다.
groupLog("에러가 나는 문법들")(() => {
  // 컴파일이 불가능한 코드
  // if(var a= 0){
  //     lg(a)
  // }

  // 실행은 가능하지만 f1을 쓸 수 없는 코드
  if (function f1() {}) {
    lg("hi");
  }
  f1();
});

groupLog("괄호 안에서 실행 가능한 코드들")(() => {
  var a;
  if ((a = 5)) {
    lg(a, 5);
  }
  var obj = {};

  if ((obj.a = 5)) lg({ obj });
  if ((obj.b = false)) {
    lg(obj.b);
  } else {
    lg({ obj });
  }

  var c;
  if ((c = obj.c = true)) {
    lg({ obj, c });
  }

  function add(a, b) {
    return a + b;
  }

  if (add(1, 2)) {
    lg("hi");
  }
  var a;
  if ((a = add(1, 2))) {
    lg({ a });
  }
  var b;
  if ((b = add(2, -2))) {
    lg("b is ture", b);
  } else {
    lg("b is false", b);
  }
  if (
    function () {
      return true;
    }
  ) {
    lg("t");
  }

  // if문 안에 들어가는 ()안의 문법들은 while 에서도 동일하게작용한다.
});

// ||랑 &&로 if else를 줄일 수 있다. 하지만 가독성이 떨어지므로 코드에서는 지양
// 그럼 왜 알아야하는가? -> 오픈소스 라이브러리의 경우 이런 문법 많이 씀
groupLog("||&&")(() => {
  var a = true;
  var b = false;
  lg(a || b, true);
  lg(b || a, true);
  lg(a && b, false);
  lg(b && a, false);

  var a = "hi";
  var b = "";
  lg(a || b, "hi");
  lg(b || a, "hi");
  lg(a && b, "");
  lg(b && a, ""); // b가 falsy여서 b만 평가하고, b를 반환한다.

  function add(a, b) {
    return a + b;
  }
  lg(0 && 1, 0);
  lg(1 && 0, 0);
  lg([] || {}, []);
  lg([] && {}, {});
  lg(([] && {}) || 0, {});
  lg(0 || 0 || 0 || 1 || null, 1);
  lg(add(10, -10) || add(10, -10), 0);
  lg(add(10, -10) || add(10, 10), 20);
  var v;
  lg((v = add(10, -10)) || (v++ && 20), 0);
  lg((v = add(10, -10)) || (++v && 20), 20);
  var v1;
  lg(
    ((1 || 0) && (v = add(1, 2))) || (v1 = add(2, 5)),
    v === 3,
    v1 === undefined
  );
  var v1;
  lg(((1 || 0) && (v = add(1, -1))) || (v1 = add(2, 5)), v === 0, v1 === 7);
});

groupLog("삼항연산자")(() => {
  function sum(arr) {
    return (function _sum(arr, v) {
      return arr.length ? _sum(arr, arr.shift() + v) : v;
    })(arr, 0);
  }
  var a = false;
  var c = a ? 10 : sum([1, 2, 3, 4]);
  lg(c);
  const sum2 = (arr) => {
    const _sum = (arr, v) => (arr.length ? _sum(arr, arr.shift() + v) : v);
    return _sum(arr, 0);
  };

  var a = false;
  var c = a ? 10 : sum2([1, 2, 3, 4]);
  lg(c);
});
groupLog(
  "함수를 실행하는 괄호{}는 클로저를 만들수도 있고, 비동기 상황이 생기거나 다른 실행컨택스트가 연결되는 상황이 발생 할 수 있다."
)(() => {
  const add5 = function (a) {
    // 새로운 공간
    lg(a + " 와 함께 실행하고있지로오오옹");
    // 실행컨택스트
    // 클로저
    // 비동기 상황

    return 5 + a;
  };
  lg(add5(10), 15);

  // before call f
  const call = function (f) {
    lg("before f");
    const self = this;
    return function (args) {
      // cleanup 로직
      // 화살표 함수를 이용하여 익명함수를 선언했다면  f가 적절한 bind를 받았다는 가정 하에 self를 하지 않고 this에 접근할 수 있다.
      lg({ args, self }, this);
      const res = f(args);
      lg("after f");
      return res;
    };
  };
  const ggg = {
    secretNum: 100,
    add: function (a) {
      lg("in add", this);
      return this.secretNum + a;
    },
    add5,
  };
  lg(ggg.add(50), 150);
  // ggg.add라는 메서드를 다른 함수에 넘긴다면
  // const ggg_add = ggg.add -> ggg_add를 넘겨 사용하는 것과 같은 효과가 되므로
  // this context를 bind하지 않는다면 잃게 된다.
  // 그러므로 콜백으로 넘기면 꼭 바인딩 해서 this context를 넘겨주도록 하자.

  lg(call(ggg.add.bind(ggg))(5), 105);
  const obj = { a: 1, call };
  lg(call.bind(obj)(ggg.add5.bind(ggg))(5), 10);
  lg(obj.call(ggg.add5.bind(ggg))(15), 20);
});
