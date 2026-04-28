import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  { name: 'SWIFT', src: 'https://upload.wikimedia.org/wikipedia/commons/b/be/SWIFT_logo.svg' },
  { name: 'Visa', src: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
  { name: 'Mastercard', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
  { name: 'Bloomberg', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Bloomberg_logo.svg' },
  { name: 'NYSE', src: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/NYSE_logo.svg' },
  { name: 'Reuters', src: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Reuters_logo.svg' },
];

const LogoTicker = () => {
  return (
    <div className="logo_ticker_wrapper py-5 bg-white border-top border-bottom overflow-hidden">
      <div className="container">
        <div className="text-center mb-4">
          <span className="text-uppercase text-muted fw-bold l-spacing-2 small">Trusted Partners & Global Networks</span>
        </div>
        <div className="ticker_container d-flex overflow-hidden">
          <motion.div 
            className="ticker_track d-flex gap-5 align-items-center"
            animate={{ x: [0, -1000] }}
            transition={{ 
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              }
            }}
          >
            {[...logos, ...logos, ...logos].map((logo, index) => (
              <div key={index} className="ticker_item px-4">
                <img 
                  src={logo.src} 
                  alt={logo.name} 
                  style={{ height: '30px', filter: 'grayscale(1) opacity(0.6)', transition: 'all 0.3s' }}
                  className="hover-color"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <style>{`
        .hover-color:hover {
          filter: grayscale(0) opacity(1) !important;
        }
      `}</style>
    </div>
  );
};

export default LogoTicker;
