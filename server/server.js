let app = require('express')();
let http = require('http').Server(app);
const bodyParser = require('body-parser');
const path = require('path');
const multer = require("multer");
let mysql = require('mysql');
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

//Create new tutorial
// for parsing multipart/form-data
app.use(multer().any());

app.post('', (req, res) => {

    let titolo = req.body.title;
    let descrizione = req.body.description;

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
    });

    console.log('body:', req.body);


});


//Upload file

app.post('', (req, res) => {

    if (!req.body.title || !req.body.description || !req.body.token || !req.body.tutorial) {
        return res.status(400).send('Please provide all required fields and files');
    }

    let titolo = req.body.title;
    let descrizione = req.body.description;
    let tutorial = req.body.tutorial;
    let token = req.body.token;
    let PathPresentazione = '/var/www/html/upload/file/';
    let PathEsercizi = '/var/www/html/upload/file/';;

    console.log('Title:', req.body.title);
    console.log('Description:', req.body.description);
    console.log('Token:', req.body.token);
    console.log('Tutorial:', req.body.tutorial);
    console.log('Files:', req.files);

    //query token

    // Save each file to a specified directory
    req.files.forEach(file => {
        const destinationDir = '/var/www/html/upload/file'; // Specify your destination directory here
        const filePath = path.join(destinationDir, file.originalname);
        if (file.fieldname == 'presentation') {
            PathPresentazione = '/var/www/html/upload/file/' + file.originalname;
        }
        if (file.fieldname == 'exercise') {
            PathPresentazione = '/var/www/html/upload/file/' + file.originalname;
        }
        // Save the file
        fs.writeFile(filePath, file.buffer, (err) => {
            if (err) {
                console.error('Error saving file:', err);
            } else {
                console.log('File saved successfully:', file.originalname);
            }
        });
    });

    con.query("INSERT INTO `subtutorial` (`Titolo`, `Descrizione`, `PathPresentazione`, `PathEsercizi`, `tutorial`) VALUES (?,?,?,?,?)", [titolo, descrizione, PathPresentazione, PathEsercizi, tutorial], function (err) {
        if (err) throw err;
        return res.status(201).send('Caricato nel tutorial');
    });

    res.send('Files uploaded successfully!');
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});