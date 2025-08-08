import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, CardContent, Typography, Button, TextField, Grid, Box } from "@mui/material";
import api from "../api";
import Loader from "../components/Loader";
import EditReviewForm from "../components/EditReviewForm";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [loadingBook, setLoadingBook] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const fetchBook = async () => {
    setLoadingBook(true);
    try {
      const res = await api.get(`/books/${id}`);
      setBook(res.data);
    } catch {
      alert("Could not load book");
    } finally {
      setLoadingBook(false);
    }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data || []);
    } catch {
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => { fetchBook(); fetchReviews(); }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { alert("Please login first"); navigate("/login"); return; }
    try {
      await api.post(`/reviews/${id}`, { review_text: reviewText, rating: Number(rating) });
      setReviewText(""); setRating(5);
      fetchReviews(); fetchBook();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!localStorage.getItem("token")) { alert("Please login first"); navigate("/login"); return; }
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      fetchReviews(); fetchBook();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting review");
    }
  };

  if (loadingBook) return <Loader fullScreen />;

  return (
    <Container sx={{ mt: 4 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4">{book.title}</Typography>
          <Typography color="text.secondary">{book.author}</Typography>
          <Typography sx={{ mt: 1 }}>Genre: {book.genre}</Typography>
          <Typography sx={{ mt: 1 }}>⭐ {Number(book.avgRating || 0).toFixed(1)} ({book.reviewsCount || 0})</Typography>
          <Box mt={2}>
            {localStorage.getItem("token") && <Button variant="outlined" onClick={() => navigate(`/edit-book/${book._id}`)}>Edit Book</Button>}
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>Reviews</Typography>

      {loadingReviews ? <Loader /> : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {reviews.length === 0 && <Typography>No reviews yet — be the first!</Typography>}
          {reviews.map(r => (
            <Grid item xs={12} key={r._id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">{r.reviewer?.name || "Anonymous"}</Typography>
                  <Typography variant="body2">{r.review_text}</Typography>
                  <Typography variant="caption">Rating: {r.rating} • {new Date(r.createdAt).toLocaleString()}</Typography>

                  <Box mt={1} display="flex" gap={1}>
                    {editingReviewId === r._id ? (
                      <EditReviewForm review={r} onSaved={() => { setEditingReviewId(null); fetchReviews(); fetchBook(); }} />
                    ) : (
                      <>
                        <Button size="small" onClick={() => setEditingReviewId(r._id)}>Edit</Button>
                        <Button color="error" size="small" onClick={() => handleDeleteReview(r._id)}>Delete</Button>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Typography variant="h6">Add a review</Typography>
      <Box component="form" onSubmit={handleAddReview} sx={{ mt: 1 }}>
        <TextField fullWidth label="Review text" value={reviewText} onChange={(e) => setReviewText(e.target.value)} sx={{ mb: 2 }} required />
        <TextField fullWidth label="Rating (1-5)" type="number" inputProps={{ min: 1, max: 5 }} value={rating} onChange={(e) => setRating(e.target.value)} sx={{ mb: 2 }} required />
        <Button variant="contained" type="submit">Submit Review</Button>
      </Box>
    </Container>
  );
}
