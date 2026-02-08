/* ============================================
   CLEANLY - SPLIT CONTROLLER
   Orchestrates the split hero screen interactions
   ============================================ */

class SplitController {
    constructor(options = {}) {
        this.engine = options.engine;
        this.camera = options.camera;
        this.particles = options.particles;
        this.lights = options.lights;
        this.postProcessing = options.postProcessing;
        this.events = options.events;
        this.dom = options.dom;
        this.performanceTier = options.performanceTier || 'high';
        this.zoneManager = options.zoneManager;

        // State
        this.currentMode = 'split'; // 'split' | 'studio' | 'events'
        this.hoveredSide = null;    // null | 'studio' | 'events'
        this.isTransitioning = false;

        // DOM references
        this.splitContainer = document.getElementById('split-container');
        this.splitStudio = document.getElementById('splitStudio');
        this.splitEvents = document.getElementById('splitEvents');
        this.eventsContent = document.getElementById('events-content');
        this.backFromEvents = document.getElementById('backFromEvents');
        this.backToSplit = document.getElementById('backToSplit');
        this.splitDivider = document.getElementById('splitDivider');
        this.uiOverlay = document.getElementById('ui-overlay');

        this.init();
    }

    /* =========================================
       INITIALIZATION
       ========================================= */
    init() {
        this.bindHoverEvents();
        this.bindClickEvents();
        this.bindBackEvents();

        console.log('%c[SplitController] Initialized', 'color: #4a9eff;');
    }

    /* =========================================
       HOVER EVENTS
       ========================================= */
    bindHoverEvents() {
        // Studio side
        this.splitStudio.addEventListener('mouseenter', () => {
            if (this.currentMode !== 'split' || this.isTransitioning) return;
            this.onSideHover('studio');
        });

        this.splitStudio.addEventListener('mouseleave', () => {
            if (this.currentMode !== 'split' || this.isTransitioning) return;
            this.onSideLeave();
        });

        // Events side
        this.splitEvents.addEventListener('mouseenter', () => {
            if (this.currentMode !== 'split' || this.isTransitioning) return;
            this.onSideHover('events');
        });

        this.splitEvents.addEventListener('mouseleave', () => {
            if (this.currentMode !== 'split' || this.isTransitioning) return;
            this.onSideLeave();
        });
    }

    onSideHover(side) {
        if (this.hoveredSide === side) return;
        this.hoveredSide = side;

        // React 3D scene
        if (this.particles && this.particles.setColorBias) {
            this.particles.setColorBias(side);
        }

        if (this.lights && this.lights.setHoverLighting) {
            this.lights.setHoverLighting(side);
        }

        if (this.camera && this.camera.driftToSide) {
            this.camera.driftToSide(side);
        }
    }

    onSideLeave() {
        this.hoveredSide = null;

        // Reset 3D scene to neutral
        if (this.particles && this.particles.setColorBias) {
            this.particles.setColorBias(null);
        }

        if (this.lights && this.lights.setHoverLighting) {
            this.lights.setHoverLighting(null);
        }

        if (this.camera && this.camera.driftToSide) {
            this.camera.driftToSide(null);
        }
    }

    /* =========================================
       CLICK / SELECTION EVENTS
       ========================================= */
    bindClickEvents() {
        // Studio CTA
        const studioCta = this.splitStudio.querySelector('.split-cta');
        if (studioCta) {
            studioCta.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.selectSide('studio');
            });
        }

        // Events CTA
        const eventsCta = this.splitEvents.querySelector('.split-cta');
        if (eventsCta) {
            eventsCta.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.selectSide('events');
            });
        }
    }

    /* =========================================
       SELECT A SIDE — Cinematic transition
       ========================================= */
    async selectSide(side) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const tl = gsap.timeline({
            onComplete: () => {
                this.isTransitioning = false;
            }
        });

        // 1. Fade out opposite side content
        const oppositeSide = side === 'studio' ? this.splitEvents : this.splitStudio;
        const oppositeContent = oppositeSide.querySelector('.split-content');

        tl.to(oppositeContent, {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: 'power2.in'
        });

        // 2. Fade out divider
        tl.to(this.splitDivider, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        }, '<');

        // 3. Expand chosen side via CSS class
        tl.call(() => {
            this.splitContainer.classList.add(`${side}-selected`);
        });

        // 4. Bloom flash (if post-processing available)
        if (this.postProcessing && this.performanceTier !== 'low') {
            tl.call(() => {
                this.bloomFlash();
            }, null, '+=0.2');
        }

        // 5. Wait for expansion
        tl.to({}, { duration: 0.6 });

        // 6. Fade out split content of the chosen side
        const chosenContent = (side === 'studio' ? this.splitStudio : this.splitEvents).querySelector('.split-content');
        tl.to(chosenContent, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        });

        // 7. Hide split container, show appropriate content
        tl.call(() => {
            this.splitContainer.classList.add('hidden');
            this.splitContainer.classList.remove('visible');

            if (side === 'studio') {
                this.showStudioContent();
            } else {
                this.showEventsContent();
            }

            this.currentMode = side;
        });

        // 8. Animate in the new content
        if (side === 'events') {
            tl.call(() => {
                this.animateEventsIn();
            }, null, '+=0.1');
        }
    }

    /* =========================================
       SHOW STUDIO CONTENT
       ========================================= */
    showStudioContent() {
        // Show existing UI overlay (nav, HUD, scroll indicator)
        this.uiOverlay.classList.add('visible');

        // Show back button in nav
        if (this.backToSplit) {
            this.backToSplit.classList.add('visible');
        }

        // Emit event so main.js can activate zone navigation
        if (this.events) {
            this.events.emit('mode:studio');
        }
    }

    /* =========================================
       SHOW EVENTS CONTENT
       ========================================= */
    showEventsContent() {
        this.eventsContent.classList.remove('hidden');

        // Set particles to events color permanently
        if (this.particles && this.particles.setColorBias) {
            this.particles.setColorBias('events');
        }

        if (this.lights && this.lights.setHoverLighting) {
            this.lights.setHoverLighting('events');
        }
    }

    animateEventsIn() {
        const title = this.eventsContent.querySelector('.events-main-title');
        const subtitle = this.eventsContent.querySelector('.events-subtitle');
        const cards = this.eventsContent.querySelectorAll('.event-card');
        const nav = this.eventsContent.querySelector('.events-nav');

        const tl = gsap.timeline();

        if (nav) {
            tl.fromTo(nav,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
        }

        if (title) {
            tl.fromTo(title,
                { opacity: 0, y: 40, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' },
                '-=0.2'
            );
        }

        if (subtitle) {
            tl.fromTo(subtitle,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                '-=0.4'
            );
        }

        if (cards.length) {
            tl.fromTo(cards,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' },
                '-=0.2'
            );
        }
    }

    /* =========================================
       BACK EVENTS
       ========================================= */
    bindBackEvents() {
        // Back from Events
        if (this.backFromEvents) {
            this.backFromEvents.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.backToSplitScreen();
            });
        }

        // Back from Studio (nav button)
        if (this.backToSplit) {
            this.backToSplit.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.backToSplitScreen();
            });
        }
    }

    /* =========================================
       BACK TO SPLIT — Reverse transition
       ========================================= */
    async backToSplitScreen() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const previousMode = this.currentMode;

        const tl = gsap.timeline({
            onComplete: () => {
                this.isTransitioning = false;
            }
        });

        // 1. Fade out current content
        if (previousMode === 'events') {
            tl.to(this.eventsContent, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    this.eventsContent.classList.add('hidden');
                    // Reset opacity for next show
                    gsap.set(this.eventsContent, { opacity: 1 });
                }
            });
        } else if (previousMode === 'studio') {
            // Hide UI overlay
            tl.to(this.uiOverlay, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    this.uiOverlay.classList.remove('visible');
                    if (this.backToSplit) {
                        this.backToSplit.classList.remove('visible');
                    }
                }
            });

            // Emit event to deactivate zone navigation
            if (this.events) {
                this.events.emit('mode:split');
            }
        }

        // 2. Reset 3D scene to neutral
        tl.call(() => {
            if (this.particles && this.particles.setColorBias) {
                this.particles.setColorBias(null);
            }
            if (this.lights && this.lights.setHoverLighting) {
                this.lights.setHoverLighting(null);
            }
            if (this.camera) {
                if (this.camera.resetPosition) {
                    this.camera.resetPosition();
                } else if (this.camera.driftToSide) {
                    this.camera.driftToSide(null);
                }
            }
        });

        // 3. Prepare split container for re-entry
        tl.call(() => {
            // Reset selection classes
            this.splitContainer.classList.remove('studio-selected', 'events-selected');

            // Reset all content opacity
            const allContents = this.splitContainer.querySelectorAll('.split-content');
            allContents.forEach(c => {
                gsap.set(c, { opacity: 1, scale: 1 });
            });

            gsap.set(this.splitDivider, { opacity: 1 });

            // Show split container
            this.splitContainer.classList.remove('hidden');
            this.splitContainer.classList.add('visible');
        }, null, '+=0.1');

        // 4. Play a quick re-reveal of split content
        tl.call(() => {
            this.playQuickReveal();
        }, null, '+=0.1');

        // 5. Update state
        tl.call(() => {
            this.currentMode = 'split';
            this.hoveredSide = null;
        });
    }

    /* =========================================
       BLOOM FLASH EFFECT
       ========================================= */
    bloomFlash() {
        if (!this.postProcessing || !this.postProcessing.passes || !this.postProcessing.passes.bloom) return;

        const bloom = this.postProcessing.passes.bloom;
        const originalStrength = bloom.strength;

        gsap.to(bloom, {
            strength: 2.5,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
                gsap.to(bloom, {
                    strength: originalStrength,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            }
        });
    }

    /* =========================================
       REVEAL ANIMATION — After loader
       ========================================= */
    playRevealTimeline() {
        this.splitContainer.classList.add('visible');

        const labels = this.splitContainer.querySelectorAll('.split-label');
        const titles = this.splitContainer.querySelectorAll('.split-title');
        const taglines = this.splitContainer.querySelectorAll('.split-tagline');
        const services = this.splitContainer.querySelectorAll('.split-services');
        const ctas = this.splitContainer.querySelectorAll('.split-cta');
        const metas = this.splitContainer.querySelectorAll('.split-meta');
        const dividerLines = this.splitContainer.querySelectorAll('.divider-line');
        const dividerSymbol = this.splitContainer.querySelector('.divider-symbol');

        const tl = gsap.timeline({ delay: 0.3 });

        // Divider lines draw in
        tl.to(dividerLines, {
            scaleY: 1,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.1
        });

        // Diamond symbol
        if (dividerSymbol) {
            tl.to(dividerSymbol, {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out'
            }, '-=0.4');
        }

        // Labels "PILIER A" / "PILIER B"
        tl.to(labels, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.1
        }, '-=0.2');

        // Titles
        tl.to(titles, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.15
        }, '-=0.1');

        // Taglines
        tl.to(taglines, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.1
        }, '-=0.3');

        // Service tags
        tl.to(services, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.1
        }, '-=0.2');

        // CTAs
        tl.fromTo(ctas,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.15 },
            '-=0.2'
        );

        // Meta texts
        tl.to(metas, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            stagger: 0.1
        }, '-=0.2');

        return tl;
    }

    /* =========================================
       QUICK REVEAL — When returning to split
       ========================================= */
    playQuickReveal() {
        const labels = this.splitContainer.querySelectorAll('.split-label');
        const titles = this.splitContainer.querySelectorAll('.split-title');
        const taglines = this.splitContainer.querySelectorAll('.split-tagline');
        const services = this.splitContainer.querySelectorAll('.split-services');
        const ctas = this.splitContainer.querySelectorAll('.split-cta');
        const metas = this.splitContainer.querySelectorAll('.split-meta');
        const dividerSymbol = this.splitContainer.querySelector('.divider-symbol');

        // Set everything visible immediately for a fast return
        const allElements = [...labels, ...titles, ...taglines, ...services, ...ctas, ...metas];
        if (dividerSymbol) allElements.push(dividerSymbol);

        const tl = gsap.timeline();

        tl.fromTo(allElements,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.03 }
        );

        return tl;
    }

    /* =========================================
       GETTERS
       ========================================= */
    getMode() {
        return this.currentMode;
    }

    isInSplitMode() {
        return this.currentMode === 'split';
    }
}

export default SplitController;
