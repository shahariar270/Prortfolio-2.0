import React, { useEffect, useState } from 'react'
import { LeftContentBox } from './Sections/LeftContentBox'
import { RightContentBox } from './Sections/RightContentBox'
import { QuickInfoModal } from '../Component/QuickInfoModal'

export const Layout = () => {
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false)

  useEffect(() => {
    const cursor = document.querySelector(".cursor");

    const handleMove = (e) => {
      if (!cursor) return;
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    document.addEventListener("mousemove", handleMove);

    return () => {
      document.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div className='st-portfolio--layout'>
      <div className="cursor"></div>

      <LeftContentBox onOpenQuickModal={() => setIsQuickModalOpen(true)} />
      <RightContentBox />

      {/* Floating Quick Action Button */}
      <button
        type="button"
        className="st-quick-fab"
        onClick={() => setIsQuickModalOpen(true)}
        aria-label="Quick Contact & Info"
        title="Quick Contact & Info"
      >
        <span className="st-fab-icon">⚡</span>
        <span>Quick Contact</span>
      </button>

      {/* Quick Contact & Info Popup Modal */}
      <QuickInfoModal
        isOpen={isQuickModalOpen}
        onClose={() => setIsQuickModalOpen(false)}
      />
    </div>
  )
}
