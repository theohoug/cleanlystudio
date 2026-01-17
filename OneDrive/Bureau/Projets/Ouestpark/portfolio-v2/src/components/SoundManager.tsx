/**
 * @component SoundManager
 * @description Premium Web Audio API sound engine - Awwwards level
 * @author Cleanlystudio
 */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface SoundManagerProps {
  isLoaded: boolean;
}

class PremiumAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGains: GainNode[] = [];
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private isPlaying = false;
  private initialized = false;

  async init() {
    if (this.initialized) return;

    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0;

    // Create reverb for spatial depth
    this.reverbNode = this.ctx.createConvolver();
    await this.createReverb();

    this.masterGain.connect(this.ctx.destination);
    this.initialized = true;
  }

  private async createReverb() {
    if (!this.ctx || !this.reverbNode) return;

    const length = this.ctx.sampleRate * 2.5;
    const impulse = this.ctx.createBuffer(2, length, this.ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }

    this.reverbNode.buffer = impulse;
  }

  async startAmbient() {
    if (!this.ctx || !this.masterGain || this.isPlaying) return;
    this.isPlaying = true;

    // Rich harmonic frequencies for cinematic ambient
    const layers = [
      { freq: 55, gain: 0.12, type: "sine" as OscillatorType },      // A1 - Deep bass
      { freq: 82.5, gain: 0.08, type: "sine" as OscillatorType },    // E2 - Fifth
      { freq: 110, gain: 0.06, type: "sine" as OscillatorType },     // A2 - Octave
      { freq: 138.6, gain: 0.04, type: "triangle" as OscillatorType }, // C#3 - Major third
      { freq: 165, gain: 0.03, type: "sine" as OscillatorType },     // E3 - Fifth
      { freq: 220, gain: 0.02, type: "sine" as OscillatorType },     // A3 - High octave
    ];

    // LFO for subtle movement
    this.lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    this.lfo.frequency.value = 0.1;
    this.lfo.type = "sine";
    lfoGain.gain.value = 3;
    this.lfo.connect(lfoGain);
    this.lfo.start();

    // Dry/wet mix for reverb
    const dryGain = this.ctx.createGain();
    const wetGain = this.ctx.createGain();
    dryGain.gain.value = 0.7;
    wetGain.gain.value = 0.3;

    dryGain.connect(this.masterGain);
    if (this.reverbNode) {
      this.reverbNode.connect(wetGain);
      wetGain.connect(this.masterGain);
    }

    layers.forEach((layer, i) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = layer.type;
      osc.frequency.value = layer.freq;

      // Subtle frequency modulation
      lfoGain.connect(osc.frequency);

      oscGain.gain.value = layer.gain;

      // Low-pass filter for warmth
      filter.type = "lowpass";
      filter.frequency.value = 800 + (i * 200);
      filter.Q.value = 0.5;

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(dryGain);
      if (this.reverbNode) {
        oscGain.connect(this.reverbNode);
      }

      osc.start();
      this.oscillators.push(osc);
      this.ambientGains.push(oscGain);
    });

    // Smooth fade in
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 3);
  }

  stopAmbient() {
    if (!this.ctx || !this.masterGain) return;
    this.isPlaying = false;

    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      this.oscillators = [];
      this.ambientGains = [];
      if (this.lfo) {
        try { this.lfo.stop(); } catch {}
        this.lfo = null;
      }
    }, 1200);
  }

  playTransition() {
    if (!this.ctx) return;

    // Subtle cinematic whoosh - like air movement
    const duration = 0.6;
    const now = this.ctx.currentTime;

    // White noise burst filtered to sound like air
    const bufferSize = this.ctx.sampleRate * duration;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    // Bandpass filter for whoosh character
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(150, now + duration);
    filter.Q.value = 1;

    // Lowpass to soften
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 2000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);

    // Subtle low tone sweep
    const tone = this.ctx.createOscillator();
    const toneGain = this.ctx.createGain();
    tone.type = "sine";
    tone.frequency.setValueAtTime(80, now);
    tone.frequency.exponentialRampToValueAtTime(40, now + duration);
    toneGain.gain.setValueAtTime(0.03, now);
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.7);
    tone.connect(toneGain);
    toneGain.connect(this.ctx.destination);
    tone.start(now);
    tone.stop(now + duration);
  }

  playHover() {
    if (!this.ctx) return;

    // Subtle crystalline tick
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.value = 2400;
    osc2.type = "sine";
    osc2.frequency.value = 3200;

    filter.type = "highpass";
    filter.frequency.value = 1500;

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc2.start();
    osc.stop(this.ctx.currentTime + 0.1);
    osc2.stop(this.ctx.currentTime + 0.1);
  }

  playClick() {
    if (!this.ctx) return;

    // Satisfying click with body
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playSuccess() {
    if (!this.ctx) return;

    // Pleasant ascending chime
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 - Major chord

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      const startTime = this.ctx!.currentTime + (i * 0.1);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  }
}

export default function SoundManager({ isLoaded }: SoundManagerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<PremiumAudioEngine | null>(null);

  useEffect(() => {
    audioRef.current = new PremiumAudioEngine();
    return () => {
      audioRef.current?.stopAmbient();
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || hasInteracted) return;

    const startAudio = async () => {
      if (audioRef.current && !isMuted) {
        await audioRef.current.init();
        audioRef.current.startAmbient();
        setHasInteracted(true);
      }
    };

    const handleInteraction = () => {
      startAudio();
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("scroll", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [isLoaded, hasInteracted, isMuted]);

  const toggleSound = useCallback(async () => {
    if (!audioRef.current) return;

    await audioRef.current.init();

    if (isMuted) {
      audioRef.current.startAmbient();
    } else {
      audioRef.current.stopAmbient();
    }

    setIsMuted(!isMuted);
    setHasInteracted(true);
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      (window as any).playTransitionSound = () => {
        if (!isMuted && hasInteracted) audioRef.current?.playTransition();
      };
      (window as any).playHoverSound = () => {
        if (!isMuted && hasInteracted) audioRef.current?.playHover();
      };
      (window as any).playClickSound = () => {
        if (!isMuted && hasInteracted) audioRef.current?.playClick();
      };
      (window as any).playSuccessSound = () => {
        if (!isMuted && hasInteracted) audioRef.current?.playSuccess();
      };
    }
  }, [isMuted, hasInteracted]);

  if (!isLoaded) return null;

  return (
    <>
      <button
        onClick={toggleSound}
        className={`sound-toggle ${isMuted ? "muted" : ""} ${hasInteracted ? "interacted" : ""}`}
        aria-label={isMuted ? "Activer le son" : "Couper le son"}
        data-cursor="Sound"
      >
        <div className="sound-toggle-inner">
          {isMuted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </div>
        <div className="sound-bars">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </div>
      </button>

      <style jsx>{`
        .sound-toggle {
          position: fixed;
          bottom: 32px;
          left: 32px;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(12px);
          cursor: none;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .sound-toggle::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .sound-toggle:hover {
          border-color: rgba(255, 255, 255, 0.25);
          transform: scale(1.08);
          background: rgba(0, 0, 0, 0.6);
        }

        .sound-toggle:hover::before {
          opacity: 1;
        }

        .sound-toggle.interacted:not(.muted) {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .sound-toggle-inner {
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .sound-toggle.muted .sound-toggle-inner {
          opacity: 0.4;
        }

        .sound-bars {
          position: absolute;
          bottom: 8px;
          display: flex;
          gap: 2px;
          align-items: flex-end;
        }

        .bar {
          width: 2px;
          background: #fff;
          border-radius: 1px;
          transition: all 0.3s ease;
        }

        .bar:nth-child(1) { height: 8px; animation: bar1 0.5s ease-in-out infinite; }
        .bar:nth-child(2) { height: 12px; animation: bar2 0.5s ease-in-out infinite 0.1s; }
        .bar:nth-child(3) { height: 6px; animation: bar3 0.5s ease-in-out infinite 0.2s; }
        .bar:nth-child(4) { height: 10px; animation: bar4 0.5s ease-in-out infinite 0.3s; }

        .sound-toggle.muted .bar {
          animation: none;
          height: 2px;
          opacity: 0.3;
        }

        @keyframes bar1 { 0%, 100% { height: 8px; } 50% { height: 4px; } }
        @keyframes bar2 { 0%, 100% { height: 12px; } 50% { height: 6px; } }
        @keyframes bar3 { 0%, 100% { height: 6px; } 50% { height: 10px; } }
        @keyframes bar4 { 0%, 100% { height: 10px; } 50% { height: 5px; } }

        @media (max-width: 768px) {
          .sound-toggle {
            bottom: 20px;
            left: 20px;
            width: 44px;
            height: 44px;
            cursor: auto;
          }
        }
      `}</style>
    </>
  );
}
