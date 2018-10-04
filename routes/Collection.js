var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');
router.get('/', function(req, res, next) {
	var id = req.headers.cookie.split(';'); //split 切割字串
	id = id[1].slice(4); //取fb的id，slice(字串從第幾位開始取)
	sql.connect(db,function(err){
		if(err) console.log(req.headers.cookie.split(';'));
		var request = new sql.Request();
		//找到符合fbId的收藏資料和公司名稱和證期會代碼
		request.query("SELECT * FROM (SELECT CollectedId FROM Collection WHERE fbId = '"+id+"') AS collection INNER JOIN (SELECT code,company FROM companyProfile) AS company ON collection.CollectedId=company.code",function(err,result){
			if(err){
				console.log(err);
				res.send(err);
			}
			sql.close();
			res.render('./Collection', {title: '股起勇氣', data: result.recordset });
		});
	});
});

//刪除收藏紀錄
router.post('/del',function(req,res,next){
	var act = req.body.act;
	var code =  req.body.code;
	if(act == 'del'){
		sql.connect(db,function(err){
			if(err) console.log(err);
			var request =new sql.Request();
			request.query("DELETE FROM Collection WHERE CollectedId="+code,function(err,result){
				if(err){
					console.log(err);
					res.send(err);
				}
				else{
					console.log('成功刪除');
					res.send('ok');
				}
				sql.close();
			});
		});
	}
});

module.exports = router;