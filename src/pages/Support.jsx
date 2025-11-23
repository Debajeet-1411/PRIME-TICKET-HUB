import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import { MessageCircle, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                }}
            >
                <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-dark)' }}>{question}</span>
                {isOpen ? <ChevronUp size={20} color="#ff6b6b" /> : <ChevronDown size={20} color="#666" />}
            </button>
            {isOpen && (
                <p style={{ marginTop: '0.5rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
                    {answer}
                </p>
            )}
        </div>
    );
};

const Support = () => {
    const faqs = [
        {
            question: "How do I cancel my booking?",
            answer: "You can cancel your booking up to 4 hours before the showtime. Go to 'My Bookings', select the ticket, and click 'Cancel Booking'. Refund will be processed within 5-7 business days."
        },
        {
            question: "Where can I find my ticket?",
            answer: "Your ticket is sent to your registered email address and is also available in the 'My Bookings' section of the website."
        },
        {
            question: "Are food and beverages included?",
            answer: "No, food and beverages need to be purchased separately at the cinema counter or can be added during booking if the option is available."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept Credit/Debit Cards, UPI, Net Banking, and popular Wallets."
        }
    ];

    return (
        <div>
            <Navbar />
            <BackButton />
            <div className="container" style={{ padding: '3rem 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>How can we help you?</h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                        Search our help center or contact us directly.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                    {/* FAQs */}
                    <div style={{ flex: 2, minWidth: '300px' }}>
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                            {faqs.map((faq, idx) => (
                                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <h2 className="section-title">Contact Us</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#fff0f0', padding: '10px', borderRadius: '50%' }}>
                                    <Phone color="#ff6b6b" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Call Us</p>
                                    <p style={{ fontWeight: 600 }}>1800-123-4567</p>
                                </div>
                            </div>

                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#fff0f0', padding: '10px', borderRadius: '50%' }}>
                                    <Mail color="#ff6b6b" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Email Us</p>
                                    <p style={{ fontWeight: 600 }}>support@goldenseat.com</p>
                                </div>
                            </div>

                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#fff0f0', padding: '10px', borderRadius: '50%' }}>
                                    <MessageCircle color="#ff6b6b" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Chat with Us</p>
                                    <button style={{ color: '#ff6b6b', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>Start Chat ›</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
