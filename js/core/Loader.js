/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   Loader.js - Asset Loading Manager
   ============================================ */

import * as THREE from 'three';

class Loader {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.loadedAssets = {};
        this.totalAssets = 0;
        this.loadedCount = 0;
    }
    
    async loadTexture(name, url) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                url,
                (texture) => {
                    this.loadedAssets[name] = texture;
                    this.loadedCount++;
                    resolve(texture);
                },
                undefined,
                (error) => {
                    console.error(`[Loader] Failed to load texture: ${url}`, error);
                    reject(error);
                }
            );
        });
    }
    
    getAsset(name) {
        return this.loadedAssets[name];
    }
    
    getProgress() {
        if (this.totalAssets === 0) return 100;
        return (this.loadedCount / this.totalAssets) * 100;
    }
}

export default Loader;
