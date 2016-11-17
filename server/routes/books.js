var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/sigma';


// get books and distinct genres from DB
router.get('/', function(req, res) {
  console.log('get request');
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }
    var data = {};

    // Select all books
    client.query('SELECT * FROM books', function(err, result) {

      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      data.books = result.rows;
    });

    // Select each distinct genre
    client.query('SELECT DISTINCT genre FROM books', function(err, result) {
      done(); // close the connection.

      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }

      data.genres = result.rows;
      res.send(data);
    });

  });
});

// Get all books one particular genre
router.get('/:genre', function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    if(err) {
      console.log('connection error:', err);
      res.sendStatus(500);
    }

    client.query(
      'SELECT * FROM books WHERE genre = $1',
      [req.params.genre],
      function (err, result) {
        done();

        if(err) {
          console.log('select genre query error:', err);
          res.sendStatus(500);
        }
        res.send(result.rows);
      }
    )
  })
});

// Add a new book to the database
router.post('/', function(req, res) {
  var newBook = req.body;
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'INSERT INTO books (title, author, published, genre, edition, publisher) ' +
      'VALUES ($1, $2, $3, $4, $5, $6)',
      [newBook.title, newBook.author, newBook.published, newBook.genre, newBook.edition, newBook.publisher],
      function(err, result) {
        done();

        if(err) {
          console.log('insert query error: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });

  });

});

// Delete a book
router.delete('/:id', function(req, res) {
  bookID = req.params.id;

  console.log('book id to delete: ', bookID);
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'DELETE FROM books WHERE id = $1',
      [bookID],
      function(err, result) {
        done();

        if(err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    });

});


// Update a book
router.put('/:id', function(req, res) {
  bookID = req.params.id;
  book = req.body;

  console.log('book to update ', book);

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'UPDATE books SET title=$1, author=$2, genre=$3, published=$4, edition=$5, publisher=$6' +
      ' WHERE id=$7',
      // array of values to use in the query above
      [book.title, book.author, book.genre, book.published, book.edition, book.publisher, bookID],
      function(err, result) {
        if(err) {
          console.log('update error: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }); // close connect

}); // end route


module.exports = router;
