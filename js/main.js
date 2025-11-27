/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   Main Entry Point
   ============================================ */

import Engine from './core/Engine.js';
import Loader from './core/Loader.js';
import Camera from './core/Camera.js';
import PostProcessing from './core/PostProcessing.js';

import Environment from './world/Environment.js';
import Particles from './world/Particles.js';
import Lights from './world/Lights.js';
import Structures from './world/Structures.js';

import ZoneManager from './zones/ZoneManager.js';

import Cursor from './ui/Cursor.js';
import HUD from './ui/HUD.js';

import DeviceDetect from './utils/DeviceDetect.js';
import EventBus from './utils/EventBus.js';

/* =============================================
   APP CLASS - Main Controller
   ============================================= */
class App {
    constructor() {
        // State
        this.isReady = false;
        this.isPlaying = false;
        this.currentZone = 0;
        
        // Performance tier (will be set by DeviceDetect)
        this.performanceTier = 'high'; // 'high', 'medium', 'low'
        
        // Module references
        this.engine = null;
        this.camera = null;
        this.postProcessing = null;
        this.environment = null;
        this.particles = null;
        this.lights = null;
        this.structures = null;
        this.zoneManager = null;
        this.cursor = null;
        this.hud = null;
        
        // DOM Elements
        this.dom = {
            loader: document.getElementById('loader'),
            loadProgress: document.getElementById('loadProgress'),
            loadPercent: document.getElementById('loadPercent'),
            loadSystem: document.getElementById('loadSystem'),
            loadAssets: document.getElementById('loadAssets'),
            loaderParticles: document.getElementById('loaderParticles'),
            app: document.getElementById('app'),
            canvasContainer: document.getElementById('canvas-container'),
            uiOverlay: document.getElementById('ui-overlay'),
            scrollIndicator: document.getElementById('scrollIndicator'),
            navZones: document.querySelectorAll('.nav-zone'),
            audioToggle: document.getElementById('audioToggle')
        };
        
        // Bind methods
        this.update = this.update.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        
        // Initialize
        this.init();
    }
    
    /* =========================================
       INITIALIZATION
       ========================================= */
    async init() {
        console.log('%c◈ CLEANLY STUDIO', 'font-size: 20px; font-weight: bold; color: #4a9eff;');
        console.log('%cVoid Experience Initializing...', 'color: #666;');
        
        // Step 1: Detect device & set performance tier
        this.detectDevice();
        
        // Step 2: Create loader particles
        this.createLoaderParticles();
        
        // Step 3: Initialize event bus
        this.initEventBus();
        
        // Step 4: Load assets
        await this.loadAssets();
        
        // Step 5: Initialize 3D engine
        this.initEngine();
        
        // Step 6: Initialize world
        this.initWorld();
        
        // Step 7: Initialize zones
        this.initZones();
        
        // Step 8: Initialize UI
        this.initUI();
        
        // Step 9: Bind events
        this.bindEvents();
        
        // Step 10: Hide loader & start
        this.start();
    }
    
    /* =========================================
       DEVICE DETECTION
       ========================================= */
    detectDevice() {
        this.device = new DeviceDetect();
        this.performanceTier = this.device.getPerformanceTier();
        
        console.log(`%cDevice: ${this.device.type}`, 'color: #4a9eff;');
        console.log(`%cPerformance Tier: ${this.performanceTier}`, 'color: #4a9eff;');
        
        // Update loader status
        this.updateLoadStatus('DETECTING DEVICE');
        
        // Show mobile message if needed
        if (this.device.isMobile || this.device.isTablet) {
            this.showMobileMessage();
        }
    }
    
    /* =========================================
       LOADER PARTICLES
       ========================================= */
    createLoaderParticles() {
        const container = this.dom.loaderParticles;
        const count = this.device.isMobile ? 15 : 30;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'loader-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${15 + Math.random() * 10}s`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.opacity = 0.1 + Math.random() * 0.3;
            container.appendChild(particle);
        }
    }
    
    /* =========================================
       EVENT BUS
       ========================================= */
    initEventBus() {
        this.events = new EventBus();
        
        // Global event listeners
        this.events.on('zone:change', (zoneIndex) => {
            this.currentZone = zoneIndex;
            this.updateNavigation(zoneIndex);
        });
        
        this.events.on('camera:move', (position) => {
            if (this.hud) {
                this.hud.updateCoords(position);
            }
        });
    }
    
    /* =========================================
       ASSET LOADING
       ========================================= */
    async loadAssets() {
        this.updateLoadStatus('LOADING ASSETS');
        
        const loader = new Loader();
        
        // Define assets to load
        const assets = [
            // Textures will be added here later
            // { type: 'texture', name: 'particle', url: 'assets/textures/particle.png' },
        ];
        
        // For now, simulate loading
        const totalAssets = assets.length || 1;
        let loadedAssets = 0;
        
        // Simulate progressive loading
        await new Promise((resolve) => {
            const interval = setInterval(() => {
                loadedAssets++;
                const progress = Math.min((loadedAssets / totalAssets) * 100, 100);
                
                this.updateLoadProgress(progress);
                this.dom.loadAssets.textContent = `${loadedAssets}/${totalAssets}`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50);
        });
        
        this.updateLoadStatus('ASSETS LOADED');
    }
    
    /* =========================================
       3D ENGINE INITIALIZATION
       ========================================= */
    initEngine() {
        this.updateLoadStatus('INITIALIZING ENGINE');
        
        this.engine = new Engine({
            container: this.dom.canvasContainer,
            performanceTier: this.performanceTier,
            antialias: this.performanceTier === 'high',
            alpha: false
        });
        
        // Initialize camera controller
        this.camera = new Camera({
            engine: this.engine,
            performanceTier: this.performanceTier
        });
        
        // Initialize post-processing (desktop only)
        if (this.performanceTier !== 'low') {
            this.postProcessing = new PostProcessing({
                engine: this.engine,
                performanceTier: this.performanceTier
            });
        }
        
        this.updateLoadStatus('ENGINE READY');
    }
    
    /* =========================================
       WORLD INITIALIZATION
       ========================================= */
    initWorld() {
        this.updateLoadStatus('BUILDING WORLD');
        
        // Environment (fog, background)
        this.environment = new Environment({
            engine: this.engine,
            performanceTier: this.performanceTier
        });
        
        // Lights
        this.lights = new Lights({
            engine: this.engine,
            performanceTier: this.performanceTier
        });
        
        // Particles (stars, dust)
        this.particles = new Particles({
            engine: this.engine,
            performanceTier: this.performanceTier,
            camera: this.camera
        });
        
        // Geometric structures
        this.structures = new Structures({
            engine: this.engine,
            performanceTier: this.performanceTier
        });
        
        this.updateLoadStatus('WORLD READY');
    }
    
    /* =========================================
       ZONES INITIALIZATION
       ========================================= */
    initZones() {
        this.updateLoadStatus('LOADING ZONES');
        
        this.zoneManager = new ZoneManager({
            engine: this.engine,
            camera: this.camera,
            events: this.events,
            performanceTier: this.performanceTier
        });
        
        this.updateLoadStatus('ZONES READY');
    }
    
    /* =========================================
       UI INITIALIZATION
       ========================================= */
    initUI() {
        this.updateLoadStatus('INITIALIZING UI');
        
        // Custom cursor (desktop only)
        if (!this.device.isMobile && !this.device.isTablet) {
            this.cursor = new Cursor();
        }
        
        // HUD
        this.hud = new HUD({
            events: this.events
        });
        
        this.updateLoadStatus('UI READY');
    }
    
    /* =========================================
       EVENT BINDINGS
       ========================================= */
    bindEvents() {
        // Window events
        window.addEventListener('resize', this.onResize);
        window.addEventListener('scroll', this.onScroll);
        window.addEventListener('mousemove', this.onMouseMove);
        
        // Navigation clicks
        this.dom.navZones.forEach((btn) => {
            btn.addEventListener('click', () => {
                const zoneIndex = parseInt(btn.dataset.zone);
                this.goToZone(zoneIndex);
            });
        });
        
        // Audio toggle
        this.dom.audioToggle.addEventListener('click', () => {
            this.toggleAudio();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.onKeyDown(e);
        });
        
        // Touch events for mobile
        if (this.device.isMobile || this.device.isTablet) {
            this.initTouchEvents();
        }
        
        // Visibility change (pause when tab hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    /* =========================================
       TOUCH EVENTS (Mobile)
       ========================================= */
    initTouchEvents() {
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe(touchStartY, touchEndY);
        }, { passive: true });
    }
    
    handleSwipe(startY, endY) {
        const threshold = 50;
        const diff = startY - endY;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe up - next zone
                this.goToZone(Math.min(this.currentZone + 1, 4));
            } else {
                // Swipe down - previous zone
                this.goToZone(Math.max(this.currentZone - 1, 0));
            }
        }
    }
    
    /* =========================================
       START EXPERIENCE
       ========================================= */
    start() {
        this.updateLoadStatus('ENTERING VOID');
        this.updateLoadProgress(100);
        
        // Delay before hiding loader
        setTimeout(() => {
            // Hide loader
            this.dom.loader.classList.add('hidden');
            
            // Show UI
            this.dom.uiOverlay.classList.add('visible');
            
            // Start render loop
            this.isReady = true;
            this.isPlaying = true;
            this.update();
            
            console.log('%c◈ VOID EXPERIENCE READY', 'font-size: 14px; font-weight: bold; color: #4a9eff;');
            
        }, 800);
    }
    
    /* =========================================
       MAIN UPDATE LOOP
       ========================================= */
    update() {
        if (!this.isPlaying) return;
        
        // Request next frame
        requestAnimationFrame(this.update);
        
        // Get delta time
        const delta = this.engine.clock.getDelta();
        const elapsed = this.engine.clock.getElapsedTime();
        
        // Update modules
        if (this.camera) this.camera.update(delta, elapsed);
        if (this.particles) this.particles.update(delta, elapsed);
        if (this.structures) this.structures.update(delta, elapsed);
        if (this.zoneManager) this.zoneManager.update(delta, elapsed);
        if (this.cursor) this.cursor.update();
        
        // Render
        if (this.postProcessing) {
            this.postProcessing.render();
        } else {
            this.engine.render();
        }
    }
    
    /* =========================================
       NAVIGATION
       ========================================= */
    goToZone(index) {
        if (index === this.currentZone) return;
        if (index < 0 || index > 4) return;
        
        // Update zone via manager
        if (this.zoneManager) {
            this.zoneManager.goToZone(index);
        }
        
        // Update current zone
        this.currentZone = index;
        
        // Update nav UI
        this.updateNavigation(index);
        
        // Hide scroll indicator after first zone change
        if (index > 0) {
            this.dom.scrollIndicator.classList.add('hidden');
        }
    }
    
    updateNavigation(index) {
        this.dom.navZones.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
        
        // Update HUD zone
        if (this.hud) {
            this.hud.updateZone(index);
        }
    }
    
    /* =========================================
       EVENT HANDLERS
       ========================================= */
    onResize() {
        if (this.engine) this.engine.resize();
        if (this.camera) this.camera.resize();
        if (this.postProcessing) this.postProcessing.resize();
    }
    
    onScroll(e) {
        // Scroll hijacking will be handled by ZoneManager
    }
    
    onMouseMove(e) {
        // Update cursor position
        if (this.cursor) {
            this.cursor.move(e.clientX, e.clientY);
        }
        
        // Update camera parallax
        if (this.camera && !this.device.isMobile) {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            this.camera.setMousePosition(x, y);
        }
    }
    
    onKeyDown(e) {
        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                this.goToZone(Math.min(this.currentZone + 1, 4));
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.goToZone(Math.max(this.currentZone - 1, 0));
                break;
            case 'Home':
                e.preventDefault();
                this.goToZone(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToZone(4);
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                this.goToZone(parseInt(e.key) - 1);
                break;
        }
    }
    
    /* =========================================
       AUDIO
       ========================================= */
    toggleAudio() {
        const isActive = this.dom.audioToggle.classList.toggle('active');
        const statusText = this.dom.audioToggle.querySelector('.audio-status');
        statusText.textContent = isActive ? 'ON' : 'OFF';
        
        // Audio implementation will be added later
        console.log(`Audio ${isActive ? 'enabled' : 'disabled'}`);
    }
    
    /* =========================================
       PAUSE / RESUME
       ========================================= */
    pause() {
        this.isPlaying = false;
    }
    
    resume() {
        if (!this.isReady) return;
        this.isPlaying = true;
        this.update();
    }
    
    /* =========================================
       LOADER HELPERS
       ========================================= */
    updateLoadProgress(percent) {
        this.dom.loadProgress.style.width = `${percent}%`;
        this.dom.loadPercent.textContent = `${Math.round(percent)}%`;
    }
    
    updateLoadStatus(status) {
        this.dom.loadSystem.textContent = status;
    }
    
    /* =========================================
       MOBILE MESSAGE
       ========================================= */
    showMobileMessage() {
        // Check if already dismissed
        if (localStorage.getItem('cleanly-mobile-dismissed')) {
            return;
        }
        
        // Create message element
        const message = document.createElement('div');
        message.className = 'mobile-message';
        message.innerHTML = `
            <span class="mobile-message-icon">💻</span>
            <span class="mobile-message-text">
                For the <strong>full experience</strong>, visit on desktop
            </span>
            <button class="mobile-message-close">GOT IT</button>
        `;
        
        document.body.appendChild(message);
        
        // Close button
        message.querySelector('.mobile-message-close').addEventListener('click', () => {
            message.classList.add('hidden');
            localStorage.setItem('cleanly-mobile-dismissed', 'true');
            setTimeout(() => message.remove(), 300);
        });
    }
}

/* =============================================
   INITIALIZE APP
   ============================================= */
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

export default App;
