import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import BookList from "./pages/BookList";
import AddBook from "./pages/AddBook";
import BookDetail from "./pages/BookDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EditBook from "./pages/EditBook";

function App() {
  const isAuth = !!localStorage.getItem("token");
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/add" element={isAuth ? <AddBook /> : <Navigate to="/login" />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/edit-book/:id" element={isAuth ? <EditBook /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
