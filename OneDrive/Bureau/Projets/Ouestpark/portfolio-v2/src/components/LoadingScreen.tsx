/**
 * @component LoadingScreen
 * @description Premium loading screen with 3D-like animation - Awwwards level
 * @author Cleanlystudio
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";
import { gsap } from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

const MIN_LOAD_TIME = 3500; // Minimum 3.5s pour tout charger sans lag

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<"loading" | "ready" | "exit">("loading");
  const [canExit, setCanExit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!logoRef.current || !linesRef.current) return;

    const letters = logoRef.current.querySelectorAll(".letter");
    const lines = linesRef.current.querySelectorAll(".deco-line");

    gsap.fromTo(letters,
      { y: 60, opacity: 0, rotateX: -90 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.08, ease: "power3.out", delay: 0.3 }
    );

    gsap.fromTo(lines,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.5, stagger: 0.2, ease: "power2.inOut", delay: 0.5 }
    );
  }, []);

  // Set minimum load time
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanExit(true);
    }, MIN_LOAD_TIME);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only exit when BOTH progress is 100 AND minimum time has passed
    if (progress === 100 && !active && canExit) {
      setPhase("ready");

      setTimeout(() => {
        setPhase("exit");

        if (containerRef.current && logoRef.current) {
          const tl = gsap.timeline({
            onComplete: () => {
              setShow(false);
              onComplete();
            }
          });

          tl.to(logoRef.current.querySelectorAll(".letter"), {
            y: -60,
            opacity: 0,
            rotateX: 90,
            duration: 0.6,
            stagger: 0.03,
            ease: "power3.in"
          })
          .to(progressRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.4
          }, "-=0.4")
          .to(containerRef.current, {
            clipPath: "inset(50% 0% 50% 0%)",
            duration: 0.8,
            ease: "power4.inOut"
          }, "-=0.2");
        }
      }, 600);
    }
  }, [progress, active, canExit, onComplete]);

  if (!show) return null;

  const loadingTexts = [
    { threshold: 0, text: "Initializing" },
    { threshold: 20, text: "Loading assets" },
    { threshold: 40, text: "Building world" },
    { threshold: 60, text: "Preparing experience" },
    { threshold: 80, text: "Almost there" },
    { threshold: 100, text: "Ready" },
  ];

  const currentText = loadingTexts.reduce((acc, item) =>
    progress >= item.threshold ? item.text : acc, loadingTexts[0].text
  );

  return (
    <div
      ref={containerRef}
      className="loading-screen-premium"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="loading-bg-grid" />
      <div className="loading-bg-gradient" />

      <div ref={linesRef} className="loading-deco-lines">
        <div className="deco-line line-1" />
        <div className="deco-line line-2" />
        <div className="deco-line line-3" />
      </div>

      <div className="loading-main">
        <div ref={logoRef} className="loading-logo-animated">
          {"CLEANLY".split("").map((char, i) => (
            <span key={i} className="letter letter-main">{char}</span>
          ))}
          <span className="letter-space" />
          {"STUDIO".split("").map((char, i) => (
            <span key={i + 7} className="letter letter-accent">{char}</span>
          ))}
        </div>

        <div ref={progressRef} className="loading-progress-premium">
          <div className="progress-info">
            <span className="progress-text">{currentText}</span>
            <span className="progress-percent">{Math.round(progress)}%</span>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar-bg" />
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="progress-bar-glow"
              style={{ left: `${progress}%` }}
            />
          </div>

          <div className="progress-markers">
            {[0, 25, 50, 75, 100].map((mark) => (
              <div
                key={mark}
                className={`marker ${progress >= mark ? "active" : ""}`}
              />
            ))}
          </div>
        </div>

        {phase === "ready" && (
          <div className="loading-ready">
            <div className="ready-pulse" />
            <span>Entering experience</span>
          </div>
        )}
      </div>

      <div className="loading-footer">
        <div className="loading-sound-hint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <span>Enable sound for full experience</span>
        </div>
        <div className="loading-year">2025</div>
      </div>

      <style jsx>{`
        .loading-screen-premium {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .loading-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }

        .loading-bg-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, transparent 0%, #000 70%);
        }

        .loading-deco-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .deco-line {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transform-origin: left;
        }

        .line-1 { top: 30%; left: 0; right: 0; }
        .line-2 { top: 50%; left: 0; right: 0; }
        .line-3 { top: 70%; left: 0; right: 0; }

        .loading-main {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .loading-logo-animated {
          font-size: clamp(32px, 8vw, 72px);
          font-weight: 200;
          letter-spacing: 0.15em;
          margin-bottom: 60px;
          perspective: 500px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }

        .letter {
          display: inline-block;
          transform-style: preserve-3d;
        }

        .letter-main {
          color: #fff;
        }

        .letter-accent {
          color: #666;
        }

        .letter-space {
          width: 0.3em;
        }

        .loading-progress-premium {
          width: 320px;
          margin: 0 auto;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .progress-text {
          color: rgba(255,255,255,0.5);
          transition: all 0.3s ease;
        }

        .progress-percent {
          color: #fff;
          font-variant-numeric: tabular-nums;
        }

        .progress-bar-container {
          position: relative;
          height: 2px;
          margin-bottom: 16px;
        }

        .progress-bar-bg {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.1);
          border-radius: 1px;
        }

        .progress-bar-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.8) 100%);
          border-radius: 1px;
          transition: width 0.3s ease-out;
        }

        .progress-bar-glow {
          position: absolute;
          top: -6px;
          width: 12px;
          height: 14px;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 70%);
          transform: translateX(-50%);
          transition: left 0.3s ease-out;
        }

        .progress-markers {
          display: flex;
          justify-content: space-between;
        }

        .marker {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }

        .marker.active {
          background: #fff;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        }

        .loading-ready {
          margin-top: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.7);
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ready-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }

        .loading-footer {
          position: absolute;
          bottom: 40px;
          left: 40px;
          right: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .loading-sound-hint {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.4);
        }

        .loading-sound-hint svg {
          opacity: 0.5;
          animation: soundPulse 2s ease-in-out infinite;
        }

        @keyframes soundPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        .loading-year {
          font-size: 11px;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.3);
        }

        @media (max-width: 768px) {
          .loading-logo-animated {
            font-size: clamp(24px, 7vw, 48px);
          }

          .loading-progress-premium {
            width: 260px;
          }

          .loading-footer {
            bottom: 24px;
            left: 24px;
            right: 24px;
            flex-direction: column;
            gap: 16px;
          }

          .loading-sound-hint {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
