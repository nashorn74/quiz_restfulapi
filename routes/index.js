var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//////////////////////////////////////////////////////////

var datautils = require('date-utils');
var request = require('request');
var MongoClient = require('mongodb').MongoClient; 
var ObjectID = require('mongodb').ObjectID;
// Connection URL 
var url = 'mongodb://localhost:27017/quiz';
const redis = require('redis');  
const client = redis.createClient(); 

router.get('/qna', function(req,res) {
	console.log(JSON.stringify(req.query));
	client.get(JSON.stringify(req.query), function (err, data) {
        if (err) {
        	res.send({result:false,err:err});
        } else {
        	if (data != null) {
        		console.log("Redis data response...")
	            res.send(JSON.parse(data));
	        } else {
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
						    	client.setex(JSON.stringify(req.query), 300, JSON.stringify(results));
						    	res.send(results);
						    }
						    db.close();
						});
					}
				});
	        }
        }
    });
});

router.get('/qna.csv', function(req, res) {
	MongoClient.connect(url, function(err, db) {
		console.log("Connected correctly to server");
		if (err) {
			res.send({result:false,err:err});
		} else {
			var qna = db.collection('qna');
			qna.find({}).sort({createdAt:-1})
				.toArray(function(err, results) {
			    if (err) {
			    	res.send({result:false,err:err});
			    } else {
			    	res.setHeader('Content-disposition', 'attachment; filename=qna.txt');
					res.setHeader('Content-type', 'text/plain');
					res.charset = 'UTF-8';
					res.write("\"질문 ID\", \"질문 제목\", \"질문 본문\", \"게시물 작성일\", \"게시물 작성일\", \"답변 변호사\"\n");
					for (var i = 0; i < results.length; i++) {
						var obj = results[i];
						var lawyers = '';
						for (var j = 0; j < obj.answers.length; j++) {
							lawyers += obj.answers[j].lawyer;
							if (j != obj.answers.length-1)
								lawyers += ", ";
						}
						var createdAt = obj.createdAt.toFormat('YYYY-MM-DD HH24:MI:SS');
						var updatedAt = obj.updatedAt.toFormat('YYYY-MM-DD HH24:MI:SS');
						res.write("\""+obj._id+"\", \""+
							obj.title+"\", \""+obj.body+
							"\", \""+createdAt+"\", \""+updatedAt+"\", \""+
							lawyers+"\"\n");
					}
					res.end();
			    }
			    db.close();
			});
		}
	});	
});

router.get('/qna/:id', function(req, res) {
	console.log(req.params.id);
	client.get(req.params.id, function (err, data) {
        if (err) {
        	res.send({result:false,err:err});
        } else {
        	if (data != null) {
        		console.log("Redis data response...")
	            res.send(JSON.parse(data));
	        } else {
	            MongoClient.connect(url, function(err, db) {
					console.log("Connected correctly to server");
					if (err) {
						res.send({result:false,err:err});
					} else {
						var qna = db.collection('qna');
						qna.find({_id:ObjectID.createFromHexString(req.params.id)})
							.sort({createdAt:-1})
							.toArray(function(err, results) {
						    if (err) {
						    	res.send({result:false,err:err});
						    } else {
						    	client.setex(req.params.id, 300, JSON.stringify(results));
						    	res.send(results);
						    }
						    db.close();
						});
					}
				});
	        }
        }
    });
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
    MongoClient.connect(url, function(err, db) {
		console.log("Connected correctly to server");
		if (err) {
			res.send({result:false,err:err});
		} else {
			var qna = db.collection('qna');
			qna.find({_id:ObjectID.createFromHexString(req.params.id)})
				.sort({createdAt:-1})
				.toArray(function(err, results) {
			    if (err) {
			    	res.send({result:false,err:err});
			    } else {
			    	var sendBody = JSON.stringify(
								{
								  id: 2,
								  title: "some title",
								  body: "some value"
								});
			    	if (results.length > 0) {
			    		results[0].id = results.length;
			    		sendBody = JSON.stringify(results[0]);
			    	}
			    	console.log(sendBody);
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
							body: sendBody
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
			    }
			    db.close();
			});
		}
	});
});

router.put('/qna/:id', function(req, res) {
	console.log(req.params.id);
	MongoClient.connect(url, function(err, db) {
		console.log("Connected correctly to server");
		if (err) {
			res.send({result:false,err:err});
		} else {
			var qna = db.collection('qna');
			qna.update({_id:ObjectID.createFromHexString(req.params.id)}, 
				{$set:{title:req.body.title,body:req.body.body,
					answers:req.body.answers, updatedAt:new Date()}},
				function(err, result) {
			    if (err) {
			    	res.send({result:false,err:err});
			    	db.close();
			    } else {
					qna.findOne({_id:ObjectID.createFromHexString(req.params.id)},
						function(err, result) {
					    if (err) {
					    	res.send({result:false,err:err});
					    } else {
					    	res.send(result);
					    }
					    db.close();
					});
			    }
			});
		}
	});
});

router.delete('/qna/:id', function(req, res){
	console.log(req.params.id);
	MongoClient.connect(url, function(err, db) {
		console.log("Connected correctly to server");
		if (err) {
			res.send({result:false,err:err});
		} else {
			var qna = db.collection('qna');
			qna.remove({_id:ObjectID.createFromHexString(req.params.id)}, 
				function(err, result) {
			    if (err) {
			    	res.send({result:false,err:err});
			    } else {
			    	res.send({result:true,return:result});
			    }
			    db.close();
			});
		}
	});
});

module.exports = router;
