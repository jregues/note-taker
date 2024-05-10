const express = require("express");
const path = require("path");
const fs = require("fs");
const notesData = fs.readFileSync('./db/db.json', 'utf8')
const PORT = 3001;

const app = express();

const generateUniqueId = () => {
    return '_' + Math.random().toString(30).substr(2, 9);
   }

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get('/api/notes', (req, res) => res.json(notesData));

app.post('/api/notes', (req, res) => {
    try {
    const notes = JSON.parse(notesData)

    

    const newNote = {
        id: generateUniqueId(),
        title: req.body.title,
        text: req.body.text
    };

    notes.push(newNote)
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
    res.json(newNote);
} catch (err) {
    console.error('Error writing file:', err);
    res.status(500).send('Error writing file');
}
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
