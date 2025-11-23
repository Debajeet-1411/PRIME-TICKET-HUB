import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            style={{
                position: 'fixed',
                top: '80px',
                left: '20px',
                zIndex: 999,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '10px 20px',
                background: 'rgba(42, 42, 42, 0.95)',
                border: '1px solid #3a3a3a',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.background = '#2dc492';
                e.currentTarget.style.borderColor = '#2dc492';
                e.currentTarget.style.transform = 'translateX(-5px)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(42, 42, 42, 0.95)';
                e.currentTarget.style.borderColor = '#3a3a3a';
                e.currentTarget.style.transform = 'translateX(0)';
            }}
        >
            <ArrowLeft size={18} />
            Back
        </button>
    );
};

export default BackButton;
