import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ variant = 'light', size = 'medium', className = '' }) => {
  const logoPath = '/LOGO-removebg-preview (1).png';
  
  const isDark = variant === 'dark';
  const textColor = isDark ? '#000000' : '#ffffff';
  
  const sizes = {
    small: { height: '30px', fontSize: '18px' },
    medium: { height: '45px', fontSize: '22px' },
    large: { height: '60px', fontSize: '28px' }
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <Link to="/" className={className} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '8px' }}>
      <img 
        src={logoPath} 
        alt="Synox Banking Logo" 
        style={{ height: currentSize.height, width: 'auto', objectFit: 'contain' }} 
      />
      <span style={{ 
        fontSize: currentSize.fontSize, 
        fontWeight: 800, 
        color: textColor, 
        letterSpacing: '-0.5px',
        textTransform: 'uppercase',
        fontFamily: "'Outfit', sans-serif"
      }}>
        Synox
      </span>
    </Link>
  );
};

export default Logo;
