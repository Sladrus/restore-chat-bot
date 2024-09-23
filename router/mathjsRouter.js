const Router = require("express");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const MathJsController = require("../controller/MathJsController");
const router = new Router();

router.post("/evaluate", AuthMiddleware, MathJsController.evaluateExpression);

module.exports = router;
