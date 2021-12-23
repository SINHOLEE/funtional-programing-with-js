const { groupLog, lg } = require("../../utils");

const add = function (a, b, cb) {
  setTimeout(function () {
    cb(a + b);
  }, 1000);
};
const sub = function (a, b, cb) {
  setTimeout(function () {
    cb(a - b);
  }, 1000);
};
const div = function (a, b, cb) {
  setTimeout(function () {
    cb(a / b);
  }, 1000);
};
const multiple = function (a, b, cb) {
  setTimeout(function () {
    cb(a * b);
  }, 1000);
};

function _async(func) {
  return function (...args) {
    // 미래시점을 미리 땡겨오기 위한 변수
    arguments[arguments.length++] = function (result) {
      _callback(result);
    };
    func.apply(null, arguments);

    var _callback;

    function _async_cb_receiver(callback) {
      _callback = callback;
    }

    return _async_cb_receiver;
  };
}

function _async2(func) {
  return function () {
    // arguments[arguments.length++] = (function (result) {
    //       _callback(result);
    //     } <- 여기에 세미콜론을 붙이지 않으면 자바스크립트 엔진은 끝이라고 판단하지 못해서 즉시실행함수로 받아버린다.
    // 치명적인 버그를 발생여지가 있음
    // arguments[arguments.length++] = (function (result) {
    //   _callback(result);
    // })(
    //   // 변경된 부분
    //   function wait(args) {
    //     /* 새로운 공간 추가 */
    //     for (var i = 0; i < args.length; i++)
    //       if (args[i] && args[i].name == "_async_cb_receiver")
    //         return args[i](function (arg) {
    //           args[i] = arg;
    //           wait(args);
    //         });
    //     func.apply(null, args);
    //   }
    // )(arguments);
    arguments[arguments.length++] = function (result) {
      _callback(result);
    };
    // 변경된 부분
    (function wait(args) {
      /* 새로운 공간 추가 */
      for (let i = 0; i < args.length; i++) {
        if (args[i] && args[i].name == "_async_cb_receiver") {
          return args[i](function (arg) {
            args[i] = arg;
            wait(args);
          });
        }
      }
      func.apply(null, args);
    })(arguments);
    let _callback;

    function _async_cb_receiver(callback) {
      _callback = callback;
    }

    return _async_cb_receiver;
  };
}

const asyncAdd2 = _async2(function (a, b, cb) {
  setTimeout(function () {
    cb(a + b);
  }, 1000);
});
const asyncMulti2 = _async2(function (a, b, cb) {
  setTimeout(function () {
    cb(a * b);
  }, 1000);
});

const asyncLog = _async2(function (result) {
  setTimeout(() => {
    lg(result);
  }, 1000);
});
const asyncAdd = _async(add);
const asyncDiv = _async(div);
const asyncMulti = _async(multiple);
const asyncSub = _async(sub);

const asyncDiv2 = _async2(div);
const asyncSub2 = _async2(sub);

// groupLog("기본적인 콜백지옥")(() => {
//   add(1, 2, function (added) {
//     lg({ added });
//     sub(added, 6, function (subed) {
//       lg({ subed });
//       multiple(100, subed, function (multipled) {
//         lg({ multipled });
//         div(200, multipled, function (result) {
//           lg({ result });
//         });
//       });
//     });
//   });
// });

// groupLog("async 중첩 실행 초석 다지기")(() => {
//
//   asyncAdd(
//     10,
//     20
//   )(function (added) {
//     lg({ added });
//     asyncSub(
//       added,
//       5
//     )(function (subed) {
//       lg({ subed });
//       asyncMulti(
//         subed,
//         7
//       )(function (r) {
//         lg({ r });
//       });
//     });
//   });
// });

groupLog("재귀 중첩 비동기")(() => {
  asyncLog(asyncAdd2(asyncAdd2(7, 8), 2));
});
