/**
 * @file page.tsx
 * @description Awwwards portfolio v2 - Premium implementation with GSAP
 * @author Cleanlystudio
 */
"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import emailjs from "@emailjs/browser";
import { gsap } from "gsap";
import { AnimatedTitle, AnimatedLabel, AnimatedParagraph, StaggerReveal, MagneticButton } from "@/components/AnimatedText";

const ImmersiveScene = dynamic(
  () => import("@/components/three/ImmersiveScene"),
  { ssr: false, loading: () => null }
);

const LoadingScreen = dynamic(
  () => import("@/components/LoadingScreen"),
  { ssr: false }
);

const CustomCursor = dynamic(
  () => import("@/components/CustomCursor"),
  { ssr: false }
);

const SoundManager = dynamic(
  () => import("@/components/SoundManager"),
  { ssr: false }
);

const MobileOverlay = dynamic(
  () => import("@/components/MobileOverlay"),
  { ssr: false }
);

const KonamiCode = dynamic(
  () => import("@/components/KonamiCode"),
  { ssr: false }
);

import { SERVICES, getActiveService, isGalleryOverview, getCurrentRoom } from "@/components/three/ImmersiveScene";

const scrollSteps = [
  { id: "hero", label: "Accueil", progress: 0 },
  { id: "intro", label: "Intro", progress: 0.06 },
  { id: "gallery-title", label: "Projets", progress: 0.15 },
  { id: "project-1", label: "Web", progress: 0.22 },
  { id: "project-2", label: "Mobile", progress: 0.30 },
  { id: "project-3", label: "Gaming", progress: 0.38 },
  { id: "project-4", label: "Vidéo", progress: 0.46 },
  { id: "project-5", label: "Design", progress: 0.52 },
  { id: "about", label: "À propos", progress: 0.60 },
  { id: "offer-1", label: "Starter", progress: 0.67 },
  { id: "offer-2", label: "Pro", progress: 0.71 },
  { id: "offer-3", label: "Premium", progress: 0.75 },
  { id: "contact-form", label: "Contact", progress: 0.85 },
  { id: "contact-socials", label: "Réseaux", progress: 0.93 },
];

const sections = [
  { id: "hero", label: "Home" },
  { id: "services", label: "Work" },
  { id: "about", label: "About" },
  { id: "offers", label: "Offers" },
  { id: "contact", label: "Contact" },
];

const stats = [
  { value: "40+", label: "Projets" },
  { value: "100K+", label: "Reach" },
  { value: "8+", label: "Années" },
];

const projectTypes = [
  { value: "", label: "Type de projet" },
  { value: "starter", label: "Site vitrine (Starter)" },
  { value: "pro", label: "Site sur-mesure (Pro)" },
  { value: "premium", label: "Expérience immersive (Premium)" },
  { value: "other", label: "Autre / Je ne sais pas encore" },
];

const budgetOptions = [
  { value: "", label: "Budget estimé" },
  { value: "<1500", label: "< 1 500€" },
  { value: "1500-3500", label: "1 500€ – 3 500€" },
  { value: "3500-7000", label: "3 500€ – 7 000€" },
  { value: ">7000", label: "> 7 000€" },
  { value: "tbd", label: "À définir ensemble" },
];

const offers = [
  {
    id: "starter",
    name: "Starter",
    price: "À partir de 1 500€",
    tagline: "Votre vitrine pro en 2 semaines",
    target: "Artisans, indépendants, commerces locaux",
    includes: [
      "Site élégant jusqu'à 5 pages",
      "Design responsive",
      "Optimisé Google (SEO)",
      "Formulaire de contact",
      "Google Maps + horaires",
      "Hébergement 1 an inclus",
      "2 sessions de révisions"
    ],
    delay: "~2 semaines",
  },
  {
    id: "pro",
    name: "Pro",
    price: "À partir de 3 500€",
    tagline: "Un site qui convertit vos visiteurs en clients",
    target: "Restaurants, PME, startups",
    includes: [
      "Site sur-mesure jusqu'à 10 pages",
      "Animations fluides et modernes",
      "Vous gérez votre contenu (CMS)",
      "Réservation ou prise de RDV",
      "Galerie photos & avis Google",
      "Hébergement 1 an + maintenance 3 mois",
      "Formation 30min incluse",
      "3 sessions de révisions"
    ],
    delay: "3-4 semaines",
  },
  {
    id: "premium",
    name: "Premium",
    price: "À partir de 7 000€",
    tagline: "L'expérience que vos concurrents n'auront jamais",
    target: "Marques ambitieuses, projets signature",
    includes: [
      "Expérience immersive 3D / WebGL",
      "Design 100% unique",
      "Animations et interactions avancées",
      "CMS complet",
      "Hébergement 1 an + maintenance 6 mois",
      "Révisions illimitées",
      "Support prioritaire"
    ],
    delay: "6-10 semaines",
  },
];

const OfferIcon = ({ id }: { id: string }) => {
  if (id === "starter") return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  );
  if (id === "pro") return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
};

const EMAILJS_SERVICE_ID = "service_ac0ps2e";
const EMAILJS_TEMPLATE_ID = "template_vdumhp9";
const EMAILJS_AUTOREPLY_ID = "template_dx1etrz";
const EMAILJS_PUBLIC_KEY = "DYQWf8ZrPToCuxrQN";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const touchStartY = useRef<number>(0);
  const lastWheelTime = useRef<number>(0);

  const [formData, setFormData] = useState({ name: "", email: "", projectType: "", budget: "", message: "", website: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [idleHint, setIdleHint] = useState<string | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollRef = useRef<number>(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const goToStep = useCallback((stepIndex: number) => {
    if (isTransitioning || stepIndex < 0 || stepIndex >= scrollSteps.length) return;

    setIsTransitioning(true);
    setCurrentStep(stepIndex);
    setScrollProgress(scrollSteps[stepIndex].progress);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning]);

  const nextStep = useCallback(() => {
    goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const prevStep = useCallback(() => {
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const mobileOfferIndex = useMemo(() => {
    const step = scrollSteps[currentStep];
    if (step.id === "offer-1") return 0;
    if (step.id === "offer-2") return 1;
    if (step.id === "offer-3") return 2;
    return 0;
  }, [currentStep]);

  const activeService = useMemo(() => getActiveService(scrollProgress), [scrollProgress]);
  const currentService = activeService !== null ? SERVICES[activeService] : null;

  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTransitioning || isLoading) return;

      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;

      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, .contact-overlay-content")) return;

      e.preventDefault();
      lastWheelTime.current = now;

      if (e.deltaY > 30) {
        nextStep();
      } else if (e.deltaY < -30) {
        prevStep();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning || isLoading) return;

      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select")) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      if (Math.abs(deltaY) > 60) {
        if (deltaY > 0) {
          nextStep();
        } else {
          prevStep();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning || isLoading) return;
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        nextStep();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        prevStep();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTransitioning, isLoading, nextStep, prevStep]);

  const getIdleHintMessage = useCallback(() => {
    const step = scrollSteps[currentStep];
    if (step.id === "hero") return "Scrollez ou swipez pour naviguer";
    return null;
  }, [currentStep]);

  useEffect(() => {
    setIdleHint(null);

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      const hint = getIdleHintMessage();
      if (hint) setIdleHint(hint);
    }, 3000);

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [currentStep, getIdleHintMessage]);

  const scrollToSection = (index: number) => {
    const stepMap: { [key: number]: number } = {
      0: 0,
      1: 3,
      2: 7,
      3: 8,
      4: 11,
    };
    goToStep(stepMap[index] || 0);
  };

  const goToNextSection = () => {
    nextStep();
  };

  const handleFadeOpacity = useCallback((opacity: number) => {
    setFadeOpacity(opacity);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);

    if (navRef.current) {
      gsap.fromTo(navRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 }
      );
    }
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const scrollToContact = (prefilledType?: string) => {
    if (prefilledType) {
      setFormData(prev => ({ ...prev, projectType: prefilledType }));
    }
    goToStep(11);
  };

  const scrollToSocials = () => {
    goToStep(12);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.website) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const projectLabel = projectTypes.find(p => p.value === formData.projectType)?.label || "Non spécifié";
      const budgetLabel = budgetOptions.find(b => b.value === formData.budget)?.label || "Non spécifié";

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        company: projectLabel,
        budget: budgetLabel,
        message: formData.message,
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_ID, templateParams, EMAILJS_PUBLIC_KEY);

      setIsSubmitted(true);
      setFormData({ name: "", email: "", projectType: "", budget: "", message: "", website: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Erreur lors de l'envoi. Réessayez ou contactez-nous par email.");
    }
    setIsSubmitting(false);
  };

  const currentStepData = scrollSteps[currentStep];
  const showHeroContent = currentStepData.id === "hero";
  const showImmersiveIntro = currentStepData.id === "intro";
  const showGalleryTitle = currentStepData.id === "gallery-title";
  const showAboutContent = currentStepData.id === "about";
  const showOffersContent = currentStepData.id.startsWith("offer-");
  const showContactForm = currentStepData.id === "contact-form";
  const showContactSocials = currentStepData.id === "contact-socials";

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <MobileOverlay />
      <CustomCursor />
      <SoundManager isLoaded={!isLoading} />
      <KonamiCode />

      <ImmersiveScene
        scrollProgress={scrollProgress}
        onFadeOpacity={handleFadeOpacity}
      />

      <div className="fade-overlay" style={{ opacity: fadeOpacity }} />
      <div className="vignette-overlay" />
      <div className="noise-overlay" />
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})`, width: "100%" }} />

      <nav ref={navRef} className="nav" style={{ opacity: 0 }} role="navigation" aria-label="Navigation principale">
        <div className="nav-logo" data-cursor="Home" aria-label="Cleanlystudio - Accueil">CS</div>
        <div className="nav-links">
          <a href="#services" data-cursor="Work" aria-label="Voir mes projets">Work</a>
          <a href="#about" data-cursor="About" aria-label="À propos de moi">About</a>
          <a href="#contact" data-cursor="Contact" aria-label="Me contacter">Contact</a>
        </div>
      </nav>

      <div className="section-indicator">
        {scrollSteps.map((step, index) => (
          <button
            key={index}
            className={`indicator-dot ${currentStep === index ? "active" : ""} ${index < currentStep ? "passed" : ""}`}
            onClick={() => goToStep(index)}
            aria-label={step.label}
          >
            <span className="indicator-line" />
          </button>
        ))}
      </div>

      {showImmersiveIntro && (
        <div className="immersive-intro">
          <div className="intro-particles">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="intro-particle" style={{ '--i': i } as React.CSSProperties} />
            ))}
          </div>
          <div className="intro-rings">
            <div className="intro-ring ring-1" />
            <div className="intro-ring ring-2" />
            <div className="intro-ring ring-3" />
          </div>
          <div className="intro-content">
            <div className="intro-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p className="immersive-intro-text">
              {"Bienvenue dans une".split("").map((char, i) => (
                <span key={i} className="intro-char" style={{ '--delay': `${i * 0.03}s` } as React.CSSProperties}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
              <br />
              {"expérience immersive".split("").map((char, i) => (
                <span key={i + 20} className="intro-char accent" style={{ '--delay': `${(i + 20) * 0.03}s` } as React.CSSProperties}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </p>
            <div className="intro-divider">
              <span className="divider-line" />
              <span className="divider-dot" />
              <span className="divider-line" />
            </div>
            <span className="immersive-intro-sub">
              <span className="sub-icon">↓</span>
              Swipez pour explorer
            </span>
          </div>
          <div className="intro-glow" />
        </div>
      )}

      {showGalleryTitle && (
        <div className="gallery-title">
          <AnimatedTitle isVisible={showGalleryTitle} className="gallery-title-text">
            {"Projets &\nCompétences"}
          </AnimatedTitle>
        </div>
      )}

      {currentService && (
        <div className="service-overlay">
          <div className="service-overlay-content">
            <p className="service-overlay-num">
              {String(activeService! + 1).padStart(2, "0")}
            </p>
            <h2 className="service-overlay-title">{currentService.name}</h2>
            <div className="service-overlay-skills">
              {currentService.skills.map((skill: string) => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
            <div className="service-overlay-projects">
              <p className="service-overlay-projects-label">Projets associés</p>
              {currentService.projects.map((project: { name: string; desc: string; link?: string; status?: string; metric?: string }) => (
                <div key={project.name} className="service-project-item">
                  <h3>{project.name}</h3>
                  <p>{project.desc}</p>
                  {project.metric && <span className="project-metric">{project.metric}</span>}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" data-cursor="View">
                      Voir le projet →
                    </a>
                  )}
                  {project.status && <span className="project-status">{project.status}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAboutContent && (
        <div className="about-overlay">
          <div className="about-overlay-content">
            <AnimatedLabel isVisible={showAboutContent} className="section-label" delay={0}>
              À propos
            </AnimatedLabel>
            <AnimatedTitle isVisible={showAboutContent} className="section-title" delay={0.2}>
              {"Théo Houguet"}
            </AnimatedTitle>
            <AnimatedParagraph isVisible={showAboutContent} className="section-text" delay={0.4}>
              Développeur créatif basé en Normandie, je crée des expériences digitales uniques qui allient design premium et technologie de pointe.
            </AnimatedParagraph>
            <AnimatedParagraph isVisible={showAboutContent} className="section-text" delay={0.6}>
              Passionné par le web immersif, les applications mobiles et le game design, je transforme vos idées en réalités interactives.
            </AnimatedParagraph>
            <StaggerReveal isVisible={showAboutContent} className="stats-row" delay={0.8} stagger={0.15}>
              {stats.map((stat) => (
                <div key={stat.label} className="stat-item">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </div>
      )}

      {showOffersContent && (
        <div className="offers-overlay">
          <div className="offers-overlay-content">
            <AnimatedTitle isVisible={showOffersContent} className="offers-title" delay={0}>
              {"Mes Offres"}
            </AnimatedTitle>
            <AnimatedParagraph isVisible={showOffersContent} className="offers-subtitle" delay={0.2}>
              Des solutions adaptées à chaque projet et budget
            </AnimatedParagraph>
            <div className="offers-grid">
              {offers.map((offer, index) => (
                <div
                  key={offer.id}
                  className={`offer-card offer-${offer.id} ${index === mobileOfferIndex ? "mobile-visible" : ""}`}
                  data-visible={showOffersContent}
                  data-index={index}
                >
                  <div className="offer-icon"><OfferIcon id={offer.id} /></div>
                  <h3 className="offer-name">{offer.name}</h3>
                  <p className="offer-price">{offer.price}</p>
                  <p className="offer-tagline">{offer.tagline}</p>
                  <p className="offer-target">{offer.target}</p>
                  <ul className="offer-includes">
                    {offer.includes.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <p className="offer-delay">Délai : {offer.delay}</p>
                  <button className="offer-cta" onClick={() => scrollToContact(offer.id)} aria-label={`Choisir l'offre ${offer.name}`}>
                    Choisir {offer.name}
                  </button>
                </div>
              ))}
            </div>
            <div className="offers-progress-dots">
              {offers.map((_, index) => (
                <div key={index} className={`offers-progress-dot ${index === mobileOfferIndex ? "active" : ""} ${index < mobileOfferIndex ? "passed" : ""}`} />
              ))}
            </div>
            <div className="offers-swipe-hint">
              <span>↓ Scrollez pour voir les offres ↓</span>
            </div>
            <p className="offers-footer">
              Hébergement inclus la première année. Pages supplémentaires, maintenance, options → sur devis.
            </p>
          </div>
        </div>
      )}

      {showContactForm && (
        <div className="contact-overlay">
          <div className="contact-overlay-content">
            <AnimatedLabel isVisible={showContactForm} className="contact-status" delay={0}>
              ● Disponible pour projets
            </AnimatedLabel>
            <AnimatedTitle isVisible={showContactForm} className="section-title contact-title" delay={0.2}>
              {"Discutons de\nvotre vision"}
            </AnimatedTitle>
            {isSubmitted ? (
              <div className="contact-success">
                <div className="success-icon">✓</div>
                <p>Message envoyé avec succès</p>
                <span>Je vous réponds sous 48h</span>
              </div>
            ) : (
              <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleFormChange}
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
                />
                <div className="form-row">
                  <div className="form-field">
                    <input
                      type="text"
                      name="name"
                      placeholder=" "
                      className="form-input"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                    <label className="form-label">Votre nom</label>
                  </div>
                  <div className="form-field">
                    <input
                      type="email"
                      name="email"
                      placeholder=" "
                      className="form-input"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                    <label className="form-label">Votre email</label>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <select
                      name="projectType"
                      className="form-select"
                      value={formData.projectType}
                      onChange={handleFormChange}
                    >
                      {projectTypes.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <select
                      name="budget"
                      className="form-select"
                      value={formData.budget}
                      onChange={handleFormChange}
                    >
                      {budgetOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-field">
                  <textarea
                    name="message"
                    placeholder=" "
                    className="form-textarea"
                    rows={3}
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  />
                  <label className="form-label">Votre message</label>
                </div>
                <MagneticButton type="submit" className="form-submit" disabled={isSubmitting} aria-label={isSubmitting ? "Envoi du message en cours" : "Envoyer le message"}>
                  <span>{isSubmitting ? "Envoi en cours..." : "Envoyer le message"}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      )}

      {showContactSocials && (
        <div className="socials-overlay">
          <div className="socials-overlay-content">
            <AnimatedTitle isVisible={showContactSocials} className="socials-title" delay={0}>
              {"Restons en contact"}
            </AnimatedTitle>
            <a href="mailto:contact@cleanlystudio.fr" className="socials-email" data-cursor="Email" aria-label="Envoyer un email à contact@cleanlystudio.fr">
              contact@cleanlystudio.fr
            </a>
            <div className="socials-links">
              <a href="https://instagram.com/cleanlystudio" target="_blank" rel="noopener noreferrer" className="social-link" data-cursor="Instagram" aria-label="Suivre Cleanlystudio sur Instagram (ouvre dans un nouvel onglet)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                </svg>
                <span>@cleanlystudio</span>
              </a>
              <a href="https://linkedin.com/in/theo-houguet" target="_blank" rel="noopener noreferrer" className="social-link" data-cursor="LinkedIn" aria-label="Voir le profil LinkedIn de Théo Houguet (ouvre dans un nouvel onglet)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="3" />
                  <path d="M7 11v6M7 7v.01M11 11v6M11 14c0-1.657 1.343-3 3-3s3 1.343 3 3v3" />
                </svg>
                <span>Théo Houguet</span>
              </a>
            </div>
            <p className="socials-footer">Normandie, France</p>
          </div>
        </div>
      )}

      <main ref={mainRef}>
        <section
          ref={(el) => { sectionRefs.current[0] = el; }}
          className="section"
          style={{ minHeight: "80vh" }}
        >
          {showHeroContent && (
            <div className="section-content hero-content" style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease" }}>
              <AnimatedLabel isVisible={showHeroContent && !isLoading} className="hero-label" delay={0.1}>
                Creative Developer
              </AnimatedLabel>
              <div className="hero-title">
                <AnimatedTitle isVisible={showHeroContent && !isLoading} className="hero-title-line" delay={0.2}>
                  {"Crafting"}
                </AnimatedTitle>
                <AnimatedTitle isVisible={showHeroContent && !isLoading} className="hero-title-line accent" delay={0.35}>
                  {"Digital"}
                </AnimatedTitle>
                <AnimatedTitle isVisible={showHeroContent && !isLoading} className="hero-title-line" delay={0.5}>
                  {"Experiences"}
                </AnimatedTitle>
              </div>
              <div className="hero-cta" style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.8s ease 0.3s" }}>
                <button className="cta-primary" onClick={() => goToStep(2)} aria-label="Voir mes projets et compétences">
                  <span>Voir mes projets</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </button>
                <button className="cta-secondary" onClick={() => scrollToContact()} aria-label="Aller au formulaire de contact">
                  <span>Me contacter</span>
                </button>
              </div>
            </div>
          )}
        </section>

        <section
          ref={(el) => { sectionRefs.current[1] = el; }}
          id="services"
          className="section"
          style={{ minHeight: "400vh" }}
        />

        <section
          ref={(el) => { sectionRefs.current[2] = el; }}
          id="about"
          className="section"
          style={{ minHeight: "120vh" }}
        />

        <section
          ref={(el) => { sectionRefs.current[3] = el; }}
          id="offers"
          className="section"
          style={{ minHeight: "120vh" }}
        />

        <section
          ref={(el) => { sectionRefs.current[4] = el; }}
          id="contact"
          className="section"
          style={{ minHeight: "180vh" }}
        />
      </main>


      {idleHint && currentStep === 0 && (
        <div className={`idle-hint ${idleHint ? "visible" : ""}`}>
          <div className="idle-hint-content">
            <div className="idle-hint-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </div>
            <span className="idle-hint-text">{idleHint}</span>
          </div>
        </div>
      )}

      <button
        className={`next-button ${currentStep >= scrollSteps.length - 1 ? "hidden" : ""}`}
        onClick={nextStep}
        aria-label="Étape suivante"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
    </>
  );
}
