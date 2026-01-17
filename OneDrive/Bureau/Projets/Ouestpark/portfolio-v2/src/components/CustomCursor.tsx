/**
 * @component CustomCursor
 * @description Premium custom cursor with magnetic effect - Awwwards level
 * @author Cleanlystudio
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [hoverType, setHoverType] = useState<"default" | "link" | "button" | "view">("default");

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorTrail = cursorTrailRef.current;
    if (!cursor || !cursorDot || !cursorTrail) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;
    let trailX = 0;
    let trailY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => {
      setIsClicking(true);
      if (typeof (window as any).playClickSound === "function") {
        (window as any).playClickSound();
      }
    };
    const onMouseUp = () => setIsClicking(false);

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      dotX += (mouseX - dotX) * 0.6;
      dotY += (mouseY - dotY) * 0.6;
      trailX += (mouseX - trailX) * 0.08;
      trailY += (mouseY - trailY) * 0.08;

      cursor.style.transform = `translate(${cursorX - 24}px, ${cursorY - 24}px)`;
      cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
      cursorTrail.style.transform = `translate(${trailX - 40}px, ${trailY - 40}px)`;

      requestAnimationFrame(animate);
    };

    const handleHoverables = () => {
      const hoverables = document.querySelectorAll("a, button, .hoverable, [data-cursor]");

      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          setIsHovering(true);
          const text = el.getAttribute("data-cursor");
          if (text) setCursorText(text);

          const tagName = el.tagName.toLowerCase();
          if (tagName === "a") setHoverType("link");
          else if (tagName === "button") setHoverType("button");
          else if (text) setHoverType("view");
          else setHoverType("default");

          if (typeof (window as any).playHoverSound === "function") {
            (window as any).playHoverSound();
          }
        });
        el.addEventListener("mouseleave", () => {
          setIsHovering(false);
          setCursorText("");
          setHoverType("default");
        });
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    handleHoverables();
    animate();

    const observer = new MutationObserver(handleHoverables);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      observer.disconnect();
    };
  }, [isVisible]);

  useEffect(() => {
    if (!cursorRef.current) return;

    if (isHovering) {
      gsap.to(cursorRef.current, {
        scale: cursorText ? 2 : 1.6,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)"
      });
    } else {
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)"
      });
    }
  }, [isHovering, cursorText]);

  useEffect(() => {
    if (!cursorRef.current || !cursorDotRef.current) return;

    if (isClicking) {
      gsap.to(cursorRef.current, {
        scale: 0.7,
        duration: 0.1,
        ease: "power2.out"
      });
      gsap.to(cursorDotRef.current, {
        scale: 0.5,
        duration: 0.1,
        ease: "power2.out"
      });
    } else if (!isHovering) {
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)"
      });
      gsap.to(cursorDotRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)"
      });
    }
  }, [isClicking, isHovering]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <div
        ref={cursorTrailRef}
        className={`cursor-trail ${isVisible ? "visible" : ""}`}
      />
      <div
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? "hovering" : ""} ${isVisible ? "visible" : ""} ${hoverType}`}
      >
        <div className="cursor-ring" />
        {cursorText && (
          <span className="cursor-text">{cursorText}</span>
        )}
      </div>
      <div
        ref={cursorDotRef}
        className={`cursor-dot ${isVisible ? "visible" : ""} ${isHovering ? "hovering" : ""}`}
      />

      <style jsx>{`
        .cursor-trail {
          position: fixed;
          top: 0;
          left: 0;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          opacity: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
          transition: opacity 0.5s ease;
        }

        .cursor-trail.visible {
          opacity: 1;
        }

        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 48px;
          height: 48px;
          pointer-events: none;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cursor-ring {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .custom-cursor.visible {
          opacity: 1;
        }

        .custom-cursor.hovering .cursor-ring {
          border-color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
        }

        .custom-cursor.link .cursor-ring {
          border-style: dashed;
        }

        .custom-cursor.button .cursor-ring {
          border-width: 2px;
        }

        .custom-cursor.view .cursor-ring {
          background: rgba(255, 255, 255, 0.1);
        }

        .cursor-text {
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #fff;
          white-space: nowrap;
          position: relative;
          z-index: 1;
          animation: textFadeIn 0.3s ease;
        }

        @keyframes textFadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          background: #fff;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10001;
          opacity: 0;
          transition: opacity 0.3s ease, background 0.3s ease;
        }

        .cursor-dot.visible {
          opacity: 1;
        }

        .cursor-dot.hovering {
          background: transparent;
        }

        @media (pointer: coarse) {
          .custom-cursor,
          .cursor-dot,
          .cursor-trail {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
