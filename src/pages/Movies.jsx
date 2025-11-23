import React, { useState, useMemo, useCallback } from 'react';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import MovieCard from '../components/MovieCard';
import moviesData from '../data/movies.json';
import { useTMDBMovies } from '../hooks/useTMDBMovies';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { fetchMoreMovies } from '../services/tmdbService';
import { Search, Filter } from 'lucide-react';

const Movies = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('All');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [additionalMovies, setAdditionalMovies] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    // Fetch initial TMDB movies
    const { movies: tmdbMovies, loading } = useTMDBMovies(30);

    // Merge all movies: local + initial TMDB + additional from infinite scroll
    const allMovies = useMemo(() =>
        [...moviesData, ...tmdbMovies, ...additionalMovies],
        [tmdbMovies, additionalMovies]
    );

    const languages = ['All', ...new Set(allMovies.map(m => m.language))];
    const genres = ['All', ...new Set(allMovies.flatMap(m => m.genre))];

    const filteredMovies = useMemo(() => {
        return allMovies.filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLanguage = selectedLanguage === 'All' || movie.language === selectedLanguage;
            const matchesGenre = selectedGenre === 'All' || movie.genre.includes(selectedGenre);
            return matchesSearch && matchesLanguage && matchesGenre;
        });
    }, [allMovies, searchQuery, selectedLanguage, selectedGenre]);

    // Load more movies on scroll
    const loadMoreMovies = useCallback(async () => {
        if (!hasMore || loading) return;

        try {
            const currentTMDBCount = tmdbMovies.length + additionalMovies.length;
            const newMovies = await fetchMoreMovies(currentTMDBCount, 20);

            if (newMovies.length === 0) {
                setHasMore(false);
            } else {
                setAdditionalMovies(prev => [...prev, ...newMovies]);
            }
        } catch (error) {
            console.error('Error loading more movies:', error);
        }
    }, [tmdbMovies.length, additionalMovies.length, hasMore, loading]);

    // Infinite scroll hook
    const { isFetching, sentinelRef } = useInfiniteScroll(loadMoreMovies, hasMore);

    return (
        <div>
            <Navbar />
            <BackButton />
            <div className="container" style={{ padding: '3rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 className="section-title" style={{ marginBottom: 0 }}>All Movies</h2>
                        <p style={{ color: '#b0b0b0', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            {loading ? 'Loading...' : `${allMovies.length} movies available`}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {/* Search */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <Search size={18} color="var(--text-light)" />
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    marginLeft: '0.5rem',
                                    outline: 'none',
                                    color: 'var(--text-dark)',
                                    width: '200px'
                                }}
                            />
                        </div>

                        {/* Filters */}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Filter size={18} color="var(--text-light)" />
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: '1px solid #ddd',
                                    outline: 'none',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                            </select>

                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: '1px solid #ddd',
                                    outline: 'none',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                {genres.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: '#b0b0b0' }}>
                        <p style={{ fontSize: '1.2rem' }}>Loading movies...</p>
                    </div>
                ) : filteredMovies.length > 0 ? (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.5rem' }}>
                            {filteredMovies.map(movie => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>

                        {/* Infinite scroll sentinel */}
                        <div ref={sentinelRef} style={{ padding: '2rem 0', textAlign: 'center' }}>
                            {isFetching && hasMore && (
                                <div style={{ color: '#b0b0b0' }}>
                                    <p>Loading more movies...</p>
                                </div>
                            )}
                            {!hasMore && allMovies.length > 56 && (
                                <p style={{ color: '#b0b0b0' }}>No more movies to load</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-light)' }}>
                        <p style={{ fontSize: '1.2rem' }}>No movies found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedLanguage('All'); setSelectedGenre('All'); }}
                            style={{ marginTop: '1rem', color: '#ff6b6b', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Movies;
