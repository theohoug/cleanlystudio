/**
 * @file agence-web-saint-lo/page.tsx
 * @description SEO landing page — Web agency in Saint-Lô
 * @author Cleanlystudio
 */

import type { Metadata } from 'next'
import SEOLanding from '@/components/SEOLanding'

export const metadata: Metadata = {
  title: 'Agence Web Saint-Lô | Création Site Internet Manche',
  description: 'Agence web à Saint-Lô spécialisée en création de sites internet professionnels dès 97€/mois. Design premium pour entreprises de la Manche. 30 jours gratuits.',
  alternates: { canonical: 'https://cleanlystudio.pro/agence-web-saint-lo/' },
  openGraph: {
    title: 'Agence Web Saint-Lô — Manche | Cleanly Studio',
    description: 'Création de sites web professionnels à Saint-Lô et dans la Manche.',
    url: 'https://cleanlystudio.pro/agence-web-saint-lo/',
  },
}

export default function Page() {
  return (
    <SEOLanding
      label="Saint-Lô & Manche"
      title={'Votre agence web\nà Saint-Lô'}
      subtitle="Agence web manchoise pour les professionnels de Saint-Lô et de la Manche. Sites performants, design soigné et référencement local optimisé."
      painPoints={[
        { title: 'La Manche aussi a droit au premium', desc: 'Pas besoin d\'aller à Rennes ou Paris pour un site web de qualité. Votre agence est ici, dans la Manche.' },
        { title: 'Trouvé par vos voisins', desc: 'SEO local ciblé sur Saint-Lô et la Manche. Quand un client cherche vos services près de chez lui, c\'est vous qu\'il trouve.' },
        { title: 'Un partenaire qui vous connaît', desc: 'Nous travaillons avec les commerçants, artisans et professions libérales de la Manche. On comprend vos besoins.' },
        { title: 'Abordable et professionnel', desc: '97€ HT/mois tout compris. Un investissement accessible qui se rentabilise dès les premiers clients gagnés grâce à votre site.' },
      ]}
      benefits={[
        { stat: '+35%', label: 'Nouveaux clients' },
        { stat: 'Top 3', label: 'Google Manche' },
        { stat: '97€', label: '/mois HT' },
        { stat: '2 sem', label: 'Livraison' },
      ]}
      breadcrumbName="Agence web Saint-Lô"
      breadcrumbUrl="https://cleanlystudio.pro/agence-web-saint-lo/"
    />
  )
}
