var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');

router.get('/', function(req, res, next) {
	res.render('./Zero_start', {title: '股起勇氣' });
	
});

module.exports = router;