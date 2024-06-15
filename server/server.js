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
  //const { username, password } = req.body;
  let username = req.body.username;
  let password = req.body.password;
  console.log('Username:', username);
  console.log('Password:', password);

  res.cookie('username', username);
 


  /*
  // controllo se l'utente è presente nel database
  try{
    const query = con.query('SELECT * FROM user WHERE username = $1', [username]);
    const user = query.rows[0];
    console.log(user);

    if (!user) {
      console.log('Hai sbagliato le tue credenziali')
    }
  } catch (error) {
    console.error('Errore di login', error);
    res.status(500).send({status : "internal error"});
  }
  */

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



  /*
  // Query al db per controllo utente già esistente
  if(!username) {
    return null;
  }
  
  const result = con.query('SELECT * FROM user WHERE username = $1', [username]);
  const user = result.rows[0];
  if(user) {
    console.log('Utente esiste gia');
  }
  
  else {
    console.log('utente nuovo');
  }
  */
});

app.post('/upload-macchine', (req, res) => {
  console.log('body:', req.body);
  //prendere i dati dal form

  let marca = req.body.marca;
  let modello = req.body.modello;
  let descrizione = req.body.descrizione;
  let anno = req.body.anno;
  let kilometri = req.body.kilometri;
  let prezzo = req.body.prezzo;
  // prendere lo stato della nuova macchina
  // prendere il venditore (username)
  // ottenere l'id della nuova macchina

  
  //inserire i dati nel database
  // manca il campo id
  con.query('INSERT INTO macchine (marca, modello, descrizione, anno, kilometri, stato, prezzo, venditore, venduta) VALUES ($1, $2, $3, $4, $5, $6)', [marca, modello, descrizione, anno, kilometri, stato])


});

app.post('/upload-ricambi', (req, res) => {
  console.log('body:', req.body);
  //prendere i dati dal form
  //inserire i dati nel database
});

app.get('/macchine', (req, res) => {
  console.log('body:', req.body);
  //sql per prendere tutte le macchine
  //restiruire un json con tutte le macchine
});

app.get('/ricambi', (req, res) => {
  console.log('body:', req.body);
  //sql per prendere tutti i ricambi
  //restiruire un json con tutti i ricambi
});

app.post('/buy-macchina', (req, res) => {
  console.log('body:', req.body);
  //prendere i dati dal form id macchina e nome cliente
  //inserire i dati nel database
});

app.post('/buy-ricambi', (req, res) => {

  console.log('body:', req.body);
  //prendere i dati dal form id ricambi e nome cliente
  //inserire i dati nel database
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});