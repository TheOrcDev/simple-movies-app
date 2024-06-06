import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  createSearchParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

import "reactjs-popup/dist/index.css";
import { fetchMovies, resetMovies } from "./data/moviesSlice";
import {
  ENDPOINT_SEARCH,
  ENDPOINT_DISCOVER,
  ENDPOINT,
  API_KEY,
} from "./constants";
import {
  Header,
  Movies,
  Starred,
  WatchLater,
  YoutubePlayer,
} from "./components";
import "./app.scss";

const App = () => {
  const state = useSelector((state) => state);
  const { movies } = state;
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [videoKey, setVideoKey] = useState();
  const [isOpen, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const closeModal = () => setOpen(false);

  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  const getSearchResults = async (query) => {
    dispatch(resetMovies());
    if (query !== "") {
      await dispatch(
        fetchMovies({ apiUrl: `${ENDPOINT_SEARCH}&query=${query}`, page: 1 })
      );
      setSearchParams(createSearchParams({ search: query }));
    } else {
      await dispatch(fetchMovies({ apiUrl: ENDPOINT_DISCOVER, page: 1 }));
      setSearchParams({});
    }
    setCurrentPage(1);
  };

  const searchMovies = (query) => {
    navigate("/");
    getSearchResults(query);
  };

  const getMovies = () => {
    if (searchQuery) {
      dispatch(
        fetchMovies({
          apiUrl: `${ENDPOINT_SEARCH}&query=${searchQuery}`,
          page: currentPage,
        })
      );
    } else {
      dispatch(fetchMovies({ apiUrl: ENDPOINT_DISCOVER, page: currentPage }));
    }
  };

  const getMoreMovies = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const viewTrailer = (movie) => {
    getMovie(movie.id);
    if (!videoKey) setOpen(true);
    setOpen(true);
  };

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;

    setVideoKey(null);
    const videoData = await fetch(URL).then((response) => response.json());

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(
        (vid) => vid.type === "Trailer"
      );
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
    }
  };

  useEffect(() => {
    getMovies();
  }, [currentPage]);

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        getMoreMovies();
      }
    }, 300); // Adjust the debounce delay as needed

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <Header
        searchMovies={searchMovies}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />

      {isOpen && (
        <div className="modal">
          {videoKey ? (
            <div className="modal-content">
              <button className="close-modal-button" onClick={closeModal}>
                <i className="bi bi-x" />
              </button>

              <YoutubePlayer videoKey={videoKey} />
            </div>
          ) : (
            <h6>No trailer available. Try another movie</h6>
          )}
        </div>
      )}

      <div className="container">
        <Routes>
          <Route
            path="/"
            element={<Movies movies={movies} viewTrailer={viewTrailer} />}
          />
          <Route
            path="/starred"
            element={<Starred viewTrailer={viewTrailer} />}
          />
          <Route
            path="/watch-later"
            element={<WatchLater viewTrailer={viewTrailer} />}
          />
          <Route
            path="*"
            element={<h1 className="not-found">Page Not Found</h1>}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
