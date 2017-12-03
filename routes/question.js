var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');
router.get('/',function(req,res,next){
	res.redirect("/test");
});

router.post('/', function(req, res, next) {
	var question = [];
	/*隨機產生五題，若是重複則再重新抓*/
	for(var i=0;i<5;i++){
		var rdm =0;
		do {
			var exist = false;
			rdm = Math.floor((Math.random() * 20) + 1);	
			if(question.indexOf(rdm) != -1) exist = true;
 
		} while (exist);
 
		question.push(rdm);
	}
	//console.log(question);
	num = question.join(",");
	// console.log(num);
	sql.connect(db,function(err){
			if(err) console.log(err);
			var request = new sql.Request();
			//顯示亂數產生的題目資料
			request.query("SELECT * FROM Topic WHERE id IN ("+num+")",function(err,result){
				if(err){
					console.log(err);
					res.send(err);
				}
				sql.close();
				// console.log(result.recordset);
				res.render('./question', {title: '股起勇氣', data: result.recordset });
			});
		});
});
module.exports = router;
