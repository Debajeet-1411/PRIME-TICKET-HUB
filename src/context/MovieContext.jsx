// Movie Context - Share TMDB movies across the app
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAndConvertMovies } from '../services/tmdbService';
import { getCachedMovies } from '../services/tmdbService';

const MovieContext = createContext();

export function MovieProvider({ children }) {
    const [tmdbMovies, setTmdbMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadMovies() {
            try {
                setLoading(true);

                // Try to get from cache first
                const cached = getCachedMovies();
                if (cached && cached.length > 0) {
                    setTmdbMovies(cached);
                    setLoading(false);
                    return;
                }

                // Otherwise fetch from API
                const movies = await fetchAndConvertMovies(30, 100);
                setTmdbMovies(movies);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        loadMovies();
    }, []);

    // Function to add more movies (called from infinite scroll)
    const addMovies = (newMovies) => {
        setTmdbMovies(prev => [...prev, ...newMovies]);
    };

    return (
        <MovieContext.Provider value={{ tmdbMovies, loading, error, addMovies }}>
            {children}
        </MovieContext.Provider>
    );
}

export function useMovieContext() {
    const context = useContext(MovieContext);
    if (!context) {
        throw new Error('useMovieContext must be used within MovieProvider');
    }
    return context;
}
