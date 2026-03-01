/**
 * @file agence-web-rouen/page.tsx
 * @description SEO landing page — Web agency in Rouen
 * @author Cleanlystudio
 */

import type { Metadata } from 'next'
import SEOLanding from '@/components/SEOLanding'

export const metadata: Metadata = {
  title: 'Agence Web Rouen | Création Site Internet Seine-Maritime',
  description: 'Agence web à Rouen spécialisée en création de sites internet professionnels dès 97€/mois. Design premium pour entreprises de Seine-Maritime. 30 jours gratuits.',
  alternates: { canonical: 'https://cleanlystudio.pro/agence-web-rouen/' },
  openGraph: {
    title: 'Agence Web Rouen — Seine-Maritime | Cleanly Studio',
    description: 'Création de sites web professionnels à Rouen et en Seine-Maritime.',
    url: 'https://cleanlystudio.pro/agence-web-rouen/',
  },
}

export default function Page() {
  return (
    <SEOLanding
      label="Rouen & Seine-Maritime"
      title={'Votre site web professionnel\nà Rouen'}
      subtitle="Agence web normande au service des entreprises rouennaises. Sites sur-mesure, rapides et optimisés pour le référencement local en Seine-Maritime."
      painPoints={[
        { title: 'Dominez le marché rouennais', desc: 'Apparaissez en tête des résultats Google quand un Rouennais recherche vos services. SEO local ciblé Seine-Maritime.' },
        { title: 'Un site qui reflète votre ambition', desc: 'Rouen est une ville dynamique. Votre site doit être à la hauteur : moderne, rapide et professionnel.' },
        { title: 'Budget maîtrisé, qualité maximale', desc: 'Dès 97€/mois tout compris : design, hébergement, maintenance, mises à jour. Pas de surprise sur la facture.' },
        { title: 'Support de proximité', desc: 'Votre agence est en Normandie, pas à l\'autre bout de la France. Échanges rapides, réactivité garantie.' },
      ]}
      benefits={[
        { stat: '+50%', label: 'Clients locaux' },
        { stat: 'Top 3', label: 'Google Rouen' },
        { stat: '97€', label: '/mois HT' },
        { stat: '2 sem', label: 'Livraison' },
      ]}
      breadcrumbName="Agence web Rouen"
      breadcrumbUrl="https://cleanlystudio.pro/agence-web-rouen/"
    />
  )
}
