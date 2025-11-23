import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';

const HeroCarousel = ({ movies }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [videoDuration, setVideoDuration] = useState(null);
    const iframeRef = useRef(null);

    const currentMovie = movies[currentIndex];

    // Get video ID from YouTube URL
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        const match = url.match(/embed\/([^?]+)/);
        return match ? match[1] : null;
    };

    // Fetch video duration from YouTube API (using a workaround)
    useEffect(() => {
        const videoId = getYouTubeVideoId(currentMovie?.trailer);
        if (videoId) {
            // Default to 3 minutes if we can't get duration
            // In production, you'd use YouTube Data API to get actual duration
            setVideoDuration(180000); // 3 minutes in milliseconds
        }
    }, [currentMovie]);

    // Auto-advance after video duration
    useEffect(() => {
        if (!videoDuration) return;

        const timer = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % movies.length);
        }, videoDuration);

        return () => clearTimeout(timer);
    }, [currentIndex, videoDuration, movies.length]);

    // Reset states when movie changes
    useEffect(() => {
        setImageError(false);
        setImageLoaded(false);
    }, [currentIndex]);

    // Navigation functions
    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    if (!currentMovie) return null;

    const videoId = getYouTubeVideoId(currentMovie.trailer);

    return (
        <div className="hero-carousel" style={{
            position: 'relative',
            height: '500px',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
            margin: '20px 0',
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            background: '#000'
        }}>
            {/* YouTube Trailer Background with Preload */}
            {videoId && (
                <>
                    {/* Current Video */}
                    <iframe
                        ref={iframeRef}
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&start=${currentMovie.id === 1 ? 5 : 0}`}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '300%',
                            height: '300%',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none',
                            border: 'none',
                            zIndex: 0
                        }}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title="Background Trailer"
                    />

                    {/* Preload next video */}
                    {movies[(currentIndex + 1) % movies.length]?.trailer && (
                        <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(movies[(currentIndex + 1) % movies.length].trailer)}?mute=1&controls=0&showinfo=0&rel=0&modestbranding=1`}
                            style={{ display: 'none' }}
                            title="Preload Next"
                        />
                    )}
                </>
            )}

            {/* Dark Overlay for better text readability */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.85) 100%)',
                zIndex: 1
            }} />

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 3,
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 107, 107, 0.8)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
            >
                <ChevronLeft size={28} color="white" />
            </button>

            <button
                onClick={goToNext}
                style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 3,
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 107, 107, 0.8)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
            >
                <ChevronRight size={28} color="white" />
            </button>

            <div className="hero-content" style={{
                position: 'relative',
                zIndex: 2,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '0 4rem',
                background: 'transparent',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', width: '100%' }}>
                    {/* Poster - Now Fully Opaque */}
                    {!imageError ? (
                        <img
                            src={currentMovie.poster}
                            alt={currentMovie.title}
                            style={{
                                width: '260px',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                animation: 'fadeIn 0.5s ease-in-out',
                                opacity: 1,
                                transition: 'opacity 0.3s ease'
                            }}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div style={{
                            width: '260px',
                            height: '390px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            textAlign: 'center',
                            padding: '1rem',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            animation: 'fadeIn 0.5s ease-in-out'
                        }}>
                            {currentMovie.title}
                        </div>
                    )}

                    {/* Info */}
                    <div style={{ color: 'white', maxWidth: '600px' }}>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>{currentMovie.title}</h1>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '4px' }}>{currentMovie.language}</span>
                            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '4px' }}>{currentMovie.genre.join(', ')}</span>
                            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '4px' }}>{currentMovie.duration}</span>
                        </div>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6 }}>{currentMovie.description}</p>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to={`/movie/${currentMovie.id}`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '12px 32px', fontSize: '1.1rem' }}>
                                <Ticket size={20} /> Book Now
                            </Link>
                            <Link
                                to={`/movie/${currentMovie.id}`}
                                onClick={(e) => {
                                    setTimeout(() => {
                                        const trailerSection = document.getElementById('trailer');
                                        if (trailerSection) {
                                            trailerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }, 100);
                                }}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    padding: '12px 32px',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    backdropFilter: 'blur(10px)',
                                    textDecoration: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <Play size={20} fill="white" /> Watch Trailer
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Indicators */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '10px',
                zIndex: 3
            }}>
                {movies.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                            width: idx === currentIndex ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: idx === currentIndex ? '#ff6b6b' : 'rgba(255,255,255,0.5)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            border: 'none'
                        }}
                    />
                ))}
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .hero-content { padding: 2rem !important; flex-direction: column; }
          .hero-content img { display: none; }
          .hero-content h1 { fontSize: 2rem !important; }
        }
      `}</style>
        </div>
    );
};

export default HeroCarousel;
