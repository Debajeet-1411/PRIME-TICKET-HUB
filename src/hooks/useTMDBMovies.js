import { useState, useEffect } from 'react';
import { fetchAndConvertMovies, groupMoviesByGenre } from '../services/tmdbService';

/**
 * Custom hook to fetch and manage TMDB movies
 */
export function useTMDBMovies(count = 30) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [moviesByGenre, setMoviesByGenre] = useState({});

    useEffect(() => {
        let isMounted = true;

        async function loadMovies() {
            try {
                setLoading(true);
                setError(null);

                // Fetch movies from TMDB
                const tmdbMovies = await fetchAndConvertMovies(count, 100);

                if (isMounted) {
                    setMovies(tmdbMovies);

                    // Group by genre
                    const grouped = groupMoviesByGenre(tmdbMovies);
                    setMoviesByGenre(grouped);

                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        }

        loadMovies();

        return () => {
            isMounted = false;
        };
    }, [count]);

    return { movies, loading, error, moviesByGenre };
}
