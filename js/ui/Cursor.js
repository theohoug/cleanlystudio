/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   Cursor.js - Custom Cursor
   ============================================ */

class Cursor {
    constructor() {
        // DOM Elements
        this.cursor = document.getElementById('cursor');
        this.dot = this.cursor.querySelector('.cursor-dot');
        this.ring = this.cursor.querySelector('.cursor-ring');
        this.text = this.cursor.querySelector('.cursor-text');
        
        // Position
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        
        // Ring position (follows with delay)
        this.ringX = 0;
        this.ringY = 0;
        
        // State
        this.isHovering = false;
        this.isClicking = false;
        this.isHidden = false;
        
        // Smoothing
        this.dotSmoothing = 0.2;
        this.ringSmoothing = 0.1;
        
        this.init();
    }
    
    /* =========================================
       INITIALIZATION
       ========================================= */
    init() {
        this.bindEvents();
        
        console.log('%c[Cursor] Initialized', 'color: #4a9eff;');
    }
    
    /* =========================================
       BIND EVENTS
       ========================================= */
    bindEvents() {
        // Mouse enter/leave document
        document.addEventListener('mouseenter', () => {
            this.isHidden = false;
            this.cursor.classList.remove('hidden');
        });
        
        document.addEventListener('mouseleave', () => {
            this.isHidden = true;
            this.cursor.classList.add('hidden');
        });
        
        // Mouse down/up
        document.addEventListener('mousedown', () => {
            this.isClicking = true;
            this.cursor.classList.add('clicking');
        });
        
        document.addEventListener('mouseup', () => {
            this.isClicking = false;
            this.cursor.classList.remove('clicking');
        });
        
        // Hover on interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, [data-cursor], .nav-zone, .audio-toggle'
        );
        
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.cursor.classList.add('hovering');
                
                // Custom cursor text
                const cursorText = el.dataset.cursor;
                if (cursorText) {
                    this.text.textContent = cursorText;
                }
            });
            
            el.addEventListener('mouseleave', () => {
                this.isHovering = false;
                this.cursor.classList.remove('hovering');
                this.text.textContent = '';
            });
        });
    }
    
    /* =========================================
       MOVE (called from main.js)
       ========================================= */
    move(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
    
    /* =========================================
       UPDATE (called every frame)
       ========================================= */
    update() {
        // Smooth dot movement
        this.x += (this.targetX - this.x) * this.dotSmoothing;
        this.y += (this.targetY - this.y) * this.dotSmoothing;
        
        // Smooth ring movement (more delay)
        this.ringX += (this.targetX - this.ringX) * this.ringSmoothing;
        this.ringY += (this.targetY - this.ringY) * this.ringSmoothing;
        
        // Apply transforms
        this.dot.style.transform = `translate(${this.x}px, ${this.y}px) translate(-50%, -50%)`;
        this.ring.style.transform = `translate(${this.ringX}px, ${this.ringY}px) translate(-50%, -50%)`;
        
        // Text follows ring
        if (this.text.textContent) {
            this.text.style.transform = `translate(${this.ringX}px, ${this.ringY + 30}px) translateX(-50%)`;
        }
    }
    
    /* =========================================
       SET CURSOR TEXT
       ========================================= */
    setText(text) {
        this.text.textContent = text;
    }
    
    /* =========================================
       SHOW/HIDE
       ========================================= */
    show() {
        this.isHidden = false;
        this.cursor.classList.remove('hidden');
    }
    
    hide() {
        this.isHidden = true;
        this.cursor.classList.add('hidden');
    }
}

export default Cursor;
