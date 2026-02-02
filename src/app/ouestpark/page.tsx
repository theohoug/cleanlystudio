/**
 * @file ouestpark/page.tsx
 * @description Ouest Park Festival - Demo Project Page
 * @author Cleanlystudio
 */
"use client";

import { useEffect } from 'react';

export default function OuestParkPage() {
  useEffect(() => {
    // Redirect to the Ouest Park demo on Vercel
    window.location.href = 'https://ouest-park.cleanlystudio.com';
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#08080f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          OUEST<span style={{ color: '#ff006e' }}>PARK</span>
        </h1>
        <p style={{ opacity: 0.6 }}>Redirection en cours...</p>
      </div>
    </div>
  );
}
