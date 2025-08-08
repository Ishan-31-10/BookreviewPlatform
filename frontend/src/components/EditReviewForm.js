import React, { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import api from "../api";

export default function EditReviewForm({ review, onSaved }) {
  const [reviewText, setReviewText] = useState(review.review_text || "");
  const [rating, setRating] = useState(review.rating || 5);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/reviews/${review._id}`, { review_text: reviewText, rating: Number(rating) });
      onSaved();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={1}>
      <TextField fullWidth value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
      <TextField fullWidth type="number" inputProps={{ min: 1, max: 5 }} value={rating} onChange={(e) => setRating(e.target.value)} />
      <Button variant="contained" size="small" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
    </Stack>
  );
}
