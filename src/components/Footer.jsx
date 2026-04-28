import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer_section bg-dark text-white pt-5 pb-4">
      <div className="container mt-4">
        <div className="row g-4 mb-5">
          <div className="col-lg-4">
            <div className="footer_about">
              <h2 className="text-white mb-4">SYNOX</h2>
              <p className="text-secondary mb-4">
                Redefining premium international banking for the digital age. Secure, discreet, and globally integrated.
              </p>
              <div className="social_links d-flex gap-3">
                <a href="#!" className="text-secondary hover-white"><Facebook size={20} /></a>
                <a href="#!" className="text-secondary hover-white"><Twitter size={20} /></a>
                <a href="#!" className="text-secondary hover-white"><Linkedin size={20} /></a>
                <a href="#!" className="text-secondary hover-white"><Instagram size={20} /></a>
              </div>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-4">
            <h4 className="text-white mb-4">Services</h4>
            <ul className="list-unstyled footer_links">
              <li className="mb-2"><Link to="/services" className="text-secondary text-decoration-none">Private Banking</Link></li>
              <li className="mb-2"><Link to="/trading" className="text-secondary text-decoration-none">Global Trading</Link></li>
              <li className="mb-2"><Link to="/crypto" className="text-secondary text-decoration-none">Crypto Assets</Link></li>
              <li className="mb-2"><Link to="/wealth" className="text-secondary text-decoration-none">Wealth Management</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4">
            <h4 className="text-white mb-4">Company</h4>
            <ul className="list-unstyled footer_links">
              <li className="mb-2"><Link to="/about" className="text-secondary text-decoration-none">About Us</Link></li>
              <li className="mb-2"><Link to="/careers" className="text-secondary text-decoration-none">Careers</Link></li>
              <li className="mb-2"><Link to="/news" className="text-secondary text-decoration-none">News Room</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-secondary text-decoration-none">Contact</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-4">
            <h4 className="text-white mb-4">Contact Us</h4>
            <ul className="list-unstyled footer_contact">
              <li className="d-flex gap-3 mb-3 text-secondary">
                <MapPin size={20} className="text-primary flex-shrink-0" />
                <span>123 Global Plaza, Financial District, Singapore</span>
              </li>
              <li className="d-flex gap-3 mb-3 text-secondary">
                <Phone size={20} className="text-primary flex-shrink-0" />
                <span>+1 (800) SYNOX-BANK</span>
              </li>
              <li className="d-flex gap-3 mb-3 text-secondary">
                <Mail size={20} className="text-primary flex-shrink-0" />
                <span>concierge@synox-bank.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="mb-4 opacity-10" />

        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <p className="mb-0 text-secondary fontSize-sm">
              &copy; {new Date().getFullYear()} Synox International Bank & Trade. All rights reserved. Registered with Global Financial Authority.
            </p>
          </div>
          <div className="col-md-6">
            <ul className="list-inline mb-0 text-md-end fontSize-sm">
              <li className="list-inline-item"><Link to="/terms" className="text-secondary text-decoration-none px-2">Terms</Link></li>
              <li className="list-inline-item"><Link to="/privacy" className="text-secondary text-decoration-none px-2">Privacy</Link></li>
              <li className="list-inline-item"><Link to="/disclaimer" className="text-secondary text-decoration-none px-2">Disclaimers</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
