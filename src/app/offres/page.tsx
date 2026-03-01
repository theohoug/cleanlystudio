/**
 * @file offres/page.tsx
 * @description Full pricing page with interactive checkout — Cleanly Studio
 * @author Cleanlystudio
 */

'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { TIERS, ADDONS, SETUP_FEE, TRIAL_DAYS, CARE_PRICE, ENGAGEMENT_MONTHS } from '@/data/pricing'
import type { Tier } from '@/data/pricing'
import {
  Check,
  Zap,
  Star,
  Crown,
  ArrowRight,
  Shield,
  Clock,
  Key,
  Headphones,
  ChevronDown,
  Loader2,
  Lock,
  CreditCard,
  UtensilsCrossed,
  ShoppingBag,
  Scissors,
  Home,
  Wrench,
  Briefcase,
  Stethoscope,
  Building2,
  Rocket,
} from 'lucide-react'

const TIER_ICONS: Record<string, typeof Zap> = { mini: Zap, recommande: Star, elite: Crown }

const SECTORS = [
  { icon: UtensilsCrossed, label: 'Restaurants & Hôtels', stat: '+30% de réservations' },
  { icon: ShoppingBag, label: 'Commerce & Retail', stat: '+45% de trafic' },
  { icon: Scissors, label: 'Beauté & Bien-être', stat: '+60% de RDV en ligne' },
  { icon: Home, label: 'Immobilier', stat: '+45% de demandes' },
  { icon: Wrench, label: 'Artisans & BTP', stat: 'Carnet plein en 3 mois' },
  { icon: Briefcase, label: 'Professions libérales', stat: '+90% de visibilité' },
  { icon: Stethoscope, label: 'Santé & Médical', stat: '+35% de patients' },
  { icon: Building2, label: 'Services & Consulting', stat: '+200% de RDV' },
]

const FAQ_ITEMS = [
  {
    q: 'Combien ça coûte vraiment ?',
    a: `Votre abonnement mensuel (97€, 390€ ou 790€ HT) + ${SETUP_FEE}€ HT de mise en place au 30e jour. Pendant les 30 premiers jours, vous ne payez rien. Si vous annulez pendant l'essai, aucun prélèvement.`,
  },
  {
    q: 'Et si je ne suis pas satisfait ?',
    a: 'Pendant 30 jours, c\'est 100% gratuit et sans engagement. Pas satisfait ? Vous ne payez rien. On coupe, zéro frais, zéro justification.',
  },
  {
    q: 'Qui est propriétaire du site ?',
    a: 'Pendant les 12 premiers mois, le site reste la propriété de Cleanly Studio. À partir du 13e mois, la propriété intégrale (code, design, contenu) vous est automatiquement transférée.',
  },
  {
    q: 'C\'est quoi le Care & Hub ?',
    a: `À partir du 13e mois, votre abonnement passe automatiquement à ${CARE_PRICE}€/mois (quelle que soit la formule). Ça couvre l'hébergement, la maintenance, les mises à jour et l'accès au Hub Cleanly.`,
  },
  {
    q: 'Pourquoi un abonnement plutôt qu\'un paiement unique ?',
    a: '0€ au démarrage, un site professionnel en 2 semaines, hébergement + maintenance + support inclus. Pas de surprise. Et après 12 mois, le site est à vous.',
  },
  {
    q: 'Quels sont les délais de création ?',
    a: 'Votre site est prêt sous 7 à 14 jours. On est rapides parce qu\'on maîtrise chaque étape du processus.',
  },
]

const ADVANTAGES = [
  { icon: Shield, title: '0€ au démarrage', desc: '30 jours gratuits pour tester sans risque.' },
  { icon: Clock, title: 'Toujours à jour', desc: 'Mises à jour, sécurité et performances gérées.' },
  { icon: Headphones, title: 'Support permanent', desc: 'Réponse sous 24h. Un humain, pas un chatbot.' },
  { icon: Key, title: 'Le site est à vous', desc: 'Propriété transférée après 12 mois.' },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-zinc-800/50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-white font-medium pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-zinc-500 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-zinc-400 text-sm pb-5 leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

export default function OffresPage() {
  const [selectedTier, setSelectedTier] = useState<'mini' | 'recommande' | 'elite'>('recommande')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const tier = TIERS.find(t => t.id === selectedTier)!
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = ADDONS.find(a => a.id === id)
    return sum + (addon?.price || 0)
  }, 0)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://hub.cleanlystudio.pro/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTier,
          addons: selectedAddons,
          successUrl: 'https://cleanlystudio.pro/offres?success=true',
          cancelUrl: 'https://cleanlystudio.pro/offres',
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      window.location.href = `https://hub.cleanlystudio.pro/offres?tier=${selectedTier}`
    } finally {
      setLoading(false)
    }
  }

  return (
    <main id="main-content">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-medium">{TRIAL_DAYS} jours d&apos;essai gratuit &mdash; Sans engagement</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gradient mb-5">
            Nos offres de création<br />de site web professionnel
          </h1>
          <p className="text-zinc-400 max-w-lg mx-auto text-sm leading-relaxed">
            Design sur-mesure, hébergement et maintenance inclus. Concentrez-vous sur votre activité, on s&apos;occupe du reste.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
          {TIERS.map((t) => {
            const Icon = TIER_ICONS[t.id]
            const isPopular = t.id === 'recommande'
            const isElite = t.id === 'elite'
            const isSelected = selectedTier === t.id

            return (
              <div
                key={t.id}
                onClick={() => setSelectedTier(t.id)}
                className={`relative cursor-pointer transition-all duration-300 ${isPopular ? 'md:-mt-4 md:mb-4' : ''} ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
              >
                {t.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1 text-[10px] font-bold rounded-full tracking-wider uppercase ${
                    isPopular ? 'badge-popular' : 'badge-vip'
                  }`}>
                    {t.badge}
                  </div>
                )}

                <div className={`rounded-[20px] h-full ${isPopular ? 'pricing-popular' : 'premium-card'} ${isSelected ? 'ring-1 ring-indigo-500/40' : ''}`}>
                  <div className="p-7 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isPopular ? 'bg-indigo-500/15' : isElite ? 'bg-amber-500/10' : 'bg-white/[0.03]'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          isPopular ? 'text-indigo-400' : isElite ? 'text-amber-400' : 'text-zinc-500'
                        }`} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">{t.name}</h2>
                        <p className="text-xs text-zinc-500">{t.tagline}</p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="text-5xl font-bold text-white tracking-tight">{t.price}</span>
                      <span className="text-zinc-500 text-sm ml-1">&euro; HT/mois</span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-6">
                      <Shield className="w-3 h-3 text-emerald-400" />
                      <span className="text-[11px] text-emerald-400/80 font-medium">30 jours satisfait ou remboursé</span>
                    </div>

                    <div className="space-y-3 flex-1">
                      {t.features.map((f, j) => (
                        <div key={j} className="flex items-start gap-2.5">
                          <Check className={`w-4 h-4 mt-0.5 shrink-0 ${
                            isPopular ? 'text-indigo-400' : 'text-emerald-500/60'
                          }`} />
                          <span className="text-sm text-zinc-300">{f}</span>
                        </div>
                      ))}
                      {t.expandedFeatures.map((f, j) => (
                        <div key={`exp-${j}`} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 mt-0.5 shrink-0 text-zinc-600" />
                          <span className="text-sm text-zinc-500">{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className={`mt-8 w-full py-3 rounded-xl text-sm font-semibold text-center transition-all ${
                      isSelected
                        ? 'bg-white text-zinc-950'
                        : isPopular
                          ? 'bg-white/[0.06] text-white hover:bg-white/10'
                          : 'bg-white/[0.06] text-white hover:bg-white/10'
                    }`}>
                      {isSelected ? 'Sélectionné' : 'Choisir cette offre'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="max-w-5xl mx-auto text-center mt-10">
          <p className="text-sm text-zinc-600">
            + {SETUP_FEE}&euro; HT de mise en place au J{TRIAL_DAYS} &bull; Engagement {ENGAGEMENT_MONTHS} mois &bull; À partir du 13e mois : {CARE_PRICE}&euro;/mois (Care &amp; Hub)
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Addons */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] font-medium text-indigo-400/50 uppercase tracking-[0.25em] mb-4">Options</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gradient">Modules complémentaires</h2>
            <p className="text-zinc-400 text-sm mt-3">Ajoutez des fonctionnalités selon vos besoins.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADDONS.map(addon => {
              const isSelected = selectedAddons.includes(addon.id)
              return (
                <button
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`text-left p-5 rounded-xl border transition-all duration-300 ${
                    isSelected
                      ? 'bg-indigo-500/5 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.05)]'
                      : 'premium-card hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{addon.title}</span>
                    <span className="text-xs font-bold text-zinc-400">+{addon.price}&euro;/mois</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{addon.description}</p>
                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-medium">Ajouté</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Summary + CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="premium-card p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-zinc-400">Votre abonnement</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-white">{tier.price + addonsTotal}</span>
                  <span className="text-zinc-400 text-sm">&euro; HT / mois</span>
                </div>
                {addonsTotal > 0 && (
                  <p className="text-xs text-zinc-500 mt-1">
                    {tier.name} ({tier.price}&euro;) + {selectedAddons.length} addon{selectedAddons.length > 1 ? 's' : ''} (+{addonsTotal}&euro;)
                  </p>
                )}
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Commencer mon essai gratuit
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>{TRIAL_DAYS}j gratuits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{SETUP_FEE}&euro; HT mise en place au J30</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5" />
                <span>{ENGAGEMENT_MONTHS} mois d&apos;engagement</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800/50">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Lock className="w-3.5 h-3.5" />
                <span>Paiement sécurisé par Stripe</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <CreditCard className="w-4 h-4" />
                <span className="text-[10px] font-medium tracking-wide">VISA</span>
                <span className="text-[10px] font-medium tracking-wide">MC</span>
                <span className="text-[10px] font-medium tracking-wide">CB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Garantie */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-4">30 jours satisfait ou remboursé</h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
            Si votre site ne vous plaît pas, vous ne payez rien. Zéro frais, zéro justification. On prend le risque pour vous.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-medium text-indigo-400/50 uppercase tracking-[0.25em] mb-4">Processus</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gradient">Comment ça marche</h2>
          </div>

          <div className="space-y-8">
            {[
              { step: '01', title: '30 jours gratuits', desc: 'Testez sans engagement. On crée votre site, vous validez. Si ça ne vous plaît pas, vous ne payez rien.', accent: true },
              { step: '02', title: `${ENGAGEMENT_MONTHS} mois d'abonnement`, desc: `Votre formule à ${tier.price}€/mois + ${SETUP_FEE}€ de mise en place. Hébergement, maintenance et support inclus.`, accent: false },
              { step: '03', title: 'Care & Hub (mois 13+)', desc: `Votre site vous appartient. L'abonnement passe à ${CARE_PRICE}€/mois pour l'hébergement et la maintenance. Résiliable à tout moment.`, accent: true },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-6">
                <div className={`process-dot shrink-0 ${item.accent ? '!border-emerald-500/30 !bg-emerald-500/5' : ''}`}>
                  <span className={`text-sm font-bold ${item.accent ? 'text-emerald-400' : 'text-indigo-400'}`}>{item.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Secteurs */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] font-medium text-indigo-400/50 uppercase tracking-[0.25em] mb-4">Secteurs</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gradient">Adapté à votre activité</h2>
            <p className="text-zinc-400 text-sm mt-3">Quel que soit votre secteur, on crée le site qui convertit.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SECTORS.map((s, i) => (
              <div
                key={i}
                className="group p-5 rounded-xl premium-card cursor-default"
              >
                <s.icon className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors mb-3" />
                <p className="text-sm font-semibold text-white mb-1">{s.label}</p>
                <p className="text-xs text-emerald-400/70">{s.stat}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-zinc-500 text-sm mt-6">
            Votre secteur n&apos;est pas listé ? On s&apos;adapte à tout.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Avantages */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-medium text-indigo-400/50 uppercase tracking-[0.25em] mb-4">Avantages</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gradient">Pourquoi l&apos;abonnement</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {ADVANTAGES.map((item) => (
              <div key={item.title} className="premium-card p-6 flex items-start gap-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] font-medium text-indigo-400/50 uppercase tracking-[0.25em] mb-4">FAQ</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gradient">Questions fréquentes</h2>
          </div>
          <div>
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="final-cta-card p-12 md:p-16">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gradient mb-4">
              Prêt à lancer votre site ?
            </h2>
            <p className="text-zinc-400 mb-8 text-sm leading-relaxed max-w-md mx-auto">
              {TRIAL_DAYS} jours d&apos;essai gratuit, sans engagement. Votre site professionnel en moins de 2 semaines.
            </p>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="px-10 py-4 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-100 transition-all text-sm inline-flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Commencer mon essai gratuit
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-zinc-600 text-xs mt-4 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3" />
              Paiement sécurisé par Stripe
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
