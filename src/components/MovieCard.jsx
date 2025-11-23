import React, { useState, useEffect } from 'react';
import { Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import authService from '../services/authService';

const MovieCard = ({ movie }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        setIsFavorite(userService.isFavorite(movie.id));

        // Listen for auth changes to update favorite status
        const handleAuthChange = () => {
            setIsFavorite(userService.isFavorite(movie.id));
        };
        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, [movie.id]);

    const toggleFavorite = (e) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();

        if (!authService.isLoggedIn()) {
            // Trigger login modal if not logged in (you might want to dispatch an event or use context here)
            alert('Please login to add favorites');
            return;
        }

        if (isFavorite) {
            userService.removeFromFavorites(movie.id);
            setIsFavorite(false);
        } else {
            userService.addToFavorites(movie);
            setIsFavorite(true);
        }

        // Dispatch event to update other components
        window.dispatchEvent(new Event('auth-change'));
    };

    return (
        <div className="movie-card-container" style={{ position: 'relative' }}>
            <Link to={`/movie/${movie.id}`} className="movie-card" style={{ display: 'block' }}>
                <div style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.3s ease',
                    aspectRatio: '2/3',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {!imageError && (
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: imageLoaded ? 1 : 0.7,
                                transition: 'opacity 0.3s ease'
                            }}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                        />
                    )}
                    {imageError && (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            textAlign: 'center',
                            padding: '1rem'
                        }}>
                            {movie.title}
                        </div>
                    )}
                    <div className="overlay" style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                        padding: '15px 8px 8px',
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                            <Star size={12} fill="#ff6b6b" color="#ff6b6b" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{movie.rating}</span>
                            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>• {movie.language}</span>
                        </div>
                    </div>
                </div>
                <h3 style={{ marginTop: '10px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-dark)', lineHeight: 1.3 }}>{movie.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: 1.2 }}>{movie.genre.join(', ')}</p>
            </Link>

            {/* Favorite Button */}
            <button
                onClick={toggleFavorite}
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2,
                    transition: 'all 0.2s ease'
                }}
            >
                <Heart
                    size={18}
                    color={isFavorite ? "#ff6b6b" : "white"}
                    fill={isFavorite ? "#ff6b6b" : "transparent"}
                />
            </button>
        </div>
    );
};

export default MovieCard;
