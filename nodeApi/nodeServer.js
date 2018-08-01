var express = require('express'); 
var mysql = require('mysql');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
app.use(cors());

var router = express.Router();
var connection = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'richpanel'
});
connection.connect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
	    console.log(result); 
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
app.use("/", router);

app.listen(8080);