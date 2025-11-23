import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, Play, ArrowLeft, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import moviesData from '../data/movies.json';
import theatersByLocation from '../data/theaters-by-location.json';
import { fetchMovieById } from '../services/tmdbService';

const MovieDetails = () => {
    const { id } = useParams();
    const [heroImageError, setHeroImageError] = useState(false);
    const [allTMDBMovies, setAllTMDBMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchedMovie, setFetchedMovie] = useState(null);

    // Location selection states
    const [selectedState, setSelectedState] = useState(() => localStorage.getItem('userState') || '');
    const [selectedCity, setSelectedCity] = useState(() => localStorage.getItem('userCity') || '');
    const [availableStates, setAvailableStates] = useState([]);
    const [availableCities, setAvailableCities] = useState([]);
    const [filteredTheaters, setFilteredTheaters] = useState([]);

    // Get all TMDB movies from localStorage cache
    useEffect(() => {
        try {
            const cached = localStorage.getItem('tmdb_movies_cache');
            if (cached) {
                const { data } = JSON.parse(cached);
                setAllTMDBMovies(data || []);
            }
        } catch (error) {
            console.error('Error reading cache:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialize available states
    useEffect(() => {
        const states = Object.keys(theatersByLocation);
        setAvailableStates(states);

        // If no state saved or saved state invalid, default to first
        if (states.length > 0 && (!selectedState || !states.includes(selectedState))) {
            setSelectedState(states[0]);
        }
    }, []);

    // Update available cities when state changes
    useEffect(() => {
        if (selectedState && theatersByLocation[selectedState]) {
            const cities = Object.keys(theatersByLocation[selectedState]);
            setAvailableCities(cities);

            // Save state to local storage
            localStorage.setItem('userState', selectedState);

            // If no city saved or saved city invalid for this state, default to first
            if (cities.length > 0 && (!selectedCity || !cities.includes(selectedCity))) {
                setSelectedCity(cities[0]);
            }
        }
    }, [selectedState]);

    // Save city to local storage when it changes
    useEffect(() => {
        if (selectedCity) {
            localStorage.setItem('userCity', selectedCity);
        }
    }, [selectedCity]);

    // Update filtered theaters when city changes
    useEffect(() => {
        if (selectedState && selectedCity && theatersByLocation[selectedState]?.[selectedCity]) {
            setFilteredTheaters(theatersByLocation[selectedState][selectedCity]);
        } else {
            setFilteredTheaters([]);
        }
    }, [selectedState, selectedCity]);

    // Merge local and all cached TMDB movies
    const allMovies = [...moviesData, ...allTMDBMovies];

    // Find movie from combined list
    let movie = allMovies.find(m => m.id === parseInt(id));

    // If not found in local/cache, check fetchedMovie or fetch it
    if (!movie && fetchedMovie && fetchedMovie.id === parseInt(id)) {
        movie = fetchedMovie;
    }

    // Fetch from API if not found
    useEffect(() => {
        const fetchMovie = async () => {
            if (!movie && !loading) {
                const found = await fetchMovieById(id);
                if (found) {
                    setFetchedMovie(found);
                }
            }
        };
        fetchMovie();
    }, [id, movie, loading]);

    if (loading && !movie) {
        return (
            <div>
                <Navbar />
                <BackButton />
                <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#b0b0b0' }}>
                    <p>Loading movie details...</p>
                </div>
            </div>
        );
    }

    if (!movie && !fetchedMovie) {
        return (
            <div>
                <Navbar />
                <BackButton />
                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.2rem', color: '#ff6b6b' }}>Movie not found</p>
                    <Link to="/movies" style={{ color: '#2dc492', marginTop: '1rem', display: 'inline-block' }}>
                        ← Back to Movies
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <BackButton />

            {/* Movie Hero Section */}
            <div style={{
                position: 'relative',
                background: 'transparent',
                color: 'white',
                padding: '4rem 0',
                overflow: 'hidden'
            }}>
                {!heroImageError && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${movie.backgroundImage || movie.poster})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(4px) brightness(0.95)',
                        zIndex: 0
                    }} onError={() => setHeroImageError(true)}></div>
                )}

                <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '3rem' }}>
                    <div style={{ flexShrink: 0 }}>
                        {heroImageError ? (
                            <div style={{
                                width: '300px',
                                height: '450px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 600,
                                textAlign: 'center',
                                padding: '1rem',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                            }}>
                                {movie.title}
                            </div>
                        ) : (
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                style={{
                                    width: '300px',
                                    borderRadius: '12px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                                }}
                                onError={() => setHeroImageError(true)}
                            />
                        )}
                    </div>

                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>{movie.title}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Star fill="#ff6b6b" color="#ff6b6b" />
                                <span style={{ fontWeight: 700 }}>{movie.rating}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={20} />
                                <span>{movie.duration}</span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '4px' }}>
                                {movie.language}
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '4px' }}>
                                {movie.genre.join(', ')}
                            </div>
                        </div>

                        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem', opacity: 0.9, maxWidth: '800px' }}>
                            {movie.description}
                        </p>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Cast</h3>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                {movie.cast.map((actor, idx) => (
                                    <div key={idx} style={{ textAlign: 'center' }}>
                                        <img
                                            src={actor.image}
                                            alt={actor.name}
                                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem' }}
                                        />
                                        <p style={{ fontSize: '0.9rem' }}>{actor.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                const trailerSection = document.getElementById('trailer');
                                if (trailerSection) {
                                    trailerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}
                            className="btn-outline"
                            style={{ color: 'white', borderColor: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Play size={20} /> Watch Trailer
                        </button>
                    </div>
                </div>
            </div>

            {/* Booking Section */}
            <div className="container" style={{ padding: '3rem 0' }}>
                <h2 className="section-title" style={{ color: 'white' }}>Select Your Location</h2>

                {/* Location Selectors */}
                <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                    flexWrap: 'wrap'
                }}>
                    {/* State Selector */}
                    <div style={{ flex: '1', minWidth: '250px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#b0b0b0',
                            fontSize: '0.9rem',
                            fontWeight: 500
                        }}>
                            <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Select State
                        </label>
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #3a3a3a',
                                background: '#2a2a2a',
                                color: 'white',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                outline: 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {availableStates.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    {/* City Selector */}
                    <div style={{ flex: '1', minWidth: '250px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#b0b0b0',
                            fontSize: '0.9rem',
                            fontWeight: 500
                        }}>
                            <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Select City
                        </label>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            disabled={!selectedState}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #3a3a3a',
                                background: '#2a2a2a',
                                color: 'white',
                                fontSize: '1rem',
                                cursor: selectedState ? 'pointer' : 'not-allowed',
                                outline: 'none',
                                opacity: selectedState ? 1 : 0.5,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {availableCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Theaters List */}
                <h2 className="section-title" style={{ marginTop: '2rem', color: 'white' }}>
                    Available Theaters in {selectedCity}, {selectedState}
                </h2>

                {filteredTheaters.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {filteredTheaters.map(theater => (
                            <div key={theater.id} style={{
                                background: '#2a2a2a',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                border: '1px solid #3a3a3a'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white' }}>{theater.name}</h3>
                                        <p style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>{theater.location}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: '#2dc492', fontSize: '0.9rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2dc492' }}></div>
                                            M-Ticket
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff9f43' }}></div>
                                            F&B
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {theater.showtimes.map((time, idx) => (
                                        <Link
                                            key={idx}
                                            to={`/book/${movie.id}/${theater.id}/${encodeURIComponent(time)}`}
                                            style={{
                                                padding: '10px 24px',
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                color: '#2dc492',
                                                fontWeight: 600,
                                                fontSize: '0.9rem',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseOver={(e) => { e.target.style.background = '#2dc492'; e.target.style.color = 'white'; }}
                                            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#2dc492'; }}
                                        >
                                            {time}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: '#b0b0b0',
                        background: '#2a2a2a',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #3a3a3a'
                    }}>
                        <MapPin size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p style={{ fontSize: '1.1rem' }}>No theaters available in this location</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Please select a different city or state</p>
                    </div>
                )}
            </div>

            {/* Trailer Section */}
            <div id="trailer" className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
                <h2 className="section-title">Official Trailer</h2>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                    <iframe
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        src={movie.trailer}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
