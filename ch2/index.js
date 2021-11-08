const { groupLog, lg } = require("../utils");
groupLog("key/value")(() => {
  var obj = { a: 1, b: 2 };
  lg(obj);
  obj.c = 3;
  lg(obj);
  obj["d"] = 4;
  lg(obj);
  var e = "e";
  obj[e] = 5;
  lg(obj);
  function f() {
    return "f";
  }

  obj[f()] = 6;
  lg(obj);
});

groupLog("띄어쓰기,특수문자,숫자")(() => {
  // 띄어쓰기 가능
  var obj2 = { "a a a ": 1 };
  obj2["b b b"] = 2;
  //특수문자 가능
  lg(obj2);
  var obj3 = { "margin-top": 3 };
  lg(obj3);
  // 숫자 가능 하지만 key값은 string으로 변환되서 저장됨
  var obj4 = { 1: 4 };
  obj4[2] = 50;
  lg(obj4);
});

// {}안에서는 표현식이 실행되지 않는다. 하지만 []안에서는 표현식이 실행된다.
groupLog("코드가 실행되지 않는 key영역")(() => {
  lg(
    `
       var obj5 = { (true ? "a" : "b"): 1 };
       lg(obj5);
      //SyntaxError: Unexpected token '('
  `
  );
});

groupLog("코드가 실행되는 영역")(() => {
  var obj6 = {};
  obj6[true ? "a" : "b"] = 1;
  lg(obj6, { a: 1 });
  // es6는 가능한 표현식
  var obj7 = { [true ? "a" : "b"]: 2 };
  lg(obj7);
});

// delete
groupLog("기본 객체 지우기")(() => {
  var obj = { a: 1, b: 2, c: 3 };
  delete obj.a;
  delete obj.a; // 없는 프로퍼티를 지울경우 유연하게 그냥 넘어감

  delete obj["b"];
  lg(obj);
  // delete Array.prototype.push; // 진짜 위험한 구문...
  const arr = [1, 2, 3];
  arr.push(1);
  lg(arr);
  // TypeError: arr.push is not a function
});

groupLog("일반적인 함수 정의")(() => {
  function add1(a, b) {
    return a + b;
  }
  var add2 = function (a, b) {
    return a + b;
  };
  var m = {
    add3: function (a, b) {
      return a + b;
    },
  };

  lg(m.add3(1, 2), add2(1, 2), add1(1, 2));
});
groupLog("호이스팅")(() => {
  add(1, 2);
  function add(a, b) {
    return a + b;
  }
  lg(typeof add2); //undefined
  add2(1, 2); //add2 is not a function -> 선언은 되어있지만 함수참조가 되지 않은 상황
  var add2 = function (a, b) {
    return a + b;
  };
  lg(typeof add2); // function

  hi(); // hi is not defined -> 선언 자체가 되지 않은 상태
  hi; // hi is not defined -> 선언 자체가 되지 않은 상태
  // 변수는 선언단계와 초기화 단계가 구분되는 반면, 함수선언은 선언과 동시에 초기화가 이루어지므로 참조뿐아니라 실행도 가능하다.
});

groupLog("호이스팅 활용")(() => {
  function add(a, b) {
    return valid() ? a + b : new Error("인티저 아님!");

    function valid() {
      return Number.isInteger(a) && Number.isInteger(b);
    }
  }
  lg(add(1, 2));
  lg(add(10, "a"));
});
groupLog(
  "다양한 즉시실행 함수 하지만 린트나, prettier를 설정하면 무조건 괄호안에 즉시실행으로 치환된다."
)(() => {
  !(function (arg) {
    lg(arg);
    return true;
  })(123);

  function f1() {
    return (function (a) {
      lg(a);
    })(123);
  }
  f1();

  new (function () {
    console.log("즉시실행?");
  })();
});

groupLog("eval과 new Function")(() => {
  var v = 100;
  var a = eval(`20+5+${v}`);
  lg(a);

  var add = new Function("a,b", "return a+b");
  lg(add(2, 4));
});
groupLog("메모이제이션")(() => {
  function L2(str) {
    if (L2[str]) {
      return L2[str];
    }
    var splited = str.split("=>");
    return (L2[str] = new Function(splited[0], `return ${splited[1]};`));
  }
  lg(L2("a, b => a+b")(1, 2));
  lg(L2["a, b => a+b"](4, 5));
  lg(L2("a, b => a+b")(1, 2));
});
groupLog("익명함수의 자기참조- 함수선언식의 이름 참조시 -> 외부에서 변경 가능")(
  () => {
    var f1 = function () {
      console.log(f1);
    };
    f1();
    var f2 = f1;
    f1 = null;
    f2(); // null 위험한 상황
  }
);
groupLog("유명함수의 자기참조 -> 외부에서 변경 불가능")(() => {
  var f1 = function f() {
    // f가 유명함수
    console.log(f); // 익명함수 이름 참조
  };
  f1();
  var f2 = f1;
  f1 = null;
  f2(); // 안전한 상황
});

groupLog("유명함수와 재귀를 이용한 flatten")(() => {
  function flatten(arr) {
    return (function f(arr, new_arr) {
      arr.forEach(function (v) {
        Array.isArray(v) ? f(v, new_arr) : new_arr.push(v);
      });
      return new_arr;
    })(arr, []);
  }
  lg(flatten([1, 2, [3, 4, [5, 6]]]));
});
groupLog("즉시실행, 유명함수를 이용하지 않은 flatten")(() => {
  // js특성상 15000번 이상 반복할 경우 maximum call stack size exceeded 에러 반환
  // 아직 꼬리재귀최적화가 이루어 져있지 않은 상태..
  function flatten2(arr, new_arr) {
    arr.forEach((v) =>
      Array.isArray(v) ? flatten2(v, new_arr) : new_arr.push(v)
    );
    return new_arr;
  }
  function flatten3(arr, new_arr) {
    if (!new_arr) {
      return flatten3(arr, []);
    }
    if (!Array.isArray(arr)) {
      return new_arr.push(arr);
    }
    arr.forEach((v) => flatten3(v, new_arr));
    return new_arr;
  }
  lg(flatten2([1, 2, [3, 4, [5, 6]]], [])); // 마지막 인자에 빈 배열을 추가해야하므로 복잡성 증가
  lg(flatten3([1, 2, [3, 4, [5, 6]]])); // if가 생김... 복잡한건 마찬가지
});
