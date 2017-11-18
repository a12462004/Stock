var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');

router.get('/', function(req, res, next) {
	var code = req.query.code;
	if(code == undefined){ //若為undefined代表沒有輸入code，直接跳轉頁面到DividenPolicy的1101
		res.redirect("/DividendPolicy?code=1101");
	}
	else{
		new sql.ConnectionPool(db).connect().then(pool => {
  			return pool.request().query("SELECT [code],[company],[cash_dividend],[surplus],[plot],YEAR([shareholders_date])-1 as date,(surplus+plot) as stock_dividend FROM [DividendPolicy] WHERE code='"+code+"' ORDER BY date DESC")
  		}).then(result => {
    		let rows = result.recordset
   			 res.setHeader('Access-Control-Allow-Origin', '*')
   		 	// res.status(200).json(rows);
   			 // sql.close();
   			 if(result.rowsAffected =='0'){ //若為0代表輸入的code並沒有資料可以顯示，跳轉頁面到DividenPolicy的1101
					res.redirect("/DividendPolicy?code=1101");
			 }
			 else{
				res.render('./DividendPolicy', {title: '股起勇氣', data: rows });
			 }
  			}).catch(err => {
   			 res.status(500).send({ message: err})
   			 // sql.close();
  			});
	}
});
router.post('/getChartData',function(req,res,next){
	var code = req.body.code;
	// console.log(code);
	new sql.ConnectionPool(db).connect().then(pool => {
  			return pool.request().query("SELECT YEAR([shareholders_date])-1 as year,cash_dividend,(surplus+plot) as stock_dividend FROM [DividendPolicy] WHERE code='"+code+"'")
  		}).then(result => {
    		let rows = result.recordset
   			 res.setHeader('Access-Control-Allow-Origin', '*')
   		 	// res.status(200).json(rows);
   			 // sql.close();
   			 // console.log(result.recordset);
			 res.send(rows);
  			}).catch(err => {
   			 res.status(500).send({ message: err})
   			 // sql.close();
  			});
});
module.exports = router;