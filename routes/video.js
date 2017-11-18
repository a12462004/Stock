var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');

router.get('/', function(req, res, next) {
	new sql.ConnectionPool(db).connect().then(pool => {
			return pool.request().query("SELECT code FROM CompanyProfile WHERE code = '1101'")
		}).then(result => {
		let rows = result.recordset
		res.setHeader('Access-Control-Allow-Origin', '*')
	 	// res.status(200).json(rows);
		 // sql.close();
		res.render('./video', {title: '股起勇氣', data: rows });
		}).catch(err => {
		 res.status(500).send({ message: err})
		 // sql.close();
		});
});

module.exports = router;