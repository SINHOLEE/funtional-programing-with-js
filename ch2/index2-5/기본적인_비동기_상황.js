const { groupLog, lg } = require("../../utils");
groupLog("기본적인 비동기적인 상황")(() => {
  lg(1);
  setTimeout(function () {
    lg(2);
  }, 0);
  lg(3);

  // 1,3, out of callstack 2
});
