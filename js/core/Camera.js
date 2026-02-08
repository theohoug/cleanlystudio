/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   Camera.js - Camera Controller with 360° Parallax
   ============================================ */

class Camera {
    constructor(options = {}) {
        this.engine = options.engine;
        this.performanceTier = options.performanceTier || 'high';
        
        // Camera reference
        this.camera = this.engine.getCamera();
        
        // Mouse position for parallax (-1 to 1)
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        
        // Parallax settings - MUCH more intense for 360° feel
        this.parallaxIntensityX = this.performanceTier === 'low' ? 0.3 : 0.8; // Horizontal (almost 180°)
        this.parallaxIntensityY = this.performanceTier === 'low' ? 0.2 : 0.4; // Vertical (limited)
        this.parallaxSmoothing = 0.03; // Slower = more cinematic
        
        // Camera positions for each zone
        this.zonePositions = [
            { x: 0, y: 0, z: 50, lookZ: -300 },   // Zone 0 - Entry (looking at portal)
            { x: 0, y: 0, z: 20, lookZ: -200 },   // Zone 1 - Identity
            { x: 0, y: 0, z: -10, lookZ: -100 },  // Zone 2 - Arsenal
            { x: 0, y: 0, z: -40, lookZ: 0 },     // Zone 3 - Missions
            { x: 0, y: 0, z: -70, lookZ: 50 }     // Zone 4 - Connect
        ];
        
        // Current state
        this.currentZone = 0;
        this.isMoving = false;
        this.baseRotation = { x: 0, y: 0 };
        
        // Breathing animation
        this.breatheAmount = 0.5;
        this.breatheSpeed = 0.5;
        
        console.log('%c[Camera] Initialized with 360° parallax', 'color: #4a9eff;');
    }
    
    /* =========================================
       UPDATE (called every frame)
       ========================================= */
    update(delta, elapsed) {
        // Smooth mouse tracking for parallax
        this.mouseX += (this.targetMouseX - this.mouseX) * this.parallaxSmoothing;
        this.mouseY += (this.targetMouseY - this.mouseY) * this.parallaxSmoothing;
        
        // Apply parallax rotation to camera - QUASI 360°
        // X rotation (looking up/down) - limited to avoid disorientation
        const rotationX = this.mouseY * this.parallaxIntensityY * Math.PI * 0.3;
        
        // Y rotation (looking left/right) - almost full rotation possible
        const rotationY = -this.mouseX * this.parallaxIntensityX * Math.PI * 0.6;
        
        this.camera.rotation.x = this.baseRotation.x + rotationX;
        this.camera.rotation.y = this.baseRotation.y + rotationY;
        
        // Subtle breathing animation
        const breathe = Math.sin(elapsed * this.breatheSpeed) * this.breatheAmount;
        this.camera.position.y += breathe * delta;
        
        // Subtle sway
        const sway = Math.sin(elapsed * 0.3) * 0.1;
        this.camera.position.x += sway * delta;
    }
    
    /* =========================================
       SET MOUSE POSITION
       ========================================= */
    setMousePosition(x, y) {
        // x and y are -1 to 1
        this.targetMouseX = x;
        this.targetMouseY = y;
    }
    
    /* =========================================
       MOVE TO ZONE
       ========================================= */
    async moveToZone(zoneIndex, duration = 2) {
        if (this.isMoving) return;
        if (zoneIndex < 0 || zoneIndex >= this.zonePositions.length) return;
        
        this.isMoving = true;
        this.currentZone = zoneIndex;
        
        const targetPos = this.zonePositions[zoneIndex];
        
        // Use GSAP for smooth camera movement
        if (window.gsap) {
            await new Promise((resolve) => {
                // Animate position
                gsap.to(this.camera.position, {
                    x: targetPos.x,
                    y: targetPos.y,
                    z: targetPos.z,
                    duration: duration,
                    ease: 'power2.inOut'
                });
                
                // Slight rotation during transition for drama
                gsap.to(this.baseRotation, {
                    x: 0,
                    y: 0,
                    duration: duration,
                    ease: 'power2.inOut',
                    onComplete: resolve
                });
            });
        } else {
            // Fallback - instant move
            this.camera.position.set(targetPos.x, targetPos.y, targetPos.z);
        }
        
        this.isMoving = false;
    }
    
    /* =========================================
       DRIFT TO SIDE (Split hover effect)
       ========================================= */
    driftToSide(side) {
        const targetX = side === 'studio' ? -3 : side === 'events' ? 3 : 0;

        if (window.gsap) {
            gsap.to(this.camera.position, {
                x: targetX,
                duration: 1.2,
                ease: 'power2.out'
            });
        } else {
            this.camera.position.x = targetX;
        }
    }

    /* =========================================
       RESET POSITION (Back to zone 0)
       ========================================= */
    resetPosition() {
        const pos = this.zonePositions[0];
        if (window.gsap) {
            gsap.to(this.camera.position, {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                duration: 1.5,
                ease: 'power2.inOut'
            });
        } else {
            this.camera.position.set(pos.x, pos.y, pos.z);
        }
    }

    /* =========================================
       RESIZE
       ========================================= */
    resize() {
        // Camera aspect is handled by Engine
    }
    
    /* =========================================
       GETTERS
       ========================================= */
    getPosition() {
        return this.camera.position.clone();
    }
    
    getCamera() {
        return this.camera;
    }
    
    getRotation() {
        return {
            x: this.camera.rotation.x,
            y: this.camera.rotation.y,
            z: this.camera.rotation.z
        };
    }
}

export default Camera;
