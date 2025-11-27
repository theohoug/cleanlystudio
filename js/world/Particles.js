/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   Particles.js - Beautiful Round Particles
   ============================================ */

import * as THREE from 'three';

class Particles {
    constructor(options = {}) {
        this.engine = options.engine;
        this.performanceTier = options.performanceTier || 'high';
        this.camera = options.camera;
        
        this.group = new THREE.Group();
        this.group.name = 'Particles';
        
        // Textures
        this.softParticleTexture = null;
        this.glowParticleTexture = null;
        this.starParticleTexture = null;
        
        // Particle systems
        this.ambientParticles = null;
        this.glowOrbs = null;
        this.sparkles = null;
        
        // Animation data
        this.ambientData = null;
        this.glowData = null;
        this.sparkleData = null;
        
        this.init();
    }
    
    /* =========================================
       INITIALIZATION
       ========================================= */
    init() {
        this.createTextures();
        this.createAmbientParticles();
        this.createGlowOrbs();
        this.createSparkles();
        
        // Add to scene
        this.engine.add(this.group);
        
        console.log('%c[Particles] Initialized with beautiful rounds', 'color: #4a9eff;');
    }
    
    /* =========================================
       CREATE HIGH-QUALITY TEXTURES
       ========================================= */
    createTextures() {
        // SOFT PARTICLE - Very smooth gradient circle
        const softCanvas = document.createElement('canvas');
        softCanvas.width = 128;
        softCanvas.height = 128;
        const softCtx = softCanvas.getContext('2d');
        
        const softGradient = softCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
        softGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        softGradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.9)');
        softGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)');
        softGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        softGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
        softGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        softCtx.fillStyle = softGradient;
        softCtx.fillRect(0, 0, 128, 128);
        
        this.softParticleTexture = new THREE.CanvasTexture(softCanvas);
        this.softParticleTexture.needsUpdate = true;
        
        // GLOW ORB - Intense center with soft falloff
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = 128;
        glowCanvas.height = 128;
        const glowCtx = glowCanvas.getContext('2d');
        
        const glowGradient = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        glowGradient.addColorStop(0.05, 'rgba(255, 255, 255, 1)');
        glowGradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        glowGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
        glowGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.15)');
        glowGradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.05)');
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        glowCtx.fillStyle = glowGradient;
        glowCtx.fillRect(0, 0, 128, 128);
        
        this.glowParticleTexture = new THREE.CanvasTexture(glowCanvas);
        this.glowParticleTexture.needsUpdate = true;
        
        // SPARKLE - Sharp bright center
        const sparkleCanvas = document.createElement('canvas');
        sparkleCanvas.width = 64;
        sparkleCanvas.height = 64;
        const sparkleCtx = sparkleCanvas.getContext('2d');
        
        const sparkleGradient = sparkleCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        sparkleGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        sparkleGradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.9)');
        sparkleGradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.3)');
        sparkleGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.1)');
        sparkleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        sparkleCtx.fillStyle = sparkleGradient;
        sparkleCtx.fillRect(0, 0, 64, 64);
        
        this.starParticleTexture = new THREE.CanvasTexture(sparkleCanvas);
        this.starParticleTexture.needsUpdate = true;
    }
    
    /* =========================================
       AMBIENT PARTICLES - Main floating particles
       ========================================= */
    createAmbientParticles() {
        const count = this.performanceTier === 'high' ? 600 : 
                      this.performanceTier === 'medium' ? 300 : 150;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const opacities = new Float32Array(count);
        
        // Beautiful color palette
        const palette = [
            new THREE.Color(0x4a9eff), // Electric blue
            new THREE.Color(0x7ab8ff), // Light blue
            new THREE.Color(0x9e4aff), // Purple
            new THREE.Color(0xc490ff), // Light purple
            new THREE.Color(0x4affff), // Cyan
            new THREE.Color(0xffffff), // White
        ];
        
        this.ambientData = {
            basePositions: new Float32Array(count * 3),
            speeds: new Float32Array(count),
            phases: new Float32Array(count * 3), // xyz phases
            amplitudes: new Float32Array(count)
        };
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // Distribute in camera path area
            positions[i3] = (Math.random() - 0.5) * 180;
            positions[i3 + 1] = (Math.random() - 0.5) * 120;
            positions[i3 + 2] = (Math.random() - 0.5) * 250 - 50;
            
            this.ambientData.basePositions[i3] = positions[i3];
            this.ambientData.basePositions[i3 + 1] = positions[i3 + 1];
            this.ambientData.basePositions[i3 + 2] = positions[i3 + 2];
            
            this.ambientData.speeds[i] = 0.2 + Math.random() * 0.5;
            this.ambientData.phases[i3] = Math.random() * Math.PI * 2;
            this.ambientData.phases[i3 + 1] = Math.random() * Math.PI * 2;
            this.ambientData.phases[i3 + 2] = Math.random() * Math.PI * 2;
            this.ambientData.amplitudes[i] = 2 + Math.random() * 4;
            
            // Random color from palette
            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Variable sizes - mostly small with some larger
            const sizeRand = Math.random();
            if (sizeRand > 0.95) {
                sizes[i] = 8 + Math.random() * 6; // Big (5%)
            } else if (sizeRand > 0.8) {
                sizes[i] = 4 + Math.random() * 4; // Medium (15%)
            } else {
                sizes[i] = 1.5 + Math.random() * 2.5; // Small (80%)
            }
            
            opacities[i] = 0.4 + Math.random() * 0.4;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Custom shader for perfect round particles
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: this.softParticleTexture },
                uTime: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vSize;
                
                void main() {
                    vColor = color;
                    vSize = size;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                varying vec3 vColor;
                varying float vSize;
                
                void main() {
                    vec2 uv = gl_PointCoord;
                    vec4 texColor = texture2D(uTexture, uv);
                    
                    // Apply color
                    vec3 finalColor = vColor * texColor.rgb;
                    float alpha = texColor.a * 0.8;
                    
                    // Discard transparent pixels for cleaner edges
                    if (alpha < 0.01) discard;
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });
        
        this.ambientParticles = new THREE.Points(geometry, material);
        this.group.add(this.ambientParticles);
    }
    
    /* =========================================
       GLOW ORBS - Large beautiful glowing spheres
       ========================================= */
    createGlowOrbs() {
        if (this.performanceTier === 'low') return;
        
        const count = this.performanceTier === 'high' ? 80 : 40;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        
        const orbColors = [
            new THREE.Color(0x4a9eff),
            new THREE.Color(0x9e4aff),
            new THREE.Color(0x4affff),
        ];
        
        this.glowData = {
            basePositions: new Float32Array(count * 3),
            orbitSpeeds: new Float32Array(count),
            orbitRadii: new Float32Array(count),
            phases: new Float32Array(count),
            verticalOffsets: new Float32Array(count)
        };
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            const angle = Math.random() * Math.PI * 2;
            const radius = 40 + Math.random() * 80;
            const height = (Math.random() - 0.5) * 80;
            
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = height;
            positions[i3 + 2] = Math.sin(angle) * radius - 80;
            
            this.glowData.basePositions[i3] = positions[i3];
            this.glowData.basePositions[i3 + 1] = positions[i3 + 1];
            this.glowData.basePositions[i3 + 2] = positions[i3 + 2];
            
            this.glowData.orbitSpeeds[i] = 0.05 + Math.random() * 0.15;
            this.glowData.orbitRadii[i] = radius;
            this.glowData.phases[i] = angle;
            this.glowData.verticalOffsets[i] = Math.random() * Math.PI * 2;
            
            const color = orbColors[Math.floor(Math.random() * orbColors.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            sizes[i] = 15 + Math.random() * 25;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: this.glowParticleTexture },
                uTime: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (400.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform float uTime;
                varying vec3 vColor;
                
                void main() {
                    vec2 uv = gl_PointCoord;
                    vec4 texColor = texture2D(uTexture, uv);
                    
                    vec3 finalColor = vColor * texColor.rgb * 1.5;
                    float alpha = texColor.a * 0.7;
                    
                    if (alpha < 0.01) discard;
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.glowOrbs = new THREE.Points(geometry, material);
        this.group.add(this.glowOrbs);
    }
    
    /* =========================================
       SPARKLES - Tiny bright points
       ========================================= */
    createSparkles() {
        const count = this.performanceTier === 'high' ? 400 : 200;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        
        this.sparkleData = {
            basePositions: new Float32Array(count * 3),
            twinklePhases: new Float32Array(count),
            twinkleSpeeds: new Float32Array(count),
            baseSizes: new Float32Array(count)
        };
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            positions[i3] = (Math.random() - 0.5) * 200;
            positions[i3 + 1] = (Math.random() - 0.5) * 150;
            positions[i3 + 2] = (Math.random() - 0.5) * 300 - 50;
            
            this.sparkleData.basePositions[i3] = positions[i3];
            this.sparkleData.basePositions[i3 + 1] = positions[i3 + 1];
            this.sparkleData.basePositions[i3 + 2] = positions[i3 + 2];
            
            this.sparkleData.twinklePhases[i] = Math.random() * Math.PI * 2;
            this.sparkleData.twinkleSpeeds[i] = 2 + Math.random() * 4;
            
            const baseSize = 1 + Math.random() * 2;
            sizes[i] = baseSize;
            this.sparkleData.baseSizes[i] = baseSize;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: this.starParticleTexture },
                uColor: { value: new THREE.Color(0xffffff) }
            },
            vertexShader: `
                attribute float size;
                varying float vSize;
                
                void main() {
                    vSize = size;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (200.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform vec3 uColor;
                varying float vSize;
                
                void main() {
                    vec2 uv = gl_PointCoord;
                    vec4 texColor = texture2D(uTexture, uv);
                    
                    float alpha = texColor.a * 0.9;
                    if (alpha < 0.01) discard;
                    
                    gl_FragColor = vec4(uColor * texColor.rgb, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.sparkles = new THREE.Points(geometry, material);
        this.group.add(this.sparkles);
    }
    
    /* =========================================
       UPDATE
       ========================================= */
    update(delta, elapsed) {
        // Update ambient particles - organic floating
        if (this.ambientParticles && this.ambientData) {
            const positions = this.ambientParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length / 3; i++) {
                const i3 = i * 3;
                const speed = this.ambientData.speeds[i];
                const amp = this.ambientData.amplitudes[i];
                
                positions[i3] = this.ambientData.basePositions[i3] + 
                    Math.sin(elapsed * speed + this.ambientData.phases[i3]) * amp;
                positions[i3 + 1] = this.ambientData.basePositions[i3 + 1] + 
                    Math.cos(elapsed * speed * 0.8 + this.ambientData.phases[i3 + 1]) * amp * 0.7;
                positions[i3 + 2] = this.ambientData.basePositions[i3 + 2] + 
                    Math.sin(elapsed * speed * 0.6 + this.ambientData.phases[i3 + 2]) * amp * 0.4;
            }
            
            this.ambientParticles.geometry.attributes.position.needsUpdate = true;
            this.ambientParticles.material.uniforms.uTime.value = elapsed;
        }
        
        // Update glow orbs - slow orbiting
        if (this.glowOrbs && this.glowData) {
            const positions = this.glowOrbs.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length / 3; i++) {
                const i3 = i * 3;
                const speed = this.glowData.orbitSpeeds[i];
                const radius = this.glowData.orbitRadii[i];
                const phase = this.glowData.phases[i];
                const vertOffset = this.glowData.verticalOffsets[i];
                
                const angle = phase + elapsed * speed;
                positions[i3] = Math.cos(angle) * radius;
                positions[i3 + 2] = Math.sin(angle) * radius - 80;
                positions[i3 + 1] = this.glowData.basePositions[i3 + 1] + 
                    Math.sin(elapsed * 0.3 + vertOffset) * 8;
            }
            
            this.glowOrbs.geometry.attributes.position.needsUpdate = true;
            this.glowOrbs.material.uniforms.uTime.value = elapsed;
        }
        
        // Update sparkles - twinkling
        if (this.sparkles && this.sparkleData) {
            const sizes = this.sparkles.geometry.attributes.size.array;
            
            for (let i = 0; i < sizes.length; i++) {
                const phase = this.sparkleData.twinklePhases[i];
                const speed = this.sparkleData.twinkleSpeeds[i];
                const baseSize = this.sparkleData.baseSizes[i];
                
                const twinkle = Math.sin(elapsed * speed + phase) * 0.5 + 0.5;
                sizes[i] = baseSize * (0.3 + twinkle * 0.7);
            }
            
            this.sparkles.geometry.attributes.size.needsUpdate = true;
        }
    }
    
    /* =========================================
       DISPOSE
       ========================================= */
    dispose() {
        if (this.softParticleTexture) this.softParticleTexture.dispose();
        if (this.glowParticleTexture) this.glowParticleTexture.dispose();
        if (this.starParticleTexture) this.starParticleTexture.dispose();
        
        this.group.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
        this.engine.remove(this.group);
    }
}

export default Particles;
