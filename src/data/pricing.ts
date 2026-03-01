/**
 * @file pricing.ts
 * @description Static pricing data for portfolio site
 * @author Cleanlystudio
 */

export interface Tier {
  id: 'mini' | 'recommande' | 'elite'
  name: string
  price: number
  tagline: string
  badge: string | null
  features: string[]
  expandedFeatures: string[]
}

export interface Addon {
  id: string
  title: string
  description: string
  price: number
}

export const TIERS: Tier[] = [
  {
    id: 'mini',
    name: 'Mini',
    price: 97,
    tagline: 'L\'essentiel pour démarrer',
    badge: null,
    features: [
      'Site vitrine sur-mesure',
      'Hébergement haute performance',
      'SSL & sécurité',
      'Design responsive mobile',
      '2 modifications par mois',
    ],
    expandedFeatures: [
      'Support email sous 48h',
      'Maintenance technique',
    ],
  },
  {
    id: 'recommande',
    name: 'Recommandé',
    price: 390,
    tagline: 'Pour les entreprises qui veulent grandir',
    badge: 'Populaire',
    features: [
      'Tout du Mini, plus :',
      'Module réservation intégré',
      'Suivi analytics & tracking',
      'Modifications illimitées',
      'Support prioritaire 24h',
    ],
    expandedFeatures: [
      'SEO de base optimisé',
      'Formulaire de contact avancé',
      'Intégration Google Maps',
    ],
  },
  {
    id: 'elite',
    name: 'Élite',
    price: 790,
    tagline: 'L\'accompagnement premium complet',
    badge: 'VIP',
    features: [
      'Tout du Recommandé, plus :',
      'CRM intégré',
      'SEO actif mensuel',
      'Accès WhatsApp VIP',
      'Rapport mensuel performance',
    ],
    expandedFeatures: [
      'Accompagnement stratégique',
      'Intégration réseaux sociaux',
      'A/B testing pages',
    ],
  },
]

export const ADDONS: Addon[] = [
  {
    id: 'booking',
    title: 'Module Réservation',
    description: 'Vos clients réservent directement depuis votre site, 24h/24.',
    price: 50,
  },
  {
    id: 'menu_digital',
    title: 'Menu Digital QR',
    description: 'Votre carte accessible en un scan. Modifiez plats et prix en 2 clics.',
    price: 40,
  },
  {
    id: 'multi_langue',
    title: 'Site Multi-Langue',
    description: 'Votre site traduit pour toucher les clients internationaux.',
    price: 60,
  },
  {
    id: 'google_pack',
    title: 'Pack Visibilité Google',
    description: 'Apparaissez en premier quand vos clients cherchent vos services.',
    price: 90,
  },
  {
    id: 'maintenance_plus',
    title: 'Maintenance Plus',
    description: 'Réponse garantie 24h et modifications illimitées chaque mois.',
    price: 70,
  },
  {
    id: 'immo_connect',
    title: 'Immo Connect',
    description: 'Synchronisation automatique de vos annonces (Apimo, Hektor...).',
    price: 90,
  },
  {
    id: 'devis_auto',
    title: 'Devis en Ligne',
    description: 'Formulaire de devis interactif directement sur votre site.',
    price: 50,
  },
]

export const SETUP_FEE = 990
export const TRIAL_DAYS = 30
export const ENGAGEMENT_MONTHS = 12
export const CARE_PRICE = 97
