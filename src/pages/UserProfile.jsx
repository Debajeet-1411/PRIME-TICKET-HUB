import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import authService from '../services/authService';
import userService from '../services/userService';
import { User, Mail, Phone, Calendar, Heart, Ticket } from 'lucide-react';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' or 'bookings'

    useEffect(() => {
        if (!authService.isLoggedIn()) {
            navigate('/');
            return;
        }

        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setFavorites(userService.getFavorites());
        setBookings(userService.getBookings());

        // Listen for auth changes
        const handleAuthChange = () => {
            if (!authService.isLoggedIn()) {
                navigate('/');
            } else {
                const updatedUser = authService.getCurrentUser();
                setUser(updatedUser);
                setFavorites(userService.getFavorites());
                setBookings(userService.getBookings());
            }
        };

        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, [navigate]);

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
            <Navbar />

            <div className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

                    {/* Sidebar - User Info */}
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        height: 'fit-content'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                marginBottom: '1rem',
                                boxShadow: '0 10px 20px rgba(255, 107, 107, 0.3)'
                            }}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2d3436', marginBottom: '0.5rem' }}>{user.name}</h2>
                            <p style={{ color: '#636e72', fontSize: '0.9rem' }}>Member since {new Date(user.createdAt || Date.now()).getFullYear()}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '12px' }}>
                                <Mail size={20} color="#ff6b6b" />
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: '#636e72', marginBottom: '2px' }}>Email</p>
                                    <p style={{ fontWeight: 500, color: '#2d3436' }}>{user.email}</p>
                                </div>
                            </div>
                            {user.phone && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '12px' }}>
                                    <Phone size={20} color="#ff6b6b" />
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: '#636e72', marginBottom: '2px' }}>Phone</p>
                                        <p style={{ fontWeight: 500, color: '#2d3436' }}>{user.phone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
                            <button
                                onClick={() => setActiveTab('favorites')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '0.5rem 1.5rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: activeTab === 'favorites' ? '#ff6b6b' : '#636e72',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Heart size={20} fill={activeTab === 'favorites' ? '#ff6b6b' : 'none'} />
                                    Favorites ({favorites.length})
                                </div>
                                {activeTab === 'favorites' && (
                                    <div style={{ position: 'absolute', bottom: '-1rem', left: 0, width: '100%', height: '3px', background: '#ff6b6b', borderRadius: '3px 3px 0 0' }} />
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab('bookings')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '0.5rem 1.5rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: activeTab === 'bookings' ? '#ff6b6b' : '#636e72',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Ticket size={20} />
                                    My Bookings ({bookings.length})
                                </div>
                                {activeTab === 'bookings' && (
                                    <div style={{ position: 'absolute', bottom: '-1rem', left: 0, width: '100%', height: '3px', background: '#ff6b6b', borderRadius: '3px 3px 0 0' }} />
                                )}
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div style={{ minHeight: '400px' }}>
                            {activeTab === 'favorites' && (
                                <>
                                    {favorites.length > 0 ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
                                            {favorites.map(movie => (
                                                <MovieCard key={movie.id} movie={movie} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '4rem', color: '#b2bec3' }}>
                                            <Heart size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                            <h3>No favorite movies yet</h3>
                                            <p>Start exploring and heart the movies you love!</p>
                                            <button
                                                onClick={() => navigate('/movies')}
                                                style={{
                                                    marginTop: '1rem',
                                                    padding: '0.8rem 2rem',
                                                    background: '#ff6b6b',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Explore Movies
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'bookings' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {bookings.length > 0 ? (
                                        bookings.map(booking => (
                                            <div key={booking.id} style={{
                                                background: 'white',
                                                borderRadius: '12px',
                                                padding: '1.5rem',
                                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                                display: 'flex',
                                                gap: '1.5rem',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{
                                                    width: '80px',
                                                    height: '100px',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    flexShrink: 0
                                                }}>
                                                    <img
                                                        src={booking.moviePoster || 'https://placehold.co/100x150?text=Movie'}
                                                        alt="Movie"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2d3436' }}>{booking.movieTitle}</h3>
                                                        <span style={{
                                                            background: '#e3fcef',
                                                            color: '#00b894',
                                                            padding: '4px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 600
                                                        }}>
                                                            Confirmed
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', color: '#636e72', fontSize: '0.9rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <Calendar size={16} />
                                                            <span>{new Date(booking.date).toLocaleDateString()} | {booking.time}</span>
                                                        </div>
                                                        <div>Theater: <span style={{ fontWeight: 500, color: '#2d3436' }}>{booking.theater}</span></div>
                                                        <div>Seats: <span style={{ fontWeight: 500, color: '#2d3436' }}>{booking.seats.join(', ')}</span></div>
                                                        <div>Amount: <span style={{ fontWeight: 500, color: '#2d3436' }}>₹{booking.amount}</span></div>
                                                    </div>
                                                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#b2bec3' }}>
                                                        Booking ID: {booking.id}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '4rem', color: '#b2bec3' }}>
                                            <Ticket size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                            <h3>No bookings found</h3>
                                            <p>You haven't booked any tickets yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserProfile;
