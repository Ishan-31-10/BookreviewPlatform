const express = require('express');
const Review = require('../models/Review');
const Book = require('../models/Book');
const auth = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/:bookId', auth, async (req, res) => {
  try {
    const { review_text, rating } = req.body;
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const review = new Review({
      review_text,
      rating,
      reviewer: req.user._id,
      book: req.params.bookId
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:bookId', async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate('reviewer', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const { review_text, rating } = req.body;
    if (review_text !== undefined) review.review_text = review_text;
    if (rating !== undefined) review.rating = rating;

    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const book = await Book.findById(review.book);

    const isReviewer = review.reviewer.toString() === req.user._id.toString();
    const isBookOwner = book && book.createdBy && book.createdBy.toString() === req.user._id.toString();

    if (!isReviewer && !isBookOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
