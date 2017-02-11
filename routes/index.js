var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//////////////////////////////////////////////////////////

router.get('/qna', function(req,res) {
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
	 }, {
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
	var obj = {
	  "id": 1,
	  "title": "Lorem ipsum",
	  "createdAt": "2017-02-09T20:47:46.677Z",
	  "updatedAt": "2017-02-09T20:47:46.677Z",
	  "body": "The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog",
	  "answers": [{
	    "lawyer": "홍길동",
	    "body": "The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog, The quick brown fox jumps over lazy dog"
	  }]
	};

	res.send(obj);
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
