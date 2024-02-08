const Book = require('../models/book');
const { bookValidation } = require('../validators/bookValidation');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (book == null) {
      return res.status(404).json({ message: 'Cannot find book' });
    }
    res.json(book);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (book == null) {
      return res.status(404).json({ message: 'Cannot find book' });
    }
    await Book.deleteOne({ _id: req.params.bookId });
    res.json({ message: 'Deleted book' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    // Validate request body
    const { error } = bookValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Update book fields based on request body
    const updatedBook = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true });

    // Check if book was found
    if (!updatedBook) {
      return res.status(404).json({ message: 'Cannot find book' });
    }

    res.json(updatedBook);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    // Validate request body
    const { error } = bookValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Create a new book object based on request body
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      price: req.body.price
      // Add more fields as needed
    });

    // Save the new book to the database
    const savedBook = await newBook.save();

    // Respond with the saved book object and 201 status
    res.status(201).json(savedBook);
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
};
