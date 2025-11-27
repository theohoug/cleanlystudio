/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   HUD.js - Heads-Up Display
   ============================================ */

class HUD {
    constructor(options = {}) {
        this.events = options.events;
        
        // DOM Elements
        this.dom = {
            coordX: document.getElementById('hudCoordX'),
            coordY: document.getElementById('hudCoordY'),
            zone: document.getElementById('hudZone'),
            depth: document.getElementById('hudDepth')
        };
        
        // State
        this.currentZone = 0;
        this.depth = 0;
        
        this.init();
    }
    
    /* =========================================
       INITIALIZATION
       ========================================= */
    init() {
        // Subscribe to events
        if (this.events) {
            this.events.on('zone:change', (index) => {
                this.updateZone(index);
            });
            
            this.events.on('camera:position:update', (position) => {
                this.updateCoords(position);
            });
        }
        
        console.log('%c[HUD] Initialized', 'color: #4a9eff;');
    }
    
    /* =========================================
       UPDATE COORDINATES
       ========================================= */
    updateCoords(position) {
        if (!position) return;
        
        // Format coordinates
        const x = position.x.toFixed(2);
        const y = position.y.toFixed(2);
        const z = position.z.toFixed(2);
        
        this.dom.coordX.textContent = `X: ${x}`;
        this.dom.coordY.textContent = `Y: ${y}`;
        this.dom.depth.textContent = z;
        
        this.depth = position.z;
    }
    
    /* =========================================
       UPDATE ZONE
       ========================================= */
    updateZone(index) {
        this.currentZone = index;
        this.dom.zone.textContent = String(index).padStart(2, '0');
        
        // Add animation class
        this.dom.zone.classList.add('updated');
        setTimeout(() => {
            this.dom.zone.classList.remove('updated');
        }, 300);
    }
    
    /* =========================================
       SHOW/HIDE
       ========================================= */
    show() {
        document.querySelectorAll('.hud-corner').forEach((corner) => {
            corner.style.opacity = '1';
        });
    }
    
    hide() {
        document.querySelectorAll('.hud-corner').forEach((corner) => {
            corner.style.opacity = '0';
        });
    }
}

export default HUD;
