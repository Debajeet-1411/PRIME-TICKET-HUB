import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroCarousel from '../components/HeroCarousel';
import MovieCard from '../components/MovieCard';
import MovieRow from '../components/MovieRow';
import Footer from '../components/Footer';
import moviesData from '../data/movies.json';
import { useTMDBMovies } from '../hooks/useTMDBMovies';

const Home = () => {
    const languages = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi'];

    // Fetch TMDB movies
    const { movies: tmdbMovies, loading, error, moviesByGenre } = useTMDBMovies(30);

    // Merge local and TMDB movies
    const allMovies = [...moviesData, ...tmdbMovies];

    // Get top genres from TMDB movies
    const topGenres = Object.keys(moviesByGenre).slice(0, 5);

    return (
        <div>
            <Navbar />
            <div className="container">
                <HeroCarousel movies={moviesData.slice(0, 5)} />

                {/* Recommended Movies */}
                <section style={{ margin: '3rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className="section-title" style={{ marginBottom: 0 }}>Recommended Movies</h2>
                        <Link to="/movies" style={{ color: '#ff6b6b', fontWeight: 600, textDecoration: 'none' }}>See All ›</Link>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#b0b0b0' }}>
                            <p>Loading recommended movies...</p>
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#ff6b6b' }}>
                            <p>Error loading movies: {error}</p>
                        </div>
                    ) : (
                        <>
                            <MovieRow movies={tmdbMovies.slice(0, 12)} id="recommended-row-1" />
                            <MovieRow movies={tmdbMovies.slice(12, 24)} id="recommended-row-2" />
                        </>
                    )}
                </section>

                {/* Genre Sections */}
                {!loading && topGenres.map(genre => {
                    const genreMovies = moviesByGenre[genre] || [];
                    if (genreMovies.length === 0) return null;

                    return (
                        <section key={genre} style={{ margin: '3rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 className="section-title" style={{ marginBottom: 0 }}>{genre} Movies</h2>
                                <Link to={`/movies?genre=${genre}`} style={{ color: '#ff6b6b', fontWeight: 600, textDecoration: 'none' }}>See All ›</Link>
                            </div>
                            <MovieRow movies={genreMovies.slice(0, 10)} id={`genre-${genre}`} />
                        </section>
                    );
                })}

                {/* Language Categories */}
                {languages.map(lang => {
                    const langMovies = moviesData.filter(m => m.language === lang);
                    if (langMovies.length === 0) return null;

                    return (
                        <section key={lang} style={{ margin: '3rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 className="section-title" style={{ marginBottom: 0 }}>{lang} Movies</h2>
                                <Link to={`/movies?lang=${lang}`} style={{ color: '#ff6b6b', fontWeight: 600, textDecoration: 'none' }}>See All ›</Link>
                            </div>
                            <MovieRow movies={langMovies} id={`lang-${lang}`} />
                        </section>
                    );
                })}
            </div>
            <Footer />
        </div>
    );
};

export default Home;
