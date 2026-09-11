"use client";

import React, { useState, useEffect, useRef } from "react";

interface CIIRCFirstBootProps {
  onComplete: () => void;
  isDark: boolean;
}

type BootPhase =
  | "empty"        // 0.0s - 0.7s: Pristine empty canvas, faint ambient caustic breathing begins
  | "condensing"   // 0.7s - 1.8s: Liquid glass silhouette forms from soft blur and light
  | "refracting"   // 1.8s - 2.8s: Specular light sweep sweeps across the glass letterforms
  | "resolved"     // 2.4s - 3.1s: Letters settle into crisp optical glass clarity
  | "welcome"      // 2.7s - 4.2s: "Welcome to CIIRC" emerges gracefully beneath the wordmark
  | "dissolving"   // 4.2s - 4.9s: Seamless continuous dissolve into the workspace environment
  | "complete";

export function CIIRCFirstBoot({ onComplete, isDark }: CIIRCFirstBootProps) {
  const [phase, setPhase] = useState<BootPhase>("empty");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Automatic cinematic timeline (total sequence ~4.8 seconds)
  useEffect(() => {
    if (prefersReducedMotion) {
      // Graceful swift transition for reduced motion users
      const t1 = setTimeout(() => setPhase("resolved"), 200);
      const t2 = setTimeout(() => setPhase("welcome"), 500);
      const t3 = setTimeout(() => {
        setPhase("dissolving");
        setTimeout(onComplete, 400);
      }, 1500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }

    // Phase 1: Liquid glass condensation begins (0.7s)
    const t1 = setTimeout(() => setPhase("condensing"), 700);

    // Phase 2: Specular reflection sweep glides across the letterforms (1.8s)
    const t2 = setTimeout(() => setPhase("refracting"), 1800);

    // Phase 3: Glass achieves crystal optical clarity (2.4s)
    const t3 = setTimeout(() => setPhase("resolved"), 2400);

    // Phase 4: "Welcome to CIIRC" emerges with subtle upward drift (2.7s)
    const t4 = setTimeout(() => setPhase("welcome"), 2700);

    // Phase 5: Automatic transition engages at 4.2s (no button needed)
    const t5 = setTimeout(() => {
      setPhase("dissolving");
      // Mark as seen in localStorage
      try {
        localStorage.setItem("ciirc_intro_seen", "true");
      } catch {}
      // Notify parent to unmount after fade completes (4.9s)
      setTimeout(() => {
        setPhase("complete");
        onComplete();
      }, 700);
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [prefersReducedMotion, onComplete]);

  // Keyboard escape hatch for power users (Enter / Space / Esc instantly enters workspace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        try {
          localStorage.setItem("ciirc_intro_seen", "true");
        } catch {}
        setPhase("complete");
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  // Phase status helpers
  const isCondensing = phase !== "empty";
  const isRefracting = ["refracting", "resolved", "welcome", "dissolving", "complete"].includes(phase);
  const isResolved = ["resolved", "welcome", "dissolving", "complete"].includes(phase);
  const isWelcome = ["welcome", "dissolving", "complete"].includes(phase);
  const isDissolving = phase === "dissolving";

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none pointer-events-none transition-opacity duration-700 ease-out ${
        isDissolving ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: isDark
          ? "radial-gradient(ellipse 130% 100% at 50% 38%, #0d1424 0%, #080c16 50%, #03050a 100%)"
          : "radial-gradient(ellipse 130% 100% at 50% 36%, #ffffff 0%, #f6f8fc 48%, #e9eef7 100%)",
      }}
    >
      {/* 1. Atmospheric Volumetric Caustic Lighting (Subtle Breathing Field) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Soft Cyan Atmospheric Pool */}
        <div
          className={`absolute w-[720px] h-[380px] rounded-full transition-all duration-1000 ease-out ${
            isCondensing ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(56, 189, 248, 0.20) 0%, rgba(2, 132, 199, 0.05) 50%, transparent 75%)"
              : "radial-gradient(circle, rgba(56, 189, 248, 0.24) 0%, rgba(186, 230, 253, 0.10) 50%, transparent 75%)",
            filter: "blur(75px)",
            transform: isDissolving ? "scale(1.4)" : "scale(1)",
          }}
        />

        {/* Faint Indigo Deep-Field Undertone */}
        <div
          className={`absolute w-[960px] h-[520px] rounded-full transition-all duration-1200 ease-out ${
            isCondensing ? "opacity-100 scale-100" : "opacity-0 scale-85"
          }`}
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(30, 58, 138, 0.15) 0%, rgba(14, 165, 233, 0.02) 60%, transparent 80%)"
              : "radial-gradient(circle, rgba(0, 102, 204, 0.07) 0%, rgba(224, 242, 254, 0.04) 60%, transparent 80%)",
            filter: "blur(100px)",
            transform: isDissolving ? "scale(1.3)" : "scale(1)",
          }}
        />
      </div>

      {/* 2. Hero Composition (Enormous Negative Space) */}
      <div className="relative flex flex-col items-center justify-center z-10">
        {/* Soft Physical Depth Floor Shadow */}
        <div
          className={`absolute -bottom-3 w-[400px] sm:w-[480px] h-[52px] rounded-full pointer-events-none transition-all duration-1000 ${
            isResolved ? "opacity-100" : isCondensing ? "opacity-40" : "opacity-0"
          }`}
          style={{
            background: isDark
              ? "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.65) 0%, rgba(2, 132, 199, 0.08) 45%, transparent 75%)"
              : "radial-gradient(ellipse at center, rgba(14, 50, 120, 0.15) 0%, rgba(14, 50, 120, 0.03) 50%, transparent 75%)",
            filter: "blur(20px)",
          }}
        />

        {/* 3. The CIIRC Liquid Glass Wordmark */}
        <div
          className="relative flex items-center justify-center transition-all"
          style={{
            transitionDuration: isDissolving ? "700ms" : isResolved ? "1000ms" : "1200ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transform: isDissolving
              ? "scale(1.05) translateY(-6px)"
              : isResolved
              ? "scale(1) translateY(0)"
              : isCondensing
              ? "scale(0.98) translateY(2px)"
              : "scale(0.95) translateY(8px)",
            opacity: isDissolving ? 0 : isResolved ? 1 : isCondensing ? 0.75 : 0,
            filter: isDissolving
              ? "blur(12px)"
              : isResolved
              ? "blur(0px)"
              : isCondensing
              ? "blur(10px)"
              : "blur(32px)",
          }}
        >
          {/* Authentic CIIRC Wordmark with Liquid Glass Optical Shader Stack */}
          <img
            src="/ciirc-logo-hires.png"
            alt="CIIRC"
            className="w-[340px] sm:w-[440px] lg:w-[480px] h-auto object-contain select-none"
            style={{
              filter: isDark
                ? "drop-shadow(0 1.5px 2px rgba(255, 255, 255, 0.8)) drop-shadow(0 -1px 2px rgba(56, 189, 248, 0.4)) drop-shadow(0 18px 40px rgba(0, 0, 0, 0.7))"
                : "drop-shadow(0 2px 3px rgba(255, 255, 255, 0.98)) drop-shadow(0 -1px 2px rgba(2, 132, 199, 0.38)) drop-shadow(0 16px 36px rgba(2, 132, 199, 0.16))",
            }}
          />

          {/* Traveling Specular Light Sweep (Masked strictly inside letterforms) */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              WebkitMaskImage: "url(/ciirc-logo-hires.png)",
              maskImage: "url(/ciirc-logo-hires.png)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              mixBlendMode: "overlay",
            }}
          >
            <div
              className="absolute top-[-60%] left-[-120%] w-[65%] h-[220%]"
              style={{
                background:
                  "linear-gradient(115deg, transparent 15%, rgba(255, 255, 255, 0.15) 32%, rgba(255, 255, 255, 0.95) 48%, rgba(56, 189, 248, 0.75) 53%, rgba(255, 255, 255, 0.2) 68%, transparent 85%)",
                transform: isRefracting
                  ? "translateX(800px) rotate(18deg)"
                  : "translateX(0px) rotate(18deg)",
                transition: "transform 1.3s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
        </div>

        {/* 4. The "Welcome to CIIRC" Moment */}
        <p
          className="mt-8 text-[13.5px] sm:text-[15px] font-medium tracking-[0.26em] uppercase select-none transition-all duration-700"
          style={{
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            color: isDark ? "rgba(226, 232, 240, 0.92)" : "rgba(71, 85, 105, 0.92)",
            opacity: isDissolving ? 0 : isWelcome ? 1 : 0,
            transform: isDissolving
              ? "translateY(-6px)"
              : isWelcome
              ? "translateY(0)"
              : "translateY(10px)",
            filter: isWelcome ? "blur(0px)" : "blur(6px)",
          }}
        >
          Welcome to CIIRC
        </p>
      </div>
    </div>
  );
}
