import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ background: "linear-gradient(45deg,#6a11cb,#2575fc)" }}>
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography component={Link} to="/" variant="h6" sx={{ color: "white", textDecoration: "none", flexGrow: 1 }}>
          📚 Book Review
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button component={Link} to="/" color="inherit">Home</Button>
          <Button component={Link} to="/add" color="inherit">Add</Button>
          {!token ? (
            <>
              <Button component={Link} to="/login" color="inherit">Login</Button>
              <Button component={Link} to="/signup" color="inherit">Signup</Button>
            </>
          ) : (
            <Button onClick={handleLogout} color="inherit">Logout</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
