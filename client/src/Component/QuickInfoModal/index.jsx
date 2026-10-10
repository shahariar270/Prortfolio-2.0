import React, { useState, useEffect } from 'react';
import profile from '../../assets/images/profile.jpg';
import { resumeDownloadUrl } from '../../config/resume';

export const QuickInfoModal = ({ isOpen, onClose, quickDataCustom }) => {
  const [copied, setCopied] = useState(false);

  // Default Quick Data - easily extendable
  const defaultData = {
    name: 'Shahariar',
    title: 'Founder @ Novakrift · React & MERN Specialist',
    status: 'Available for freelance & full-time projects',
    email: 'shahariar@example.com', // user can update
    whatsapp: 'https://wa.me/8801700000000', // update with actual whatsapp
    facebook: 'https://facebook.com/shahariar.novakrift',
    linkedin: 'https://linkedin.com/in/shahariar',
    github: 'https://github.com/shahariar270',
    location: 'Dhaka, Bangladesh (GMT+6)',
    responseTime: 'Within a few hours',
    skills: 'React, MERN, Node.js, Next.js, SCSS',
    resumeUrl: resumeDownloadUrl
  };

  const data = { ...defaultData, ...quickDataCustom };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(data.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="st-quick-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="st-quick-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button type="button" className="st-quick-modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Modal Header */}
        <div className="st-quick-modal-header">
          <img src={profile} alt={data.name} className="st-quick-modal-avatar" />
          <div className="st-quick-modal-user">
            <h3>{data.name}</h3>
            <p className="st-quick-modal-title">{data.title}</p>
            <div className="st-quick-modal-badge">
              <span className="st-badge-dot"></span>
              {data.status}
            </div>
          </div>
        </div>

        {/* Modal Content / Quick Links */}
        <div className="st-quick-modal-body">
          <h4 className="st-quick-modal-section-title">⚡ Quick Contact & Socials</h4>
          <div className="st-quick-modal-grid">
            {/* WhatsApp */}
            <a href={data.whatsapp} target="_blank" rel="noopener noreferrer" className="st-quick-card whatsapp">
              <span className="st-card-icon">💬</span>
              <div className="st-card-text">
                <strong>WhatsApp</strong>
                <span>Instant Message</span>
              </div>
            </a>

            {/* Email with copy button */}
            <div className="st-quick-card email" onClick={handleCopyEmail}>
              <span className="st-card-icon">✉️</span>
              <div className="st-card-text">
                <strong>Email</strong>
                <span>{copied ? 'Copied to Clipboard! ✓' : data.email}</span>
              </div>
              <button type="button" className="st-copy-btn" title="Copy Email">
                {copied ? '✓' : '📋'}
              </button>
            </div>

            {/* Facebook */}
            <a href={data.facebook} target="_blank" rel="noopener noreferrer" className="st-quick-card facebook">
              <span className="st-card-icon">📘</span>
              <div className="st-card-text">
                <strong>Facebook</strong>
                <span>Connect Profile</span>
              </div>
            </a>

            {/* LinkedIn */}
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="st-quick-card linkedin">
              <span className="st-card-icon">💼</span>
              <div className="st-card-text">
                <strong>LinkedIn</strong>
                <span>Professional Network</span>
              </div>
            </a>

            {/* GitHub */}
            <a href={data.github} target="_blank" rel="noopener noreferrer" className="st-quick-card github">
              <span className="st-card-icon">💻</span>
              <div className="st-card-text">
                <strong>GitHub</strong>
                <span>Code Repositories</span>
              </div>
            </a>
          </div>

          {/* Key Details Section */}
          <h4 className="st-quick-modal-section-title">📍 Quick Info</h4>
          <div className="st-quick-modal-info-list">
            <div className="st-info-item">
              <span className="st-info-label">Location:</span>
              <span className="st-info-val">{data.location}</span>
            </div>
            <div className="st-info-item">
              <span className="st-info-label">Response Time:</span>
              <span className="st-info-val">{data.responseTime}</span>
            </div>
            <div className="st-info-item">
              <span className="st-info-label">Specialties:</span>
              <span className="st-info-val">{data.skills}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="st-quick-modal-footer">
          <a
            href={data.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="st-quick-btn primary"
          >
            📄 Download Resume
          </a>
          <button type="button" className="st-quick-btn secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
