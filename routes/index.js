var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//////////////////////////////////////////////////////////

var request = require('request');
var MongoClient = require('mongodb').MongoClient; 
// Connection URL 
var url = 'mongodb://localhost:27017/quiz';

router.get('/qna', function(req,res) {
	console.log(req.query.count);
	console.log(req.query.page);
	MongoClient.connect(url, function(err, db) {
		console.log("Connected correctly to server");
		if (err) {
			res.send({result:false,err:err});
		} else {
			var count = Number(req.query.count);
			var page = Number(req.query.page);
			var skip = (page-1)*count;
			console.log(skip);
			console.log(count);
			var qna = db.collection('qna');
			qna.find({}, {skip:skip,limit:count}).sort({createdAt:-1})
				.toArray(function(err, results) {
			    if (err) {
			    	res.send({result:false,err:err});
			    } else {
			    	res.send(results);
			    }
			});
		}
		db.close();
	});
});

router.get('/qna.csv', function(req, res) {
	res.setHeader('Content-disposition', 'attachment; filename=qna.txt');
	res.setHeader('Content-type', 'text/plain');
	res.charset = 'UTF-8';
	res.write("\"질문 ID\", \"질문 제목\", \"질문 본문\", \"게시물 작성일\", \"게시물 작성일\", \"답변 변호사\"\n");
	res.write("1, \"Hey, I just changed ... (truncated)\" , \"yay ... (truncated)\", \"2017-02-10 05:47:46\", \"2017-02-10 05:47:46\", \"홍길동, 홍길순\"\n");
	res.write("2, \"foo ... (truncated)\" , \"bar ... (truncated)\", \"2017-02-10 05:47:46\", \"2017-02-10 05:47:46\", \"홍길동\"\n");
	res.end();
});

router.get('/qna/:id', function(req, res) {
	console.log(req.params.id);
	var obj = [{
		   "id": 1,
		   "title": "Lorem ipsum",
		   "createdAt": "2017-02-09T20:47:46.677Z",
		   "updatedAt": "2017-02-09T20:47:46.677Z",
		   "body": "The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog",
		   "answers": [{
		     "lawyer": "홍길동",
		     "body": "The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog"
		   }]
		 }, 
		 {
		  "id": 2,
		  "title": "Lorem ipsum",
		  "createdAt": "2017-02-09T20:47:46.677Z",
		  "updatedAt": "2017-02-09T20:47:46.677Z",
		  "body": "The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog",
		  "answers": [{
		    "lawyer": "홍길동",
		    "body": "The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog"
		  }]
		}];

	res.send(obj);
});

router.post('/qna', function(req, res) {
	console.log(req.body);
	MongoClient.connect(url, function(err, db) {
		console.log("Connected correctly to server");
		if (err) {
			res.send({result:false,err:err});
		} else {
			var qna = db.collection('qna');
		    req.body.createdAt = new Date();
		    req.body.updatedAt = new Date();
			qna.save(req.body, function(err, result) {
			    if (err) {
			    	res.send({result:false,err:err});
			    } else {
			    	res.send(req.body);
			    }
			    db.close();
			});
		}
	});
});

router.post('/qna/:id/export', function(req, res) {
	console.log(req.params.id);

	request (
		{
			url: 'https://k8qs29zhf7.execute-api.ap-northeast-2.amazonaws.com/dev/import?key=7259cb1f',
			method: 'POST',
			headers: [
				{
				  name: 'content-type',
				  value: 'application/json'
				}
			],
			body: JSON.stringify(
				{
				  id: 2,
				  title: "some title",
				  body: "some value"
				})
		}, function(err,httpResponse,body){ 
		if(httpResponse.statusCode == 204){
	    	console.log('OK!')
	    	res.send({result:true});
		} else {
	    	console.log('error: '+ httpResponse.statusCode)
	    	console.log(body)
	    	res.send({result:false,error:httpResponse.statusCode});
	    }
	});
});

router.put('/qna/:id', function(req, res) {
	console.log(req.params.id);
	var obj = {
	  "id": 1,
	  "title": "Hey, I just changed title of question!",
	  "createdAt": "2017-02-09T20:47:46.677Z",
	  "updatedAt": "2017-02-09T20:50:12.173Z",
	  "body": "yay~ The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog",
	  "answers": [{
	    "lawyer": "홍길동",
	    "body": "The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog"
	  }]
	};

	res.send(obj);
});

router.delete('/qna/:id', function(req, res){
	console.log(req.params.id);

	res.send({result:true});
});

module.exports = router;
