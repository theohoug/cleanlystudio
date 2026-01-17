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

import { SERVICES, getActiveService, isGalleryOverview, getCurrentRoom } from "@/components/three/ImmersiveScene";

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const [formData, setFormData] = useState({ name: "", email: "", projectType: "", budget: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleOfferTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleOfferTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleOfferTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 30;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setCurrentOfferIndex(prev => Math.min(offers.length - 1, prev + 1));
      } else {
        setCurrentOfferIndex(prev => Math.max(0, prev - 1));
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const activeService = useMemo(() => getActiveService(scrollProgress), [scrollProgress]);
  const currentService = activeService !== null ? SERVICES[activeService] : null;
  const showGalleryTitle = useMemo(() => isGalleryOverview(scrollProgress), [scrollProgress]);

  const mainRef = useRef<HTMLElement>(null);

  const handleScroll = useCallback(() => {
    const main = mainRef.current;
    if (!main) return;

    const scrollTop = main.scrollTop;
    const scrollHeight = main.scrollHeight - main.clientHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    setScrollProgress(progress);

    const windowHeight = main.clientHeight;
    const scrollCenter = scrollTop + windowHeight / 2;

    sectionRefs.current.forEach((section, index) => {
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollCenter >= sectionTop && scrollCenter < sectionBottom) {
          setCurrentSection(index);
        }
      }
    });
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    main.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => main.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToNextSection = () => {
    const nextSection = Math.min(currentSection + 1, sections.length - 1);
    scrollToSection(nextSection);
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
    sectionRefs.current[4]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setFormData({ name: "", email: "", projectType: "", budget: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Erreur lors de l'envoi. Réessayez ou contactez-nous par email.");
    }
    setIsSubmitting(false);
  };

  const currentRoom = useMemo(() => getCurrentRoom(scrollProgress), [scrollProgress]);
  const showHeroContent = currentRoom === "hero";
  const showAboutContent = currentRoom === "about" && scrollProgress < 0.66;
  const showOffersContent = scrollProgress >= 0.66 && scrollProgress < 0.79;
  const showContactContent = currentRoom === "contact";

  const showImmersiveIntro = scrollProgress > 0.02 && scrollProgress < 0.10;

  const activeOfferIndex = useMemo(() => {
    if (!showOffersContent) return 0;
    const offerProgress = (scrollProgress - 0.66) / (0.79 - 0.66);
    return Math.min(2, Math.floor(offerProgress * 3));
  }, [scrollProgress, showOffersContent]);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <MobileOverlay />
      <CustomCursor />
      <SoundManager isLoaded={!isLoading} />

      <ImmersiveScene
        scrollProgress={scrollProgress}
        onFadeOpacity={handleFadeOpacity}
      />

      <div className="fade-overlay" style={{ opacity: fadeOpacity }} />
      <div className="vignette-overlay" />
      <div className="noise-overlay" />
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})`, width: "100%" }} />

      <nav ref={navRef} className="nav" style={{ opacity: 0 }}>
        <div className="nav-logo" data-cursor="Home">Cleanlystudio</div>
        <div className="nav-links">
          <a href="#services" data-cursor="Work">Work</a>
          <a href="#about" data-cursor="About">About</a>
          <a href="#contact" data-cursor="Contact">Contact</a>
        </div>
      </nav>

      <div className="section-indicator">
        {sections.map((section, index) => (
          <button
            key={index}
            className={`indicator-dot ${currentSection === index ? "active" : ""}`}
            onClick={() => scrollToSection(index)}
            aria-label={section.label}
          >
            <span className="indicator-line" />
          </button>
        ))}
      </div>

      {showImmersiveIntro && (
        <div className="immersive-intro">
          <p className="immersive-intro-text">Bienvenue dans une expérience immersive</p>
          <span className="immersive-intro-sub">Continuez à scroller pour explorer</span>
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
        <div
          className="offers-overlay"
          onTouchStart={handleOfferTouchStart}
          onTouchMove={handleOfferTouchMove}
          onTouchEnd={handleOfferTouchEnd}
        >
          <div className="offers-overlay-content">
            <AnimatedTitle isVisible={showOffersContent} className="offers-title" delay={0}>
              {"Mes Offres"}
            </AnimatedTitle>
            <AnimatedParagraph isVisible={showOffersContent} className="offers-subtitle" delay={0.2}>
              Des solutions adaptées à chaque projet et budget
            </AnimatedParagraph>
            <div
              className="offers-grid"
              onTouchStart={handleOfferTouchStart}
              onTouchMove={handleOfferTouchMove}
              onTouchEnd={handleOfferTouchEnd}
            >
              {offers.map((offer, index) => (
                <div
                  key={offer.id}
                  className={`offer-card offer-${offer.id} ${index === currentOfferIndex ? "mobile-visible" : ""}`}
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
                  <button className="offer-cta" onClick={() => scrollToContact(offer.id)}>
                    Choisir {offer.name}
                  </button>
                </div>
              ))}
            </div>
            <div className="offers-nav-mobile">
              <button
                className="offers-nav-btn"
                onClick={() => setCurrentOfferIndex(Math.max(0, currentOfferIndex - 1))}
                disabled={currentOfferIndex === 0}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <div className="offers-progress-dots">
                {offers.map((_, index) => (
                  <div key={index} className={`offers-progress-dot ${index === currentOfferIndex ? "active" : ""} ${index < currentOfferIndex ? "passed" : ""}`} />
                ))}
              </div>
              <button
                className="offers-nav-btn"
                onClick={() => setCurrentOfferIndex(Math.min(offers.length - 1, currentOfferIndex + 1))}
                disabled={currentOfferIndex === offers.length - 1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
            <p className="offers-footer">
              Hébergement inclus la première année. Pages supplémentaires, maintenance, options → sur devis.
            </p>
          </div>
        </div>
      )}

      {showContactContent && (
        <div className="contact-overlay">
          <div className="contact-overlay-content">
            <AnimatedLabel isVisible={showContactContent} className="contact-status" delay={0}>
              ● Disponible pour projets
            </AnimatedLabel>
            <AnimatedTitle isVisible={showContactContent} className="section-title contact-title" delay={0.2}>
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
                    rows={4}
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  />
                  <label className="form-label">Votre message</label>
                </div>
                <MagneticButton type="submit" className="form-submit" disabled={isSubmitting}>
                  <span>{isSubmitting ? "Envoi en cours..." : "Envoyer le message"}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </MagneticButton>
              </form>
            )}
            <div className="contact-divider">
              <span>ou directement</span>
            </div>
            <a href="mailto:contact@cleanlystudio.fr" className="contact-email" data-cursor="Email">
              contact@cleanlystudio.fr
            </a>
            <div className="social-row">
              <a href="https://github.com/kowta" target="_blank" rel="noopener noreferrer" data-cursor="GitHub">GitHub</a>
              <a href="https://instagram.com/cleanlystudio" target="_blank" rel="noopener noreferrer" data-cursor="Instagram">Instagram</a>
              <a href="https://linkedin.com/in/theo-houguet" target="_blank" rel="noopener noreferrer" data-cursor="LinkedIn">LinkedIn</a>
            </div>
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
            <div className="section-content hero-content">
              <AnimatedLabel isVisible={showHeroContent && !isLoading} className="hero-label" delay={0.5}>
                Creative Developer
              </AnimatedLabel>
              <div className="hero-title">
                <AnimatedTitle isVisible={showHeroContent && !isLoading} className="hero-title-line" delay={0.7}>
                  {"Crafting"}
                </AnimatedTitle>
                <AnimatedTitle isVisible={showHeroContent && !isLoading} className="hero-title-line accent" delay={0.9}>
                  {"Digital"}
                </AnimatedTitle>
                <AnimatedTitle isVisible={showHeroContent && !isLoading} className="hero-title-line" delay={1.1}>
                  {"Experiences"}
                </AnimatedTitle>
              </div>
              <div className="hero-cta" style={{ opacity: showHeroContent && !isLoading ? 1 : 0, transition: "opacity 0.8s ease 1.5s" }}>
                <button className="cta-primary" onClick={() => {
                  const main = mainRef.current;
                  if (main) {
                    const targetScroll = main.scrollHeight * 0.14;
                    main.scrollTo({ top: targetScroll, behavior: "smooth" });
                  }
                }}>
                  <span>Voir mes projets</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </button>
                <button className="cta-secondary" onClick={() => scrollToContact()}>
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

      <div className={`scroll-hint ${scrollProgress > 0.05 ? "hidden" : ""}`}>
        <div className="scroll-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
        <span className="scroll-hint-text">Swipe pour explorer</span>
      </div>

      <button
        className={`next-button ${currentSection >= sections.length - 1 ? "hidden" : ""}`}
        onClick={goToNextSection}
        aria-label="Section suivante"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
    </>
  );
}
