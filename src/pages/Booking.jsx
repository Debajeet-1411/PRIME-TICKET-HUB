import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import AuthModal from '../components/AuthModal';
import authService from '../services/authService';
import moviesData from '../data/movies.json';
import theatersByLocation from '../data/theaters-by-location.json';
import { fetchMovieById } from '../services/tmdbService';

const Booking = () => {
    const { movieId, theaterId, showtime } = useParams();
    const navigate = useNavigate();
    const [allTMDBMovies, setAllTMDBMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [fetchedMovie, setFetchedMovie] = useState(null);

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

    // Merge local and all cached TMDB movies
    const allMovies = [...moviesData, ...allTMDBMovies];

    // Find movie from combined list
    let movie = allMovies.find(m => m.id === parseInt(movieId));

    // If not found, check fetchedMovie
    if (!movie && fetchedMovie && fetchedMovie.id === parseInt(movieId)) {
        movie = fetchedMovie;
    }

    // Fetch from API if not found
    useEffect(() => {
        const fetchMovie = async () => {
            if (!movie && !loading) {
                const found = await fetchMovieById(movieId);
                if (found) {
                    setFetchedMovie(found);
                }
            }
        };
        fetchMovie();
    }, [movieId, movie, loading]);

    // Find theater from nested location data
    let theater = null;
    const targetTheaterId = parseInt(theaterId);

    // Iterate through states and cities to find the theater
    Object.values(theatersByLocation).forEach(cities => {
        Object.values(cities).forEach(theaterList => {
            const found = theaterList.find(t => t.id === targetTheaterId);
            if (found) theater = found;
        });
    });

    // Fallback if theater not found (to prevent blocking)
    if (!theater) {
        theater = {
            id: targetTheaterId,
            name: "Selected Theater",
            location: "Unknown Location",
            showtimes: [decodeURIComponent(showtime)]
        };
    }

    // Wait for movie fetch if it's loading
    if (!movie && !fetchedMovie && loading) {
        return (
            <div>
                <Navbar />
                <BackButton />
                <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#b0b0b0' }}>
                    <p>Loading booking details...</p>
                </div>
            </div>
        );
    }

    // If movie still not found after trying to fetch, use fallback
    if (!movie && !fetchedMovie && !loading) {
        movie = {
            id: parseInt(movieId),
            title: "Unknown Movie",
            poster: "https://placehold.co/300x450?text=Movie+Not+Found",
            backgroundImage: "https://placehold.co/1920x1080?text=Movie+Not+Found",
            rating: "N/A",
            duration: "N/A",
            language: "N/A",
            genre: ["N/A"],
            price: 250
        };
    } else if (!movie && fetchedMovie) {
        movie = fetchedMovie;
    }

    const rows = 10;
    const cols = 12;
    const price = movie.price || 250;

    const bookedSeats = ['A5', 'A6', 'C4', 'C5', 'F8', 'F9'];

    const [selectedSeats, setSelectedSeats] = useState([]);

    const handleSeatClick = (seatId) => {
        if (bookedSeats.includes(seatId)) return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleProceed = () => {
        if (selectedSeats.length === 0) return;

        // Check if user is logged in
        if (!authService.isLoggedIn()) {
            // Show login modal instead of redirecting
            setIsAuthModalOpen(true);
            return;
        }

        navigate('/payment', {
            state: {
                movie,
                theater,
                showtime,
                selectedSeats,
                totalAmount: selectedSeats.length * price
            }
        });
    };

    const handleAuthSuccess = () => {
        // After successful login, proceed to payment
        setIsAuthModalOpen(false);
        navigate('/payment', {
            state: {
                movie,
                theater,
                showtime,
                selectedSeats,
                totalAmount: selectedSeats.length * price
            }
        });
    };

    return (
        <div>
            <Navbar />
            <BackButton />
            <div className="container" style={{ padding: '2rem 0', display: 'flex', gap: '2rem', minHeight: '80vh' }}>
                <div style={{ flex: 2 }}>
                    <h2 className="section-title">{movie.title}</h2>
                    <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                        {theater.name} | {decodeURIComponent(showtime)}
                    </p>

                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-sm)',
                        marginBottom: '2rem',
                        overflowX: 'auto'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', minWidth: '600px' }}>
                            {Array.from({ length: rows }).map((_, rowIdx) => {
                                const rowLabel = String.fromCharCode(65 + rowIdx);
                                return (
                                    <div key={rowLabel} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span style={{ width: '20px', color: 'var(--text-light)' }}>{rowLabel}</span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {Array.from({ length: cols }).map((_, colIdx) => {
                                                const seatId = `${rowLabel}${colIdx + 1}`;
                                                const isBooked = bookedSeats.includes(seatId);
                                                const isSelected = selectedSeats.includes(seatId);

                                                return (
                                                    <button
                                                        key={seatId}
                                                        onClick={() => handleSeatClick(seatId)}
                                                        disabled={isBooked}
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '8px',
                                                            border: isSelected ? 'none' : '1px solid #ddd',
                                                            background: isBooked ? '#eee' : isSelected ? 'var(--primary-gradient)' : 'white',
                                                            color: isSelected ? 'white' : isBooked ? '#aaa' : '#333',
                                                            fontSize: '0.8rem',
                                                            cursor: isBooked ? 'not-allowed' : 'pointer',
                                                            transition: 'transform 0.1s'
                                                        }}
                                                        onMouseEnter={(e) => !isBooked && (e.target.style.transform = 'scale(1.1)')}
                                                        onMouseLeave={(e) => !isBooked && (e.target.style.transform = 'scale(1)')}
                                                    >
                                                        {colIdx + 1}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                            <div style={{
                                height: '8px',
                                background: '#ddd',
                                borderRadius: '4px',
                                width: '80%',
                                margin: '0 auto 1rem',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                            }}></div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>All eyes this way please!</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '20px', height: '20px', border: '1px solid #ddd', borderRadius: '4px' }}></div>
                            <span>Available</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '20px', height: '20px', background: '#eee', borderRadius: '4px' }}></div>
                            <span>Booked</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '20px', height: '20px', background: 'linear-gradient(135deg, #ff9a9e, #fecfef)', borderRadius: '4px' }}></div>
                            <span>Selected</span>
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-md)',
                        position: 'sticky',
                        top: '100px'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Booking Summary</h3>

                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-light)' }}>Movie</span>
                            <span style={{ fontWeight: 600 }}>{movie.title}</span>
                        </div>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-light)' }}>Theater</span>
                            <span style={{ fontWeight: 600, textAlign: 'right' }}>{theater.name}</span>
                        </div>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-light)' }}>Tickets</span>
                            <span style={{ fontWeight: 600 }}>{selectedSeats.length}</span>
                        </div>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-light)' }}>Seats</span>
                            <span style={{ fontWeight: 600 }}>{selectedSeats.join(', ')}</span>
                        </div>

                        <div style={{ borderTop: '1px solid #eee', margin: '1.5rem 0' }}></div>

                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
                            <span>Total Amount</span>
                            <span>Rs. {selectedSeats.length * price}</span>
                        </div>

                        <button
                            onClick={handleProceed}
                            disabled={selectedSeats.length === 0}
                            className="btn-primary"
                            style={{ width: '100%', opacity: selectedSeats.length === 0 ? 0.5 : 1, cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer' }}
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={handleAuthSuccess}
            />
        </div>
    );
};

export default Booking;
