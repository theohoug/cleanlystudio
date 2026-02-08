/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   Lights.js - Scene Lighting
   ============================================ */

import * as THREE from 'three';

class Lights {
    constructor(options = {}) {
        this.engine = options.engine;
        this.performanceTier = options.performanceTier || 'high';
        
        this.group = new THREE.Group();
        this.group.name = 'Lights';
        
        // Light references
        this.ambientLight = null;
        this.mainLight = null;
        this.accentLights = [];
        
        this.init();
    }
    
    /* =========================================
       INITIALIZATION
       ========================================= */
    init() {
        this.createAmbientLight();
        this.createMainLight();
        
        if (this.performanceTier !== 'low') {
            this.createAccentLights();
        }
        
        // Add to scene
        this.engine.add(this.group);
        
        console.log('%c[Lights] Initialized', 'color: #4a9eff;');
    }
    
    /* =========================================
       AMBIENT LIGHT
       ========================================= */
    createAmbientLight() {
        // Very subtle ambient light (void is mostly dark)
        this.ambientLight = new THREE.AmbientLight(0x101020, 0.3);
        this.group.add(this.ambientLight);
    }
    
    /* =========================================
       MAIN LIGHT
       ========================================= */
    createMainLight() {
        // Main directional light (like distant sun/star)
        this.mainLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.mainLight.position.set(50, 50, 50);
        
        // Shadows (high tier only)
        if (this.performanceTier === 'high') {
            this.mainLight.castShadow = true;
            this.mainLight.shadow.mapSize.width = 1024;
            this.mainLight.shadow.mapSize.height = 1024;
            this.mainLight.shadow.camera.near = 0.5;
            this.mainLight.shadow.camera.far = 200;
        }
        
        this.group.add(this.mainLight);
    }
    
    /* =========================================
       ACCENT LIGHTS
       ========================================= */
    createAccentLights() {
        // Blue accent light
        const blueLight = new THREE.PointLight(0x4a9eff, 1, 100);
        blueLight.position.set(-30, 20, 10);
        this.accentLights.push(blueLight);
        this.group.add(blueLight);
        
        // Purple accent light
        const purpleLight = new THREE.PointLight(0x9e4aff, 0.5, 80);
        purpleLight.position.set(30, -10, 20);
        this.accentLights.push(purpleLight);
        this.group.add(purpleLight);
        
        // Cyan subtle fill
        const cyanLight = new THREE.PointLight(0x4affff, 0.3, 60);
        cyanLight.position.set(0, 30, -20);
        this.accentLights.push(cyanLight);
        this.group.add(cyanLight);
    }
    
    /* =========================================
       UPDATE
       ========================================= */
    update(delta, elapsed) {
        // Subtle light animation
        this.accentLights.forEach((light, index) => {
            const offset = index * 2;
            light.intensity = light.userData.baseIntensity || light.intensity;
            light.intensity *= 0.9 + Math.sin(elapsed + offset) * 0.1;
        });
    }
    
    /* =========================================
       SET HOVER LIGHTING (Split screen)
       ========================================= */
    setHoverLighting(side) {
        const configs = {
            studio:  { color1: 0x4a9eff, color2: 0x4affff, intensity: 1.2 },
            events:  { color1: 0xff4a6a, color2: 0xff9e4a, intensity: 1.2 },
            neutral: { color1: 0x4a9eff, color2: 0x9e4aff, intensity: 1.0 }
        };

        const config = configs[side] || configs.neutral;

        if (this.accentLights.length >= 2 && window.gsap) {
            const c1 = new THREE.Color(config.color1);
            const c2 = new THREE.Color(config.color2);

            gsap.to(this.accentLights[0].color, {
                r: c1.r, g: c1.g, b: c1.b,
                duration: 0.8,
                ease: 'power2.out'
            });
            gsap.to(this.accentLights[1].color, {
                r: c2.r, g: c2.g, b: c2.b,
                duration: 0.8,
                ease: 'power2.out'
            });
            gsap.to(this.accentLights[0], {
                intensity: config.intensity,
                duration: 0.8,
                ease: 'power2.out'
            });
        }
    }

    /* =========================================
       SET ZONE LIGHTING
       ========================================= */
    setZoneLighting(zoneIndex) {
        // Adjust lighting based on current zone
        const zoneSettings = [
            { ambient: 0.3, main: 0.5 },  // Entry - neutral
            { ambient: 0.4, main: 0.4 },  // Identity - slightly warmer
            { ambient: 0.3, main: 0.6 },  // Arsenal - more contrast
            { ambient: 0.35, main: 0.5 }, // Missions - balanced
            { ambient: 0.5, main: 0.3 }   // Connect - softer
        ];
        
        const settings = zoneSettings[zoneIndex] || zoneSettings[0];
        
        if (window.gsap) {
            gsap.to(this.ambientLight, { intensity: settings.ambient, duration: 1 });
            gsap.to(this.mainLight, { intensity: settings.main, duration: 1 });
        } else {
            this.ambientLight.intensity = settings.ambient;
            this.mainLight.intensity = settings.main;
        }
    }
    
    /* =========================================
       DISPOSE
       ========================================= */
    dispose() {
        this.group.traverse((child) => {
            if (child.dispose) child.dispose();
        });
        this.engine.remove(this.group);
    }
}

export default Lights;
