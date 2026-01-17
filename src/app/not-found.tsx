/**
 * @component NotFound
 * @description Premium 404 page with immersive glitch effect
 * @author Cleanlystudio
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!numbersRef.current || !glitchRef.current) return;

    const digits = numbersRef.current.querySelectorAll(".digit");
    const glitchLayers = glitchRef.current.querySelectorAll(".glitch-layer");

    // Entry animation
    gsap.fromTo(digits,
      { y: 200, opacity: 0, rotateX: -90 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.3
      }
    );

    // Continuous glitch effect
    const glitchTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 });

    glitchTimeline
      .to(glitchLayers, {
        x: "random(-10, 10)",
        duration: 0.1,
        stagger: 0.02
      })
      .to(glitchLayers, {
        x: 0,
        duration: 0.1
      })
      .to(glitchLayers, {
        opacity: 0.8,
        duration: 0.05
      })
      .to(glitchLayers, {
        opacity: 1,
        duration: 0.05
      });

    // Random flicker
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        gsap.to(digits, {
          opacity: 0.5,
          duration: 0.05,
          yoyo: true,
          repeat: 1
        });
      }
    }, 2000);

    return () => clearInterval(flickerInterval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="not-found-container">
      {/* Animated background */}
      <div className="not-found-bg">
        <div className="grid-overlay" />
        <div className="noise-overlay" />
        <div className="gradient-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
      </div>

      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="not-found-content">
        {/* Glitch 404 */}
        <div
          ref={glitchRef}
          className="glitch-container"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
          }}
        >
          <div className="glitch-layer glitch-layer-1">404</div>
          <div className="glitch-layer glitch-layer-2">404</div>
          <div ref={numbersRef} className="numbers-main">
            <span className="digit">4</span>
            <span className="digit digit-zero">0</span>
            <span className="digit">4</span>
          </div>
        </div>

        {/* Message */}
        <div className="not-found-message">
          <h2 className="message-title">Page introuvable</h2>
          <p className="message-text">
            Cette page s'est perdue dans le void digital
          </p>
        </div>

        {/* CTA */}
        <Link href="/" className="back-home-btn">
          <span className="btn-bg" />
          <span className="btn-text">Retour à l'accueil</span>
          <span className="btn-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </Link>

        {/* Decorative elements */}
        <div className="deco-lines">
          <div className="deco-line line-h-1" />
          <div className="deco-line line-h-2" />
          <div className="deco-line line-v-1" />
          <div className="deco-line line-v-2" />
        </div>
      </div>

      {/* Corner branding */}
      <div className="corner-brand">
        <span>CLEANLY</span>
        <span className="brand-accent">STUDIO</span>
      </div>

      <style jsx>{`
        .not-found-container {
          position: fixed;
          inset: 0;
          background: #050505;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: var(--font-sans, system-ui, sans-serif);
        }

        .not-found-bg {
          position: absolute;
          inset: 0;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
        }

        .gradient-orbs {
          position: absolute;
          inset: 0;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          animation: orbFloat 10s ease-in-out infinite;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          top: -10%;
          left: -10%;
          background: rgba(255, 50, 50, 0.1);
          animation-delay: 0s;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          bottom: -5%;
          right: -5%;
          background: rgba(100, 100, 255, 0.08);
          animation-delay: -3s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.05);
          animation-delay: -6s;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: particleFloat linear infinite;
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .not-found-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .glitch-container {
          position: relative;
          margin-bottom: 40px;
          transition: transform 0.3s ease-out;
        }

        .numbers-main {
          font-size: clamp(120px, 25vw, 280px);
          font-weight: 100;
          letter-spacing: -0.05em;
          color: #fff;
          display: flex;
          justify-content: center;
          perspective: 1000px;
        }

        .digit {
          display: inline-block;
          transform-style: preserve-3d;
          text-shadow:
            0 0 40px rgba(255,255,255,0.3),
            0 0 80px rgba(255,255,255,0.1);
        }

        .digit-zero {
          color: rgba(255, 255, 255, 0.4);
          animation: zeroPulse 3s ease-in-out infinite;
        }

        @keyframes zeroPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        .glitch-layer {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          font-size: clamp(120px, 25vw, 280px);
          font-weight: 100;
          letter-spacing: -0.05em;
          text-align: center;
          pointer-events: none;
        }

        .glitch-layer-1 {
          color: rgba(255, 0, 0, 0.3);
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translateX(-3px);
        }

        .glitch-layer-2 {
          color: rgba(0, 255, 255, 0.3);
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
          transform: translateX(3px);
        }

        .not-found-message {
          margin-bottom: 50px;
        }

        .message-title {
          font-size: 24px;
          font-weight: 300;
          color: #fff;
          margin-bottom: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .message-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.05em;
        }

        .back-home-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          text-decoration: none;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .btn-bg {
          position: absolute;
          inset: 0;
          background: #fff;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .back-home-btn:hover .btn-bg {
          transform: scaleX(1);
        }

        .btn-text, .btn-arrow {
          position: relative;
          z-index: 1;
          transition: color 0.4s ease;
        }

        .back-home-btn:hover .btn-text,
        .back-home-btn:hover .btn-arrow {
          color: #000;
        }

        .btn-arrow {
          display: flex;
          transform: translateX(0);
          transition: transform 0.4s ease, color 0.4s ease;
        }

        .back-home-btn:hover .btn-arrow {
          transform: translateX(5px);
        }

        .deco-lines {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .deco-line {
          position: absolute;
          background: rgba(255, 255, 255, 0.03);
        }

        .line-h-1, .line-h-2 {
          height: 1px;
          left: 0;
          right: 0;
        }

        .line-h-1 { top: 20%; }
        .line-h-2 { bottom: 20%; }

        .line-v-1, .line-v-2 {
          width: 1px;
          top: 0;
          bottom: 0;
        }

        .line-v-1 { left: 20%; }
        .line-v-2 { right: 20%; }

        .corner-brand {
          position: fixed;
          bottom: 40px;
          left: 40px;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          display: flex;
          gap: 8px;
        }

        .corner-brand span {
          color: rgba(255, 255, 255, 0.3);
        }

        .brand-accent {
          color: rgba(255, 255, 255, 0.15) !important;
        }

        @media (max-width: 768px) {
          .numbers-main {
            font-size: clamp(80px, 20vw, 150px);
          }

          .glitch-layer {
            font-size: clamp(80px, 20vw, 150px);
          }

          .message-title {
            font-size: 18px;
          }

          .message-text {
            font-size: 12px;
          }

          .back-home-btn {
            padding: 14px 24px;
          }

          .corner-brand {
            bottom: 20px;
            left: 20px;
            font-size: 9px;
          }

          .deco-lines {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
