const express = require('express');
let app = express();
let http = require('http').Server(app);
let mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
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

app.use(cors({
  origin: 'http://localhost', // Replace with your frontend origin
  credentials: true, // Allow cookies from the frontend
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  console.log('body:', req.body);

  res.clearCookie('username');
  res.clearCookie('tipo');

  let username = req.body.username;
  let password = req.body.password;
  console.log('Username:', username);
  console.log('Password:', password);

  con.query('SELECT username, password, clientevenditore FROM user WHERE username = ?', [username], function (err, results) {
    if (err) {
      console.error('Errore durante la selezione del nome nel database', err);
      return res.status(500).send('Errore interno del server');
    }

    if (results.length === 0) {
      // Utente non trovato
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <script type="text/javascript">
              alert('Nome utente non valido');
              window.location.href = 'http://localhost/login.html';
            </script>
          </head>
          <body></body>
        </html>
      `);
    }

    let user = results[0];
    if (user.password !== password) {
      // Password non corrisponde
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <script type="text/javascript">
              alert('Password non valida');
              window.location.href = 'http://localhost/login.html';
            </script>
          </head>
          <body></body>
        </html>
      `);
    }

    // Login corretto, impostare i cookie
    res.cookie('username', username);
    if (user.clientevenditore === 'venditore') {
      res.cookie('tipo', 'venditore');
    } else {
      res.cookie('tipo', 'cliente');
    }

    // Redirect alla pagina principale
    res.status(201).redirect('http://localhost/auto.html');
  });

});


//Upload file

app.post('/signin', (req, res) => {

  res.clearCookie('username');
  res.clearCookie('tipo');

  let username = req.body.username;
  let password = req.body.password;
  let venditorecliente = req.body.venditorecliente;
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('venditorecliente:', venditorecliente);

  con.query('SELECT username FROM user WHERE username = ?', [username], function (err, results) {
    if (err) {
      console.error('Errore durante la selezione del nome nel database', err);
      return res.status(500).send('Errore interno del server');
    }

    if (results.length === 0) {
      // Utente non trovato
      con.query('INSERT INTO user (username, password, clientevenditore) VALUES (?, ?, ?)',
        [username, password, venditorecliente], function (err) {
          if (err) {
            console.error('Errore durante l\'inserimento nel database', err);
            return res.status(500).send('Errore interno del server');
          }

          // Login corretto, impostare i cookie
          res.cookie('username', username);
          if (venditorecliente === 'venditore') {
            res.cookie('tipo', 'venditore');
          } else {
            res.cookie('tipo', 'cliente');
          }

          // Redirect alla pagina principale
          res.status(201).redirect('http://localhost/auto.html');
        });

    } else {
      return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <script type="text/javascript">
            alert('Utente già esistente');
            window.location.href = 'http://localhost/login.html';
          </script>
        </head>
        <body></body>
      </html>
    `);
    }
  });

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
  let stato = req.body.stato;
  let venditore = req.cookies.username;
  if (!venditore) {
    return res.status(400).send('Venditore non trovato nei cookie');
  }

  // Inserire i dati nel database
  con.query('INSERT INTO macchine (marca, modello, descrizione, anno, kilometri, stato, prezzo, venditore, venduta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [marca, modello, descrizione, anno, kilometri, stato, prezzo, venditore, 0], function (err) {
      if (err) {
        console.error('Errore durante l\'inserimento nel database', err);
        return res.status(500).send('Errore interno del server');
      }

      res.status(201).redirect('http://localhost/auto.html');
    });

});

app.post('/upload-ricambi', (req, res) => {
  console.log('body:', req.body);
  //prendere i dati dal form
  let marca = req.body.marca;
  let modello = req.body.modello;
  let descrizione = req.body.descrizione;
  let prezzo = req.body.prezzo;
  let stato = req.body.stato;
  let venditore = req.cookies.username;
  if (!venditore) {
    return res.status(400).send('Venditore non trovato nei cookie');
  }

  // Inserire i dati nel database
  con.query('INSERT INTO ricambi (marca, modello, descrizione, stato, prezzo, venditore, venduta) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [marca, modello, descrizione, stato, prezzo, venditore, 0], function (err) {
      if (err) {
        console.error('Errore durante l\'inserimento nel database', err);
        return res.status(500).send('Errore interno del server');
      }

      res.status(201).redirect('http://localhost/ricambi.html');
    });
});

app.get('/macchine', (req, res) => {
  const sql = `
    SELECT m.id, m.marca, m.modello, m.descrizione, m.anno, m.kilometri, m.stato, m.prezzo, m.venduta, v.username AS venditore_username 
    FROM macchine m 
    JOIN user v ON m.venditore = v.username
  `;

  con.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching macchine:', err);
      return res.status(500).send('Internal Server Error');
    }

    const macchine = results.map(row => ({
      id: row.id,
      marca: row.marca,
      modello: row.modello,
      descrizione: row.descrizione,
      anno: row.anno,
      kilometri: row.kilometri,
      stato: row.stato,
      prezzo: row.prezzo,
      venduta: row.venduta,
      venditore: {
        username: row.venditore_username
      }
    }));

    res.json(macchine);
  });
});

app.get('/ricambi', (req, res) => {
  const sql = `
    SELECT r.id, r.marca, r.modello, r.descrizione, r.stato, r.prezzo, r.venduta, v.username AS venditore_username 
    FROM ricambi r 
    JOIN user v ON r.venditore = v.username
  `;

  con.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching ricambi:', err);
      return res.status(500).send('Internal Server Error');
    }

    const ricambi = results.map(row => ({
      id: row.id,
      marca: row.marca,
      modello: row.modello,
      descrizione: row.descrizione,
      stato: row.stato,
      prezzo: row.prezzo,
      venduta: row.venduta,
      venditore: {
        username: row.venditore_username
      }
    }));

    res.json(ricambi);
  });
});

app.post('/buy-macchina', (req, res) => {
  console.log('body:', req.body);
  //prendere i dati dal form id macchina e nome cliente
  //inserire i dati nel database
  let macchina = req.body.macchina_id;
  let cliente = req.body.username;
  let venditore;

  con.query('SELECT venditore FROM macchine where id=?', [macchina], function (err, results) {
    if (err) {
      console.error('Errore durante la ricerca nel database', err);
      return res.status(500).send('Errore interno del server');
    }
    venditore = results[0].venditore;

    con.query('INSERT INTO transazioni (venditore, cliente, `id-macchine-vendita`) VALUES (?, ?, ?)',
      [venditore, cliente, macchina], function (err) {
        if (err) {
          console.error('Errore durante l\'inserimento nel database', err);
          return res.status(500).send('Errore interno del server');
        }

        con.query('UPDATE macchine SET venduta=1 WHERE id=?', [macchina], function (err) {
          if (err) {
            console.error('Errore durante l\'aggiornamento nel database', err);
            return res.status(500).send('Errore interno del server');
          }
          res.status(201).redirect('http://localhost/auto.html');
        });

      });

  });

});

app.post('/buy-ricambi', (req, res) => {
  console.log('body:', req.body);
  //prendere i dati dal form id macchina e nome cliente
  //inserire i dati nel database
  let ricambio = req.body.ricambi_id;
  let cliente = req.body.username;
  let venditore;

  con.query('SELECT venditore FROM ricambi where id=?', [ricambio], function (err, results) {
    if (err) {
      console.error('Errore durante la ricerca nel database', err);
      return res.status(500).send('Errore interno del server');
    }
    venditore = results[0].venditore;

    con.query('INSERT INTO transazioni (venditore, cliente, `id-ricambi-vendita`) VALUES (?, ?, ?)',
      [venditore, cliente, ricambio], function (err) {
        if (err) {
          console.error('Errore durante l\'inserimento nel database', err);
          return res.status(500).send('Errore interno del server');
        }

        con.query('UPDATE ricambi SET venduta=1 WHERE id=?', [ricambio], function (err) {
          if (err) {
            console.error('Errore durante l\'aggiornamento nel database', err);
            return res.status(500).send('Errore interno del server');
          }
          res.status(201).redirect('http://localhost/ricambi.html');
        });

      });

  });
});

app.get('/transazioni', (req, res) => {
  console.log('body:', req.body);
  const username = req.cookies.username; // Assume che il cookie username sia stato impostato correttamente durante il login
  console.log('Username:', username);
  // Query SQL per recuperare le transazioni dell'utente come venditore o cliente
  const sql = `
    SELECT t.id, t.venditore, t.cliente, t.\`id-macchine-vendita\`, t.\`id-ricambi-vendita\`, 
           m.marca AS marca_macchina, m.modello AS modello_macchina, m.descrizione AS descrizione_macchina,
           r.marca AS marca_ricambio, r.modello AS modello_ricambio, r.descrizione AS descrizione_ricambio,
           m.stato AS stato_macchina, r.stato AS stato_ricambio
    FROM transazioni t
    LEFT JOIN macchine m ON t.\`id-macchine-vendita\` = m.id
    LEFT JOIN ricambi r ON t.\`id-ricambi-vendita\` = r.id
    WHERE t.venditore = ? OR t.cliente = ?
  `;

  con.query(sql, [username, username], (err, results) => {
    if (err) {
      console.error('Errore durante il recupero delle transazioni:', err);
      return res.status(500).send('Errore interno del server');
    }

    const transazioni = results.map(row => {
      // Determina se la transazione è relativa a una macchina o a un ricambio
      const isMacchina = row.marca_macchina !== null;
      const isRicambio = row.marca_ricambio !== null;

      // Costruisci l'oggetto transazione con i dati rilevanti
      const transazione = {
        id: row.id,
        venditore: row.venditore,
        cliente: row.cliente,
        macchina: {
          id: row['id-macchine-vendita'],
          marca: isMacchina ? row.marca_macchina : null,
          modello: isMacchina ? row.modello_macchina : null,
          descrizione: isMacchina ? row.descrizione_macchina : null,
          stato: isMacchina ? row.stato_macchina : null,
        },
        ricambio: {
          id: row['id-ricambi-vendita'],
          marca: isRicambio ? row.marca_ricambio : null,
          modello: isRicambio ? row.modello_ricambio : null,
          descrizione: isRicambio ? row.descrizione_ricambio : null,
          stato: isRicambio ? row.stato_ricambio : null,
        }
      };

      return transazione;
    });

    res.status(200).json(transazioni);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});