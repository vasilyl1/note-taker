const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = 3001; // server to listen to this port

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // middleware to allow client/browser to read from public and beyond


// HTML routes 
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// API routes
app.get('/api/notes', (req, res) => { // returns all existing Notes
    console.info(`GET /api/notes to read db.json and return all saved notes as JSON`);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.status(200).send(data); // returning json of notes to the client
        }
    });

});

app.post('/api/notes', (req, res) => { // posts the new note and returns the new note to the client
    console.info(`POST /api/notes should receive a new note to save 
        on the request body, add it to the db.json file, and then return 
        the new note to the client. You'll need to find a way to give each 
        note a unique id when it's saved (look into npm packages that could 
            do this for you).`);

    const note = req.body; // client sends json.stringify
    const newNote = note;



    // write to the DB functionality here


    const response = {
        status: 'success',
        body: newNote,
    }
    res.status(201).json(response);
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} `)
);