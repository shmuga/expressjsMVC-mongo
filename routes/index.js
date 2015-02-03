var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var models = require('../models');


router.get('/', function(req, res) {
   //res.render("index");
   models.User.findAll(function(res){
      console.log(res);
   });
});

module.exports = router;
