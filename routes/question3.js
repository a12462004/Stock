var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');
/* GET company page. */
router.get('/', function(req, res, next) {
	res.render('./question3', {title: '股起勇氣' });
	
});

module.exports = router;