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


function _async(func) {
    return function (...args) {
        // 미래시점을 미리 땡겨오기 위한 변수
        let _callback;
        // arguments = [a,b,cb] 으로 관리
        const newArgs = [...args, (result) => _callback(result)]
        func.call(null, ...newArgs)

        function _async_cb_receiver(callback) {
            _callback = callback;
        }
        return _async_cb_receiver;
    };
}

function _async2(func) {
    return function () {
        // 미래시점을 미리 땡겨오기 위한 변수
        // arguments = [a,b,cb] 으로 관리
        arguments[arguments.length++] = function (result){
            _callback(result);
        }
        (function wait(args2){
            for(var i=0;i<args2.length;i++) {
                if (args2[i] && args2[i].name === '_async_cb_receiver'){

                    return args2[i](function (arg) {
                        args2[i] = arg;
                        wait(args2);
                    });
                }
                func.apply(null, args2)
            }
        })(arguments)

        var _callback;

        function _async_cb_receiver(callback) {
            _callback = callback;
        }
        return _async_cb_receiver;
    };
}

const asyncAdd = _async(add);
const asyncDiv = _async(div);
const asyncMulti = _async(multiple);
const asyncSub = _async(sub);

const asyncAdd2 = _async2(add);
const asyncDiv2 = _async2(div);
const asyncMulti2 = _async2(multiple);
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

  asyncAdd2(10, asyncMulti2(2,3))

});
