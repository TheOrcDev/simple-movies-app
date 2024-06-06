import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchMovies = createAsyncThunk(
  "fetch-movies",
  async ({ apiUrl, page }) => {
    const response = await fetch(`${apiUrl}&page=${page}`);
    const data = await response.json();
    if (!data.results) {
      throw new Error("Invalid API response");
    }
    return { movies: data, page };
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    page: 1,
    fetchStatus: "",
  },
  reducers: {
    resetMovies(state) {
      state.movies = [];
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.fetchStatus = "success";
        if (action.payload.page === 1) {
          state.movies = action.payload.movies;
        } else {
          state.movies.results = [
            ...state.movies.results,
            ...action.payload.movies.results,
          ];
        }
      })
      .addCase(fetchMovies.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.fetchStatus = "error";
      });
  },
});

export const { resetMovies } = moviesSlice.actions;
export default moviesSlice;
