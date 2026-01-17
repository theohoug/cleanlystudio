/**
 * @component KonamiCode
 * @description Easter egg - Konami code activates special effects
 * @author Cleanlystudio
 */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export default function KonamiCode() {
  const [activated, setActivated] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const keysRef = useRef<string[]>([]);
  const animationRef = useRef<number | null>(null);

  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96f", "#ffd93d", "#6bcb77", "#ff8fab"];

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 150; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
    setParticles(newParticles);
  }, []);

  const animateParticles = useCallback(() => {
    setParticles((prev) => {
      const updated = prev
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1,
          rotation: p.rotation + p.rotationSpeed,
        }))
        .filter((p) => p.y < window.innerHeight + 50);

      if (updated.length > 0) {
        animationRef.current = requestAnimationFrame(animateParticles);
      } else {
        setActivated(false);
        setShowMessage(false);
      }

      return updated;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activated) return;

      keysRef.current = [...keysRef.current, e.code].slice(-10);

      if (keysRef.current.join(",") === KONAMI_CODE.join(",")) {
        setActivated(true);
        setShowMessage(true);
        keysRef.current = [];
        createParticles();

        if (typeof (window as any).playSuccessSound === "function") {
          (window as any).playSuccessSound();
        }

        requestAnimationFrame(animateParticles);
      }
    },
    [activated, createParticles, animateParticles]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleKeyDown]);

  if (!activated) return null;

  return (
    <div className="konami-container">
      {showMessage && (
        <div className="konami-message">
          <span className="konami-text">🎮 KONAMI CODE ACTIVATED! 🎮</span>
          <span className="konami-subtext">You found the secret!</span>
        </div>
      )}

      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}

      <style jsx>{`
        .konami-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99999;
          overflow: hidden;
        }

        .konami-message {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          animation: messageIn 0.5s ease-out;
        }

        @keyframes messageIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .konami-text {
          display: block;
          font-size: clamp(24px, 5vw, 48px);
          font-weight: 700;
          color: #fff;
          text-shadow:
            0 0 20px rgba(255, 107, 107, 0.8),
            0 0 40px rgba(78, 205, 196, 0.6),
            0 0 60px rgba(150, 102, 255, 0.4);
          letter-spacing: 0.05em;
          animation: textGlow 0.5s ease-in-out infinite alternate;
        }

        @keyframes textGlow {
          from {
            text-shadow:
              0 0 20px rgba(255, 107, 107, 0.8),
              0 0 40px rgba(78, 205, 196, 0.6),
              0 0 60px rgba(150, 102, 255, 0.4);
          }
          to {
            text-shadow:
              0 0 30px rgba(255, 107, 107, 1),
              0 0 60px rgba(78, 205, 196, 0.8),
              0 0 80px rgba(150, 102, 255, 0.6);
          }
        }

        .konami-subtext {
          display: block;
          margin-top: 12px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .confetti {
          position: absolute;
          border-radius: 2px;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
