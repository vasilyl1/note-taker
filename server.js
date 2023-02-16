const express = require('express');
const path = require('path');
const fs = require('fs');
const randomID = require('./lib/mathFunctions.js');
const PORT = 3001; // server to listen to this port
const DATABASE = './db/db.json'; // database file for storing notes data

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
    const note = req.body; // json with the data from the client 
    note.id = randomID(); // generates random ID

    fs.readFile(DATABASE, 'utf-8', (err, data) => { // reading the file into the buffer
        if (err) {
            console.error(err);
        } else {
            const buffer = JSON.parse(data); // getting existing data
            while (buffer.filter((el) => { return (el.id === note.id) }).length > 0) {
                // this is checking if we have assigned duplicate id.
                // If so, generates the new id
                note.id = randomID();
            };
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

app.delete('/api/notes/:id', (req, res) => { //deletes the note from the database
    if (req.params.id) { // the parameter is passed ok
        fs.readFile(DATABASE, 'utf-8', (err, data) => { // reading the file into the buffer
            if (err) {
                console.error(err);
            } else {
                let buffer = JSON.parse(data); // getting existing data
                buffer = buffer.filter((el) => { return (el.id !== req.params.id) }); // returns the new array without the deleted element
                fs.writeFile(DATABASE, JSON.stringify(buffer), 'utf8', (err) => { // rewrites the file with the new data
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