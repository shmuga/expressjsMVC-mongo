var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render("api/users/index",{name:"mark"});
});

module.exports = router;
