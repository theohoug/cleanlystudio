/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   DeviceDetect.js - Device & Performance Detection
   ============================================ */

class DeviceDetect {
    constructor() {
        // Device type
        this.isMobile = false;
        this.isTablet = false;
        this.isDesktop = false;
        this.type = 'desktop';
        
        // Capabilities
        this.hasTouch = false;
        this.hasGyroscope = false;
        this.hasMouse = false;
        this.hasWebGL2 = false;
        
        // Performance
        this.gpuTier = 'high';
        this.performanceTier = 'high';
        this.deviceMemory = null;
        this.hardwareConcurrency = null;
        
        // Screen
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.pixelRatio = window.devicePixelRatio || 1;
        this.isRetina = this.pixelRatio > 1;
        
        // Detect everything
        this.detect();
    }
    
    /* =========================================
       MAIN DETECTION
       ========================================= */
    detect() {
        this.detectDeviceType();
        this.detectCapabilities();
        this.detectPerformance();
        this.calculatePerformanceTier();
    }
    
    /* =========================================
       DEVICE TYPE
       ========================================= */
    detectDeviceType() {
        const ua = navigator.userAgent.toLowerCase();
        
        // Mobile detection
        const mobileKeywords = [
            'android', 'webos', 'iphone', 'ipod', 
            'blackberry', 'windows phone', 'opera mini', 'mobile'
        ];
        
        // Tablet detection
        const tabletKeywords = ['ipad', 'tablet', 'playbook', 'silk'];
        
        // Check user agent
        this.isMobile = mobileKeywords.some(keyword => ua.includes(keyword));
        this.isTablet = tabletKeywords.some(keyword => ua.includes(keyword));
        
        // iPad Pro detection (reports as desktop in UA)
        if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
            this.isTablet = true;
            this.isMobile = false;
        }
        
        // Screen size fallback
        if (!this.isMobile && !this.isTablet) {
            if (this.screenWidth <= 768) {
                this.isMobile = true;
            } else if (this.screenWidth <= 1024) {
                this.isTablet = true;
            }
        }
        
        // Desktop is neither mobile nor tablet
        this.isDesktop = !this.isMobile && !this.isTablet;
        
        // Set type string
        if (this.isMobile) {
            this.type = 'mobile';
        } else if (this.isTablet) {
            this.type = 'tablet';
        } else {
            this.type = 'desktop';
        }
    }
    
    /* =========================================
       CAPABILITIES
       ========================================= */
    detectCapabilities() {
        // Touch support
        this.hasTouch = (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
        
        // Mouse support (can have both touch and mouse)
        this.hasMouse = window.matchMedia('(pointer: fine)').matches;
        
        // Gyroscope support
        this.hasGyroscope = (
            'DeviceOrientationEvent' in window ||
            'DeviceMotionEvent' in window
        );
        
        // WebGL2 support
        try {
            const canvas = document.createElement('canvas');
            this.hasWebGL2 = !!(
                canvas.getContext('webgl2') ||
                canvas.getContext('experimental-webgl2')
            );
        } catch (e) {
            this.hasWebGL2 = false;
        }
    }
    
    /* =========================================
       PERFORMANCE DETECTION
       ========================================= */
    detectPerformance() {
        // Device memory (Chrome only)
        if ('deviceMemory' in navigator) {
            this.deviceMemory = navigator.deviceMemory;
        }
        
        // Hardware concurrency (CPU cores)
        if ('hardwareConcurrency' in navigator) {
            this.hardwareConcurrency = navigator.hardwareConcurrency;
        }
        
        // GPU detection via WebGL
        this.detectGPU();
    }
    
    /* =========================================
       GPU DETECTION
       ========================================= */
    detectGPU() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) {
                this.gpuTier = 'low';
                return;
            }
            
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
                
                // High-end GPUs
                const highEndGPUs = [
                    'nvidia geforce rtx',
                    'nvidia geforce gtx 10',
                    'nvidia geforce gtx 16',
                    'nvidia geforce gtx 20',
                    'nvidia geforce gtx 30',
                    'nvidia geforce gtx 40',
                    'radeon rx 5',
                    'radeon rx 6',
                    'radeon rx 7',
                    'apple m1',
                    'apple m2',
                    'apple m3',
                    'apple gpu', // iPhone/iPad recent
                    'adreno 6',
                    'adreno 7',
                    'mali-g7',
                    'mali-g8'
                ];
                
                // Low-end GPUs
                const lowEndGPUs = [
                    'intel hd graphics',
                    'intel uhd graphics 6',
                    'intel iris',
                    'adreno 3',
                    'adreno 4',
                    'adreno 5',
                    'mali-4',
                    'mali-t',
                    'powervr',
                    'swiftshader', // Software renderer
                    'llvmpipe'
                ];
                
                // Check GPU tier
                if (highEndGPUs.some(gpu => renderer.includes(gpu))) {
                    this.gpuTier = 'high';
                } else if (lowEndGPUs.some(gpu => renderer.includes(gpu))) {
                    this.gpuTier = 'low';
                } else {
                    this.gpuTier = 'medium';
                }
                
                console.log(`%c[DeviceDetect] GPU: ${renderer}`, 'color: #666;');
            } else {
                // Can't detect, assume medium
                this.gpuTier = 'medium';
            }
            
        } catch (e) {
            console.warn('[DeviceDetect] GPU detection failed:', e);
            this.gpuTier = 'medium';
        }
    }
    
    /* =========================================
       CALCULATE PERFORMANCE TIER
       ========================================= */
    calculatePerformanceTier() {
        let score = 0;
        
        // Device type scoring
        if (this.isDesktop) score += 3;
        else if (this.isTablet) score += 2;
        else score += 1;
        
        // GPU scoring
        if (this.gpuTier === 'high') score += 3;
        else if (this.gpuTier === 'medium') score += 2;
        else score += 1;
        
        // Memory scoring
        if (this.deviceMemory) {
            if (this.deviceMemory >= 8) score += 2;
            else if (this.deviceMemory >= 4) score += 1;
        } else {
            score += 1; // Unknown, assume medium
        }
        
        // CPU cores scoring
        if (this.hardwareConcurrency) {
            if (this.hardwareConcurrency >= 8) score += 2;
            else if (this.hardwareConcurrency >= 4) score += 1;
        } else {
            score += 1; // Unknown, assume medium
        }
        
        // WebGL2 bonus
        if (this.hasWebGL2) score += 1;
        
        // Screen size penalty (very high resolution)
        const pixels = this.screenWidth * this.screenHeight * this.pixelRatio;
        if (pixels > 8000000) score -= 1; // 4K+
        
        // Determine tier
        // Max possible score: 3+3+2+2+1 = 11
        // Min possible score: 1+1+0+0+0-1 = 1
        if (score >= 9) {
            this.performanceTier = 'high';
        } else if (score >= 5) {
            this.performanceTier = 'medium';
        } else {
            this.performanceTier = 'low';
        }
        
        console.log(`%c[DeviceDetect] Performance Score: ${score}`, 'color: #666;');
    }
    
    /* =========================================
       GETTERS
       ========================================= */
    getPerformanceTier() {
        return this.performanceTier;
    }
    
    getDeviceType() {
        return this.type;
    }
    
    getCapabilities() {
        return {
            touch: this.hasTouch,
            gyroscope: this.hasGyroscope,
            mouse: this.hasMouse,
            webgl2: this.hasWebGL2
        };
    }
    
    getInfo() {
        return {
            type: this.type,
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isDesktop: this.isDesktop,
            performanceTier: this.performanceTier,
            gpuTier: this.gpuTier,
            hasTouch: this.hasTouch,
            hasGyroscope: this.hasGyroscope,
            hasMouse: this.hasMouse,
            hasWebGL2: this.hasWebGL2,
            screenWidth: this.screenWidth,
            screenHeight: this.screenHeight,
            pixelRatio: this.pixelRatio,
            deviceMemory: this.deviceMemory,
            cpuCores: this.hardwareConcurrency
        };
    }
    
    /* =========================================
       REQUEST GYROSCOPE PERMISSION (iOS 13+)
       ========================================= */
    async requestGyroscopePermission() {
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                return permission === 'granted';
            } catch (e) {
                console.warn('[DeviceDetect] Gyroscope permission denied:', e);
                return false;
            }
        }
        // No permission needed on other devices
        return this.hasGyroscope;
    }
}

export default DeviceDetect;
