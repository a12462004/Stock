var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');
/* GET shedule page. */
router.get('/', function(req, res, next) {
	var code = req.query.code;
	if(code == undefined){ //若為undefined代表沒有輸入code，直接跳轉頁面到Schedule的1101
		res.redirect("/Schedule?code=1101");
	}
	else{
		new sql.ConnectionPool(db).connect().then(pool => {
  			return pool.request().query("SELECT code,convert(varchar, event_date, 111) AS event_date,event_type,event_note,convert(varchar, [time], 108) AS event_time,place,content FROM Schedule WHERE code='"+code+"' ORDER BY event_date DESC")
  		}).then(result => {
    		let rows = result.recordset
   			 res.setHeader('Access-Control-Allow-Origin', '*')
   		 	// res.status(200).json(rows);
   			 // sql.close();
   			 if(result.rowsAffected =='0'){ //若為0代表輸入的code並沒有資料可以顯示，跳轉頁面到Schedule的1101
					res.redirect("/Schedule?code=1101");
				}
			 else{
				res.render('./Schedule', {title:'股起勇氣',data: rows });
			 }
  			}).catch(err => {
   			 res.status(500).send({ message: "${err}"})
   			 // sql.close();
  			});
	}
});


module.exports = router;