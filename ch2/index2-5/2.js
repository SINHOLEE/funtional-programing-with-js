const { groupLog, lg } = require("../../utils");
groupLog("콜백함수로 비동기 결과 받기")(() => {
  let r;
  var add = function (a, b, cb) {
    setTimeout(function () {
      cb(a + b);
    }, 1000);
  };
  add(2, 3, function (result) {
    r = result;
    lg(result);
  });
  lg("add 함수 호출한 뒤 바로 로그를 찍으면 아직 undefined", r);
  setTimeout(() => {
    lg(0, r);
  }, 0);
  setTimeout(() => {
    lg(
      999,
      r,
      "가끔 r이 5가 뜨는 결과도 나옴 즉 완전히 세밀한 동작은 아니라는 듯"
    );
  }, 999);
});
