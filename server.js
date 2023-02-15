const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = 3001; // server to listen to this port
const DATABASE = './db/db.json'; // current file for storing data

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
    fs.readFile(DATABASE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(err).send("read note from file failed");
        } else {
            res.status(200).send(data); // returning json of notes to the client
        }
    });

});

app.post('/api/notes', (req, res) => { // posts the new note and returns the new note to the client
    console.info(`POST /api/notes should received a new note and saved it.`);
    const note = req.body; // json with the data from the client 
    note.id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); // generates random ID

    console.info(note);

    fs.readFile(DATABASE, 'utf-8', (err, data) => { // reading the file into the buffer
        if (err) {
            console.error(err);
        } else {
            const buffer = JSON.parse(data); // getting existing data
            buffer.push(note); // adding the new note to the end
            fs.writeFile(DATABASE, JSON.stringify(buffer), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    res.status(err).send("append note to file failed");
                } else {
                    res.status(201).send(buffer); // returning the saved note
                }
            });

        }
    });

});

app.delete('api/notes/:delID',(req,res) => { //deletes the note from the database
    console.info(req.params.delID);
    if (req.params.id) { // the parameter is passed ok
        fs.readFile(DATABASE, 'utf-8', (err, data) => { // reading the file into the buffer
            if (err) {
                console.error(err);
            } else {
                const buffer = JSON.parse(data); // getting existing data
                buffer = buffer.filter((element) => {return (element !== req.params.delID) }); // returns the new array deletes element id
                fs.writeFile(DATABASE, JSON.stringify(buffer), 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        res.status(err).send("delete note from the file failed");
                    } else {
                        res.status(201).send(buffer); // returning the new list of notes
                    }
                });
    
            }
        });

    }

});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} `)
);