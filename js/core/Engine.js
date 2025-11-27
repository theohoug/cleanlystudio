/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   Engine.js - Three.js Core Setup
   ============================================ */

import * as THREE from 'three';

class Engine {
    constructor(options = {}) {
        // Options
        this.container = options.container;
        this.performanceTier = options.performanceTier || 'high';
        this.antialias = options.antialias !== undefined ? options.antialias : true;
        this.alpha = options.alpha !== undefined ? options.alpha : false;
        
        // Core Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = null;
        
        // Dimensions
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width / this.height;
        this.pixelRatio = Math.min(window.devicePixelRatio, this.getMaxPixelRatio());
        
        // Initialize
        this.init();
    }
    
    /* =========================================
       INITIALIZATION
       ========================================= */
    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createClock();
        
        console.log('%c[Engine] Initialized', 'color: #4a9eff;');
        console.log(`%c[Engine] Pixel Ratio: ${this.pixelRatio}`, 'color: #666;');
        console.log(`%c[Engine] Antialias: ${this.antialias}`, 'color: #666;');
    }
    
    /* =========================================
       SCENE
       ========================================= */
    createScene() {
        this.scene = new THREE.Scene();
        
        // Deep void black background
        this.scene.background = new THREE.Color(0x030308);
        
        // Fog for depth effect
        // Near fog starts far, far fog is very far = objects fade gently into void
        const fogColor = 0x030308;
        const fogNear = 50;
        const fogFar = 500;
        
        if (this.performanceTier === 'high') {
            // Exponential fog for more realistic depth
            this.scene.fog = new THREE.FogExp2(fogColor, 0.003);
        } else {
            // Linear fog for better performance
            this.scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
        }
    }
    
    /* =========================================
       CAMERA
       ========================================= */
    createCamera() {
        // Perspective camera with strong perspective effect
        const fov = 75; // Field of view
        const near = 0.1; // Near clipping plane
        const far = 1000; // Far clipping plane
        
        this.camera = new THREE.PerspectiveCamera(
            fov,
            this.aspect,
            near,
            far
        );
        
        // Initial position - looking into the void
        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(0, 0, 0);
    }
    
    /* =========================================
       RENDERER
       ========================================= */
    createRenderer() {
        // Renderer configuration based on performance tier
        const rendererConfig = {
            antialias: this.antialias,
            alpha: this.alpha,
            powerPreference: this.performanceTier === 'high' ? 'high-performance' : 'default',
            stencil: false, // Not needed, saves memory
            depth: true
        };
        
        this.renderer = new THREE.WebGLRenderer(rendererConfig);
        
        // Size & pixel ratio
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(this.pixelRatio);
        
        // Color & tone mapping
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        if (this.performanceTier === 'high') {
            // Cinematic tone mapping
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1.0;
        } else {
            // Simple tone mapping for performance
            this.renderer.toneMapping = THREE.LinearToneMapping;
            this.renderer.toneMappingExposure = 1.0;
        }
        
        // Shadows (only on high tier)
        if (this.performanceTier === 'high') {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        } else {
            this.renderer.shadowMap.enabled = false;
        }
        
        // Append to container
        this.container.appendChild(this.renderer.domElement);
        
        // Style canvas
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
    }
    
    /* =========================================
       CLOCK
       ========================================= */
    createClock() {
        this.clock = new THREE.Clock();
    }
    
    /* =========================================
       RENDER
       ========================================= */
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    /* =========================================
       RESIZE
       ========================================= */
    resize() {
        // Update dimensions
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width / this.height;
        
        // Update camera
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();
        
        // Update renderer
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.getMaxPixelRatio()));
    }
    
    /* =========================================
       HELPERS
       ========================================= */
    getMaxPixelRatio() {
        // Limit pixel ratio based on performance tier
        switch (this.performanceTier) {
            case 'high':
                return 2;
            case 'medium':
                return 1.5;
            case 'low':
                return 1;
            default:
                return 2;
        }
    }
    
    /* =========================================
       ADD/REMOVE FROM SCENE
       ========================================= */
    add(object) {
        this.scene.add(object);
    }
    
    remove(object) {
        this.scene.remove(object);
    }
    
    /* =========================================
       GETTERS
       ========================================= */
    getScene() {
        return this.scene;
    }
    
    getCamera() {
        return this.camera;
    }
    
    getRenderer() {
        return this.renderer;
    }
    
    getClock() {
        return this.clock;
    }
    
    getSize() {
        return {
            width: this.width,
            height: this.height,
            aspect: this.aspect
        };
    }
    
    /* =========================================
       DISPOSE
       ========================================= */
    dispose() {
        // Clean up renderer
        this.renderer.dispose();
        
        // Remove canvas from DOM
        if (this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        
        // Clear scene
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        console.log('%c[Engine] Disposed', 'color: #ff4a4a;');
    }
}

export default Engine;
