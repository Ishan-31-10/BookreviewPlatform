import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    author: "",
    genre: "",
    minRating: "",
  });
  const limit = 6;

  const fetchBooks = () => {
    setLoading(true);

    axios
      .get(`${API_BASE_URL}/books`, {
        params: {
          page,
          limit,
          author: filters.author,
          genre: filters.genre,
          minRating: filters.minRating,
        },
      })
      .then((res) => {
        setBooks(res.data.books || []);
        setTotalPages(Math.ceil(res.data.totalCount / limit));
      })
      .catch((err) => {
        console.error(err);
        alert("Could not fetch books");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    if (filters.minRating && (filters.minRating < 1 || filters.minRating > 5)) {
      alert("Rating must be between 1 and 5");
      return;
    }
    setPage(1);
    fetchBooks();
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* Top Bar */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        gap={2}
      >
        <Typography variant="h4">Books</Typography>
        <Button
          component={Link}
          to="/add"
          variant="contained"
          color="primary"
          onClick={(e) => {
            if (!localStorage.getItem("token")) {
              e.preventDefault();
              alert("Please login first to add a book.");
            }
          }}
        >
          Add Book
        </Button>
      </Box>

      {/* Filters */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <TextField
          label="Author"
          name="author"
          value={filters.author}
          onChange={handleFilterChange}
          size="small"
        />
        <TextField
          label="Genre"
          name="genre"
          value={filters.genre}
          onChange={handleFilterChange}
          size="small"
        />
        <TextField
          label="Min Rating"
          name="minRating"
          select
          value={filters.minRating}
          onChange={handleFilterChange}
          size="small"
          sx={{ width: 150 }}
        >
          <MenuItem value="">Any</MenuItem>
          {[1, 2, 3, 4, 5].map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="outlined" onClick={applyFilters}>
          Apply Filters
        </Button>
      </Box>

      {/* Loader */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : books.length === 0 ? (
        <Typography>No books found. Add one!</Typography>
      ) : (
        <>
          {/* Books Grid */}
          <Grid container spacing={3}>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <Card
                  sx={{
                    transition: "0.25s",
                    "&:hover": { boxShadow: 6, transform: "translateY(-6px)" },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{book.title}</Typography>
                    <Typography color="text.secondary">
                      {book.author}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>Genre: {book.genre}</Typography>
                    <Typography sx={{ mt: 1 }}>
                      ⭐ {Number(book.avgRating || 0).toFixed(1)} (
                      {book.reviewsCount || 0})
                    </Typography>

                    <Box mt={2} display="flex" gap={1}>
                      <Button
                        component={Link}
                        to={`/book/${book._id}`}
                        variant="outlined"
                        size="small"
                      >
                        View
                      </Button>
                      {localStorage.getItem("token") && (
                        <Button
                          component={Link}
                          to={`/edit-book/${book._id}`}
                          variant="contained"
                          size="small"
                        >
                          Edit
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
}
