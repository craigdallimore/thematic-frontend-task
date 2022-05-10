// https://jestjs.io/docs/code-transformation#examples
module.exports = {
  process() {
    return "module.exports = {};";
  },
  getCacheKey() {
    return "svgTransform";
  },
};
