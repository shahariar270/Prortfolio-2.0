import React, { useState, useEffect } from 'react';
import profile from '../../assets/images/profile.jpg';
import { resumeDownloadUrl } from '../../config/resume';

export const QuickInfoModal = ({ isOpen, onClose, quickDataCustom }) => {
  const [copied, setCopied] = useState(false);

  const defaultData = {
    name: 'Shahariar',
    title: 'Full-Stack Engineer | Competitive Programmer | AI Automation | CMS Expert',
    email: 'dev.shahariar.official@gmail.com',
    whatsapp: 'https://wa.me/8801915579467',
    facebook: 'https://www.facebook.com/shahariar270/',
    linkedin: 'https://www.linkedin.com/in/shahariar270/',
    github: 'https://github.com/shahariar270',
    location: 'Dhaka, Bangladesh (GMT+6)',
    responseTime: 'Within a few hours',
    skills: 'React, MERN, Next.js, AI Automation, Competitive Programming, CMS',
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Modal Header */}
        <div className="st-quick-modal-header">
          <img src={profile} alt={data.name} className="st-quick-modal-avatar" />
          <div className="st-quick-modal-user">
            <h3>{data.name}</h3>
            <p className="st-quick-modal-title">{data.title}</p>
          </div>
        </div>

        {/* Modal Content / Quick Links */}
        <div className="st-quick-modal-body">
          <h4 className="st-quick-modal-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            Quick Contact & Socials
          </h4>

          <div className="st-quick-modal-grid">
            {/* WhatsApp */}
            <a href={data.whatsapp} target="_blank" rel="noopener noreferrer" className="st-quick-card whatsapp">
              <span className="st-card-icon whatsapp-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.854 0-3.674-.499-5.267-1.442l-.378-.225-3.916 1.027 1.045-3.817-.247-.393c-1.036-1.648-1.583-3.553-1.583-5.513 0-5.69 4.63-10.32 10.322-10.32 2.757 0 5.347 1.074 7.297 3.025 1.95 1.951 3.023 4.541 3.023 7.297 0 5.692-4.63 10.322-10.323 10.322m0-22.183c-6.529 0-11.84 5.311-11.84 11.84 0 2.09.544 4.133 1.578 5.926l-1.677 6.126 6.269-1.644c1.722.939 3.666 1.433 5.67 1.434 6.53 0 11.841-5.311 11.841-11.842 0-3.163-1.232-6.136-3.468-8.372-2.235-2.236-5.209-3.468-8.373-3.468"/>
                </svg>
              </span>
              <div className="st-card-text">
                <strong>WhatsApp</strong>
                <span>Instant Message</span>
              </div>
            </a>

            {/* Email with copy button */}
            <div className="st-quick-card email" onClick={handleCopyEmail}>
              <span className="st-card-icon email-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <div className="st-card-text">
                <strong>Email</strong>
                <span>{copied ? 'Copied to Clipboard! ✓' : data.email}</span>
              </div>
              <button type="button" className="st-copy-btn" title="Copy Email">
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>

            {/* Facebook */}
            <a href={data.facebook} target="_blank" rel="noopener noreferrer" className="st-quick-card facebook">
              <span className="st-card-icon facebook-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </span>
              <div className="st-card-text">
                <strong>Facebook</strong>
                <span>Connect Profile</span>
              </div>
            </a>

            {/* LinkedIn */}
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="st-quick-card linkedin">
              <span className="st-card-icon linkedin-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.262-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </span>
              <div className="st-card-text">
                <strong>LinkedIn</strong>
                <span>Professional Network</span>
              </div>
            </a>

            {/* GitHub */}
            <a href={data.github} target="_blank" rel="noopener noreferrer" className="st-quick-card github">
              <span className="st-card-icon github-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </span>
              <div className="st-card-text">
                <strong>GitHub</strong>
                <span>Code Repositories</span>
              </div>
            </a>
          </div>

          {/* Key Details Section */}
          <h4 className="st-quick-modal-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Quick Info
          </h4>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            Download Resume
          </a>
          <button type="button" className="st-quick-btn secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
