const MathJsService = require("../service/MathJsService");

class MathJsController {
    async evaluateExpression(req, res, next) {
        try {
          const body = req.body;
          const result = await MathJsService.evaluateExpression(body);
          return res.json(result);
        } catch (e) {
          console.log(e);
          next(e);
        }
      }
}

module.exports = new MathJsController();