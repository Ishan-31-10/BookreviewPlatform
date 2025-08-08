const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review_text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
