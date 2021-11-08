const { lg } = require("../utils");
const people = [
  {
    id: 1,
    name: "시니",
    age: 12,
  },
  {
    id: 2,
    name: "훈",
    age: 20,
  },
  {
    id: 3,
    name: "크리스",
    age: 33,
  },
  {
    id: 4,
    name: "루카",
    age: 25,
  },
];

const _ = {};
//compose 구현
_.compose = function (...args) {
  return function (...args2) {
    let i = args.length - 1;
    let res = args[i].apply(this, args2);
    while (i--) {
      res = args[i].call(this, res);
    }
    return res;
  };
};

_.map = function (list, iteratee) {
  const new_list = [];
  for (let i = 0; i < list.length; i++) {
    new_list.push(iteratee(list[i], i, list));
  }
  return new_list;
};

_.filter = function (list, predicate) {
  const new_list = [];
  for (let i = 0; i < list.length; i++) {
    if (predicate(list[i], i, list)) {
      new_list.push(list[i]);
    }
  }
  return new_list;
};

_.find = function (list, predicate) {
  for (let i = 0; i < list.length; i++) {
    if (predicate(list[i], i, list)) {
      return list[i];
    }
  }
};

_.findIndex = function (list, predicate) {
  for (let i = 0; i < list.length; i++) {
    if (predicate(list[i], i, list)) {
      return i;
    }
  }
  return -1;
};

/***
 * 하나의 key에 대한 비교만 가능함
 */
const bmatch1 = (key, value) => (obj) => obj[key] === value;
lg(_.find(people, bmatch1("id", 1)));

const _object = (key, value) => {
  const obj = {};
  obj[key] = value;
  return obj;
};

const _match = (obj, obj2) => {
  for (const key in obj2) {
    if (obj[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
};
/**
 * @description
 * @param obj2OrKey
 * @param val
 * @returns {function(*=): boolean}
 */

_.bmatch = function (obj2OrKey, val) {
  // obj2가 obj 형태일 경우{id:1, age:20}
  let obj2 = obj2OrKey;
  // key, value 인자일 경우
  if (arguments.length === 2) {
    obj2 = _object(obj2OrKey, val);
  }
  return function (obj) {
    return _match(obj, obj2);
  };
};

lg(_.find(people, _.bmatch({ id: 2, name: "훈" })));
lg(_.find(people, _.bmatch("id", 2)));
lg(
  _.findIndex(people, (item, idx, lis) => {
    console.log({ item, idx, lis });
    return _.bmatch({ id: 2, name: "훈" });
  })
);
lg(_.filter([12, 22, 33, 51], (val, idx) => idx < 2));
const even = (_, idx) => idx % 2;
// 이거 말고 반대로 뒤집는 함수 어떻게 만들 수 있을까.
const not =
  (predicate) =>
  (...arg) =>
    !predicate(...arg);
lg(_.filter([12, 22, 33, 51], even));
lg(_.filter([12, 22, 33, 51], not(even)));

lg(_.map(_.filter(people, even), (person) => person.name));

lg("--------쓸대없어보이는 함수------");
lg("truthy만 평가되도록 정제를 도와주는 함수");
// 쓸대없어보이는 함수
_.identity = function (v) {
  return v;
};
const a = 10;
lg(_.identity(a));
const truthyAndFalsyList = [
  1,
  0,
  "",
  {},
  [],
  null,
  undefined,
  "string",
  false,
  true,
];
_.not = (v) => !v;
_.beq = (a) => (b) => a === b;

lg(_.filter([12, 22, 33, 51], not(even)));
lg("------------");
lg(_.filter([12, 22, 33, 51], _.compose(_.not, even)));
lg(_.filter([12, 22, 33, 51], _.compose(even)));
// truthy만 필터링 된다.
lg(_.filter(truthyAndFalsyList, _.identity));

const positive = (list) => _.find(list, _.identity);
const negativeIndex = (list) => _.findIndex(list, _.not);
/**
 * 하나라도 truthy라면 참, 아니면 거짓
 */
_.some = _.compose(_.not, _.not, positive);
/**
 * 모두 truthy라면 참, 하나라도 falsy면 거짓
 */
// _.every = (list) => _.filter(list, _.identity).length === list.length; // 하나라도 false면 평가를 중지하는 것이 더 효율적

_.every = _.compose(_.beq(-1), negativeIndex);
//true
lg(_.some(truthyAndFalsyList), true);
lg(_.some(["", {}, []]), true);
lg(_.every([1, 2, 3, 4, 5, "2", {}, []]), true);

// false
lg(_.every(truthyAndFalsyList), false);
lg(_.some("", false, null, NaN, undefined), false);

const greeting = (name) => `hi ${name}`;
const exclaim = (statement) => `${statement.toUpperCase()}!`;
const welcome = _.compose(exclaim, greeting);
lg(welcome("sinho"));
