/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   EventBus.js - Global Event System
   ============================================ */

class EventBus {
    constructor() {
        // Store all event listeners
        this.events = {};
        
        // Debug mode
        this.debug = false;
    }
    
    /* =========================================
       SUBSCRIBE TO EVENT
       ========================================= */
    on(eventName, callback, context = null) {
        // Create event array if doesn't exist
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        
        // Add listener
        this.events[eventName].push({
            callback,
            context,
            once: false
        });
        
        if (this.debug) {
            console.log(`%c[EventBus] Subscribed to: ${eventName}`, 'color: #4a9eff;');
        }
        
        // Return unsubscribe function
        return () => this.off(eventName, callback);
    }
    
    /* =========================================
       SUBSCRIBE ONCE
       ========================================= */
    once(eventName, callback, context = null) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        
        this.events[eventName].push({
            callback,
            context,
            once: true
        });
        
        if (this.debug) {
            console.log(`%c[EventBus] Subscribed once to: ${eventName}`, 'color: #4a9eff;');
        }
        
        return () => this.off(eventName, callback);
    }
    
    /* =========================================
       UNSUBSCRIBE FROM EVENT
       ========================================= */
    off(eventName, callback) {
        if (!this.events[eventName]) return;
        
        // Remove specific callback
        if (callback) {
            this.events[eventName] = this.events[eventName].filter(
                listener => listener.callback !== callback
            );
        } else {
            // Remove all listeners for this event
            delete this.events[eventName];
        }
        
        if (this.debug) {
            console.log(`%c[EventBus] Unsubscribed from: ${eventName}`, 'color: #ff4a4a;');
        }
    }
    
    /* =========================================
       EMIT EVENT
       ========================================= */
    emit(eventName, ...args) {
        if (!this.events[eventName]) return;
        
        if (this.debug) {
            console.log(`%c[EventBus] Emit: ${eventName}`, 'color: #4aff4a;', args);
        }
        
        // Create copy of listeners (in case one removes itself)
        const listeners = [...this.events[eventName]];
        
        // Call all listeners
        listeners.forEach(listener => {
            // Call with context if provided
            if (listener.context) {
                listener.callback.apply(listener.context, args);
            } else {
                listener.callback(...args);
            }
            
            // Remove if it was a one-time listener
            if (listener.once) {
                this.off(eventName, listener.callback);
            }
        });
    }
    
    /* =========================================
       CHECK IF EVENT HAS LISTENERS
       ========================================= */
    has(eventName) {
        return this.events[eventName] && this.events[eventName].length > 0;
    }
    
    /* =========================================
       GET LISTENER COUNT
       ========================================= */
    listenerCount(eventName) {
        if (!this.events[eventName]) return 0;
        return this.events[eventName].length;
    }
    
    /* =========================================
       GET ALL EVENT NAMES
       ========================================= */
    eventNames() {
        return Object.keys(this.events);
    }
    
    /* =========================================
       CLEAR ALL EVENTS
       ========================================= */
    clear() {
        this.events = {};
        
        if (this.debug) {
            console.log('%c[EventBus] Cleared all events', 'color: #ff4a4a;');
        }
    }
    
    /* =========================================
       ENABLE/DISABLE DEBUG
       ========================================= */
    setDebug(enabled) {
        this.debug = enabled;
    }
}

/* =============================================
   PREDEFINED EVENT NAMES
   ============================================= */
export const Events = {
    // App lifecycle
    APP_READY: 'app:ready',
    APP_RESIZE: 'app:resize',
    APP_PAUSE: 'app:pause',
    APP_RESUME: 'app:resume',
    
    // Loading
    LOAD_START: 'load:start',
    LOAD_PROGRESS: 'load:progress',
    LOAD_COMPLETE: 'load:complete',
    LOAD_ERROR: 'load:error',
    
    // Zones
    ZONE_CHANGE_START: 'zone:change:start',
    ZONE_CHANGE_COMPLETE: 'zone:change:complete',
    ZONE_ENTER: 'zone:enter',
    ZONE_LEAVE: 'zone:leave',
    
    // Camera
    CAMERA_MOVE_START: 'camera:move:start',
    CAMERA_MOVE_COMPLETE: 'camera:move:complete',
    CAMERA_POSITION_UPDATE: 'camera:position:update',
    
    // User interaction
    USER_SCROLL: 'user:scroll',
    USER_CLICK: 'user:click',
    USER_HOVER: 'user:hover',
    USER_SWIPE: 'user:swipe',
    
    // Audio
    AUDIO_TOGGLE: 'audio:toggle',
    AUDIO_PLAY: 'audio:play',
    AUDIO_STOP: 'audio:stop',
    
    // Performance
    PERF_LOW: 'perf:low',
    PERF_RECOVER: 'perf:recover',
    
    // UI
    UI_SHOW: 'ui:show',
    UI_HIDE: 'ui:hide',
    CURSOR_HOVER: 'cursor:hover',
    CURSOR_LEAVE: 'cursor:leave'
};

export default EventBus;
