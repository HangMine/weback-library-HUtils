var path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "HUtils.js",
    library: "HUtils",
    // 兼容AMD和commonJS规范的同时，还兼容全局引用的方式
    libraryTarget: "umd",
  },
  // 优先使用用户的库
  // externals: {
  //   lodash: {
  //     commonjs: "lodash",
  //     commonjs2: "lodash",
  //     amd: "lodash",
  //     root: "_" /* 全局变量 */,
  //   },
  // },
};
