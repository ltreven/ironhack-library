const express = require('express');
const router  = express.Router();

const Book = require('../models/book.js'); 
const Author = require('../models/author.js'); 

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/books/add', (req, res, next) => {
  // leer todos los autores y enviar a la página
  Author.find().then(authors => res.render("book-add", {authors}))
});

router.post('/books/add', (req, res, next) => {
  const { title, author, description, rating } = req.body;
  const newBook = new Book({ title, author, description, rating})
  newBook.save()
  .then((book) => {
    res.redirect('/books');
  })
  .catch((error) => {
    console.log(error);
  })
});

router.get('/books/edit', (req, res, next) => {
  // leer todos los autores y enviar a la página

  const p1 = Author.find() //.then(authors => res.render("book-add", {authors}))
  const p2 = Book.findOne({_id: req.query.book_id})
  Promise.all([p1,p2])
  .then(data => {
    const authorsData = data[0].map(elem => {
      const newelem = {
        _id: elem._id, 
        name: elem.name + " " + elem.lastName, 
        selectme: elem._id.toString() === data[1].author[0]._id.toString()
      }
      return newelem
    })
    console.log(authorsData)
    res.render("book-edit", {book: data[1], authors: authorsData});
  })
  .catch(error => {
    console.log(error);
  })
});

router.post('/books/edit', (req, res, next) => {
  const { title, author, description, rating } = req.body;
  Book.update({_id: req.query.book_id}, { $set: {title, author, description, rating }})
  .then((book) => {
    res.redirect('/books');
  })
  .catch((error) => {
    console.log(error);
  })
});

router.get('/books', (req, res, next) => {
  Book.find()
    .then(allTheBooksFromDB => {
      // console.log('Retrieved books from DB:', allTheBooksFromDB);
      res.render('books', { books: allTheBooksFromDB });
    })
    .catch(error => {
      console.log('Error while getting the books from the DB: ', error);
    })
});

router.get('/books/:bookId', (req, res, next) => {
  Book.findById(req.params.bookId)
    .populate('author')
    .then(book => {
      console.log(book)
      res.render('book-details', { book });
    })
    .catch(error => {
      console.log('Error while retrieving book details: ', error);
    })
});

router.get('/books/delete/:bookId', (req, res, next) => {
  Book.findByIdAndRemove(req.params.bookId)
  .then((book) => {
    res.redirect('/books');
  })
  .catch((error) => {
    console.log(error);
  })
});

router.get('/authors/add', (req, res, next) => {
  res.render('author-add');
});

router.post('/authors/add', (req, res, next) => {
  const { name, lastName, nationality, birthday, pictureUrl } = req.body;
  const newAuthor = new Author({ name, lastName, nationality, birthday, pictureUrl });
  newAuthor
    .save()
    .then(book => {
      res.redirect('/books');
    })
    .catch(error => {
      console.log(error);
    });
});


module.exports = router;
