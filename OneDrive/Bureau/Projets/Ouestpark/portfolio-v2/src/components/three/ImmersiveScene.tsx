/**
 * @component ImmersiveScene
 * @description Clean scroll-driven 3D experience with fade transitions - V2 Fixed
 * @author Cleanlystudio
 */
"use client";

import { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

// ============================================================
// CONFIGURATION
// ============================================================

const ROOMS = {
  hero: "/models/ModernLivingRoom.glb", // Back to original
  gallery: "/models/VRGallery.glb",
  about: "/models/ModernOffice.glb",
  contact: "/models/CosyCoffee.glb", // Back to working model
};

// Services displayed in gallery
export const SERVICES = [
  {
    id: "web",
    name: "Développement Web",
    object: { path: "/models/gallery/cupcake.glb", scale: 3 },
    position: [0, 0, 3] as [number, number, number],
    skills: ["React", "Next.js", "Three.js", "Node.js"],
    projects: [
      { name: "La Taverne de Pri", desc: "Site immersif pour restaurant médiéval", link: "https://latavernedepri.fr", metric: "+90% visibilité, +30% clients" },
      { name: "Ce Portfolio", desc: "Expérience 3D interactive niveau Awwwards" }
    ]
  },
  {
    id: "apps",
    name: "Applications",
    object: { path: "/models/gallery/robot.glb", scale: 3 },
    position: [-2.5, 0, 0] as [number, number, number],
    skills: ["React Native", "Discord.js", "Python", "MongoDB"],
    projects: [
      { name: "YUMR", desc: "Application mobile cuisine gamifiée", status: "En cours" },
      { name: "Assistant IA", desc: "Bot intelligent disponible 24/7", status: "Live", metric: "50K+ utilisateurs" }
    ]
  },
  {
    id: "3d",
    name: "3D et Immersif",
    object: { path: "/models/gallery/saturn.glb", scale: 3 },
    position: [2.5, 0, 0] as [number, number, number],
    skills: ["Blender", "WebGL", "Three.js", "Game Design"],
    projects: [
      { name: "Stellar Game", desc: "Jeu spatial procédural en WebGL" },
      { name: "Moonlit Manor", desc: "Jeu immersif Loup-Garou multijoueur", status: "En dev" }
    ]
  },
  {
    id: "video",
    name: "Vidéo et Motion",
    object: { path: "/models/gallery/campfire.glb", scale: 3 },
    position: [-2.5, 0, -3] as [number, number, number],
    skills: ["After Effects", "Premiere Pro", "Motion Design", "Storytelling", "Direction Artistique"],
    projects: [
      { name: "KohLanta", desc: "Jeu Instagram interactif avec éliminations en direct", metric: "100K+ reach, 15K participants" }
    ]
  },
  {
    id: "design",
    name: "Design et Événementiel",
    object: { path: "/models/gallery/trophy.glb", scale: 3 },
    position: [2.5, 0, -3] as [number, number, number],
    skills: ["Figma", "UI/UX", "Brand Identity", "Gestion de projet", "Community Management"],
    projects: [
      { name: "E-sport Events", desc: "Organisation de tournois et événements gaming", metric: "35K+ joueurs, 50+ événements" }
    ]
  }
];

// Preload all models
Object.values(ROOMS).forEach(path => useGLTF.preload(path));
SERVICES.forEach(s => useGLTF.preload(s.object.path));

// ============================================================
// SCROLL RANGES - FIXED TIMING
// ============================================================

// Hero: 0 - 0.10 (with zoom)
// Fade 1: 0.10 - 0.12
// Gallery: 0.12 - 0.55
// Fade 2: 0.55 - 0.57
// About: 0.57 - 0.77
// Fade 3: 0.77 - 0.79
// Contact: 0.79 - 1.0

const FADE_RANGES = [
  { start: 0.10, end: 0.12 }, // Hero -> Gallery
  { start: 0.55, end: 0.57 }, // Gallery -> About
  { start: 0.77, end: 0.79 }, // About -> Contact
];

// Gallery camera positions
const GALLERY_CAMERAS: { range: [number, number]; pos: [number, number, number]; look: [number, number, number]; service: number | null }[] = [
  { range: [0.12, 0.20], pos: [0, 2, -8], look: [0, 1, 0], service: null }, // Overview - closer
  { range: [0.20, 0.28], pos: [0, 1.5, 5], look: [0, 1.2, 3], service: 0 },    // Web Dev
  { range: [0.28, 0.36], pos: [-2, 1.5, 2], look: [-2.5, 1.2, 0], service: 1 }, // Apps
  { range: [0.36, 0.44], pos: [2, 1.5, 2], look: [2.5, 1.2, 0], service: 2 },   // 3D
  { range: [0.44, 0.50], pos: [-2, 1.5, -1], look: [-2.5, 1.2, -3], service: 3 }, // Video
  { range: [0.50, 0.55], pos: [2, 1.5, -1], look: [2.5, 1.2, -3], service: 4 },   // Design
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function getCurrentRoom(progress: number): keyof typeof ROOMS {
  if (progress < 0.12) return "hero";
  if (progress < 0.57) return "gallery";
  if (progress < 0.79) return "about";
  return "contact";
}

export function getFadeOpacity(progress: number): number {
  for (const fade of FADE_RANGES) {
    if (progress >= fade.start && progress <= fade.end) {
      const mid = (fade.start + fade.end) / 2;
      if (progress < mid) {
        return (progress - fade.start) / (mid - fade.start);
      } else {
        return 1 - (progress - mid) / (fade.end - mid);
      }
    }
  }
  return 0;
}

export function getActiveService(progress: number): number | null {
  for (const cam of GALLERY_CAMERAS) {
    if (progress >= cam.range[0] && progress < cam.range[1]) {
      return cam.service;
    }
  }
  return null;
}

export function isGalleryOverview(progress: number): boolean {
  return progress >= 0.12 && progress < 0.20;
}

function getCameraForProgress(progress: number): { pos: [number, number, number]; look: [number, number, number] } {
  // Hero with zoom
  if (progress < 0.12) {
    const zoomProgress = progress / 0.12;
    const z = 4 - zoomProgress * 1.5;
    return { pos: [0, 1.5, z], look: [0, 1.2, 0] };
  }

  // Gallery
  if (progress < 0.57) {
    for (const cam of GALLERY_CAMERAS) {
      if (progress >= cam.range[0] && progress < cam.range[1]) {
        return { pos: cam.pos, look: cam.look };
      }
    }
  }

  // About section (0.57 - 0.66)
  if (progress < 0.66) {
    return { pos: [0, 1.5, 3], look: [0, 1.2, 0] };
  }

  // Offers section (0.66 - 0.79) - Camera moves distinctly for each offer
  if (progress < 0.79) {
    const offersProgress = (progress - 0.66) / (0.79 - 0.66);
    const offerIndex = Math.min(2, Math.floor(offersProgress * 3));
    const offerLocalProgress = (offersProgress * 3) % 1;

    const offerPositions = [
      { pos: [-1.2, 1.4, 3.2], look: [0.3, 1.0, 0] },
      { pos: [0, 1.8, 2.8], look: [0, 1.2, 0] },
      { pos: [1.2, 1.5, 3.0], look: [-0.3, 1.0, 0] },
    ];

    const current = offerPositions[offerIndex];
    const next = offerPositions[Math.min(2, offerIndex + 1)];

    const smoothProgress = offerLocalProgress * offerLocalProgress * (3 - 2 * offerLocalProgress);

    const camX = current.pos[0] + (next.pos[0] - current.pos[0]) * smoothProgress;
    const camY = current.pos[1] + (next.pos[1] - current.pos[1]) * smoothProgress;
    const camZ = current.pos[2] + (next.pos[2] - current.pos[2]) * smoothProgress;
    const lookX = current.look[0] + (next.look[0] - current.look[0]) * smoothProgress;
    const lookY = current.look[1] + (next.look[1] - current.look[1]) * smoothProgress;

    return { pos: [camX, camY, camZ], look: [lookX, lookY, 0] };
  }

  // Contact - camera looking slightly down
  return { pos: [0, 1.8, 2.5], look: [0, 0.8, -1] };
}

// ============================================================
// COMPONENTS
// ============================================================

function Room({ path, visible }: { path: string; visible: boolean }) {
  const { scene } = useGLTF(path);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.material = child.material.clone();
      }
    });
    return clone;
  }, [scene]);

  if (!visible) return null;

  return <primitive object={clonedScene} />;
}

function ServiceObject({
  config,
  isActive,
}: {
  config: typeof SERVICES[0];
  isActive: boolean;
}) {
  const { scene } = useGLTF(config.object.path);
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.material = child.material.clone();
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMapIntensity = 1.5;
        }
      }
    });
    return clone;
  }, [scene]);

  const { offsetY } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    const scale = config.object.scale;
    return {
      offsetY: (-center.y + size.y / 2) * scale,
    };
  }, [clonedScene, config.object.scale]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const speed = isActive ? 0.8 : hovered ? 0.6 : 0.3;
      groupRef.current.rotation.y += delta * speed;
    }

    if (glowRef.current) {
      const targetOpacity = isActive ? 0.5 : hovered ? 0.25 : 0;
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity += (targetOpacity - material.opacity) * 0.1;

      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1;
      glowRef.current.scale.setScalar(isActive ? pulse : 1);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
    }
  });

  const pedestalHeight = 0.8;

  return (
    <group position={config.position}>
      {/* Base glow */}
      <mesh
        ref={glowRef}
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial
          color={isActive ? "#4080ff" : "#ffffff"}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Animated ring */}
      {(isActive || hovered) && (
        <mesh
          ref={ringRef}
          position={[0, 0.03, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.9, 1.0, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={isActive ? 0.3 : 0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Pedestal */}
      <mesh position={[0, pedestalHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.35, pedestalHeight, 32]} />
        <meshStandardMaterial
          color={isActive ? "#2a2a2a" : hovered ? "#1a1a1a" : "#111"}
          metalness={0.98}
          roughness={0.02}
          emissive={isActive ? "#222" : hovered ? "#111" : "#000"}
          emissiveIntensity={isActive ? 0.5 : 0.2}
        />
      </mesh>

      {/* Base ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.5, 32]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.95}
          roughness={0.05}
          emissive={isActive ? "#444" : "#000"}
        />
      </mesh>

      {/* Lights when active */}
      {isActive && (
        <>
          <spotLight
            position={[0, 4, 2]}
            angle={0.4}
            penumbra={0.9}
            intensity={4}
            color="#ffffff"
            castShadow
          />
          <pointLight
            position={[0, 2.5, 0]}
            intensity={2}
            color="#ffffff"
            distance={6}
          />
          {/* Sparkles around active object */}
          <Sparkles
            count={20}
            scale={2}
            size={2}
            speed={0.4}
            opacity={0.6}
            position={[0, 1.5, 0]}
          />
        </>
      )}

      {/* Object with Float */}
      <Float
        speed={2}
        rotationIntensity={0}
        floatIntensity={isActive ? 0.3 : 0.15}
        floatingRange={[-0.05, 0.05]}
      >
        <group position={[0, pedestalHeight + offsetY, 0]}>
          <group ref={groupRef} scale={config.object.scale}>
            <primitive object={clonedScene} />
          </group>
        </group>
      </Float>

      {/* Invisible hitbox for hover */}
      <mesh
        position={[0, 1.5, 0]}
        onPointerOver={() => { setHovered(true); }}
        onPointerOut={() => { setHovered(false); }}
      >
        <boxGeometry args={[1.2, 3, 1.2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Hover light */}
      {hovered && !isActive && (
        <pointLight position={[0, 2.5, 0]} intensity={1.5} color="#ffffff" distance={4} />
      )}
    </group>
  );
}

function Gallery({ visible, activeService }: { visible: boolean; activeService: number | null }) {
  if (!visible) return null;

  return (
    <group>
      {SERVICES.map((service, index) => (
        <ServiceObject
          key={service.id}
          config={service}
          isActive={activeService === index}
        />
      ))}
    </group>
  );
}

function CinematicCamera({
  scrollProgress,
  mouse,
}: {
  scrollProgress: number;
  mouse: { x: number; y: number };
}) {
  const { camera, clock } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3(0, 1, 0));

  useFrame(() => {
    const { pos, look } = getCameraForProgress(scrollProgress);
    const time = clock.getElapsedTime();

    // Subtle breathing/sway motion
    const breathX = Math.sin(time * 0.3) * 0.02;
    const breathY = Math.cos(time * 0.25) * 0.015;
    const breathZ = Math.sin(time * 0.2) * 0.01;

    const parallax = 0.15;
    targetPos.current.set(
      pos[0] + mouse.x * parallax + breathX,
      pos[1] + mouse.y * parallax * 0.3 + breathY,
      pos[2] + breathZ
    );
    targetLook.current.set(
      look[0] + mouse.x * parallax * 0.5 + breathX * 0.5,
      look[1] + mouse.y * parallax * 0.2 + breathY * 0.3,
      look[2]
    );

    camera.position.lerp(targetPos.current, 0.04);
    currentLook.current.lerp(targetLook.current, 0.04);
    camera.lookAt(currentLook.current);
  });

  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ffffff" />
    </>
  );
}

function DustParticles({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <Sparkles
      count={50}
      scale={10}
      size={1.5}
      speed={0.2}
      opacity={0.3}
      color="#ffffff"
    />
  );
}

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.15}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        offset={0.4}
        darkness={0.5}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

function Scene({
  scrollProgress,
  mouse,
}: {
  scrollProgress: number;
  mouse: { x: number; y: number };
}) {
  const currentRoom = getCurrentRoom(scrollProgress);
  const activeService = getActiveService(scrollProgress);
  const showGallery = currentRoom === "gallery";

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 8, 25]} />
      <CinematicCamera scrollProgress={scrollProgress} mouse={mouse} />
      <Lights />
      <Environment preset="city" />

      <Room path={ROOMS.hero} visible={currentRoom === "hero"} />
      <Room path={ROOMS.gallery} visible={currentRoom === "gallery"} />
      <Room path={ROOMS.about} visible={currentRoom === "about"} />
      <Room path={ROOMS.contact} visible={currentRoom === "contact"} />

      <Gallery visible={showGallery} activeService={activeService} />

      <DustParticles visible={true} />
      <PostProcessing />
    </>
  );
}

// ============================================================
// MAIN EXPORT
// ============================================================

interface ImmersiveSceneProps {
  scrollProgress: number;
  onFadeOpacity: (opacity: number) => void;
}

export default function ImmersiveScene({ scrollProgress, onFadeOpacity }: ImmersiveSceneProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const lastRoomRef = useRef<string | null>(null);

  useEffect(() => {
    const opacity = getFadeOpacity(scrollProgress);
    onFadeOpacity(opacity);

    // Play transition sound when changing rooms
    const currentRoom = getCurrentRoom(scrollProgress);
    if (lastRoomRef.current && lastRoomRef.current !== currentRoom) {
      if (typeof (window as any).playTransitionSound === "function") {
        (window as any).playTransitionSound();
      }
    }
    lastRoomRef.current = currentRoom;
  }, [scrollProgress, onFadeOpacity]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene scrollProgress={scrollProgress} mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}
