var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');
var sql = require('mssql');
/* GET company page. */
router.get('/', function(req, res, next) {
	res.render('./grade', {title: '股起勇氣' });
	
});
router.post('/',function(req,res,next){
	//測驗者答案
	var u_answer =[];
	u_answer[0] = req.body.q1;
	u_answer[1] = req.body.q2;
	u_answer[2] = req.body.q3;
	u_answer[3] = req.body.q4;
	u_answer[4] = req.body.q5;
	// console.log(answer);
	//測驗題目ID
	question = req.body.questionId;
	sql.connect(db,function(err){
			if(err) console.log(err);
			var request = new sql.Request();
			request.query("SELECT * FROM Topic WHERE id IN ("+question+")",function(err,result){
				if(err){
					console.log(err);
					res.send(err);
				}
				sql.close();
				var resultA = result.recordset;
				var t_answer =[]; 
				for (var i = 0; i < resultA.length; i++) {
					t_answer.push(resultA[i].answer);
				}
				var grade = 0;
				for (var i = 0; i < 5; i++) {
					if(t_answer[i] == u_answer[i]){
						grade +=20;
					}
				}
				// console.log(t_answer);
				// console.log(result.recordset);
				// console.log(u_answer);
				res.render('./grade', {title: '股起勇氣', data: result.recordset ,u_answer: u_answer,grade:grade});
			});
		});
});

module.exports = router;