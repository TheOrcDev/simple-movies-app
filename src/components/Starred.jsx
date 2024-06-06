import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import starredSlice from '../data/starredSlice'
import Movie from './Movie'
import '../styles/starred.scss'

const Starred = ({viewTrailer}) => {

    const state = useSelector((state) => state)
    const { starred } = state
    const { clearAllStarred } = starredSlice.actions
    const dispatch = useDispatch()

  return (
    <div className="starred" data-testid="starred">
      {starred.starredMovies.length > 0 && (
        <div data-testid="starred-movies" className="starred-movies">
          <h6 className="header">Starred movies</h6>
          <div className="row">
            {starred.starredMovies.map((movie) => (
              <Movie 
                movie={movie} 
                key={movie.id}
                viewTrailer={viewTrailer}
              />
            ))}
          </div>

          <div className="text-center">
            <button className="btn btn-primary" onClick={() => dispatch(clearAllStarred())}>Remove all starred</button>
          </div>
        </div>
      )}

      {starred.starredMovies.length === 0 && (
        <div className="text-center empty-cart">
          <i className="bi bi-star" />
          <p>There are no starred movies.</p>
          <p>Go to <Link to='/'>Home</Link></p>
        </div>
      )}
    </div>
  )
}

export default Starred
