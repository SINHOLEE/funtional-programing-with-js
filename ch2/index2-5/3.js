const { groupLog, lg } = require("../../utils");

var add = function (a, b, cb) {
  setTimeout(function () {
    cb(a + b);
  }, 1000);
};
var sub = function (a, b, cb) {
  setTimeout(function () {
    cb(a - b);
  }, 1000);
};
var div = function (a, b, cb) {
  setTimeout(function () {
    cb(a / b);
  }, 1000);
};
var multiple = function (a, b, cb) {
  setTimeout(function () {
    cb(a * b);
  }, 1000);
};
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

groupLog("async 중첩 실행")(() => {
  function _async(func) {
    return function (...args) {
      lg("1", "length", arguments.length, { arguments, args });
      arguments[arguments.length++] = function (result) {
        _callback(result);
        lg({ result });
      };
      lg("2", "length", arguments.length, { arguments, args });
      func.apply(null, arguments);

      var _callback;
      function _async_cb_receiver(callback) {
        lg(1, { callback, _callback });
        _callback = callback;
        lg(2, { callback, _callback });
      }
      return _async_cb_receiver;
    };
  }

  const asyncAdd = _async(add);
  const asyncDiv = _async(div);
  const asyncMulti = _async(multiple);
  const asyncSub = _async(sub);

  asyncAdd(
    10,
    20
  )(function (added) {
    lg({ added });
    asyncSub(
      added,
      5
    )(function (subed) {
      lg({ subed });
      asyncMulti(
        subed,
        7
      )(function (r) {
        lg({ r });
      });
    });
  });
});
