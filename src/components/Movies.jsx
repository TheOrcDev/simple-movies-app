import Movie from './Movie';
import '../styles/movies.scss';

const Movies = ({ movies, viewTrailer }) => {
    if (!movies || !movies.movies.results || movies.movies.results.length === 0) {
        return (
            <div data-testid="movies" className="movies-list">
                <p>No movies available</p>
            </div>
        );
    }

    return (
        <div data-testid="movies" className="movies-list">
            {movies.movies.results.map((movie) => (
                <Movie 
                    movie={movie} 
                    key={movie.id}
                    viewTrailer={viewTrailer}
                />
            ))}
        </div>
    );
};

export default Movies;
