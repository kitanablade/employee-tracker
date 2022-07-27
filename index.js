const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'books_db'
  },
  console.log(`Connected to the movies_db database.`)
);

app.get("/api/results", (req, res) => {
    db.query('SELECT * FROM students', function (err, results) {
      res.json(results);
    });
  });

  app.use((req, res) => {
    res.status(404).end();
  });  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
