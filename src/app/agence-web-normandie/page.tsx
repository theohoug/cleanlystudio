/**
 * @file agence-web-normandie/page.tsx
 * @description SEO landing page — Web agency in Normandie
 * @author Cleanlystudio
 */

import type { Metadata } from 'next'
import SEOLanding from '@/components/SEOLanding'

export const metadata: Metadata = {
  title: 'Agence Web Normandie | Création Site Internet Professionnel',
  description: 'Agence web en Normandie spécialisée en création de sites internet professionnels dès 97€/mois. Design premium, hébergement inclus. 30 jours d\'essai gratuit.',
  alternates: { canonical: 'https://cleanlystudio.pro/agence-web-normandie/' },
  openGraph: {
    title: 'Agence Web Normandie | Cleanly Studio',
    description: 'Création de sites web professionnels en Normandie. Design premium, hébergement et maintenance inclus.',
    url: 'https://cleanlystudio.pro/agence-web-normandie/',
  },
}

export default function Page() {
  return (
    <SEOLanding
      label="Normandie"
      title={'Votre agence web\nen Normandie'}
      subtitle="Basés à Périers dans la Manche, nous créons des sites web professionnels pour les entreprises normandes. Proximité, réactivité et qualité premium."
      painPoints={[
        { title: 'Une agence qui comprend votre territoire', desc: 'Installés en Normandie, nous connaissons le tissu économique local. Commerçants, artisans, professions libérales : on parle le même langage.' },
        { title: 'Pas besoin d\'aller à Paris', desc: 'Un site premium ne nécessite pas une agence parisienne à 5000€. Vous avez la même qualité à un prix juste, avec un interlocuteur disponible.' },
        { title: 'Optimisé pour le SEO local', desc: 'Votre site est conçu pour apparaître dans les recherches locales. Vos clients normands vous trouvent en premier sur Google.' },
        { title: 'Un accompagnement de proximité', desc: 'Échanges en visio ou par téléphone, réponse sous 24h. Un vrai partenaire digital, pas un prestataire distant.' },
      ]}
      benefits={[
        { stat: '50+', label: 'Sites créés' },
        { stat: 'Top 3', label: 'Google local' },
        { stat: '24h', label: 'Temps de réponse' },
        { stat: '2 sem', label: 'Livraison' },
      ]}
      breadcrumbName="Agence web Normandie"
      breadcrumbUrl="https://cleanlystudio.pro/agence-web-normandie/"
    />
  )
}
