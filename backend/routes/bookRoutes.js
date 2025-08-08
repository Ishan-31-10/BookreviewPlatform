const express = require("express");
const Book = require("../models/Book");
const Review = require("../models/Review");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const { author, genre, minRating } = req.query;

    let query = {};
    if (author) query.author = { $regex: author, $options: "i" };
    if (genre) query.genre = { $regex: genre, $options: "i" };

    const totalCount = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const reviews = await Review.find({ book: book._id }).select("rating");
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0;
        return {
          ...book,
          avgRating,
          reviewsCount: reviews.length,
        };
      })
    );

    const filteredBooks = minRating
      ? booksWithRatings.filter((b) => b.avgRating >= Number(minRating))
      : booksWithRatings;

    res.json({ books: filteredBooks, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    if (!title || !author || !genre) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newBook = new Book({ title, author, genre, createdBy: req.user._id });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!book) return res.status(404).json({ message: "Book not found" });

    const reviews = await Review.find({ book: book._id }).populate(
      "reviewer",
      "name"
    );
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
        : 0;

    res.json({
      ...book.toObject(),
      reviews,
      avgRating,
      reviewsCount: reviews.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this book" });
    }

    const { title, author, genre } = req.body;
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (genre !== undefined) book.genre = genre;

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this book" });
    }

    await Review.deleteMany({ book: book._id });
    await book.deleteOne();

    res.json({ message: "Book and its reviews deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
