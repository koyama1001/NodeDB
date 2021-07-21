const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs') 
const app = express()
const port = 3000
const mysql = require('mysql');
const encoder =bodyParser.urlencoded();
const Connection = require('mysql/lib/Connection')

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');


const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'works'
});



con.connect(function(err) {
  if (err) throw err;
  console.log('Connected');
});


console.log(__dirname);
app.set('veiw engine','hds');




app.get('/', (req, res) => {
//response.send("Hello");
res.render("login");
	});




app.post("/",encoder,(req,res)=>{
  const user_no=req.body['user_no'];
  const password=req.body['password'];

  if (user_no && password) {
    const sql = "SELECT * FROM user WHERE user_no = ? and password =?";
    con.query(sql,[user_no,password],function (err, result, fields) {  
      if (result.length > 0) {
        if(result[0].auth_type==1)
        {
          console.log(result[0].auth_type);
          res.redirect('stamp');
        }else{
          console.log(result[0].auth_type);
          console.log(result);
          console.log(user_no);
          console.log(password);
          res.redirect('index/user_no');

        }
      }
      else{
        response.send('Incorrect user_no and/or Password!');
      }
    
    });
  }
});

app.get('/index/:user_no', (req, res)=> {
  const sql = "select * from work  WHERE user_id = "+ req.params.user_no;
	con.query(sql, function (err, result, fields) {  
	if (err) throw err;
	res.render('index',{works : result});
	});
});


app.get('/stamp', (req, res) => 
	res.render('stamp'))

app.post('/stamp', (req, res) => res.send(req.body))



//編集	
app.get('/edit/:id',(req,res)=>{
	const sql = "SELECT * FROM work WHERE id = ?";
	con.query(sql,[req.params.id],function (err, result, fields) {  
		if (err) throw err;
		res.render('edit',{works : result});
		});
});

//更新
app.post('/update/:id',(req,res)=>{
	const sql = "UPDATE work SET ? WHERE id = " + req.params.id;
	con.query(sql,req.body,function (err, result, fields) {  
		if (err) throw err;
		console.log(result);
		res.redirect('/index');
		});
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))