/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   Environment.js - Background & Atmosphere
   ============================================ */

import * as THREE from 'three';

class Environment {
    constructor(options = {}) {
        this.engine = options.engine;
        this.performanceTier = options.performanceTier || 'high';
        
        this.group = new THREE.Group();
        this.group.name = 'Environment';
        
        // References for animation
        this.starfield = null;
        this.starSizes = null;
        this.starPhases = null;
        this.nebulas = [];
        this.destinationPortal = null;
        this.portalRings = [];
        this.flowParticles = null;
        this.flowPositions = null;
        
        this.init();
    }
    
    /* =========================================
       INITIALIZATION
       ========================================= */
    init() {
        this.createStarfield();
        this.createNebulas();
        this.createDestinationPortal();
        this.createFlowParticles();
        
        // Add to scene
        this.engine.add(this.group);
        
        console.log('%c[Environment] Initialized', 'color: #4a9eff;');
    }
    
    /* =========================================
       STARFIELD - Twinkling stars
       ========================================= */
    createStarfield() {
        const starCount = this.performanceTier === 'high' ? 5000 : 
                          this.performanceTier === 'medium' ? 2500 : 1000;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        const colors = new Float32Array(starCount * 3);
        const phases = new Float32Array(starCount); // For twinkling
        
        // Star color palette
        const starColors = [
            new THREE.Color(0xffffff),   // White
            new THREE.Color(0xaaccff),   // Light blue
            new THREE.Color(0xffeedd),   // Warm white
            new THREE.Color(0x4a9eff),   // Accent blue
            new THREE.Color(0xddaaff),   // Light purple
            new THREE.Color(0xaaffff),   // Cyan
        ];
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Spherical distribution - more stars in the "forward" direction
            const radius = 100 + Math.random() * 400;
            const theta = Math.random() * Math.PI * 2;
            // Bias phi towards the front (negative Z)
            const phi = Math.acos((Math.random() * 1.5) - 0.5);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = -Math.abs(radius * Math.cos(phi)); // Push towards negative Z
            
            // Variable sizes - mostly small, some large
            const sizeRand = Math.random();
            if (sizeRand > 0.98) {
                sizes[i] = 3 + Math.random() * 2; // Big bright stars (2%)
            } else if (sizeRand > 0.9) {
                sizes[i] = 1.5 + Math.random() * 1.5; // Medium stars (8%)
            } else {
                sizes[i] = 0.5 + Math.random() * 1; // Small stars (90%)
            }
            
            // Random color from palette
            const color = starColors[Math.floor(Math.random() * starColors.length)];
            const brightness = 0.6 + Math.random() * 0.4;
            colors[i3] = color.r * brightness;
            colors[i3 + 1] = color.g * brightness;
            colors[i3 + 2] = color.b * brightness;
            
            // Random phase for twinkling
            phases[i] = Math.random() * Math.PI * 2;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Store for animation
        this.starSizes = sizes.slice();
        this.starPhases = phases;
        
        // Shader material for twinkling stars
        const material = new THREE.PointsMaterial({
            size: 2,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.starfield = new THREE.Points(geometry, material);
        this.starfield.name = 'Starfield';
        this.group.add(this.starfield);
    }
    
    /* =========================================
       NEBULAS - Colorful space clouds
       ========================================= */
    createNebulas() {
        if (this.performanceTier === 'low') return;
        
        // Multiple layered nebulas for depth
        const nebulaConfigs = [
            { color: 0x4a9eff, opacity: 0.08, z: -350, scale: 500, rotation: 0.3 },
            { color: 0x9e4aff, opacity: 0.06, z: -400, scale: 600, rotation: -0.5 },
            { color: 0x4affff, opacity: 0.04, z: -450, scale: 700, rotation: 0.8 },
            { color: 0xff4a9e, opacity: 0.03, z: -500, scale: 550, rotation: -0.2 },
            // Central glow (where portal is)
            { color: 0x4a9eff, opacity: 0.15, z: -280, scale: 200, rotation: 0, x: 0, y: 0 },
        ];
        
        nebulaConfigs.forEach((config, index) => {
            // Create gradient texture for nebula
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            
            // Radial gradient
            const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
            gradient.addColorStop(0, `rgba(255, 255, 255, 1)`);
            gradient.addColorStop(0.3, `rgba(255, 255, 255, 0.5)`);
            gradient.addColorStop(0.6, `rgba(255, 255, 255, 0.2)`);
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 256, 256);
            
            const texture = new THREE.CanvasTexture(canvas);
            
            const geometry = new THREE.PlaneGeometry(config.scale, config.scale);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                map: texture,
                transparent: true,
                opacity: config.opacity,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            
            const nebula = new THREE.Mesh(geometry, material);
            nebula.position.z = config.z;
            nebula.position.x = config.x !== undefined ? config.x : (Math.random() - 0.5) * 150;
            nebula.position.y = config.y !== undefined ? config.y : (Math.random() - 0.5) * 150;
            nebula.rotation.z = config.rotation;
            
            this.nebulas.push(nebula);
            this.group.add(nebula);
        });
    }
    
    /* =========================================
       DESTINATION PORTAL - The "call to scroll"
       ========================================= */
    createDestinationPortal() {
        const portalGroup = new THREE.Group();
        portalGroup.position.z = -300;
        
        // Central glowing orb
        const coreGeometry = new THREE.SphereGeometry(8, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a9eff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        portalGroup.add(core);
        
        // Inner glow
        const glowGeometry = new THREE.SphereGeometry(15, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a9eff,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        portalGroup.add(glow);
        
        // Outer glow
        const outerGlowGeometry = new THREE.SphereGeometry(30, 32, 32);
        const outerGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a9eff,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });
        const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
        portalGroup.add(outerGlow);
        
        // Rotating rings around portal
        const ringColors = [0x4a9eff, 0x9e4aff, 0x4affff];
        const ringSizes = [25, 35, 45];
        
        ringSizes.forEach((size, i) => {
            const ringGeometry = new THREE.TorusGeometry(size, 0.3, 16, 100);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: ringColors[i % ringColors.length],
                transparent: true,
                opacity: 0.4 - i * 0.1,
                blending: THREE.AdditiveBlending
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI * 0.5 + (i * 0.2);
            ring.rotation.y = i * 0.3;
            this.portalRings.push({
                mesh: ring,
                speed: 0.3 + i * 0.15,
                axis: i % 2 === 0 ? 'x' : 'y'
            });
            portalGroup.add(ring);
        });
        
        this.destinationPortal = portalGroup;
        this.group.add(portalGroup);
    }
    
    /* =========================================
       FLOW PARTICLES - Guide towards portal
       ========================================= */
    createFlowParticles() {
        const count = this.performanceTier === 'high' ? 300 : 150;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const speeds = new Float32Array(count);
        
        const color1 = new THREE.Color(0x4a9eff);
        const color2 = new THREE.Color(0xffffff);
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // Start scattered, will flow towards portal
            const angle = Math.random() * Math.PI * 2;
            const radius = 20 + Math.random() * 80;
            
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = Math.sin(angle) * radius;
            positions[i3 + 2] = Math.random() * 200; // Spread along Z
            
            // Color gradient
            const t = Math.random();
            colors[i3] = color1.r + (color2.r - color1.r) * t;
            colors[i3 + 1] = color1.g + (color2.g - color1.g) * t;
            colors[i3 + 2] = color1.b + (color2.b - color1.b) * t;
            
            speeds[i] = 20 + Math.random() * 40;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        this.flowSpeeds = speeds;
        this.flowPositions = positions.slice();
        
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.flowParticles = new THREE.Points(geometry, material);
        this.group.add(this.flowParticles);
    }
    
    /* =========================================
       UPDATE
       ========================================= */
    update(delta, elapsed) {
        // Slowly rotate starfield
        if (this.starfield) {
            this.starfield.rotation.y += delta * 0.005;
            this.starfield.rotation.x += delta * 0.002;
            
            // Twinkle stars
            const sizes = this.starfield.geometry.attributes.size.array;
            for (let i = 0; i < sizes.length; i++) {
                const twinkle = Math.sin(elapsed * 2 + this.starPhases[i]) * 0.5 + 0.5;
                sizes[i] = this.starSizes[i] * (0.5 + twinkle * 0.5);
            }
            this.starfield.geometry.attributes.size.needsUpdate = true;
        }
        
        // Rotate nebulas slowly
        this.nebulas.forEach((nebula, i) => {
            nebula.rotation.z += delta * 0.01 * (i % 2 === 0 ? 1 : -1);
        });
        
        // Pulse portal
        if (this.destinationPortal) {
            const pulse = Math.sin(elapsed * 2) * 0.2 + 1;
            this.destinationPortal.scale.setScalar(pulse);
            
            // Rotate portal rings
            this.portalRings.forEach((ring) => {
                if (ring.axis === 'x') {
                    ring.mesh.rotation.x += delta * ring.speed;
                } else {
                    ring.mesh.rotation.y += delta * ring.speed;
                }
                ring.mesh.rotation.z += delta * 0.1;
            });
        }
        
        // Flow particles towards portal
        if (this.flowParticles) {
            const positions = this.flowParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length / 3; i++) {
                const i3 = i * 3;
                
                // Move towards portal (negative Z)
                positions[i3 + 2] -= this.flowSpeeds[i] * delta;
                
                // Spiral inward as they approach
                const z = positions[i3 + 2];
                if (z < -200) {
                    const factor = (-z - 200) / 100;
                    const angle = elapsed * 2 + i * 0.1;
                    positions[i3] *= 0.98;
                    positions[i3 + 1] *= 0.98;
                    positions[i3] += Math.cos(angle) * factor * 0.5;
                    positions[i3 + 1] += Math.sin(angle) * factor * 0.5;
                }
                
                // Reset when past portal
                if (z < -320) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = 20 + Math.random() * 80;
                    positions[i3] = Math.cos(angle) * radius;
                    positions[i3 + 1] = Math.sin(angle) * radius;
                    positions[i3 + 2] = 100 + Math.random() * 100;
                }
            }
            
            this.flowParticles.geometry.attributes.position.needsUpdate = true;
        }
    }
    
    /* =========================================
       DISPOSE
       ========================================= */
    dispose() {
        this.group.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (child.material.map) child.material.map.dispose();
                child.material.dispose();
            }
        });
        this.engine.remove(this.group);
    }
}

export default Environment;
