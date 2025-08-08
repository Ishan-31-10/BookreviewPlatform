import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function AddBook() {
  const [form, setForm] = useState({ title: "", author: "", genre: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { alert("Please login first to add a book"); navigate("/login"); return; }

    try {
      setLoading(true);
      const res = await api.post("/books", form);
      alert("Book added");
      navigate(`/book/${res.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Error adding book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, maxWidth: 700, mx: "auto" }} elevation={3}>
        <Typography variant="h5" gutterBottom>Add Book</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Title" name="title" value={form.title} onChange={handleChange} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Author" name="author" value={form.author} onChange={handleChange} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Genre" name="genre" value={form.genre} onChange={handleChange} sx={{ mb: 2 }} required />
          <Button variant="contained" type="submit" disabled={loading}>{loading ? "Adding..." : "Add Book"}</Button>
        </form>
      </Paper>
    </Container>
  );
}
