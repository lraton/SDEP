const express = require('express'); // Importa il framework Express.js
let app = express(); // Crea un'applicazione Express
let http = require('http').Server(app); // Crea un server HTTP utilizzando l'applicazione Express
let mysql = require('mysql'); // Importa il modulo MySQL per la connessione al database
const bodyParser = require('body-parser'); // Middleware per il parsing dei dati di richiesta
const cookieParser = require('cookie-parser'); // Middleware per il parsing dei cookie
const cors = require('cors'); // Middleware per gestire le richieste di risorse incrociate (CORS)
let db = require('./db.js'); // Importa i dati di configurazione del database da un file esterno
let con; // Variabile per la connessione al database

// Connessione al database MySQL
con = mysql.createConnection({
  host: db.host, // Host del database
  user: db.user, // Utente del database
  password: db.password, // Password dell'utente
  database: db.database // Nome del database
});

con.connect(function (err) {
  if (err) throw err; // Gestisce gli errori di connessione al database
  console.log("Connessione al database avvenuta con successo!"); // Stampa un messaggio di conferma in caso di connessione riuscita
});

// Configurazione middleware per gestire le richieste CORS
app.use(cors({
  origin: 'http://localhost', // Origine del frontend che può accedere alle risorse del server
  credentials: true, // Permette l'uso dei cookie dalle richieste frontend
}));
app.use(cookieParser()); // Utilizza il middleware per il parsing dei cookie
app.use(express.urlencoded({ extended: true })); // Middleware per il parsing dei dati di tipo application/x-www-form-urlencoded
app.use(bodyParser.json()); // Middleware per il parsing dei dati di tipo application/json

// Gestione della richiesta POST per il login degli utenti
app.post('/login', (req, res) => {
  console.log('body:', req.body); // Stampa nel log i dati della richiesta POST

  res.clearCookie('username'); // Cancella il cookie 'username'
  res.clearCookie('tipo'); // Cancella il cookie 'tipo'

  let username = req.body.username; // Estrae l'username dalla richiesta
  let password = req.body.password; // Estrae la password dalla richiesta
  console.log('Username:', username);
  console.log('Password:', password);

  // Esegue una query per selezionare username, password e tipo di utente dal database
  con.query('SELECT username, password, clientevenditore FROM user WHERE username = ?', [username], function (err, results) {
    if (err) {
      console.error('Errore durante la selezione del nome nel database', err);
      return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nella query
    }

    if (results.length === 0) {
      // Se l'utente non è trovato nel database, restituisce un messaggio di errore con redirect
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <script type="text/javascript">
              alert('Nome utente non valido');
              window.location.href = 'http://localhost/login.html'; // Reindirizza alla pagina di login
            </script>
          </head>
          <body></body>
        </html>
      `);
    }

    let user = results[0]; // Estrae il risultato della query
    if (user.password !== password) {
      // Se la password non corrisponde, restituisce un messaggio di errore con redirect
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <script type="text/javascript">
              alert('Password non valida');
              window.location.href = 'http://localhost/login.html'; // Reindirizza alla pagina di login
            </script>
          </head>
          <body></body>
        </html>
      `);
    }

    // Se il login è corretto, imposta i cookie 'username' e 'tipo' in base al tipo di utente
    res.cookie('username', username);
    if (user.clientevenditore === 'venditore') {
      res.cookie('tipo', 'venditore');
    } else {
      res.cookie('tipo', 'cliente');
    }

    // Redirect alla pagina principale dopo il login
    res.status(201).redirect('http://localhost/auto.html');
  });

});

// Gestione della richiesta POST per la registrazione degli utenti
app.post('/signin', (req, res) => {
  res.clearCookie('username'); // Cancella il cookie 'username'
  res.clearCookie('tipo'); // Cancella il cookie 'tipo'

  let username = req.body.username; // Estrae l'username dalla richiesta
  let password = req.body.password; // Estrae la password dalla richiesta
  let venditorecliente = req.body.venditorecliente; // Estrae il tipo di utente (venditore o cliente) dalla richiesta
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('venditorecliente:', venditorecliente);

  // Esegue una query per verificare se l'username è già presente nel database
  con.query('SELECT username FROM user WHERE username = ?', [username], function (err, results) {
    if (err) {
      console.error('Errore durante la selezione del nome nel database', err);
      return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nella query
    }

    if (results.length === 0) {
      // Se l'username non è già presente nel database, esegue l'inserimento dei dati nel database
      con.query('INSERT INTO user (username, password, clientevenditore) VALUES (?, ?, ?)',
        [username, password, venditorecliente], function (err) {
          if (err) {
            console.error('Errore durante l\'inserimento nel database', err);
            return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nell'inserimento
          }

          // Se la registrazione è avvenuta con successo, imposta i cookie 'username' e 'tipo' in base al tipo di utente
          res.cookie('username', username);
          if (venditorecliente === 'venditore') {
            res.cookie('tipo', 'venditore');
          } else {
            res.cookie('tipo', 'cliente');
          }

          // Redirect alla pagina principale dopo la registrazione
          res.status(201).redirect('http://localhost/auto.html');
        });

    } else {
      // Se l'username è già presente nel database, restituisce un messaggio di errore con redirect
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <script type="text/javascript">
              alert('Utente già esistente');
              window.location.href = 'http://localhost/login.html'; // Reindirizza alla pagina di login
            </script>
          </head>
          <body></body>
        </html>
      `);
    }
  });

});

// Gestione della richiesta POST per l'upload di nuove macchine nel database
app.post('/upload-macchine', (req, res) => {
  console.log('body:', req.body); // Stampa nel log i dati della richiesta POST

  // Prende i dati inviati dal form
  let marca = req.body.marca;
  let modello = req.body.modello;
  let descrizione = req.body.descrizione;
  let anno = req.body.anno;
  let kilometri = req.body.kilometri;
  let prezzo = req.body.prezzo;
  let stato = req.body.stato;
  let venditore = req.cookies.username; // Assume che il cookie 'username' sia stato impostato correttamente durante il login

  if (!venditore) {
    return res.status(400).send('Venditore non trovato nei cookie'); // Se il cookie 'username' non è presente, restituisce un errore
  }

  // Esegue l'inserimento dei dati nel database
  con.query('INSERT INTO macchine (marca, modello, descrizione, anno, kilometri, stato, prezzo, venditore, venduta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [marca, modello, descrizione, anno, kilometri, stato, prezzo, venditore, 0], function (err) {
      if (err) {
        console.error('Errore durante l\'inserimento nel database', err);
        return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nell'inserimento
      }

      res.status(201).redirect('http://localhost/auto.html'); // Redirect alla pagina delle macchine dopo l'upload
    });

});

// Gestione della richiesta POST per l'upload di nuovi ricambi nel database
app.post('/upload-ricambi', (req, res) => {
  console.log('body:', req.body); // Stampa nel log i dati della richiesta POST

  // Prende i dati inviati dal form
  let marca = req.body.marca;
  let modello = req.body.modello;
  let descrizione = req.body.descrizione;
  let prezzo = req.body.prezzo;
  let stato = req.body.stato;
  let venditore = req.cookies.username; // Assume che il cookie 'username' sia stato impostato correttamente durante il login

  if (!venditore) {
    return res.status(400).send('Venditore non trovato nei cookie'); // Se il cookie 'username' non è presente, restituisce un errore
  }

  // Esegue l'inserimento dei dati nel database
  con.query('INSERT INTO ricambi (marca, modello, descrizione, stato, prezzo, venditore, venduta) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [marca, modello, descrizione, stato, prezzo, venditore, 0], function (err) {
      if (err) {
        console.error('Errore durante l\'inserimento nel database', err);
        return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nell'inserimento
      }

      res.status(201).redirect('http://localhost/ricambi.html'); // Redirect alla pagina dei ricambi dopo l'upload
    });
});

// Gestione della richiesta GET per ottenere la lista delle macchine disponibili
app.get('/macchine', (req, res) => {
  const sql = `
    SELECT m.id, m.marca, m.modello, m.descrizione, m.anno, m.kilometri, m.stato, m.prezzo, m.venduta, v.username AS venditore_username 
    FROM macchine m 
    JOIN user v ON m.venditore = v.username
  `;

  con.query(sql, (err, results) => {
    if (err) {
      console.error('Errore durante il recupero delle macchine:', err);
      return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nella query
    }

    // Costruisce un array di oggetti JSON contenenti le informazioni delle macchine
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

    res.json(macchine); // Restituisce la lista delle macchine in formato JSON
  });
});

// Gestione della richiesta GET per ottenere la lista dei ricambi disponibili
app.get('/ricambi', (req, res) => {
  const sql = `
    SELECT r.id, r.marca, r.modello, r.descrizione, r.stato, r.prezzo, r.venduta, v.username AS venditore_username 
    FROM ricambi r 
    JOIN user v ON r.venditore = v.username
  `;

  con.query(sql, (err, results) => {
    if (err) {
      console.error('Errore durante il recupero dei ricambi:', err);
      return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nella query
    }

    // Costruisce un array di oggetti JSON contenenti le informazioni dei ricambi
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

    res.json(ricambi); // Restituisce la lista dei ricambi in formato JSON
  });
});

// Gestione della richiesta POST per l'acquisto di una macchina
app.post('/buy-macchina', (req, res) => {
  console.log('body:', req.body); // Stampa nel log i dati della richiesta POST

  // Prende i dati inviati dal form: id della macchina da acquistare e nome del cliente
  let macchina = req.body.macchina_id;
  let cliente = req.body.username;
  let venditore;

  // Esegue una query per ottenere l'username del venditore della macchina
  con.query('SELECT venditore FROM macchine where id=?', [macchina], function (err, results) {
    if (err) {
      console.error('Errore durante la ricerca nel database', err);
      return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nella query
    }
    venditore = results[0].venditore;

    // Esegue una query per inserire i dati della transazione nel database
    con.query('INSERT INTO transazioni (venditore, cliente, `id-macchine-vendita`) VALUES (?, ?, ?)',
      [venditore, cliente, macchina], function (err) {
        if (err) {
          console.error('Errore durante l\'inserimento nel database', err);
          return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nell'inserimento
        }

        // Esegue una query per aggiornare lo stato della macchina a "venduta"
        con.query('UPDATE macchine SET venduta=1 WHERE id=?', [macchina], function (err) {
          if (err) {
            console.error('Errore durante l\'aggiornamento nel database', err);
            return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nell'aggiornamento
          }
          res.status(201).redirect('http://localhost/auto.html'); // Redirect alla pagina delle macchine dopo l'acquisto
        });

      });

  });

});

// Gestione della richiesta POST per l'acquisto di un ricambio
app.post('/buy-ricambi', (req, res) => {
  console.log('body:', req.body); // Stampa nel log i dati della richiesta POST

  // Prende i dati inviati dal form: id del ricambio da acquistare e nome del cliente
  let ricambio = req.body.ricambi_id;
  let cliente = req.body.username;
  let venditore;

  // Esegue una query per ottenere l'username del venditore del ricambio
  con.query('SELECT venditore FROM ricambi where id=?', [ricambio], function (err, results) {
    if (err) {
      console.error('Errore durante la ricerca nel database', err);
      return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nella query
    }
    venditore = results[0].venditore;

    // Esegue una query per inserire i dati della transazione nel database
    con.query('INSERT INTO transazioni (venditore, cliente, `id-ricambi-vendita`) VALUES (?, ?, ?)',
      [venditore, cliente, ricambio], function (err) {
        if (err) {
          console.error('Errore durante l\'inserimento nel database', err);
          return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nell'inserimento
        }

        // Esegue una query per aggiornare lo stato del ricambio a "venduto"
        con.query('UPDATE ricambi SET venduta=1 WHERE id=?', [ricambio], function (err) {
          if (err) {
            console.error('Errore durante l\'aggiornamento nel database', err);
            return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nell'aggiornamento
          }
          res.status(201).redirect('http://localhost/ricambi.html'); // Redirect alla pagina dei ricambi dopo l'acquisto
        });

      });

  });
});

// Gestione della richiesta GET per ottenere la lista delle transazioni di un utente
app.get('/transazioni', (req, res) => {
  console.log('body:', req.body); // Stampa nel log i dati della richiesta GET

  const username = req.cookies.username; // Assume che il cookie 'username' sia stato impostato correttamente durante il login
  console.log('Username:', username); // Stampa nel log l'username dell'utente

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
      return res.status(500).send('Errore interno del server'); // Restituisce errore interno del server in caso di errore nella query
    }

    // Costruisce un array di oggetti JSON contenenti le informazioni delle transazioni
    const transazioni = results.map(row => {
      // Determina se la transazione è relativa a una macchina o a un ricambio
      const isMacchina = row.marca_macchina !== null;
      const isRicambio = row.marca_ricambio !== null;

      // Costruisce l'oggetto transazione con i dati rilevanti
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

    res.status(200).json(transazioni); // Restituisce la lista delle transazioni in formato JSON
  });
});

// Configurazione del server HTTP per ascoltare sulla porta 3000
http.listen(3000, function () {
  console.log('listening on *:3000'); // Stampa nel log quando il server è in ascolto sulla porta 3000
});