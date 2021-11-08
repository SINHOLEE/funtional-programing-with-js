const lg = console.log;

const groupLog = (title) => (f) => {
  console.log(`start========${title} =======`);
  try {
    f();
  } catch (e) {
    lg("****에러****", e);
  }
  console.log(`end-----------${title} -----------`);
  console.log();
};

module.exports = { lg, groupLog };
