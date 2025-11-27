/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   PostProcessing.js - Visual Effects
   ============================================ */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

class PostProcessing {
    constructor(options = {}) {
        this.engine = options.engine;
        this.performanceTier = options.performanceTier || 'high';
        
        this.composer = null;
        this.passes = {};
        
        this.init();
    }
    
    /* =========================================
       INITIALIZATION
       ========================================= */
    init() {
        const renderer = this.engine.getRenderer();
        const scene = this.engine.getScene();
        const camera = this.engine.getCamera();
        const size = this.engine.getSize();
        
        // Create composer
        this.composer = new EffectComposer(renderer);
        
        // Render pass (base scene)
        const renderPass = new RenderPass(scene, camera);
        this.composer.addPass(renderPass);
        this.passes.render = renderPass;
        
        // Bloom pass (glow effect)
        if (this.performanceTier !== 'low') {
            const bloomParams = this.getBloomParams();
            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(size.width, size.height),
                bloomParams.strength,
                bloomParams.radius,
                bloomParams.threshold
            );
            this.composer.addPass(bloomPass);
            this.passes.bloom = bloomPass;
        }
        
        console.log('%c[PostProcessing] Initialized', 'color: #4a9eff;');
    }
    
    /* =========================================
       BLOOM PARAMETERS
       ========================================= */
    getBloomParams() {
        if (this.performanceTier === 'high') {
            return {
                strength: 0.8,
                radius: 0.5,
                threshold: 0.6
            };
        } else {
            return {
                strength: 0.5,
                radius: 0.3,
                threshold: 0.7
            };
        }
    }
    
    /* =========================================
       RENDER
       ========================================= */
    render() {
        this.composer.render();
    }
    
    /* =========================================
       RESIZE
       ========================================= */
    resize() {
        const size = this.engine.getSize();
        this.composer.setSize(size.width, size.height);
        
        if (this.passes.bloom) {
            this.passes.bloom.resolution.set(size.width, size.height);
        }
    }
    
    /* =========================================
       SETTERS
       ========================================= */
    setBloomStrength(strength) {
        if (this.passes.bloom) {
            this.passes.bloom.strength = strength;
        }
    }
    
    setBloomThreshold(threshold) {
        if (this.passes.bloom) {
            this.passes.bloom.threshold = threshold;
        }
    }
    
    /* =========================================
       DISPOSE
       ========================================= */
    dispose() {
        this.composer.dispose();
    }
}

export default PostProcessing;
