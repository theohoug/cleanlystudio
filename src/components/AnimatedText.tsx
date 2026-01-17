/**
 * @component AnimatedText
 * @description Premium GSAP text animations - Awwwards level
 * @author Cleanlystudio
 */
"use client";

import { useEffect, useRef, ReactNode, ButtonHTMLAttributes } from "react";
import { gsap } from "gsap";

interface AnimatedTitleProps {
  children: string;
  className?: string;
  delay?: number;
  isVisible: boolean;
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export function AnimatedTitle({ children, className = "", delay = 0, isVisible }: AnimatedTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const scrambleIntervals = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current || !isVisible) return;

    const lines = containerRef.current.querySelectorAll(".line");
    const chars = containerRef.current.querySelectorAll(".char");
    const charTexts = containerRef.current.querySelectorAll(".char-text");
    const glows = containerRef.current.querySelectorAll(".char-glow");

    gsap.set(lines, { overflow: "visible", paddingRight: "0.15em", paddingLeft: "0.05em" });
    gsap.set(chars, { y: "120%", opacity: 0, rotateX: -90, scale: 0.8 });
    gsap.set(glows, { opacity: 0, scale: 0 });

    const tl = gsap.timeline({ delay });

    // Main reveal animation
    tl.to(chars, {
      y: "0%",
      opacity: 1,
      rotateX: 0,
      scale: 1,
      duration: 1.0,
      stagger: 0.03,
      ease: "power4.out",
    });

    // Text scramble effect
    charTexts.forEach((charText, i) => {
      const originalChar = charText.textContent || "";
      if (originalChar === " ") return;

      const startTime = delay * 1000 + i * 30;
      const scrambleDuration = 400 + Math.random() * 200;
      const scrambleCount = 6 + Math.floor(Math.random() * 4);

      setTimeout(() => {
        let count = 0;
        const interval = setInterval(() => {
          if (count < scrambleCount) {
            charText.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            count++;
          } else {
            charText.textContent = originalChar;
            clearInterval(interval);
          }
        }, scrambleDuration / scrambleCount);
        scrambleIntervals.current.push(interval);
      }, startTime);
    });

    // Glow animation
    tl.to(glows, {
      opacity: 0.8,
      scale: 1.2,
      duration: 0.3,
      stagger: 0.02,
    }, "-=0.6")
    .to(glows, {
      opacity: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.01,
      onComplete: () => {
        hasAnimated.current = true;
      }
    }, "-=0.1");

  }, [delay, isVisible]);

  useEffect(() => {
    if (!isVisible && containerRef.current) {
      hasAnimated.current = false;
      scrambleIntervals.current.forEach(clearInterval);
      scrambleIntervals.current = [];
      const chars = containerRef.current.querySelectorAll(".char");
      const glows = containerRef.current.querySelectorAll(".char-glow");
      gsap.set(chars, { y: "120%", opacity: 0, rotateX: -90, scale: 0.8 });
      gsap.set(glows, { opacity: 0, scale: 0 });
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      scrambleIntervals.current.forEach(clearInterval);
    };
  }, []);

  const lines = children.split("\n");

  return (
    <div ref={containerRef} className={className} style={{ perspective: "1000px" }}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="line" style={{ display: "block", overflow: "visible", paddingRight: "0.1em" }}>
          <span style={{ display: "inline-block", transformStyle: "preserve-3d" }}>
            {line.split("").map((char, charIndex) => (
              <span
                key={charIndex}
                className="char"
                style={{
                  display: "inline-block",
                  whiteSpace: char === " " ? "pre" : "normal",
                  position: "relative",
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="char-text">{char}</span>
                <span
                  className="char-glow"
                  style={{
                    position: "absolute",
                    inset: "-15px",
                    background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: -1,
                  }}
                />
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

interface AnimatedParagraphProps {
  children: string;
  className?: string;
  delay?: number;
  isVisible: boolean;
}

export function AnimatedParagraph({ children, className = "", delay = 0, isVisible }: AnimatedParagraphProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current || !isVisible) return;

    const words = ref.current.querySelectorAll(".word-inner");

    gsap.fromTo(words,
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.7,
        stagger: 0.015,
        ease: "power3.out",
        delay: delay,
        onComplete: () => {
          hasAnimated.current = true;
        }
      }
    );
  }, [delay, isVisible]);

  useEffect(() => {
    if (!isVisible && ref.current) {
      hasAnimated.current = false;
      const words = ref.current.querySelectorAll(".word-inner");
      gsap.set(words, { y: "100%", opacity: 0 });
    }
  }, [isVisible]);

  const words = children.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.25em" }}>
          <span className="word-inner" style={{ display: "inline-block" }}>
            {word}
          </span>
        </span>
      ))}
    </p>
  );
}

interface AnimatedLabelProps {
  children: string;
  className?: string;
  delay?: number;
  isVisible: boolean;
}

export function AnimatedLabel({ children, className = "", delay = 0, isVisible }: AnimatedLabelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current || !isVisible) return;

    const line = ref.current.querySelector(".label-line");
    const text = ref.current.querySelector(".label-text");
    const chars = ref.current.querySelectorAll(".label-char");

    const tl = gsap.timeline({ delay });

    tl.fromTo(line,
      { width: 0 },
      { width: 24, duration: 0.5, ease: "power2.out" }
    )
    .fromTo(text,
      { x: -10, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
      "-=0.2"
    )
    .fromTo(chars,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.02,
        ease: "power2.out",
        onComplete: () => {
          hasAnimated.current = true;
        }
      },
      "-=0.3"
    );

  }, [delay, isVisible]);

  useEffect(() => {
    if (!isVisible && ref.current) {
      hasAnimated.current = false;
      const line = ref.current.querySelector(".label-line");
      const text = ref.current.querySelector(".label-text");
      const chars = ref.current.querySelectorAll(".label-char");
      gsap.set(line, { width: 0 });
      gsap.set(text, { x: -10, opacity: 0 });
      gsap.set(chars, { opacity: 0, y: 8 });
    }
  }, [isVisible]);

  return (
    <div ref={ref} className={className} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span
        className="label-line"
        style={{
          display: "block",
          height: "1px",
          background: "rgba(255,255,255,0.4)",
          width: 0,
        }}
      />
      <span className="label-text" style={{ display: "inline-flex", opacity: 0 }}>
        {children.split("").map((char, i) => (
          <span
            key={i}
            className="label-char"
            style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
          >
            {char}
          </span>
        ))}
      </span>
    </div>
  );
}

interface StaggerRevealProps {
  children: React.ReactNode[];
  className?: string;
  delay?: number;
  stagger?: number;
  isVisible: boolean;
}

export function StaggerReveal({ children, className = "", delay = 0, stagger = 0.1, isVisible }: StaggerRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current || !isVisible) return;

    const items = containerRef.current.children;

    gsap.fromTo(items,
      { y: 50, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: stagger,
        ease: "power3.out",
        delay: delay,
        onComplete: () => {
          hasAnimated.current = true;
        }
      }
    );
  }, [delay, stagger, isVisible]);

  useEffect(() => {
    if (!isVisible && containerRef.current) {
      hasAnimated.current = false;
      const items = containerRef.current.children;
      gsap.set(items, { y: 50, opacity: 0, scale: 0.9 });
    }
  }, [isVisible]);

  return (
    <div ref={containerRef} className={className}>
      {children.map((child, index) => (
        <div key={index} style={{ opacity: 0 }}>
          {child}
        </div>
      ))}
    </div>
  );
}

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className = "", strength = 0.35, ...props }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const content = contentRef.current;
    const glow = glowRef.current;
    if (!button || !content) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power2.out"
      });

      gsap.to(content, {
        x: x * strength * 0.5,
        y: y * strength * 0.5,
        duration: 0.4,
        ease: "power2.out"
      });

      if (glow) {
        gsap.to(glow, {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          duration: 0.2,
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to([button, content], {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)"
      });

      if (glow) {
        gsap.to(glow, { opacity: 0, duration: 0.3 });
      }
    };

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      });

      if (glow) {
        gsap.to(glow, { opacity: 1, duration: 0.3 });
      }

      if (typeof (window as any).playHoverSound === "function") {
        (window as any).playHoverSound();
      }
    };

    const handleClick = () => {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(button, {
            scale: 1.02,
            duration: 0.4,
            ease: "elastic.out(1, 0.5)"
          });
        }
      });

      if (typeof (window as any).playClickSound === "function") {
        (window as any).playClickSound();
      }
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("click", handleClick);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("click", handleClick);
    };
  }, [strength]);

  return (
    <button
      ref={buttonRef}
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      {...props}
    >
      <span
        ref={glowRef}
        style={{
          position: "absolute",
          width: "150px",
          height: "150px",
          background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          opacity: 0,
        }}
      />
      <span ref={contentRef} style={{ display: "flex", alignItems: "center", gap: "inherit", position: "relative", zIndex: 1 }}>
        {children}
      </span>
    </button>
  );
}

export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(entry.target,
              { y: 60, opacity: 0 },
              { y: 0, opacity: 1, duration: 1, delay, ease: "power3.out" }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

export function TextShimmer({
  children,
  className = "",
  isVisible,
  delay = 0,
}: {
  children: string;
  className?: string;
  isVisible: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current || !isVisible) return;
    hasAnimated.current = true;

    const shimmer = ref.current.querySelector(".shimmer");

    gsap.fromTo(shimmer,
      { x: "-100%" },
      {
        x: "200%",
        duration: 1.5,
        delay: delay + 0.5,
        ease: "power2.inOut",
      }
    );
  }, [isVisible, delay]);

  useEffect(() => {
    if (!isVisible) hasAnimated.current = false;
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", overflow: "hidden", display: "inline-block" }}
    >
      {children}
      <span
        className="shimmer"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          transform: "translateX(-100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
