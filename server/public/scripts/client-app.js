$(document).ready(function () {
    getBooks();

    // add a book
    $('#book-submit').on('click', postBook);
    // delete a book
    $("#book-list").on('click', '.delete', deleteBook);
    // update a book
    $("#book-list").on('click', '.update', updateBook);
    // filter books by genre
    $('#genreButton').on('click', getGenre);
});
/**
 * Retrieve books from server and append to DOM
 */
function getBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
    success: function(data) {
      appendSelect(data.genres);
      appendBooks(data.books);
    },
    error: function() {
      console.log('Database error');
    }

  })
}
/**
 * Retrieve books of a specific genre from server and append to DOM
 */
function getGenre() {
  var genre = $('#selectGenre').val();

  if(genre) {
    $.ajax({
      type: 'GET',
      url: '/books/' + genre,
      success: function (books) {
        appendBooks(books);
      },
      error: function (result) {
        console.log('could not get books by genre');
      }
    });
  }
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
  var id = $(this).closest('.book').data('id');
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
  var id = $(this).closest('.book').data('id');
  console.log(id);

  // make book object
  var book = {};
  var fields = $(this).closest('.book').find('input').serializeArray();
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

// return an input jQuery object
function createInput(type, name, value, classes, cols) {
  var $col = $('<div><div class="form-group"><label></label><input></input></div></div>');
  $col.addClass(cols)
  var $input = $col.find('input');
  var $label = $col.find('label');
  $input
    .attr('type', type)
    .attr('name', name)
    .val(value)
    .addClass(classes);
  $label
    .attr('for', name)
    .text(name.charAt(0).toUpperCase() + name.slice(1));
  return $col;
}

function appendSelect(genres) {
  var capitalizedGenre;
  var $select = $('<select name="genre" id="selectGenre" class="form-control"></select>');
  $('#genreDiv').empty();
  $('#genreDiv').append($select);
  $select.append('<option value="" selected>Select Genre</option>');
  genres.forEach(function (current) {
    capitalizedGenre = current.genre.charAt(0).toUpperCase() + current.genre.slice(1);
    $select.append('<option value="' + current.genre +'">' + capitalizedGenre +'</option>');
  });
}

function appendBooks(books) {
  $("#book-list").empty();

  for (var i = 0; i < books.length; i++) {
    $("#book-list").append('<div class="book"></div>');
    $el = $('#book-list').children().last();
    var book = books[i];
    $el.data('id', book.id);
    $el.addClass('bg-info');

    var convertedDate = book.published.substr(0, 10);
    var inputClasses = 'form-control';
    // $el.append('<input type="text" name="title" value="' + book.title + '" />');
    var $row1 = $('<div class="row"></div>');
    $el.append($row1);
    $row1.append(createInput('text', 'title', book.title, inputClasses, 'col-md-6'));
    $row1.append(createInput('text', 'author', book.author, inputClasses, 'col-md-5'));
    $row1.append('<div class="form-group buttons col-md-1"><div class="btn-group btn-group-xs"><button class="update btn btn-warning"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button><button class="delete btn btn-danger"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button></div></div>');

    var $row2 = $('<div class="row"></div>');
    $el.append($row2);
    $row2.append(createInput('text', 'genre', book.genre, inputClasses, 'col-md-3'));

    // var newDate = $('<input type="date" name="published" />');
    // newDate.val(convertedDate)
    $row2.append(createInput('date', 'published', convertedDate, inputClasses, 'col-md-3'));

    $row2.append(createInput('text', 'edition', book.edition, inputClasses, 'col-md-1'));
    $row2.append(createInput('text', 'publisher', book.publisher, inputClasses, 'col-md-5'));
    // $el.append('<input type="text" name="author" value="' + book.author + '" />');
    // $el.append('<input type="text" name="genre" value="' + book.genre + '" />');
    // $el.append('<input type="number" name="edition" value="' + book.edition + '" />');
    // $el.append('<input type="text" name="publisher" value="' + book.publisher + '" />');


  }
}
