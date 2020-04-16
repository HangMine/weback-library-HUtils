/**
 * @des: 切割二维数组
 * @param {Array} arr 原始数组
 * @param {Number} num 二维数组的长度
 * @param {Boolean} isSave 是否舍弃不满足长度的尾部,默认舍弃
 * @return:
 */

function arr2d(arr, num, isSave) {
  const sum = Math.ceil(arr.length / num); //可以切成的二维数组个数
  let currentTime = 1; //当前在Push第几个二堆数组
  let resArr = [];
  let itemArr = []; // 存放二堆单个数组

  for (const [i, item] of Object.entries(arr)) {
    itemArr.push(item);

    if (currentTime < sum) {
      // 非最后一组时
      if ((+i + 1) % num === 0) {
        currentTime++;
        resArr.push(itemArr);
        itemArr = [];
      }
    } else {
      // 最后一组时
      if (isSave) resArr.push(itemArr);
    }
  }
  return resArr;
}

/**
 * @des: 切割字符串，返回一个切割后数组
 * @param {String} str 原始数组
 * @param {Number} num 每段的长度
 * @param {Boolean} isSave 是否舍弃不满足长度的尾部,默认舍弃
 * @return:
 */
export function sliceStr(str, num, isSave) {
  let resArr = [];
  const sumRound = isSave
    ? Math.ceil(str.length / num)
    : Math.floor(str.length / num);
  for (let i = 0; i < sumRound; i++) {
    let start = i * num;
    let end = (i + 1) * num;
    resArr.push(str.slice(start, end));
  }
  return resArr;
}

/**
 * @des: 多字段排序，当值相等时会继续对下个字段的排序
 * @param {Array} arr 原始数组
 * @param {Number} sortArr 排序的字段，格式为{type:'string',prop:'city'}
 * @return:
 */

function multiSort(arr, sortArr) {
  const sortFn = keySort(sortArr);
  return arr.sort(sortFn);
}

function keySort(sortArr) {
  return function (a, b) {
    // 关键：每个值都会调用一次比较函数，如果值不相等直接返回，如果值相等，继续下一个循环
    for (const sort of sortArr) {
      const sortFn = sortMap[sort.type];
      const _return = sortFn(a[sort.prop], b[sort.prop]);
      if (_return !== 0) return _return;
    }
  };
}

const sortMap = (function () {
  const sortMap = {
    string: normalSort,
    number: numberSort,
    percent: percentSort,
  };

  function normalSort(a, b) {
    if (a > b) {
      // 返回正数时，调换顺序（因为默认升序，小的在前）
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      // 必须判断相等
      return 0;
    }
  }

  function numberSort(a, b) {
    return normalSort(+a, +b);
  }

  function percentSort(a, b) {
    a = +a.replace("%", "");
    b = +b.replace("%", "");
    return normalSort(a, b);
  }

  return sortMap;
})();

/**
 * @des: 深复制(es5+clonePrototype版本)，需考虑循环引用对象的兼容处理:https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
 * @param {any} data 需要复制的数据
 * @param {boolean} clonePrototype 是否需要复制原型型上的可枚举属性
 * @param {array} cache 保存已经遍历过的对象，是为了处理循环引用对象
 * @return:
 */
function clone(data, clonePrototype = false, cache = []) {
  const type = getType(data);
  const isPlainObject = type === "object";
  const isArray = type === "array";
  if (!isPlainObject && !isArray) {
    return data;
  }
  // 保存遍历过的对象
  const hasCache = cache.filter((item) => item.init === data)[0];
  if (hasCache) {
    return cache.copy;
  }
  let newData = isPlainObject ? {} : [];
  cache.push({
    init: data,
    copy: newData,
  });
  if (isPlainObject) {
    for (let key in data) {
      if (clonePrototype) {
        newData[key] = clone(data[key], clonePrototype, cache);
      } else {
        let isOwn = data.hasOwnProperty(key);
        isOwn && (newData[key] = clone(data[key], clonePrototype, cache));
      }
    }
  } else if (isArray) {
    for (let i = 0; i < data.length; i++) {
      newData[i] = clone(data[i]);
    }
  }
  return newData;
}

// 获取类型
function getType(obj) {
  // tostring会返回对应不同的标签的构造函数
  if (obj instanceof Element) {
    return "element";
  }
  let type = Object.prototype.toString.call(obj);
  type = type.slice(8, -1).toLowerCase();
  return type;
}

/**
 * @des: 获取日期是第几周
 * @param {Date} src 日期对象
 * @return: {number} 第number周
 */
function getWeekNumber(src) {
  if (!isDate(src)) return null;
  const date = new Date(src.getTime());
  date.setHours(0, 0, 0, 0);
  // 日期该周的周四（date.getDay() + 6) % 7的方法让 周日为起点 改为 周一为起点）
  // 周一到周日为一周：date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // 周日到周六为一周：date.setDate(date.getDate() + 4 - date.getDay());
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // 该年的1月4号,1月4号总是在第一周
  const week1 = new Date(date.getFullYear(), 0, 4);
  // 调整到第1周的星期四，并计算从日期到第1周的周数。
  // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

/**
 * @des: 柯里化--es5
 * @param {Function} fn 需要柯里化的函数
 * @param {...params} otherParams
 * @return: {Function} 柯里化后的函数
 */

function curry(fn) {
  const fixArgs = Array.prototype.slice.call(arguments, 1);
  const curryedFn = function () {
    const fnArgs = Array.prototype.slice.call(arguments);
    const finalArgs = fixArgs.concat(fnArgs);
    return fn.apply(null, finalArgs);
  };
  return curryedFn;
}

// 节流
const throttle = (fn, cycle = 100) => {
  let timer;
  return function () {
    const execFn = () => {
      fn.apply(this, arguments);
      timer = null;
    };
    if (timer === undefined) {
      execFn();
    } else if (timer === null) {
      timer = setTimeout(() => {
        execFn();
      }, cycle);
    }
  };
};

// 防抖
const debounce = (fn, delay = 100) => {
  let timer;
  return function () {
    const execFn = () => {
      fn.apply(this, arguments);
    };
    if (timer) clearTimeout(timeout);
    timer = setTimeout(() => {
      execFn();
    }, delay);
  };
};

// 获取数组里面最大最小值（可以是多层数组）
const getMinMax = (arr) => {
  let temMin, temMax, min, max;

  const setMinMax = (_arr) => {
    for (const num of _arr) {
      if (Array.isArray(num)) {
        setMinMax(num);
      } else if (typeof num === "number") {
        if (temMin === undefined) {
          temMin = temMax = min = max = num;
          continue;
        }
        if (num < temMin) {
          min = temMin = num;
        }
        if (num > temMax) {
          max = temMax = num;
        }
      } else {
        console.error("存在非数组或数字的值,已返回[0,0]!");
      }
    }
  };

  setMinMax(arr);

  const isNumber = [min, max].every((item) => typeof item === "number");
  return isNumber ? [min, max] : [0, 0];
};

// 数组去重(每次只跟当前值右边的值进行比较)
const getUniqArray = (array) => {
  var temp = [];
  var index = [];
  var l = array.length;
  for (var i = 0; i < l; i++) {
    for (var j = i + 1; j < l; j++) {
      if (array[i] === array[j]) {
        i++;
        j = i;
      }
    }
    temp.push(array[i]);
    index.push(i);
  }
  return temp;
};

export {
  arr2d,
  multiSort,
  clone,
  getMinMax,
  getUniqArray,
  getType,
  getWeekNumber,
  curry,
  throttle,
  debounce,
};
