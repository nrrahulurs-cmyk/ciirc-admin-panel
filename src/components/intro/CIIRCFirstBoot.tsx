"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { CIIRC_VIEWBOX, CIIRC_LETTERS, CIIRC_FULL_PATH } from "./ciircVectors";
import { introAudio } from "./ciircIntroAudio";

interface CIIRCFirstBootProps {
  onComplete: () => void;
  isDark: boolean;
}

type BootPhase =
  | "empty"        // 0.0s - 0.32s: Pristine empty canvas with soft atmospheric cyan/indigo diffusion
  | "forming"      // 0.32s - 1.2s: Sequential fluid materialization of c-i-i-r-c from liquid glass
  | "settling"     // 1.15s - 1.6s: Coalescing into unified, crisp blue/cyan-tinted liquid glass typography
  | "specular"     // 1.35s - 2.1s: Restrained specular refraction sweep across the glass letters
  | "dissolving"   // 2.1s - 2.6s: Automatic continuous dissolve into the workspace environment
  | "complete";

export function CIIRCFirstBoot({ onComplete, isDark }: CIIRCFirstBootProps) {
  const [phase, setPhase] = useState<BootPhase>("empty");
  const [activeLetters, setActiveLetters] = useState<number[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check user preference for reduced motion & audio settings after mount
  useEffect(() => {
    setMounted(true);
    setIsMuted(introAudio.getMuted());

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Quick Premium Cinematic Master Timeline (~2.6s total sequence)
  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveLetters([0, 1, 2, 3, 4]);
      setPhase("settling");
      const t = setTimeout(() => {
        setPhase("dissolving");
        setTimeout(onComplete, 350);
      }, 700);
      return () => {
        clearTimeout(t);
      };
    }

    // Play synchronized acoustic glass sound score
    introAudio.play();

    // Browser autoplay unlock listener on first user interaction
    const handleFirstGesture = () => {
      introAudio.play();
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
    window.addEventListener("pointerdown", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });

    // Phase 1 -> 2: Sequential materialization of c - i - i - r - c (0.3s - 1.2s)
    const delays = [320, 500, 680, 860, 1040];
    const letterTimers = delays.map((delay, idx) =>
      setTimeout(() => {
        setPhase((prev) => (prev === "empty" ? "forming" : prev));
        setActiveLetters((prev) => [...prev, idx]);
      }, delay)
    );

    // Phase 3: Coalesce into unified crisp blue/cyan liquid glass wordmark (1.15s)
    const tSettling = setTimeout(() => setPhase("settling"), 1150);

    // Phase 4: Specular reflection sweep glides across the letters (1.35s - 2.1s)
    const tSpecular = setTimeout(() => setPhase("specular"), 1350);

    // Phase 5: Smooth dissolve into dashboard engages at 2.1s
    const tDissolve = setTimeout(() => {
      setPhase("dissolving");
      try {
        sessionStorage.setItem("ciirc_intro_seen_session", "true");
      } catch {}

      // Unmount overlay after dissolve transition completes (2.6s total)
      setTimeout(() => {
        setPhase("complete");
        introAudio.stop();
        onComplete();
      }, 500);
    }, 2100);

    return () => {
      letterTimers.forEach(clearTimeout);
      clearTimeout(tSettling);
      clearTimeout(tSpecular);
      clearTimeout(tDissolve);
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      introAudio.stop();
    };
  }, [prefersReducedMotion, onComplete]);

  // Keyboard shortcut & Click to skip for power users / testing (Space / Enter / Esc / Click)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        try {
          sessionStorage.setItem("ciirc_intro_seen_session", "true");
        } catch {}
        introAudio.stop();
        setPhase("complete");
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  const handleSkipClick = () => {
    try {
      sessionStorage.setItem("ciirc_intro_seen_session", "true");
    } catch {}
    introAudio.stop();
    setPhase("complete");
    onComplete();
  };

  // Phase status helpers
  const isForming = phase !== "empty";
  const isSettling = ["settling", "specular", "dissolving", "complete"].includes(phase);
  const isSpecular = ["specular", "dissolving", "complete"].includes(phase);
  const isDissolving = phase === "dissolving";

  return (
    <div
      ref={containerRef}
      onClick={handleSkipClick}
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none cursor-pointer transition-opacity duration-500 ease-out ${
        isDissolving ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: isDark
          ? "radial-gradient(ellipse 135% 100% at 50% 40%, #080e1a 0%, #04070e 55%, #020307 100%)"
          : "radial-gradient(ellipse 135% 100% at 50% 38%, #ffffff 0%, #f6f9fd 48%, #e7f0fa 100%)",
      }}
    >
      {/* Audio Control & Subtle Skip Indicator (Top Right) */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-2.5 pointer-events-auto">
        <button
          type="button"
          suppressHydrationWarning
          onClick={(e) => {
            e.stopPropagation();
            const muted = introAudio.toggleMuted();
            setIsMuted(muted);
            if (!muted) {
              introAudio.play();
            }
          }}
          className={`px-3 py-1.5 rounded-full text-[11.5px] font-medium backdrop-blur-md transition-all flex items-center gap-1.5 border shadow-sm ${
            isDark
              ? "bg-slate-900/60 border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800/80"
              : "bg-white/70 border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-white/90"
          }`}
          title={mounted && isMuted ? "Unmute Intro Audio" : "Mute Intro Audio"}
        >
          {mounted && isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span>Sound Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#0066cc] dark:text-sky-400 animate-pulse" />
              <span>Sound On</span>
            </>
          )}
        </button>

        <span
          className={`text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-md border ${
            isDark
              ? "bg-slate-900/40 border-slate-800/50 text-slate-400"
              : "bg-white/50 border-slate-200/60 text-slate-500"
          }`}
        >
          Click / Space to skip
        </span>
      </div>

      {/* 1. Atmospheric Volumetric Caustic Lighting (Generous Negative Space) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Soft Cyan Atmospheric Caustic Pool */}
        <div
          className={`absolute w-[860px] h-[480px] rounded-full transition-all duration-1000 ease-out ${
            isForming ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(2, 132, 199, 0.10) 50%, transparent 75%)"
              : "radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(186, 230, 253, 0.18) 50%, transparent 75%)",
            filter: "blur(90px)",
            transform: isDissolving ? "scale(1.4)" : "scale(1)",
          }}
        />

        {/* Deep Royal Indigo Aura */}
        <div
          className={`absolute w-[1100px] h-[600px] rounded-full transition-all duration-1000 ease-out ${
            isForming ? "opacity-100 scale-100" : "opacity-0 scale-85"
          }`}
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(30, 27, 105, 0.25) 0%, rgba(14, 165, 233, 0.05) 60%, transparent 80%)"
              : "radial-gradient(circle, rgba(30, 58, 138, 0.14) 0%, rgba(224, 242, 254, 0.08) 60%, transparent 80%)",
            filter: "blur(120px)",
            transform: isDissolving ? "scale(1.35)" : "scale(1)",
          }}
        />
      </div>

      {/* 2. Hero Composition (Centered Liquid Glass Wordmark) */}
      <div className="relative flex flex-col items-center justify-center z-10">
        {/* Soft Physical Tinted Caustic Floor Shadow */}
        <div
          className={`absolute -bottom-8 w-[420px] sm:w-[580px] h-[60px] rounded-full pointer-events-none transition-all duration-700 ${
            isSettling ? "opacity-100" : isForming ? "opacity-50" : "opacity-0"
          }`}
          style={{
            background: isDark
              ? "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.8) 0%, rgba(2, 132, 199, 0.22) 42%, transparent 75%)"
              : "radial-gradient(ellipse at center, rgba(14, 165, 233, 0.38) 0%, rgba(30, 58, 138, 0.20) 45%, transparent 75%)",
            filter: "blur(26px)",
          }}
        />

        {/* 3. The CIIRC Visibly Blue/Cyan-Tinted Liquid Glass Wordmark */}
        <div
          className="relative w-[340px] sm:w-[480px] md:w-[580px] lg:w-[680px] aspect-[1160/530] flex items-center justify-center select-none"
          style={{
            transitionDuration: isDissolving ? "500ms" : isSettling ? "700ms" : "900ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transform: isDissolving
              ? "scale(1.03) translateY(-4px)"
              : isSettling
              ? "scale(1) translateY(0)"
              : "scale(0.96) translateY(6px)",
          }}
        >
          {/* Backing Caustic Depth Aura: Saturates the blue/cyan glass */}
          <div
            className={`absolute -inset-10 rounded-full pointer-events-none transition-opacity duration-700 ${
              isSettling ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.45) 0%, rgba(37, 99, 235, 0.25) 48%, transparent 72%)",
              filter: "blur(36px)",
            }}
          />

          {/* Master SVG Vector Graphics for True Optical Liquid Glass */}
          <svg
            viewBox={CIIRC_VIEWBOX}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Volumetric Liquid Glass Base Body Gradient (Vivid CIIRC Royal Blue + Cyan + Deep Indigo) */}
              <linearGradient id="ciircLiquidGlassBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={isDark ? "0.85" : "0.82"} />
                <stop offset="25%" stopColor="#0284c7" stopOpacity={isDark ? "0.82" : "0.80"} />
                <stop offset="55%" stopColor="#1d4ed8" stopOpacity={isDark ? "0.88" : "0.85"} />
                <stop offset="82%" stopColor="#1e2578" stopOpacity={isDark ? "0.92" : "0.90"} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={isDark ? "0.84" : "0.80"} />
              </linearGradient>

              {/* Internal Refractive Cyan Core Gradient */}
              <radialGradient id="ciircInternalCaustic" cx="42%" cy="32%" r="68%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={isDark ? "0.45" : "0.50"} />
                <stop offset="30%" stopColor="#38bdf8" stopOpacity={isDark ? "0.35" : "0.40"} />
                <stop offset="65%" stopColor="#1e40af" stopOpacity={isDark ? "0.22" : "0.25"} />
                <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
              </radialGradient>

              {/* Pristine 3D Glass Edge Bevel Highlight */}
              <linearGradient id="ciircRimStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="30%" stopColor="#7dd3fc" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#2563eb" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.90" />
              </linearGradient>

              {/* SVG 3D Surface Normal Specular Lighting Filter (Silky Smooth Optical Glass) */}
              <filter id="ciircSpecular3D" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4.2" result="heightmap" />
                {/* 3D Specular Light Reflection */}
                <feSpecularLighting
                  in="heightmap"
                  surfaceScale="2.8"
                  specularConstant="1.4"
                  specularExponent="26"
                  lightingColor="#ffffff"
                  result="specularLight"
                >
                  <feDistantLight azimuth="225" elevation="58" />
                </feSpecularLighting>
                {/* Subtle Rim Light from opposite angle */}
                <feSpecularLighting
                  in="heightmap"
                  surfaceScale="2.0"
                  specularConstant="0.8"
                  specularExponent="16"
                  lightingColor="#38bdf8"
                  result="rimLight"
                >
                  <feDistantLight azimuth="45" elevation="45" />
                </feSpecularLighting>
                {/* Composite strictly onto letter alpha */}
                <feComposite in="specularLight" in2="SourceAlpha" operator="in" result="specularTrim" />
                <feComposite in="rimLight" in2="SourceAlpha" operator="in" result="rimTrim" />
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="rimTrim" />
                  <feMergeNode in="specularTrim" />
                </feMerge>
              </filter>

              {/* Volumetric Caustic Glow Filter */}
              <filter id="ciircVolumetricGlow" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#0284c7" floodOpacity={isDark ? "0.5" : "0.32"} />
                <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#38bdf8" floodOpacity={isDark ? "0.4" : "0.26"} />
              </filter>

              {/* Wordmark Mask for Specular Glint Sweep */}
              <mask id="ciircWordmarkMask">
                <path d={CIIRC_FULL_PATH} fill="#ffffff" />
              </mask>
            </defs>

            {/* Stage A: Sequential Letter Formation (c - i - i - r - c) */}
            {/* During initial emergence, individual letters fade/scale in sequentially */}
            {!isSettling &&
              CIIRC_LETTERS.map((letter, idx) => {
                const isActive = activeLetters.includes(idx);
                return (
                  <g
                    key={letter.id}
                    style={{
                      transition: "all 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "scale(1) translateY(0)" : "scale(0.93) translateY(8px)",
                      transformOrigin: "center center",
                      filter: isActive ? "blur(0px)" : "blur(24px)",
                    }}
                  >
                    {/* Outer Caustic Shadow */}
                    <path
                      d={letter.path}
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="6"
                      opacity={isDark ? "0.4" : "0.28"}
                      style={{ filter: "blur(10px)" }}
                    />
                    {/* Glass Body */}
                    <path
                      d={letter.path}
                      fill="url(#ciircLiquidGlassBody)"
                      stroke="url(#ciircRimStroke)"
                      strokeWidth="2.4"
                    />
                    {/* Internal Luminance */}
                    <path
                      d={letter.path}
                      fill="url(#ciircInternalCaustic)"
                      style={{ mixBlendMode: "overlay" }}
                    />
                  </g>
                );
              })}

            {/* Stage B: Unified Liquid Glass Wordmark (Active once letters settle at 1.15s) */}
            <g
              filter="url(#ciircVolumetricGlow)"
              style={{
                transition: "opacity 450ms ease-out",
                opacity: isSettling ? 1 : 0,
              }}
            >
              {/* Layer 1 & 2: Volumetric Liquid Glass Letters with 3D Specular Lighting */}
              <g filter="url(#ciircSpecular3D)">
                <path
                  d={CIIRC_FULL_PATH}
                  fill="url(#ciircLiquidGlassBody)"
                  stroke="url(#ciircRimStroke)"
                  strokeWidth="2.5"
                />
              </g>

              {/* Layer 3: Internal Luminosity / Optical Caustic */}
              <path
                d={CIIRC_FULL_PATH}
                fill="url(#ciircInternalCaustic)"
                style={{ mixBlendMode: "overlay" }}
              />

              {/* Layer 4: Single Restrained Specular Light Sweep (Phase: 1.35s - 2.1s) */}
              {/* Glides across the physical glass surface, illuminating curvature and depth */}
              <g mask="url(#ciircWordmarkMask)">
                <rect
                  x="-350"
                  y="-100"
                  width="380"
                  height="750"
                  fill="url(#ciircSpecularSweepGrad)"
                  style={{
                    transform: isSpecular
                      ? "translateX(1750px) rotate(22deg)"
                      : "translateX(0px) rotate(22deg)",
                    transformOrigin: "center center",
                    transition: "transform 750ms cubic-bezier(0.22, 1, 0.36, 1)",
                    mixBlendMode: isDark ? "screen" : "overlay",
                  }}
                />
                <defs>
                  <linearGradient id="ciircSpecularSweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                    <stop offset="25%" stopColor="#ffffff" stopOpacity="0.15" />
                    <stop offset="48%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="54%" stopColor="#38bdf8" stopOpacity="0.90" />
                    <stop offset="72%" stopColor="#ffffff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
