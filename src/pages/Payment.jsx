import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import { CreditCard, Wallet, CheckCircle } from 'lucide-react';
import userService from '../services/userService';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { movie, theater, showtime, selectedSeats, totalAmount } = location.state || {};
    const [posterError, setPosterError] = React.useState(false);

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [upiId, setUpiId] = useState('');
    const [loading, setLoading] = useState(false);

    if (!movie) return <div>Invalid Booking</div>;

    const handlePayment = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate payment delay
        setTimeout(() => {
            const bookingDetails = {
                movieTitle: movie.title,
                moviePoster: movie.poster,
                theater: theater.name,
                date: new Date().toISOString(), // In a real app, use the actual show date
                time: decodeURIComponent(showtime),
                seats: selectedSeats,
                amount: totalAmount,
                paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI'
            };

            userService.addBooking(bookingDetails);

            setLoading(false);
            navigate('/confirmation', {
                state: {
                    bookingId: 'GT-' + Math.floor(Math.random() * 1000000),
                    movie,
                    theater,
                    showtime,
                    selectedSeats,
                    totalAmount,
                    paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI'
                }
            });
        }, 2000);
    };

    return (
        <div>
            <Navbar />
            <BackButton />
            <div className="container" style={{ padding: '2rem 0', display: 'flex', gap: '3rem' }}>
                <div style={{ flex: 2 }}>
                    <h2 className="section-title">Payment Options</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Card Payment */}
                        <div
                            onClick={() => setPaymentMethod('card')}
                            style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-sm)',
                                border: paymentMethod === 'card' ? '1px solid #ff6b6b' : '1px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: paymentMethod === 'card' ? '1.5rem' : '0' }}>
                                <CreditCard color={paymentMethod === 'card' ? '#ff6b6b' : '#666'} />
                                <h3 style={{ fontSize: '1.1rem', color: paymentMethod === 'card' ? '#000' : '#666' }}>Credit / Debit Card</h3>
                                {paymentMethod === 'card' && <CheckCircle size={20} color="#ff6b6b" style={{ marginLeft: 'auto' }} />}
                            </div>

                            {paymentMethod === 'card' && (
                                <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        required
                                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                                    />
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            required
                                            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="CVV"
                                            required
                                            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Card Holder Name"
                                        required
                                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary"
                                        style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        {loading ? 'Processing...' : `Pay Rs. ${totalAmount}`}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* UPI Payment */}
                        <div
                            onClick={() => setPaymentMethod('upi')}
                            style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-sm)',
                                border: paymentMethod === 'upi' ? '1px solid #ff6b6b' : '1px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: paymentMethod === 'upi' ? '1.5rem' : '0' }}>
                                <Wallet color={paymentMethod === 'upi' ? '#ff6b6b' : '#666'} />
                                <h3 style={{ fontSize: '1.1rem', color: paymentMethod === 'upi' ? '#000' : '#666' }}>UPI / Wallets</h3>
                                {paymentMethod === 'upi' && <CheckCircle size={20} color="#ff6b6b" style={{ marginLeft: 'auto' }} />}
                            </div>

                            {paymentMethod === 'upi' && (
                                <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>Scan to Pay</p>
                                        <div style={{
                                            width: '150px',
                                            height: '150px',
                                            background: 'white',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <img
                                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=dummy@upi&pn=GoldenTicket&am=100"
                                                alt="Payment QR Code"
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: '#666' }}>or enter your UPI ID below</p>
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Enter UPI ID (e.g. mobile@upi)"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary"
                                        style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        {loading ? 'Processing...' : `Pay Rs. ${totalAmount}`}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            {posterError ? (
                                <div style={{ width: '60px', height: '90px', borderRadius: '4px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 600, textAlign: 'center', padding: '4px' }}>{movie.title}</div>
                            ) : (
                                <img src={movie.poster} alt={movie.title} style={{ width: '60px', borderRadius: '4px' }} onError={() => setPosterError(true)} />
                            )}
                            <div>
                                <p style={{ fontWeight: 600 }}>{movie.title}</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{movie.language}</p>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                            {theater.name}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                            {decodeURIComponent(showtime)} | {selectedSeats.length} Tickets
                        </p>
                        <div style={{ borderTop: '1px solid #eee', margin: '1rem 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem' }}>
                            <span>Total</span>
                            <span>Rs. {totalAmount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
