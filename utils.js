const lg = console.log;

const groupLog = (title) => (f) => {
  console.log(`${title}====start===============`);
  try {
    setTimeout(() => {
      lg(`-${title}-----after callstack---------`);
      lg();
    }, 0);
    f();
  } catch (e) {
    lg("****에러****", e);
  }
  console.log(`${title}------end----------------------`);
  console.log();
};

module.exports = { lg, groupLog };
