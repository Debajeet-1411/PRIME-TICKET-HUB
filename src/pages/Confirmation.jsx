import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CheckCircle, Download, Home } from 'lucide-react';

const Confirmation = () => {
    const location = useLocation();
    const { bookingId, movie, theater, showtime, selectedSeats, totalAmount } = location.state || {};
    const [posterError, setPosterError] = React.useState(false);

    if (!bookingId) return <div>No Booking Found</div>;

    return (
        <div>
            <Navbar />
            <div className="container" style={{ padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CheckCircle size={80} color="#2dc492" style={{ marginBottom: '1rem' }} />
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>Booking Confirmed!</h1>
                <p style={{ fontSize: '1.1rem', color: 'white', marginBottom: '3rem' }}>
                    Your ticket has been sent to your email.
                </p>

                {/* Ticket Card */}
                <div style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)',
                    overflow: 'hidden',
                    width: '100%',
                    maxWidth: '600px',
                    display: 'flex'
                }}>
                    {/* Left: Movie Info */}
                    <div style={{ flex: 1, padding: '2rem', borderRight: '2px dashed #eee', position: 'relative' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            {posterError ? (
                                <div style={{ width: '80px', height: '120px', borderRadius: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 600, textAlign: 'center', padding: '4px', flexShrink: 0 }}>{movie.title}</div>
                            ) : (
                                <img src={movie.poster} alt={movie.title} style={{ width: '80px', borderRadius: '8px', flexShrink: 0 }} onError={() => setPosterError(true)} />
                            )}
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{movie.title}</h3>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{movie.language} | {movie.rating}</p>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{movie.duration}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Theater</p>
                            <p style={{ fontWeight: 600 }}>{theater.name}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Date & Time</p>
                                <p style={{ fontWeight: 600 }}>{decodeURIComponent(showtime)}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Seats</p>
                                <p style={{ fontWeight: 600 }}>{selectedSeats.join(', ')}</p>
                            </div>
                        </div>

                        {/* Cutout circles for ticket effect */}
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '20px', height: '20px', background: 'var(--bg-light)', borderRadius: '50%' }}></div>
                        <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '20px', height: '20px', background: 'var(--bg-light)', borderRadius: '50%' }}></div>
                    </div>

                    {/* Right: QR Code & ID */}
                    <div style={{ width: '180px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                        <div style={{ width: '100px', height: '100px', background: '#ddd', marginBottom: '1rem' }}>
                            {/* Mock QR */}
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example" alt="QR" style={{ width: '100%' }} />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Booking ID</p>
                        <p style={{ fontWeight: 700, color: '#ff6b6b' }}>{bookingId}</p>
                    </div>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                    <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Download size={20} /> Download Ticket
                    </button>
                    <Link to="/" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Home size={20} /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
