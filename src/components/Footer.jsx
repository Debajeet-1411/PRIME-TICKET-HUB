import React from 'react';
import { Ticket, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white',
            marginTop: '4rem',
            padding: '3rem 0 1rem'
        }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                    {/* Company Info */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Ticket color="#ff6b6b" size={28} />
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Prime Ticket Hub</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1rem', lineHeight: 1.6 }}>
                            Your ultimate destination for movie ticket bookings. Experience cinema like never before with Prime Ticket Hub.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#ff6b6b' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                            <li><Link to="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ff6b6b'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Home</Link></li>
                            <li><Link to="/movies" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ff6b6b'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Browse Movies</Link></li>
                            <li><Link to="/bookings" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ff6b6b'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>My Bookings</Link></li>
                            <li><Link to="/support" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ff6b6b'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}>Support</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#ff6b6b' }}>Contact Us</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                                <Phone size={18} color="#ff6b6b" />
                                <span>+1-800-PRIMETIX</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                                <Mail size={18} color="#ff6b6b" />
                                <span>support@primetickethub.com</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>
                                <MapPin size={18} color="#ff6b6b" />
                                <span>123 Cinema Street, Movie City</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                    {/* Footer Bottom */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                            © {currentYear} Prime Ticket Hub. All rights reserved.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ff6b6b'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}>Privacy Policy</a>
                            <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ff6b6b'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}>Terms of Service</a>
                            <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ff6b6b'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}>Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
