const express = require('express');
let app = express();
let http = require('http').Server(app);
let mysql = require('mysql');
const bodyParser = require('body-parser');
let db = require('./db.js'); //dati database in un'altro file
let con;

//mi connetto al database
con = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to the database!");
});


app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Username:', username);
  console.log('Password:', password);

  res.cookie('username', username);

  //controllo sql se è un venditore o un cliente

  res.cookie('tipo', 'cliente');
  res.cookie('tipo', 'venditore');

  /*
      con.query("INSERT INTO `tutorial` (`Titolo`, `Descrizione`) VALUES (?,?)", [titolo, descrizione], function (err) {
          if (err) throw err;
          return res.status(201).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <script type="text/javascript">
                setTimeout(function() {
                  window.location.href = 'http://localhost/upload/';
                }, 2000);
              </script>
            </head>
            <body>
            <h2>Tutorial created successfully</h2>
              <p>Redirecting in 2 seconds...</p>
            </body>
          </html>
        `);
  
        
      });*/

  res.redirect('http://localhost/auto.html');
  console.log('body:', req.body);


});


//Upload file

app.post('/signin', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let venditorecliente = req.body.venditorecliente;
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('venditorecliente:', venditorecliente);

});

app.post('/upload-macchine', (req, res) => {
  //prendere i dati dal form
  //inserire i dati nel database
});

app.post('/upload-ricambi', (req, res) => {
  //prendere i dati dal form
  //inserire i dati nel database
});

app.get('/macchine', (req, res) => {
  //sql per prendere tutte le macchine
  //restiruire un json con tutte le macchine
});

app.get('/ricambi', (req, res) => {
  //sql per prendere tutti i ricambi
  //restiruire un json con tutti i ricambi
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});