/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   ZoneManager.js - Zone Navigation Controller
   ============================================ */

class ZoneManager {
    constructor(options = {}) {
        this.engine = options.engine;
        this.camera = options.camera;
        this.events = options.events;
        this.performanceTier = options.performanceTier || 'high';
        
        // Zone state
        this.currentZone = 0;
        this.totalZones = 5;
        this.isTransitioning = false;
        
        // Zone definitions
        this.zones = [
            { name: 'ENTRY', index: 0 },
            { name: 'IDENTITY', index: 1 },
            { name: 'ARSENAL', index: 2 },
            { name: 'MISSIONS', index: 3 },
            { name: 'CONNECT', index: 4 }
        ];
        
        // Scroll handling
        this.scrollAccumulator = 0;
        this.scrollThreshold = 100;
        
        this.init();
    }
    
    /* =========================================
       INITIALIZATION
       ========================================= */
    init() {
        this.bindScrollEvents();
        
        console.log('%c[ZoneManager] Initialized', 'color: #4a9eff;');
    }
    
    /* =========================================
       SCROLL EVENTS
       ========================================= */
    bindScrollEvents() {
        // Wheel event for scroll hijacking
        window.addEventListener('wheel', (e) => {
            if (this.isTransitioning) {
                e.preventDefault();
                return;
            }
            
            this.scrollAccumulator += e.deltaY;
            
            if (Math.abs(this.scrollAccumulator) > this.scrollThreshold) {
                if (this.scrollAccumulator > 0) {
                    // Scroll down - next zone
                    this.goToZone(this.currentZone + 1);
                } else {
                    // Scroll up - previous zone
                    this.goToZone(this.currentZone - 1);
                }
                this.scrollAccumulator = 0;
            }
        }, { passive: false });
    }
    
    /* =========================================
       GO TO ZONE
       ========================================= */
    async goToZone(index) {
        // Bounds check
        if (index < 0 || index >= this.totalZones) return;
        if (index === this.currentZone) return;
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        const previousZone = this.currentZone;
        this.currentZone = index;
        
        // Emit event
        if (this.events) {
            this.events.emit('zone:change', index, previousZone);
        }
        
        // Show zone title
        this.showZoneTitle(index);
        
        // Move camera
        if (this.camera) {
            await this.camera.moveToZone(index, 1.5);
        }
        
        this.isTransitioning = false;
    }
    
    /* =========================================
       SHOW ZONE TITLE
       ========================================= */
    showZoneTitle(index) {
        const titleElement = document.getElementById('zoneTitle');
        const indexElement = titleElement.querySelector('.zone-title-index');
        const nameElement = titleElement.querySelector('.zone-title-name');
        
        const zone = this.zones[index];
        
        indexElement.textContent = String(zone.index).padStart(2, '0');
        nameElement.textContent = zone.name;
        
        // Trigger animation
        titleElement.classList.remove('visible');
        void titleElement.offsetWidth; // Force reflow
        titleElement.classList.add('visible');
    }
    
    /* =========================================
       UPDATE
       ========================================= */
    update(delta, elapsed) {
        // Zone-specific updates can go here
    }
    
    /* =========================================
       GETTERS
       ========================================= */
    getCurrentZone() {
        return this.currentZone;
    }
    
    getZoneInfo(index) {
        return this.zones[index];
    }
}

export default ZoneManager;
