$(document).ready(function () {
    getBooks();

    // add a book
    $('#book-submit').on('click', postBook);
    // delete a book
    $("#book-list").on('click', '.delete', deleteBook);
    // update a book
    $("#book-list").on('click', '.update', updateBook);
});
/**
 * Retrieve books from server and append to DOM
 */
function getBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
    success: function(books) {
      appendBooks(books);
    },
    error: function() {
      console.log('Database error');
    }

  })
}
/**
 * Add a new book to the database and refresh the DOM
 */
function postBook() {
  event.preventDefault();

  var book = {};

  $.each($('#book-form').serializeArray(), function (i, field) {
    book[field.name] = field.value;
  });
  // convert edition to integer
  book.edition = parseInt(book.edition);

  console.log('book: ', book);

  $.ajax({
    type: 'POST',
    url: '/books',
    data: book,
    success: function(response) {
      getBooks();
    },
    error: function() {
      console.log('could not post a new book');
    }
  })

}

function deleteBook() {
  var id = $(this).parent().data('id');
  console.log(id);

  $.ajax({
    type: 'DELETE',
    url: '/books/' + id,
    success: function(result) {
      getBooks();
    },
    error: function(result) {
      console.log('could not delete book.');
    }
  });
}

function updateBook() {
  var id = $(this).parent().data('id');
  console.log(id);

  // make book object
  var book = {};
  var fields = $(this).parent().children().serializeArray();
  fields.forEach(function(field) {
    book[field.name] = field.value;
  });
  console.log(book);

  $.ajax({
    type: 'PUT',
    url: '/books/' + id,
    data: book,
    success: function(result) {
      console.log('updated!!!!');
      getBooks();
    },
    error: function(result) {
      console.log('could not update book!');
    }
  });

}

function appendBooks(books) {
  $("#book-list").empty();

  for (var i = 0; i < books.length; i++) {
    $("#book-list").append('<div class="row book"></div>');
    $el = $('#book-list').children().last();
    var book = books[i];
    $el.data('id', book.id);
    console.log("Date from DB: ", book.published);

    // convert the date
    // book.date = new Date(book.published);
    // var month = book.date.getUTCMonth(book.date) + 1; // number
    // var day = book.date.getUTCDate(book.date);
    // console.log('day', day);
    // var year = book.date.getUTCFullYear(book.date);
    // var convertedDate = book.date.toLocaleDateString();//month + '/' + day + '/' + year;
    // console.log(convertedDate);

    var convertedDate = book.published.substr(0, 10);
    console.log(convertedDate);

    $el.append('<input type="text" name="title" value="' + book.title + '" />');
    $el.append('<input type="text" name="author" value="' + book.author + '" />');
    $el.append('<input type="text" name="genre" value="' + book.genre + '" />');
    var newDate = $('<input type="date" name="published" />');
    newDate.val(convertedDate)
    $el.append(newDate);
    $el.append('<input type="number" name="edition" value="' + book.edition + '" />');
    $el.append('<input type="text" name="publisher" value="' + book.publisher + '" />');

    $el.append('<button class="update">Update</button>');
    $el.append('<button class="delete">Delete</button>');
  }
}
