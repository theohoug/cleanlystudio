/* ============================================
   CLEANLY STUDIO - VOID EXPERIENCE
   Structures.js - Floating Geometric Structures
   ============================================ */

import * as THREE from 'three';

class Structures {
    constructor(options = {}) {
        this.engine = options.engine;
        this.performanceTier = options.performanceTier || 'high';
        
        this.group = new THREE.Group();
        this.group.name = 'Structures';
        
        // Structure references
        this.structures = [];
        
        this.init();
    }
    
    /* =========================================
       INITIALIZATION
       ========================================= */
    init() {
        this.createFloatingShapes();
        this.createRings();
        
        if (this.performanceTier === 'high') {
            this.createDecorativeElements();
        }
        
        // Add to scene
        this.engine.add(this.group);
        
        console.log('%c[Structures] Initialized', 'color: #4a9eff;');
    }
    
    /* =========================================
       FLOATING SHAPES
       ========================================= */
    createFloatingShapes() {
        // Glass-like material
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.1,
            transparent: true,
            opacity: 0.3,
            transmission: 0.9,
            thickness: 0.5,
            side: THREE.DoubleSide
        });
        
        // Wireframe material for outline effect
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a9eff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        // Octahedron (diamond shape)
        const octaGeom = new THREE.OctahedronGeometry(3);
        const octahedron = new THREE.Mesh(octaGeom, glassMaterial.clone());
        octahedron.position.set(-20, 10, -30);
        octahedron.userData = { rotationSpeed: { x: 0.005, y: 0.01, z: 0.003 } };
        this.structures.push(octahedron);
        this.group.add(octahedron);
        
        // Octahedron wireframe
        const octaWire = new THREE.Mesh(octaGeom.clone(), wireMaterial.clone());
        octaWire.scale.multiplyScalar(1.01);
        octahedron.add(octaWire);
        
        // Icosahedron
        const icoGeom = new THREE.IcosahedronGeometry(2.5);
        const icosahedron = new THREE.Mesh(icoGeom, glassMaterial.clone());
        icosahedron.position.set(25, -5, -25);
        icosahedron.userData = { rotationSpeed: { x: 0.003, y: 0.007, z: 0.005 } };
        this.structures.push(icosahedron);
        this.group.add(icosahedron);
        
        // Icosahedron wireframe
        const icoWire = new THREE.Mesh(icoGeom.clone(), wireMaterial.clone());
        icoWire.scale.multiplyScalar(1.01);
        icosahedron.add(icoWire);
        
        // Tetrahedron
        const tetraGeom = new THREE.TetrahedronGeometry(2);
        const tetrahedron = new THREE.Mesh(tetraGeom, glassMaterial.clone());
        tetrahedron.position.set(15, 15, -40);
        tetrahedron.userData = { rotationSpeed: { x: 0.008, y: 0.004, z: 0.006 } };
        this.structures.push(tetrahedron);
        this.group.add(tetrahedron);
        
        // Tetrahedron wireframe
        const tetraWire = new THREE.Mesh(tetraGeom.clone(), wireMaterial.clone());
        tetraWire.scale.multiplyScalar(1.01);
        tetrahedron.add(tetraWire);
    }
    
    /* =========================================
       RINGS (Torus shapes)
       ========================================= */
    createRings() {
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a9eff,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        
        // Large distant ring
        const ringGeom1 = new THREE.TorusGeometry(30, 0.3, 16, 100);
        const ring1 = new THREE.Mesh(ringGeom1, ringMaterial.clone());
        ring1.position.set(0, 0, -100);
        ring1.rotation.x = Math.PI * 0.3;
        ring1.userData = { rotationSpeed: { x: 0, y: 0, z: 0.002 } };
        this.structures.push(ring1);
        this.group.add(ring1);
        
        // Medium ring
        const ringGeom2 = new THREE.TorusGeometry(15, 0.2, 16, 80);
        const ring2 = new THREE.Mesh(ringGeom2, ringMaterial.clone());
        ring2.material.opacity = 0.3;
        ring2.position.set(0, 0, -60);
        ring2.rotation.x = Math.PI * 0.5;
        ring2.rotation.y = Math.PI * 0.2;
        ring2.userData = { rotationSpeed: { x: 0.001, y: 0, z: 0.003 } };
        this.structures.push(ring2);
        this.group.add(ring2);
    }
    
    /* =========================================
       DECORATIVE ELEMENTS
       ========================================= */
    createDecorativeElements() {
        // Floating cubes (small)
        const cubeGeom = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a9eff,
            transparent: true,
            opacity: 0.4,
            wireframe: true
        });
        
        for (let i = 0; i < 10; i++) {
            const cube = new THREE.Mesh(cubeGeom.clone(), cubeMaterial.clone());
            cube.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80 - 50
            );
            cube.scale.setScalar(0.5 + Math.random() * 1);
            cube.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.5 + Math.random() * 0.5
            };
            this.structures.push(cube);
            this.group.add(cube);
        }
    }
    
    /* =========================================
       UPDATE
       ========================================= */
    update(delta, elapsed) {
        this.structures.forEach((structure) => {
            // Rotation
            if (structure.userData.rotationSpeed) {
                structure.rotation.x += structure.userData.rotationSpeed.x;
                structure.rotation.y += structure.userData.rotationSpeed.y;
                structure.rotation.z += structure.userData.rotationSpeed.z;
            }
            
            // Floating motion
            if (structure.userData.floatOffset !== undefined) {
                const offset = structure.userData.floatOffset;
                const speed = structure.userData.floatSpeed || 1;
                structure.position.y += Math.sin(elapsed * speed + offset) * delta * 0.5;
            }
        });
    }
    
    /* =========================================
       DISPOSE
       ========================================= */
    dispose() {
        this.group.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
        this.engine.remove(this.group);
    }
}

export default Structures;
