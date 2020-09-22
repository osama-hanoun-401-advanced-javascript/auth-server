let router = require('express').Router();
let bearerMiddleware = require('./auth/middleware/bearer');
router.get('/secret', bearerMiddleware, (req, res) => {
  res.json(req.user);
});


module.exports = router;
