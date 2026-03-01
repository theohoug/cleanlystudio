/**
 * @file agence-web-caen/page.tsx
 * @description SEO landing page — Web agency in Caen
 * @author Cleanlystudio
 */

import type { Metadata } from 'next'
import SEOLanding from '@/components/SEOLanding'

export const metadata: Metadata = {
  title: 'Agence Web Caen | Création Site Internet Calvados',
  description: 'Agence web à Caen spécialisée en création de sites internet professionnels dès 97€/mois. Design premium pour entreprises du Calvados. 30 jours gratuits.',
  alternates: { canonical: 'https://cleanlystudio.pro/agence-web-caen/' },
  openGraph: {
    title: 'Agence Web Caen — Calvados | Cleanly Studio',
    description: 'Création de sites web professionnels à Caen et dans le Calvados.',
    url: 'https://cleanlystudio.pro/agence-web-caen/',
  },
}

export default function Page() {
  return (
    <SEOLanding
      label="Caen & Calvados"
      title={'Création de site web\nprofessionnel à Caen'}
      subtitle="Votre agence web de proximité pour les entreprises caennaises et du Calvados. Sites modernes, performants et optimisés pour le référencement local."
      painPoints={[
        { title: 'Visible par les Caennais', desc: 'Votre site apparaît en priorité quand un habitant de Caen recherche vos services sur Google. SEO local optimisé pour le Calvados.' },
        { title: 'Une alternative aux agences parisiennes', desc: 'Qualité premium sans le budget parisien. Un site professionnel adapté aux réalités des entreprises normandes.' },
        { title: 'Réactif et disponible', desc: 'Un interlocuteur unique qui répond sous 24h. Pas de ticket support impersonnel, un vrai échange humain.' },
        { title: 'Adapté au marché local', desc: 'Que vous soyez restaurateur à Ouistreham, commerçant rue Saint-Pierre ou artisan à Hérouville, on connaît votre marché.' },
      ]}
      benefits={[
        { stat: '+45%', label: 'Visibilité locale' },
        { stat: 'Top 3', label: 'Google Caen' },
        { stat: '97€', label: '/mois HT' },
        { stat: '2 sem', label: 'Livraison' },
      ]}
      breadcrumbName="Agence web Caen"
      breadcrumbUrl="https://cleanlystudio.pro/agence-web-caen/"
    />
  )
}
