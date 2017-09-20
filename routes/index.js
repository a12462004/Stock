var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');

/* GET home page. */
router.get('/', function(req, res, next) {
  //直接跳轉到公司基本資料頁
  res.redirect("/CompanyProfile?code=1101");
});
//搜尋功能
router.post('/search',function(req,res,next){
	var keyword = req.body.keyword;
	console.log(req);

	sql.connect(db,function(err){
		if(err) console.log(err);
		var request =  new sql.Request();
		request.query("SELECT code,company FROM CompanyProfile WHERE code LIKE '%" + keyword+ "%' OR company LIKE '%" + keyword + "%'",function(err,result){
			if(err){
				console.log(err);
				res.send(err);
			}
			sql.close();
			// console.log(result.recordset);
			var list = result.recordset;
			res.send(list);
		});
	});
});
//會員確認
router.post('/member',function(req,res,next){
	var fbId = req.body.id;
	var fbName = req.body.name;
	sql.connect(db,function(err){
		if(err) console.log(err);
		var request = new sql.Request();
		//比對是否已經是會員，是的話筆數為1，否的話筆數為0，需要做新增會員的動作。
		request.query("SELECT count(id) AS count FROM Member WHERE fbId ='"+fbId+"'",function(err,result){
			if(err) {
				console.log(err);
				res.send(err);
			}
			var rowsCount = result.recordset[0].count; //筆數
			// console.log(result.recordset[0].count);
			if(rowsCount == '0'){ //筆數為0，做會員新增
				request.query("INSERT INTO Member(fbId,fbName) VALUES('"+fbId+"','"+fbName+"')",function(err,result){
					if(err){
						console.log(err);
						res.send(err);
					}
					else{
						console.log('新增成功.');
						 sql.close(); //sql要記得關，不然會卡住run不動.
					}
				});
			}
			else if(rowsCount == '1'){
				console.log('已是會員.');
				sql.close(); //sql要記得關，不然會卡住run不動.
			}
			
		});
	});
});
module.exports = router;
