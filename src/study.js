/**
 * @des: 深复制(es6，不添加原型版本)，需考虑循环引用对象的兼容处理:https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
 * @param {any} data 需要复制的数据
 * @param {array} cache 保存已经遍历过的对象，是为了处理循环引用对象
 * @return:
 */
function deepCopy(obj, cache = []) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  const hit = cache.filter((c) => c.original === obj)[0];
  if (hit) {
    return hit.copy;
  }
  const copy = Array.isArray(obj) ? [] : {};
  cache.push({
    original: obj,
    copy,
  });
  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key], cache);
  });
  return copy;
}

/**
 * @des: 柯里化--es6
 * @param {Function} fn 需要柯里化的函数
 * @param {...params} otherParams
 * @return: {Function} 柯里化后的函数
 */

const curry2 = (fn, ...fixArgs) => {
  const curryedFn = (...fnArgs) => {
    const finalArgs = [...fixArgs, ...fnArgs];
    return fn(...finalArgs);
  };
  return curryedFn;
};

/**
 * @des: 原生bind函数
 * @param {Function} fn 需要改变this对象的函数
 * @param {Object} thisArg 要指向的this对象
 * @return: {Function} 改变后的函数
 */
function bind(fn, thisArg) {
  return function () {
    return fn.apply(thisArg, arguments);
  };
}

// 模拟new关键字
const _new = (constructor, ...args) => {
  // 1、继承构造器的原型，并创建一个新对象
  let obj = Object.create(constructor.prototype);
  // 2、将构造器的this指向新对象，并执行构造器
  let constrctorReturn = constructor.apply(obj, args);
  // 3、如果构造器没有手动返回对象，则返回第一步的对象
  return typeof constrctorReturn === "object" ? constrctorReturn : obj;
};

// 构造函数最广泛也是最优解：构造函数和原型模式(构造函数模式用于定义【实例属性】，而原型模式用于定义【方法和共享的属性】)
// function Person(name) {
//   // 如果没有使用new调用Person，强制使用new调用
//   if (this instanceof Person) {
//     this.name = name;
//   } else {
//     return new Person(name);
//   }
// }
// Person.prototype = {
//   constructor: Person,
//   sayName: function() {
//     alert(this.name);
//   }
// };

// 原型链继承：引用类型会被修改
// 借用构造函数：只能继承属性
// 组合继承（最常用）：原型链继承方法+借用构造函数继承属性（缺点：子构造函数的原型会有多余的父实例的属性
// 寄生组合式继承（最优解）:即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法(解决组合继承的缺点)

// 寄生组合式继承方法
function inheritPrototype(subType, superType) {
  var prototype = Object.create(superType.prototype); //创建对象
  // es3设置constructor
  // prototype.constructor = subType; //增强对象
  // es5设置constructor
  Object.defineProperty(prototype, "constructor", {
    enumerable: false,
    value: subType,
  });
  subType.prototype = prototype; //指定对象
}

// 寄生组合式继承属性
function inheritProps(subType, superType, extendProps = []) {
  superType.apply(subType, extendProps);
}

// 相当于少了第二个参数的Object.create,从本质上讲，object()对传入其中的对象执行了一次(保留了原型链的)浅复制
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

// 记忆函数（使用记忆函数来计算菲波那切数列、阶乘等，可以极大减少我们必须要做的工作，加速程序计算）
function memoizer(memo, fundamental) {
  var shell = function (n) {
    // 闭包记住n的情况下的数值，避免重复运算
    var result = memo[n];
    if (typeof result !== "number") {
      result = fundamental(shell, n);
      memo[n] = result;
    }
    return result;
  };
  return shell;
}

// 替换HTML特殊字符
var entityify = (function () {
  var character = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
  };

  return function () {
    return this.replace(/[<>&"]/g, function (c) {
      return character[c];
    });
  };
})();

// 创建二维数组
function matrix(m, n, initial) {
  var a,
    i,
    j,
    mat = [];
  for (i = 0; i < m; i += 1) {
    a = [];
    for (j = 0; j < n; j += 1) {
      a[j] = initial;
    }
    mat[i] = a;
  }
  return mat;
}
