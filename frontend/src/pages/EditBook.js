import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";

export default function EditBook() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", author: "", genre: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setForm({ title: res.data.title, author: res.data.author, genre: res.data.genre });
      } catch {
        alert("Could not load book");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/books/${id}`, form);
      alert("Book updated");
      navigate(`/book/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating book");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
        <Typography variant="h5" gutterBottom>Edit Book</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Title" name="title" value={form.title} onChange={handleChange} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Author" name="author" value={form.author} onChange={handleChange} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Genre" name="genre" value={form.genre} onChange={handleChange} sx={{ mb: 2 }} required />
          <Button variant="contained" type="submit">Update Book</Button>
        </form>
      </Paper>
    </Container>
  );
}
