const { evaluate } = require("mathjs");

class MathJsService {
  async evaluateExpression({ expression }) {
    const result = evaluate(expression);
    return {
      result,
    };
  }
}

module.exports = new MathJsService();
