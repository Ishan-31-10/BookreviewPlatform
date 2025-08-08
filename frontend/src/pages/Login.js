import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Login successful");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, maxWidth: 480, mx: "auto" }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Password" name="password" type="password" value={form.password} onChange={handleChange} sx={{ mb: 2 }} required />
          <Button variant="contained" type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
        </form>
      </Paper>
    </Container>
  );
}
