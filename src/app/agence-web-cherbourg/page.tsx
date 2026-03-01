/**
 * @file agence-web-cherbourg/page.tsx
 * @description SEO landing page — Web agency in Cherbourg
 * @author Cleanlystudio
 */

import type { Metadata } from 'next'
import SEOLanding from '@/components/SEOLanding'

export const metadata: Metadata = {
  title: 'Agence Web Cherbourg | Création Site Internet Cotentin',
  description: 'Agence web à Cherbourg spécialisée en création de sites internet professionnels dès 97€/mois. Design premium pour entreprises du Cotentin. 30 jours gratuits.',
  alternates: { canonical: 'https://cleanlystudio.pro/agence-web-cherbourg/' },
  openGraph: {
    title: 'Agence Web Cherbourg — Cotentin | Cleanly Studio',
    description: 'Création de sites web professionnels à Cherbourg et dans le Cotentin.',
    url: 'https://cleanlystudio.pro/agence-web-cherbourg/',
  },
}

export default function Page() {
  return (
    <SEOLanding
      label="Cherbourg & Cotentin"
      title={'Création de site web\npro à Cherbourg'}
      subtitle="Agence web locale pour les professionnels du Cotentin. Un site moderne et performant qui attire vos clients de Cherbourg et ses environs."
      painPoints={[
        { title: 'Le Cotentin mérite du premium', desc: 'Fini les sites WordPress basiques. Offrez à votre entreprise cherbourgeoise un site web à la hauteur de votre savoir-faire.' },
        { title: 'Captez la clientèle locale', desc: 'Les habitants du Cotentin cherchent des pros sur Google. Un site optimisé SEO local vous place devant vos concurrents.' },
        { title: 'Votre agence est à côté', desc: 'Basés dans la Manche, nous sommes votre voisin digital. Disponibilité et réactivité, pas de prestataire distant.' },
        { title: 'Tout compris, sans surprise', desc: 'Design, hébergement, maintenance, SSL, mises à jour. Un seul abonnement mensuel à 97€ HT, c\'est tout.' },
      ]}
      benefits={[
        { stat: '+40%', label: 'Visibilité locale' },
        { stat: 'Top 3', label: 'Google Cotentin' },
        { stat: '97€', label: '/mois HT' },
        { stat: '2 sem', label: 'Livraison' },
      ]}
      breadcrumbName="Agence web Cherbourg"
      breadcrumbUrl="https://cleanlystudio.pro/agence-web-cherbourg/"
    />
  )
}
