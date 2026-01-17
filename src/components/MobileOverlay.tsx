/**
 * @component MobileOverlay
 * @description Elegant mobile overlay suggesting desktop for better experience
 * @author Cleanlystudio
 */
"use client";

import { useState, useEffect } from "react";

export default function MobileOverlay() {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && !dismissed) {
        setTimeout(() => setIsVisible(true), 2000);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [dismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => setDismissed(true), 500);
  };

  if (!isMobile || dismissed) return null;

  return (
    <div className={`mobile-overlay ${isVisible ? "visible" : ""}`}>
      <div className="mobile-overlay-content">
        <div className="mobile-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>

        <p className="mobile-title">Meilleure expérience sur desktop</p>
        <p className="mobile-subtitle">
          Ce portfolio utilise des effets 3D immersifs optimisés pour les grands écrans
        </p>

        <div className="mobile-actions">
          <button onClick={handleDismiss} className="mobile-btn-continue">
            <span>Continuer quand même</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <div className="mobile-hint">
          <span className="pulse-dot" />
          <span>Expérience complète sur PC</span>
        </div>
      </div>

      <style jsx>{`
        .mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }

        .mobile-overlay.visible {
          opacity: 1;
          pointer-events: auto;
        }

        .mobile-overlay-content {
          text-align: center;
          max-width: 340px;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
        }

        .mobile-overlay.visible .mobile-overlay-content {
          transform: translateY(0);
          opacity: 1;
        }

        .mobile-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
        }

        .mobile-title {
          font-size: 22px;
          font-weight: 300;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
          color: #fff;
        }

        .mobile-subtitle {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 32px;
        }

        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-btn-continue {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-btn-continue:active {
          transform: scale(0.98);
          background: rgba(255, 255, 255, 0.12);
        }

        .mobile-hint {
          margin-top: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.35);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(74, 222, 128, 0.8);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
