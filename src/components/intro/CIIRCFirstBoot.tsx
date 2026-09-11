"use client";

import React, { useState, useEffect, useRef } from "react";

interface CIIRCFirstBootProps {
  onComplete: () => void;
  isDark: boolean;
}

type BootPhase =
  | "empty"        // 0.0s - 0.7s: Pristine empty canvas, faint ambient cyan/indigo diffusion wakes up
  | "formation"    // 0.7s - 1.6s: Liquid glass silhouette forms from soft blur and atmospheric light
  | "refining"     // 1.3s - 2.3s: Progressive resolution into blue/cyan-tinted translucent liquid glass
  | "specular"     // 2.1s - 2.8s: Single restrained specular refraction pass travels across the glass
  | "resolved"     // 2.7s - 3.3s: Settles into crisp optical liquid glass with dimensional depth
  | "welcome"      // 3.0s - 4.2s: "Welcome to CIIRC" emerges gracefully beneath the wordmark
  | "dissolving"   // 4.2s - 5.0s: Seamless continuous dissolve into the workspace environment
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

  // Automatic cinematic timeline (total sequence ~4.9 seconds)
  useEffect(() => {
    if (prefersReducedMotion) {
      const t1 = setTimeout(() => setPhase("resolved"), 150);
      const t2 = setTimeout(() => setPhase("welcome"), 400);
      const t3 = setTimeout(() => {
        setPhase("dissolving");
        setTimeout(onComplete, 400);
      }, 1400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }

    // Phase 1 -> 2: Formation of the blue/cyan liquid glass silhouette (0.7s)
    const t1 = setTimeout(() => setPhase("formation"), 700);

    // Phase 2 -> 3: Progressive liquid resolution & glass tint emergence (1.3s)
    const t2 = setTimeout(() => setPhase("refining"), 1300);

    // Phase 3 -> 4: Specular reflection sweep glides across the letterforms (2.1s)
    const t3 = setTimeout(() => setPhase("specular"), 2100);

    // Phase 4 -> 5: Settles into crystal-clear blue-tinted liquid glass (2.7s)
    const t4 = setTimeout(() => setPhase("resolved"), 2700);

    // Phase 5 -> 6: "Welcome to CIIRC" emerges with subtle upward drift (3.0s)
    const t5 = setTimeout(() => setPhase("welcome"), 3000);

    // Phase 6 -> 7: Automatic seamless dissolve engages at 4.2s (no button needed)
    const t6 = setTimeout(() => {
      setPhase("dissolving");
      try {
        localStorage.setItem("ciirc_intro_seen", "true");
      } catch {}

      // Unmount overlay after dissolve transition completes (5.0s)
      setTimeout(() => {
        setPhase("complete");
        onComplete();
      }, 750);
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [prefersReducedMotion, onComplete]);

  // Keyboard shortcut for power users (Enter / Space / Esc instantly enters workspace)
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
  const isForming = phase !== "empty";
  const isRefining = ["refining", "specular", "resolved", "welcome", "dissolving", "complete"].includes(phase);
  const isSpecular = ["specular", "resolved", "welcome", "dissolving", "complete"].includes(phase);
  const isResolved = ["resolved", "welcome", "dissolving", "complete"].includes(phase);
  const isWelcome = ["welcome", "dissolving", "complete"].includes(phase);
  const isDissolving = phase === "dissolving";

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none pointer-events-none transition-opacity duration-750 ease-out ${
        isDissolving ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: isDark
          ? "radial-gradient(ellipse 130% 100% at 50% 38%, #0b1120 0%, #060913 52%, #020408 100%)"
          : "radial-gradient(ellipse 130% 100% at 50% 36%, #ffffff 0%, #f7f9fd 46%, #e8eff8 100%)",
      }}
    >
      {/* Embedded SVG Shader Definitions for Real-Time Liquid Glass Optics */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          {/* Liquid Glass 3D Specular Chamfer Light Filter */}
          <filter id="ciircLiquidGlassOptics" x="-20%" y="-20%" width="140%" height="140%">
            {/* 1. Extract Alpha and compute smooth bevel slope */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="blurAlpha" />

            {/* 2. Key Specular Highlight from Top-Left (Crisp white/cyan reflection rim) */}
            <feSpecularLighting
              in="blurAlpha"
              surfaceScale="5.2"
              specularConstant="1.35"
              specularExponent="26"
              lightingColor="#ffffff"
              result="specularWhite"
            >
              <fePointLight x="-140" y="-180" z="260" />
            </feSpecularLighting>
            <feComposite in="specularWhite" in2="SourceAlpha" operator="in" result="cutSpecularWhite" />

            {/* 3. Secondary Cyan/Sky-Blue Internal Refraction Rim from Bottom-Right */}
            <feSpecularLighting
              in="blurAlpha"
              surfaceScale="4.0"
              specularConstant="1.1"
              specularExponent="16"
              lightingColor="#38bdf8"
              result="specularCyan"
            >
              <fePointLight x="180" y="220" z="220" />
            </feSpecularLighting>
            <feComposite in="specularCyan" in2="SourceAlpha" operator="in" result="cutSpecularCyan" />

            {/* 4. Merge Specular Chamfers with the Translucent Glass Body */}
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="cutSpecularCyan" />
              <feMergeNode in="cutSpecularWhite" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* 1. Atmospheric Volumetric Caustic Lighting (Subtle Breathing Field) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Soft Cyan Atmospheric Pool */}
        <div
          className={`absolute w-[760px] h-[400px] rounded-full transition-all duration-1100 ease-out ${
            isForming ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(2, 132, 199, 0.06) 50%, transparent 75%)"
              : "radial-gradient(circle, rgba(56, 189, 248, 0.26) 0%, rgba(186, 230, 253, 0.12) 50%, transparent 75%)",
            filter: "blur(80px)",
            transform: isDissolving ? "scale(1.45)" : "scale(1)",
          }}
        />

        {/* Faint Indigo Deep-Field Undertone */}
        <div
          className={`absolute w-[1000px] h-[540px] rounded-full transition-all duration-1300 ease-out ${
            isForming ? "opacity-100 scale-100" : "opacity-0 scale-85"
          }`}
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(30, 27, 105, 0.18) 0%, rgba(14, 165, 233, 0.03) 60%, transparent 80%)"
              : "radial-gradient(circle, rgba(30, 58, 138, 0.08) 0%, rgba(224, 242, 254, 0.05) 60%, transparent 80%)",
            filter: "blur(110px)",
            transform: isDissolving ? "scale(1.35)" : "scale(1)",
          }}
        />
      </div>

      {/* 2. Hero Composition (Enormous Negative Space) */}
      <div className="relative flex flex-col items-center justify-center z-10">
        {/* Soft Physical Tinted Caustic Floor Shadow */}
        <div
          className={`absolute -bottom-4 w-[420px] sm:w-[500px] h-[56px] rounded-full pointer-events-none transition-all duration-1000 ${
            isResolved ? "opacity-100" : isRefining ? "opacity-45" : "opacity-0"
          }`}
          style={{
            background: isDark
              ? "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7) 0%, rgba(2, 132, 199, 0.12) 40%, transparent 75%)"
              : "radial-gradient(ellipse at center, rgba(14, 165, 233, 0.24) 0%, rgba(30, 58, 138, 0.12) 45%, transparent 75%)",
            filter: "blur(22px)",
          }}
        />

        {/* 3. The CIIRC Blue-Tinted Liquid Glass Wordmark */}
        <div
          className="relative flex items-center justify-center select-none"
          style={{
            transitionDuration: isDissolving ? "750ms" : isResolved ? "1000ms" : "1200ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transform: isDissolving
              ? "scale(1.04) translateY(-5px)"
              : isResolved
              ? "scale(1) translateY(0)"
              : isRefining
              ? "scale(0.985) translateY(2px)"
              : "scale(0.95) translateY(8px)",
            opacity: isDissolving ? 0 : isResolved ? 1 : isRefining ? 0.85 : isForming ? 0.35 : 0,
            filter: isDissolving
              ? "blur(12px)"
              : isResolved
              ? "blur(0px)"
              : isRefining
              ? "blur(4px)"
              : isForming
              ? "blur(24px)"
              : "blur(36px)",
          }}
        >
          {/* Backing Caustic Aura: Illuminates the glass from behind */}
          <div
            className={`absolute -inset-10 rounded-full pointer-events-none transition-opacity duration-1000 ${
              isRefining ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.32) 0%, rgba(37, 99, 235, 0.15) 50%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />

          {/* Layer 1: The Authentic CIIRC Wordmark in 70% Translucent Optical Glass */}
          <img
            src="/ciirc-logo-hires.png"
            alt="CIIRC"
            className="w-[340px] sm:w-[450px] lg:w-[490px] h-auto object-contain select-none transition-all duration-700"
            style={{
              opacity: isDark ? 0.82 : 0.74,
              filter: `url(#ciircLiquidGlassOptics) ${
                isDark
                  ? "drop-shadow(0 2px 4px rgba(255, 255, 255, 0.7)) drop-shadow(0 18px 40px rgba(0, 0, 0, 0.75))"
                  : "drop-shadow(0 2px 4px rgba(255, 255, 255, 0.98)) drop-shadow(0 16px 36px rgba(2, 132, 199, 0.22))"
              }`,
            }}
          />

          {/* Layer 2: Volumetric Blue/Cyan Liquid Glass Internal Luminance & Depth */}
          {/* Strictly masked to letterforms to ensure letters are visibly BLUE/CYAN TINTED GLASS */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
              isRefining ? "opacity-100" : "opacity-0"
            }`}
            style={{
              WebkitMaskImage: "url(/ciirc-logo-hires.png)",
              maskImage: "url(/ciirc-logo-hires.png)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              background:
                "linear-gradient(135deg, rgba(56, 189, 248, 0.45) 0%, rgba(37, 99, 235, 0.65) 38%, rgba(30, 27, 105, 0.82) 72%, rgba(14, 165, 233, 0.55) 100%)",
              mixBlendMode: isDark ? "screen" : "color-burn",
            }}
          />

          {/* Layer 3: Secondary Internal Caustic Glow */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
              isResolved ? "opacity-80" : "opacity-0"
            }`}
            style={{
              WebkitMaskImage: "url(/ciirc-logo-hires.png)",
              maskImage: "url(/ciirc-logo-hires.png)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              background:
                "radial-gradient(circle at 45% 40%, rgba(255, 255, 255, 0.4) 0%, rgba(56, 189, 248, 0.3) 35%, transparent 70%)",
              mixBlendMode: "overlay",
            }}
          />

          {/* Layer 4: Single Restrained Traveling Specular Glint (Active at Phase 4: 2.1s - 2.8s) */}
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
              className="absolute top-[-60%] left-[-120%] w-[60%] h-[220%]"
              style={{
                background:
                  "linear-gradient(115deg, transparent 15%, rgba(255, 255, 255, 0.12) 30%, rgba(255, 255, 255, 0.95) 48%, rgba(56, 189, 248, 0.85) 54%, rgba(255, 255, 255, 0.22) 70%, transparent 85%)",
                transform: isSpecular
                  ? "translateX(880px) rotate(18deg)"
                  : "translateX(0px) rotate(18deg)",
                transition: "transform 1.35s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
        </div>

        {/* 4. The "Welcome to CIIRC" Moment */}
        <p
          className="mt-9 text-[14px] sm:text-[15.5px] font-medium tracking-[0.28em] uppercase select-none transition-all duration-650"
          style={{
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            color: isDark ? "#f1f5f9" : "#1e293b",
            opacity: isDissolving ? 0 : isWelcome ? 0.92 : 0,
            transform: isDissolving
              ? "translateY(-4px)"
              : isWelcome
              ? "translateY(0)"
              : "translateY(8px)",
            filter: isWelcome ? "blur(0px)" : "blur(5px)",
            letterSpacing: "0.28em",
          }}
        >
          Welcome to CIIRC
        </p>
      </div>
    </div>
  );
}
