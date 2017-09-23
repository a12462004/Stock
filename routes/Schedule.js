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
		sql.connect(db,function(err){
			if(err) console.log(err);
			var request = new sql.Request();
			request.query("SELECT * FROM Schedule WHERE code='"+code+"'",function(err,result){
				if(err){
					console.log(err);
					res.send(err);
				}
				// console.log(result.recordset);
				sql.close();
				if(result.rowsAffected =='0'){ //若為0代表輸入的code並沒有資料可以顯示，跳轉頁面到Schedule的1101
					res.redirect("/Schedule?code=1101");
				}
				else{
				res.render('./Schedule', {title:'股起勇氣',data: result.recordset });
				}
			});
		});
	}
});
/*GET shedule page*/
// router.get('/:code',function(req,res,next){
// 	sql.connect(db,function(err){
// 		if(err) console.log(err);
// 		var request = new sql.Request();
// 		request.input('code',sql.NVarChar(50),req.params.code);
// 		request.query("SELECT * FROM Schedule WHERE code=@code",function(err,result){
// 			if(err){
// 				console.log(err);
// 				res.send(err);
// 			}
// 			sql.close();
// 			res.render('./Schedule', {title:'股起勇氣',data: result.recordset });
// 		});
// 	});
// });


module.exports = router;