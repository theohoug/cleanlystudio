/**
 * @file offres/layout.tsx
 * @description Layout with metadata for pricing page (client component needs separate metadata)
 * @author Cleanlystudio
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs Création Site Web Professionnel',
  description: 'Création de site web professionnel dès 97€/mois. 30 jours d\'essai gratuit, sans engagement. Design sur-mesure, hébergement, maintenance et support inclus.',
  alternates: {
    canonical: 'https://cleanlystudio.pro/offres/',
  },
  openGraph: {
    title: 'Tarifs Création Site Web Professionnel | Cleanly Studio',
    description: 'Sites web professionnels sur-mesure dès 97€/mois. 30 jours d\'essai gratuit.',
    url: 'https://cleanlystudio.pro/offres/',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export default function OffresLayout({ children }: { children: React.ReactNode }) {
  return children
}
