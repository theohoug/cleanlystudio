/**
 * @file ouestpark/page.tsx
 * @description Ouest Park Festival - Case Study Page
 * @author Cleanlystudio
 */
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OuestParkPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#08080f] text-white overflow-hidden">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      {/* Gradient effects */}
      <div
        className="fixed top-0 left-0 w-[800px] h-[1200px] pointer-events-none z-0"
        style={{
          background: "linear-gradient(135deg, rgba(0, 200, 255, 0.12) 0%, rgba(100, 50, 200, 0.06) 30%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-[600px] h-[600px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(255, 0, 110, 0.15) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white/60 hover:text-white transition text-sm tracking-widest uppercase">
            ← Cleanlystudio
          </Link>
          <div className="font-display text-xl tracking-wider">
            OUEST<span className="text-[#ff006e]">PARK</span>
          </div>
          <a
            href="mailto:contact@cleanlystudio.pro?subject=Demo Ouest Park"
            className="px-4 py-2 bg-[#ff006e] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#ff3d8a] transition"
          >
            Demander une démo
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10">
        <p className="text-[#ff006e] text-sm uppercase tracking-[0.3em] mb-6 font-mono">
          Festival Music • 2026
        </p>
        <h1
          className="font-display text-6xl md:text-8xl lg:text-9xl text-center leading-[0.9] mb-8"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out'
          }}
        >
          OUEST<br/>
          <span className="text-[#ff006e]">PARK</span>
        </h1>
        <p className="text-white/50 text-lg md:text-xl text-center max-w-2xl mb-12">
          Concept de site web immersif pour un festival de musique électronique.
          Interface 3D interactive avec programmation dynamique.
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {['Next.js', 'Three.js', 'GSAP', 'WebGL', 'Tailwind'].map((tech) => (
            <span
              key={tech}
              className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 tracking-wider"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Preview mockup */}
        <div
          className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden border border-white/10"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a12 100%)',
            boxShadow: '0 50px 100px -20px rgba(255, 0, 110, 0.2)'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#ff006e] to-[#7b2cbf] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <p className="text-white/40 text-sm uppercase tracking-widest">Preview Interactive</p>
            </div>
          </div>

          {/* Fake browser chrome */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-black/50 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <div className="flex-1 mx-4 h-5 bg-white/5 rounded text-[10px] text-white/30 flex items-center justify-center">
              ouestpark.fr
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-20">
            Fonctionnalités <span className="text-[#ff006e]">Clés</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Vinyle 3D Interactif', desc: 'Navigation immersive avec un vinyle qui tourne et révèle la programmation.' },
              { title: 'Programmation Dynamique', desc: 'Filtrage par jour avec animations fluides et cartes artistes.' },
              { title: 'Design Néon', desc: 'Esthétique festival avec effets de lumière et glassmorphism.' }
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 bg-white/[0.02] border border-white/10 rounded-xl hover:border-[#ff006e]/30 transition-colors"
              >
                <div className="w-12 h-12 mb-6 rounded-lg bg-gradient-to-br from-[#ff006e]/20 to-[#7b2cbf]/20 flex items-center justify-center text-[#ff006e] text-xl">
                  0{i + 1}
                </div>
                <h3 className="font-display text-xl mb-3">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl mb-6">
            Intéressé par ce type de <span className="text-[#ff006e]">projet</span> ?
          </h2>
          <p className="text-white/50 text-lg mb-12">
            Je crée des expériences web immersives sur mesure pour les festivals, événements et marques ambitieuses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@cleanlystudio.pro?subject=Projet similaire à Ouest Park"
              className="px-8 py-4 bg-[#ff006e] text-white font-bold uppercase tracking-widest rounded-full hover:bg-[#ff3d8a] transition"
            >
              Me contacter
            </a>
            <Link
              href="/"
              className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest rounded-full hover:bg-white/5 transition"
            >
              Voir d'autres projets
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white/30 text-xs">
          <span>© 2025 Cleanlystudio</span>
          <span>Concept Demo • Non affilié à un événement réel</span>
        </div>
      </footer>
    </div>
  );
}
