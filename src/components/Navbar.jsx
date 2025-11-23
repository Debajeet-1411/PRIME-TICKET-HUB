import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, Ticket, Settings } from 'lucide-react';
import logo from '../assets/logo-pt.svg';
import authService from '../services/authService';
import AuthModal from './AuthModal';

import moviesData from '../data/movies.json';
import { searchMovies } from '../services/tmdbService';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(authService.getCurrentUser());

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(authService.getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('auth-change', handleStorageChange);

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search Handler
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearchLoading(true);

        // 1. Local Search
        const localResults = moviesData.filter(movie =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(m => ({ ...m, isLocal: true }));

        // 2. TMDB Search
        const tmdbResults = await searchMovies(searchQuery);

        // Combine results (Local first)
        setSearchResults([...localResults, ...tmdbResults]);
        setIsSearchLoading(false);
        setShowSearchDropdown(true);
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsProfileDropdownOpen(false);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    window.dispatchEvent(new Event('auth-change'));
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const handleMovieClick = (movie) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    if (movie.isLocal) {
      navigate(`/movie/${movie.id}`);
    } else {
      // For TMDB movies, we might need a way to handle them if they aren't in our main data
      // For now, let's assume we navigate to a generic movie page or handle it via ID
      // Since we don't have a route for raw TMDB IDs, we might need to add one or just show local
      // But user asked to show them. Let's navigate to movie details and handle fetching there if needed.
      // Currently MovieDetails expects ID to be in moviesData or cache.
      // We'll rely on the cache mechanism in MovieDetails.
      navigate(`/movie/${movie.id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSearchDropdown(false);
      if (searchResults.length > 0) {
        handleMovieClick(searchResults[0]);
      } else {
        // Navigate to movies page with search query
        navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <nav className="navbar" style={{
      padding: '0.8rem 1rem',
      background: 'black',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      color: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

        {/* Left Section: Logo + Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
            <img src={logo} alt="PrimeTicketHub Logo" style={{ height: '35px' }} />
            <span className="text-gradient">PrimeTicketHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link to="/" style={{ fontWeight: 500, color: 'white', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.9}>Home</Link>
            <Link to="/movies" style={{ fontWeight: 500, color: 'white', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.9}>Movies</Link>
            <Link to="/bookings" style={{ fontWeight: 500, color: 'white', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.9}>My Bookings</Link>
            <Link to="/support" style={{ fontWeight: 500, color: 'white', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.9}>Support</Link>
          </div>
        </div>

        {/* Right Section: Search + Auth/Profile */}
        <div className="nav-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {/* Search Bar */}
          <div className="search-bar" ref={searchRef} style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            width: '250px'
          }}>
            <Search size={18} color="#666" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                border: 'none',
                background: 'transparent',
                marginLeft: '0.5rem',
                outline: 'none',
                color: '#333',
                width: '100%',
                fontSize: '0.9rem'
              }}
            />

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div style={{
                position: 'absolute',
                top: '120%',
                left: 0,
                width: '100%',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                overflow: 'hidden',
                zIndex: 1002
              }}>
                {isSearchLoading ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>Loading...</div>
                ) : searchResults.length > 0 ? (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {searchResults.map(movie => (
                      <div
                        key={movie.id}
                        onClick={() => handleMovieClick(movie)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '0.8rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                          transition: 'background 0.1s'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
                        onMouseOut={e => e.currentTarget.style.background = 'white'}
                      >
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>{movie.title}</p>
                          <p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>
                            {movie.isLocal ? movie.language : movie.year}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>No results found</div>
                )}
              </div>
            )}
          </div>

          {user ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              {/* Profile Avatar Trigger */}
              <div
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#333',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  border: '2px solid #555'
                }}>
                  {getInitials(user.name)}
                </div>
              </div>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '220px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  padding: '0.5rem',
                  zIndex: 1001,
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid #eee', marginBottom: '0.5rem' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{user.name}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{user.email}</p>
                  </div>

                  <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', color: '#333', textDecoration: 'none', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <User size={18} /> Profile
                  </Link>
                  <Link to="/bookings" onClick={() => setIsProfileDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', color: '#333', textDecoration: 'none', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <Ticket size={18} /> My Bookings
                  </Link>
                  <div style={{ height: '1px', background: '#eee', margin: '0.5rem 0' }}></div>
                  <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', fontSize: '1rem', textAlign: 'left', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#fee2e2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="btn-primary"
              style={{ padding: '8px 24px', fontSize: '0.9rem', borderRadius: '50px' }}
            >
              Login
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={toggleMenu} style={{ display: 'none', background: 'none', border: 'none', color: 'white' }}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          background: 'black',
          padding: '1rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          borderTop: '1px solid #333'
        }}>
          <Link to="/" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}>Home</Link>
          <Link to="/movies" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}>Movies</Link>
          <Link to="/bookings" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}>My Bookings</Link>
          <Link to="/support" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}>Support</Link>
          {user ? (
            <>
              <div style={{ height: '1px', background: '#333', margin: '0.5rem 0' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                  {getInitials(user.name)}
                </div>
                <span style={{ color: 'white' }}>{user.name}</span>
              </div>
              <Link to="/profile" onClick={toggleMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none', padding: '0.5rem' }}>
                <User size={18} /> Profile
              </Link>
              <button
                onClick={() => { handleLogout(); toggleMenu(); }}
                style={{ background: 'none', border: 'none', textAlign: 'left', padding: '0.5rem', fontSize: '1rem', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <button onClick={() => { setIsAuthModalOpen(true); toggleMenu(); }} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Login
            </button>
          )}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
          .search-bar { display: none !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
