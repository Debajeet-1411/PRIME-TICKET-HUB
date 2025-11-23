import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import { Ticket, Calendar, Clock, MapPin, QrCode } from 'lucide-react';
import userService from '../services/userService';
import authService from '../services/authService';

const MyBookings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [bookings, setBookings] = useState([]);
    const [imageErrors, setImageErrors] = useState({});

    useEffect(() => {
        if (!authService.isLoggedIn()) {
            navigate('/'); // Redirect if not logged in
            return;
        }
        setBookings(userService.getBookings());
    }, [navigate]);

    const handleImageError = (movieId) => {
        setImageErrors(prev => ({ ...prev, [movieId]: true }));
    };

    // Filter bookings based on date (simple logic for now)
    const filteredBookings = bookings.filter(b => {
        const bookingDate = new Date(b.date);
        const today = new Date();
        // Reset time for comparison
        today.setHours(0, 0, 0, 0);
        bookingDate.setHours(0, 0, 0, 0);

        if (activeTab === 'upcoming') {
            return bookingDate >= today;
        } else {
            return bookingDate < today;
        }
    });

    return (
        <div>
            <Navbar />
            <BackButton />
            <div className="container" style={{ padding: '3rem 0' }}>
                <h2 className="section-title">My Bookings</h2>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee' }}>
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        style={{
                            padding: '10px 20px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'upcoming' ? '2px solid #ff6b6b' : '2px solid transparent',
                            color: activeTab === 'upcoming' ? '#ff6b6b' : 'var(--text-light)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        style={{
                            padding: '10px 20px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'history' ? '2px solid #ff6b6b' : '2px solid transparent',
                            color: activeTab === 'history' ? '#ff6b6b' : 'var(--text-light)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        History
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {filteredBookings.length > 0 ? filteredBookings.map(booking => (
                        <div key={booking.id} style={{
                            background: 'white',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-sm)',
                            overflow: 'hidden',
                            display: 'flex',
                            border: '1px solid #eee',
                            transition: 'transform 0.2s ease'
                        }}>
                            <div style={{ width: '140px', position: 'relative', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                {!imageErrors[booking.id] ? (
                                    <img
                                        src={booking.moviePoster}
                                        alt={booking.movieTitle}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={() => handleImageError(booking.id)}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textAlign: 'center',
                                        padding: '0.5rem'
                                    }}>
                                        {booking.movieTitle}
                                    </div>
                                )}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(to right, rgba(0,0,0,0.2), transparent)'
                                }}></div>
                            </div>

                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>{booking.movieTitle}</h3>
                                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{booking.movieTitle}</p>
                                        </div>
                                        <span style={{
                                            background: activeTab === 'upcoming' ? '#e6fcf5' : '#f8f9fa',
                                            color: activeTab === 'upcoming' ? '#2dc492' : '#666',
                                            padding: '6px 16px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            letterSpacing: '0.5px'
                                        }}>
                                            {activeTab === 'upcoming' ? 'UPCOMING' : 'COMPLETED'}
                                        </span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                                            <div style={{ background: '#fff0f0', padding: '8px', borderRadius: '50%' }}><MapPin size={16} color="#ff6b6b" /></div>
                                            <span style={{ fontWeight: 500 }}>{booking.theater}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                                            <div style={{ background: '#fff0f0', padding: '8px', borderRadius: '50%' }}><Calendar size={16} color="#ff6b6b" /></div>
                                            <span style={{ fontWeight: 500 }}>{new Date(booking.date).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                                            <div style={{ background: '#fff0f0', padding: '8px', borderRadius: '50%' }}><Clock size={16} color="#ff6b6b" /></div>
                                            <span style={{ fontWeight: 500 }}>{booking.time}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                                            <div style={{ background: '#fff0f0', padding: '8px', borderRadius: '50%' }}><Ticket size={16} color="#ff6b6b" /></div>
                                            <span style={{ fontWeight: 500 }}>{booking.seats.join(', ')} ({booking.seats.length} Tickets)</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #ddd', paddingTop: '1rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>Booking ID</p>
                                        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#333' }}>{booking.id}</p>
                                    </div>
                                    <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', padding: '8px 20px' }}>
                                        <QrCode size={18} /> View Ticket
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-light)' }}>
                            <Ticket size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p style={{ fontSize: '1.2rem' }}>No {activeTab} bookings found.</p>
                            {activeTab === 'upcoming' && (
                                <Link to="/movies" style={{ color: '#ff6b6b', fontWeight: 600, marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>Book a Movie Now</Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBookings;
