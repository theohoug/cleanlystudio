/**
 * @component KonamiCode
 * @description Multiple Easter eggs - Konami code, secret words, logo clicks
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

const SECRET_WORDS: { [key: string]: { message: string; emoji: string } } = {
  "awwwards": { message: "AWWWARDS MODE ACTIVATED!", emoji: "🏆" },
  "theo": { message: "HELLO THÉO!", emoji: "👋" },
  "matrix": { message: "FOLLOW THE WHITE RABBIT", emoji: "🐇" },
  "creative": { message: "CREATIVITY UNLOCKED!", emoji: "🎨" },
};

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
  const [currentMessage, setCurrentMessage] = useState({ text: "", emoji: "" });
  const [matrixMode, setMatrixMode] = useState(false);
  const keysRef = useRef<string[]>([]);
  const typedCharsRef = useRef<string>("");
  const animationRef = useRef<number | null>(null);
  const logoClicksRef = useRef<number>(0);
  const lastClickRef = useRef<number>(0);

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

  const triggerEasterEgg = useCallback((message: string, emoji: string, isMatrix = false) => {
    setActivated(true);
    setShowMessage(true);
    setCurrentMessage({ text: message, emoji });
    setMatrixMode(isMatrix);
    createParticles();

    if (typeof (window as any).playSuccessSound === "function") {
      (window as any).playSuccessSound();
    }

    requestAnimationFrame(animateParticles);
  }, [createParticles, animateParticles]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activated) return;

      // Konami code detection
      keysRef.current = [...keysRef.current, e.code].slice(-10);
      if (keysRef.current.join(",") === KONAMI_CODE.join(",")) {
        keysRef.current = [];
        typedCharsRef.current = "";
        triggerEasterEgg("KONAMI CODE ACTIVATED!", "🎮");
        return;
      }

      // Secret words detection (only letters)
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        typedCharsRef.current = (typedCharsRef.current + e.key.toLowerCase()).slice(-10);

        for (const [word, config] of Object.entries(SECRET_WORDS)) {
          if (typedCharsRef.current.endsWith(word)) {
            typedCharsRef.current = "";
            keysRef.current = [];
            triggerEasterEgg(config.message, config.emoji, word === "matrix");
            return;
          }
        }
      }
    },
    [activated, triggerEasterEgg]
  );

  // Logo click easter egg (7 clicks)
  useEffect(() => {
    const logo = document.querySelector(".nav-logo");
    if (!logo) return;

    const handleLogoClick = () => {
      const now = Date.now();
      if (now - lastClickRef.current > 2000) {
        logoClicksRef.current = 0;
      }
      lastClickRef.current = now;
      logoClicksRef.current++;

      if (logoClicksRef.current >= 7 && !activated) {
        logoClicksRef.current = 0;
        triggerEasterEgg("DEVELOPER MODE!", "👨‍💻");
      }
    };

    logo.addEventListener("click", handleLogoClick);
    return () => logo.removeEventListener("click", handleLogoClick);
  }, [activated, triggerEasterEgg]);

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
          <span className="konami-text">{currentMessage.emoji} {currentMessage.text} {currentMessage.emoji}</span>
          <span className="konami-subtext">You found a secret!</span>
        </div>
      )}

      {matrixMode && (
        <div className="matrix-rain">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="matrix-column" style={{ left: `${i * 5}%`, animationDelay: `${Math.random() * 2}s` }}>
              {Array.from({ length: 20 }).map((_, j) => (
                <span key={j} style={{ animationDelay: `${j * 0.1}s` }}>
                  {String.fromCharCode(0x30A0 + Math.random() * 96)}
                </span>
              ))}
            </div>
          ))}
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

        .matrix-rain {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: -1;
        }

        .matrix-column {
          position: absolute;
          top: -100%;
          display: flex;
          flex-direction: column;
          animation: matrixFall 4s linear infinite;
        }

        .matrix-column span {
          color: #0f0;
          font-family: monospace;
          font-size: 20px;
          text-shadow: 0 0 10px #0f0;
          opacity: 0;
          animation: matrixFade 0.5s ease forwards;
        }

        @keyframes matrixFall {
          0% { transform: translateY(0); }
          100% { transform: translateY(200vh); }
        }

        @keyframes matrixFade {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
