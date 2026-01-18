/**
 * @component LoadingScreen
 * @description Premium loading screen with 3D loader, glassmorphism & memorable effects
 * @author Cleanlystudio
 */
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useProgress } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import * as THREE from "three";

interface LoadingScreenProps {
  onComplete: () => void;
}

const MIN_LOAD_TIME = 1500;

function Loader3D({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particlesCount = 100;
  const positions = new Float32Array(particlesCount * 3);
  const scales = new Float32Array(particlesCount);

  for (let i = 0; i < particlesCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 1.5 + Math.random() * 0.5;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    scales[i] = Math.random();
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.3;
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }

    if (innerRef.current) {
      innerRef.current.rotation.x = time * 0.5;
      innerRef.current.rotation.z = time * 0.3;
      const scale = 0.3 + (progress / 100) * 0.4;
      innerRef.current.scale.setScalar(scale);
    }

    if (outerRef.current) {
      outerRef.current.rotation.x = -time * 0.2;
      outerRef.current.rotation.y = time * 0.1;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        const dist = Math.sqrt(x * x + y * y + z * z);
        const newDist = 1.5 + Math.sin(time + i * 0.1) * 0.2;
        const scale = newDist / dist;

        positions[i3] *= scale;
        positions[i3 + 1] *= scale;
        positions[i3 + 2] *= scale;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner core - grows with progress */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Outer shell */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Orbiting ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      {/* Second ring */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.1, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>

      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#ffffff"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<"loading" | "ready" | "exit">("loading");
  const [canExit, setCanExit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const loader3dRef = useRef<HTMLDivElement>(null);
  const glassCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logoRef.current || !glassCardRef.current || !loader3dRef.current) return;

    const letters = logoRef.current.querySelectorAll(".letter");

    // 3D loader - visible immediately, subtle fade in
    gsap.fromTo(loader3dRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );

    // Glass card entrance - faster
    gsap.fromTo(glassCardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.2 }
    );

    // Letters with wave effect - faster
    gsap.fromTo(letters,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.03,
        ease: "power3.out",
        delay: 0.3
      }
    );

    // Continuous letter glow pulse
    gsap.to(letters, {
      textShadow: "0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1
    });

  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanExit(true);
    }, MIN_LOAD_TIME);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (progress === 100 && !active && canExit) {
      setPhase("ready");

      setTimeout(() => {
        setPhase("exit");

        if (containerRef.current && logoRef.current && glassCardRef.current && loader3dRef.current) {
          const tl = gsap.timeline({
            onComplete: () => {
              setShow(false);
              onComplete();
            }
          });

          // Epic exit animation
          tl.to(loader3dRef.current, {
            scale: 2,
            opacity: 0,
            duration: 0.8,
            ease: "power2.in"
          })
          .to(logoRef.current.querySelectorAll(".letter"), {
            y: -60,
            opacity: 0,
            rotateY: 60,
            duration: 0.5,
            stagger: 0.02,
            ease: "power3.in"
          }, "-=0.6")
          .to(glassCardRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in"
          }, "-=0.4")
          .to(containerRef.current, {
            scale: 1.05,
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut"
          }, "-=0.2");
        }
      }, 600);
    }
  }, [progress, active, canExit, onComplete]);

  if (!show) return null;

  const loadingSteps = [
    { threshold: 0, text: "Initialisation", icon: "⚡" },
    { threshold: 25, text: "Chargement des assets", icon: "📦" },
    { threshold: 50, text: "Construction du monde", icon: "🌍" },
    { threshold: 75, text: "Préparation de l'expérience", icon: "✨" },
    { threshold: 100, text: "Prêt", icon: "🚀" },
  ];

  const currentStepIndex = loadingSteps.reduce((acc, item, index) =>
    progress >= item.threshold ? index : acc, 0
  );
  const currentText = loadingSteps[currentStepIndex].text;

  return (
    <div ref={containerRef} className="loading-screen-premium">
      {/* Animated background */}
      <div className="loading-bg-animated" />

      {/* 3D Loader */}
      <div ref={loader3dRef} className="loader-3d-container">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <Suspense fallback={null}>
            <Loader3D progress={progress} />
          </Suspense>
        </Canvas>
      </div>

      {/* Glass card with content */}
      <div ref={glassCardRef} className="loading-glass-card">
        {/* Logo */}
        <div ref={logoRef} className="loading-logo-3d">
          {"CLEANLY".split("").map((char, i) => (
            <span key={i} className="letter letter-main">{char}</span>
          ))}
          <span className="letter-space" />
          {"STUDIO".split("").map((char, i) => (
            <span key={i + 7} className="letter letter-accent">{char}</span>
          ))}
        </div>

        {/* Tagline */}
        <div className="loading-tagline">
          Crafting Digital Experiences
        </div>

        {/* Visual step indicators */}
        <div className="loading-steps">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={`step-indicator ${index <= currentStepIndex ? 'active' : ''} ${index === currentStepIndex ? 'current' : ''}`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-connector" />
            </div>
          ))}
        </div>

        {/* Progress section */}
        <div ref={progressRef} className="loading-progress-glass">
          <div className="progress-status">
            <span className="progress-text">{currentText}</span>
            <span className="progress-percent">{Math.round(progress)}%</span>
          </div>

          <div className="progress-track">
            <div className="progress-track-bg" />
            <div
              className="progress-track-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="progress-track-glow"
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>

        {/* Ready state */}
        {phase === "ready" && (
          <div className="loading-ready-state">
            <div className="ready-ring">
              <div className="ready-ring-inner" />
            </div>
            <span>Lancement de l'expérience</span>
          </div>
        )}

        {/* Glass reflections */}
        <div className="glass-reflection" />
      </div>

      {/* Footer */}
      <div className="loading-footer-premium">
        <div className="footer-right">
          <span className="footer-year">© 2025</span>
        </div>
      </div>

      <style jsx>{`
        .loading-screen-premium {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #030303;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .loading-bg-animated {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(100, 100, 150, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(150, 150, 200, 0.06) 0%, transparent 50%);
        }

        .loader-3d-container {
          width: 280px;
          height: 280px;
          margin-bottom: 40px;
        }

        .loading-glass-card {
          position: relative;
          padding: 40px 60px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          text-align: center;
          overflow: hidden;
        }

        .glass-reflection {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%);
          border-radius: 20px 20px 0 0;
          pointer-events: none;
        }

        .loading-logo-3d {
          font-size: clamp(28px, 6vw, 48px);
          font-weight: 200;
          letter-spacing: 0.12em;
          margin-bottom: 12px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          perspective: 800px;
        }

        .letter {
          display: inline-block;
          transform-style: preserve-3d;
          text-shadow: 0 0 20px rgba(255,255,255,0.3);
        }

        .letter-main {
          color: #fff;
        }

        .letter-accent {
          color: rgba(255,255,255,0.5);
        }

        .letter-space {
          width: 0.2em;
        }

        .loading-tagline {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: rgba(255,255,255,0.35);
          margin-bottom: 20px;
        }

        .loading-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 24px;
        }

        .step-indicator {
          display: flex;
          align-items: center;
        }

        .step-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          opacity: 0.3;
          transform: scale(0.9);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          filter: grayscale(1);
        }

        .step-indicator.active .step-icon {
          opacity: 1;
          transform: scale(1);
          filter: grayscale(0);
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.06);
        }

        .step-indicator.current .step-icon {
          animation: stepPulse 1.5s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(255,255,255,0.2);
        }

        @keyframes stepPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(255,255,255,0.2); }
          50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(255,255,255,0.4); }
        }

        .step-connector {
          width: 24px;
          height: 2px;
          background: rgba(255,255,255,0.08);
          transition: background 0.4s ease;
        }

        .step-indicator:last-child .step-connector {
          display: none;
        }

        .step-indicator.active .step-connector {
          background: rgba(255,255,255,0.25);
        }

        .loading-progress-glass {
          width: 260px;
          margin: 0 auto;
          padding: 16px 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
        }

        .progress-status {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .progress-text {
          color: rgba(255,255,255,0.4);
        }

        .progress-percent {
          color: #fff;
          font-variant-numeric: tabular-nums;
          font-weight: 500;
        }

        .progress-track {
          position: relative;
          height: 2px;
          border-radius: 1px;
          overflow: visible;
        }

        .progress-track-bg {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.08);
          border-radius: 1px;
        }

        .progress-track-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: #fff;
          border-radius: 1px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 15px rgba(255,255,255,0.5);
        }

        .progress-track-glow {
          position: absolute;
          top: 50%;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .loading-ready-state {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.7);
          animation: fadeInUp 0.5s ease;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ready-ring {
          position: relative;
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ready-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid rgba(74, 222, 128, 0.3);
          animation: readyRingPulse 1.5s ease-in-out infinite;
        }

        .ready-ring-inner {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 15px rgba(74, 222, 128, 0.8);
        }

        @keyframes readyRingPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.8); opacity: 0; }
        }

        .loading-footer-premium {
          position: absolute;
          bottom: 24px;
          left: 30px;
          right: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sound-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sound-bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 14px;
        }

        .sound-bars span {
          width: 2px;
          background: rgba(255,255,255,0.35);
          border-radius: 1px;
          animation: soundBar 1s ease-in-out infinite;
        }

        .sound-bars span:nth-child(1) { height: 40%; animation-delay: 0s; }
        .sound-bars span:nth-child(2) { height: 70%; animation-delay: 0.2s; }
        .sound-bars span:nth-child(3) { height: 50%; animation-delay: 0.4s; }
        .sound-bars span:nth-child(4) { height: 30%; animation-delay: 0.6s; }

        @keyframes soundBar {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }

        .sound-text {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.3);
        }

        .footer-year {
          font-size: 10px;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.2);
        }

        @media (max-width: 768px) {
          .loader-3d-container {
            width: 200px;
            height: 200px;
            margin-bottom: 30px;
          }

          .loading-glass-card {
            padding: 30px 35px;
            margin: 0 20px;
          }

          .loading-logo-3d {
            font-size: clamp(22px, 6vw, 36px);
          }

          .loading-tagline {
            font-size: 8px;
            letter-spacing: 0.3em;
            margin-bottom: 16px;
          }

          .loading-steps {
            margin-bottom: 16px;
          }

          .step-icon {
            width: 26px;
            height: 26px;
            font-size: 12px;
          }

          .step-connector {
            width: 16px;
          }

          .loading-progress-glass {
            width: 100%;
            max-width: 240px;
            padding: 14px 16px;
          }

          .loading-footer-premium {
            bottom: 16px;
            left: 16px;
            right: 16px;
          }

          .sound-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
