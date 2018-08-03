var express = require('express'); 
var mysql = require('mysql');
var cors = require('cors');
var socket = require('socket.io');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();

app.use(cors());
app.use("/", router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



var connection = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'richpanel'
});
connection.connect();
router.post('/api/authenticateAdmin', function(req, res, next){
	console.log(req.body);
   var userName = req.body.userName;
   var pass = req.body.pass;
   var sql = 'select count(*) as count from admin where admin_name = ? and password = ?';
   var query = connection.query(sql, [userName, pass], function(err, result) {
     if (err) {
        console.error(err);
        return res.send(err);
     } else {
	    console.log(result); 
        return res.json(result);
     }
	});
});

router.post('/api/authenticateUser', function(req, res, next){
	console.log(req.body);
   var userName = req.body.userName;
   var pass = req.body.pass;
   var sql = 'select count(*) as count from user where user_name = ? and user_password = ?';
   var query = connection.query(sql, [userName, pass], function(err, result) {
     if (err) {
        console.error(err);
        return res.send(err);
     } else {
	   // console.log(result); 
        return res.json(result);
     }
	});
});

router.post('/api/registerUser', function(req, res, next){
   var data = req.body;
   console.log(data);
   var query = connection.query('insert into user SET ?', data, function(err, result) {
     if (err) {
        console.error(err);
        return res.send(err);
     } else {
	    console.log(result); 
        return res.json(result);
     }
	});
});

router.post('/api/getUsersList', function(req, res, next){
	var data = req.body;
	var sql = 'select distinct user_name from user';
	var query = connection.query(sql, function(err, result){
	if (err) {
        console.error(err);
        return res.send(err);
     } else {
	    console.log(result); 
        return res.send(result);
     }
	});
});

router.post('/api/getUserChatHistory', function(req, res, next){
	var userName = req.body.userName;
	var sql = 'select message, DATE_FORMAT(chat_date, "%d %M") as chat_date, TIME_FORMAT(chat_time, "%h %i %p") as chat_time, from_user from chat where user_name = ? and chat_date BETWEEN (CURDATE() - INTERVAL 30 DAY) AND CURDATE() order by chat_sequence_no';
	var query = connection.query(sql,[userName], function(err, result){
	if (err) {
        console.error(err);
        return res.send(err);
     } else {
	    console.log(result); 
        return res.send(result);
     }
	});
});
var server = app.listen(8080,function(){
	console.log("Started server on port 8080");
});
var io = socket(server);
var clientSocketIds = {};
var adminSocketIds = {};

io.on('connection', function(socket){
	var isUser = socket.handshake.query.isUser;
	var userName = socket.handshake.query.uName;
	
	if(isUser){
		clientSocketIds.userName = socket.id;
	}else{
		adminSocketIds.userName = socket.id;
	}
	
	socket.on('chat', function(data){
		var user_name = data.uName;
		var admin_user_name = data.adminName;
		var message = data.message;
		var from_user = data.isUser;
		
		var insertSQL = "insert into chat (user_name, admin_user_name, chat_date, chat_time, message, chat_sequence_no, from_user`) VALUES(?,?,curdate(),curtime(),?,select (ifnull(max(chat_sequence_no),0) + 1) from chat where user_name=?,?)";
		
		var query = connection.query(insertSQL,[user_name,admin_user_name,message,user_name,from_user], function(err, result){
			if (err) {
				console.error(err);
				return res.send(err);
			 } else {
				var sql = 'select message, DATE_FORMAT(chat_date, "%d %M") as chat_date, TIME_FORMAT(chat_time, "%h %i %p") as chat_time, from_user from chat where user_name = ? and chat_date BETWEEN (CURDATE() - INTERVAL 30 DAY) AND CURDATE() order by chat_sequence_no';
				var query = connection.query(sql,[user_name], function(err, result){
				if (err) {
					console.error(err);
					return res.send(err);
				 } else {
					console.log(result);
					var returnObj = {
						result   : result,
						userName : user_name
					};
					io.sockets.emit('message', returnObj);
				 }
				});
			 }
		});
	});
});