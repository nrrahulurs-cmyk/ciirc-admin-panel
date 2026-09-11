"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";

interface CIIRCIntroProps {
  onComplete: () => void;
  isDark: boolean;
}

type IntroPhase =
  | "ambient"      // Phase 1: Pure ambient void & atmospheric breathing (0 - 1000ms)
  | "formation"    // Phase 2: Translucent glass structure emerges (1000 - 2000ms)
  | "reveal"       // Phase 3: CIIRC logo resolves from soft blur to optical clarity (2000 - 3000ms)
  | "tagline"      // Phase 4: Micro institutional descriptor appears (3000 - 3800ms)
  | "welcome"      // Phase 5: "Welcome to CIIRC" title emerges (3800 - 4600ms)
  | "ready"        // Phase 6: "Enter Workspace" system pill ready (4600ms+)
  | "transitioning"// Phase 7: Cinematic expansion into admin environment (800ms)
  | "complete";

export function CIIRCIntro({ onComplete, isDark }: CIIRCIntroProps) {
  const [phase, setPhase] = useState<IntroPhase>("ambient");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, rawX: 0, rawY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Choreographed cinematic timeline
  useEffect(() => {
    if (prefersReducedMotion) {
      // Instant graceful presentation for users preferring reduced motion
      const t = setTimeout(() => setPhase("ready"), 400);
      return () => clearTimeout(t);
    }

    const t1 = setTimeout(() => setPhase("formation"), 900);
    const t2 = setTimeout(() => setPhase("reveal"), 1900);
    const t3 = setTimeout(() => setPhase("tagline"), 2900);
    const t4 = setTimeout(() => setPhase("welcome"), 3700);
    const t5 = setTimeout(() => setPhase("ready"), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [prefersReducedMotion]);

  // Subtle interactive pointer tracking for realistic optical glass physics
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const normX = (e.clientX - w / 2) / (w / 2);
    const normY = (e.clientY - h / 2) / (h / 2);
    setMousePos({
      x: Math.max(-1, Math.min(1, normX)),
      y: Math.max(-1, Math.min(1, normY)),
      rawX: e.clientX,
      rawY: e.clientY,
    });
  }, [prefersReducedMotion]);

  // Trigger cinematic transition into existing admin dashboard
  const handleEnterWorkspace = useCallback(() => {
    if (phase === "transitioning" || phase === "complete") return;
    setPhase("transitioning");

    // Save completion state in localStorage
    try {
      localStorage.setItem("ciirc_intro_seen", "true");
    } catch (err) {
      console.warn("Could not save intro state:", err);
    }

    // After expansion animation completes, notify parent to unmount intro
    const transitionDuration = prefersReducedMotion ? 250 : 850;
    setTimeout(() => {
      setPhase("complete");
      onComplete();
    }, transitionDuration);
  }, [phase, onComplete, prefersReducedMotion]);

  // Keyboard navigation: Enter/Space to enter, Escape to skip immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleEnterWorkspace();
      } else if (e.key === "Escape") {
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
  }, [handleEnterWorkspace, onComplete]);

  // Calculate dynamic 3D glass tilt & reflection angle
  const tiltX = prefersReducedMotion ? 0 : -mousePos.y * 3.2; // degrees pitch
  const tiltY = prefersReducedMotion ? 0 : mousePos.x * 3.2;  // degrees yaw
  const sheenX = 50 + mousePos.x * 25; // percent
  const sheenY = 50 + mousePos.y * 25; // percent

  // Status flags for phase visibility
  const isFormationVisible = phase !== "ambient";
  const isLogoVisible = ["reveal", "tagline", "welcome", "ready", "transitioning", "complete"].includes(phase);
  const isTaglineVisible = ["tagline", "welcome", "ready", "transitioning", "complete"].includes(phase);
  const isWelcomeVisible = ["welcome", "ready", "transitioning", "complete"].includes(phase);
  const isReadyVisible = ["ready", "transitioning", "complete"].includes(phase);
  const isTransitioning = phase === "transitioning";

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none transition-opacity duration-700 ease-out ${
        isTransitioning ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: isDark
          ? "radial-gradient(ellipse 110% 90% at 50% 20%, #0c1220 0%, #070a12 55%, #030509 100%)"
          : "radial-gradient(ellipse 110% 90% at 50% 15%, #f9fcff 0%, #eef4fc 50%, #e5eef9 100%)",
      }}
    >
      {/* Ambient Volumetric Lighting Layers (Breathing Environment) */}
      <div
        className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(2, 132, 199, 0.04) 50%, transparent 75%)"
            : "radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, rgba(147, 197, 253, 0.08) 50%, transparent 75%)",
          filter: "blur(70px)",
          transform: `translate(-50%, ${mousePos.y * 12}px) scale(${isTransitioning ? 1.4 : 1})`,
        }}
      />
      <div
        className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[1100px] h-[600px] rounded-full pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(30, 58, 138, 0.15) 0%, rgba(14, 165, 233, 0.03) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(0, 102, 204, 0.06) 0%, rgba(186, 230, 253, 0.05) 60%, transparent 80%)",
          filter: "blur(90px)",
          transform: `translate(-50%, ${-mousePos.y * 15}px) scale(${isTransitioning ? 1.3 : 1})`,
        }}
      />

      {/* Top Controls: Subtle Institutional Identifier & Skip Action */}
      <header className="absolute top-0 inset-x-0 h-16 px-8 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 z-10">
        <div className="flex items-center gap-2 tracking-[0.15em] text-[11px] font-medium uppercase text-slate-400/80 dark:text-slate-500/80">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500/70 animate-pulse" />
          <span>CIIRC Admin OS</span>
        </div>

        <button
          onClick={() => {
            try {
              localStorage.setItem("ciirc_intro_seen", "true");
            } catch {}
            setPhase("complete");
            onComplete();
          }}
          className="group px-3 py-1.5 rounded-full text-[11.5px] font-medium tracking-tight text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-200/40 dark:hover:bg-slate-800/40 transition-all flex items-center gap-1.5"
          title="Press Esc to skip"
        >
          <span>Skip Intro</span>
          <span className="text-[10px] text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors font-mono">
            esc
          </span>
        </button>
      </header>

      {/* Main Central Cinematic Glass Monolith */}
      <div
        className="relative w-full max-w-[540px] px-6 transition-all duration-800 ease-out"
        style={{
          perspective: "1200px",
          transform: isTransitioning
            ? "scale(1.15) translateY(-8px)"
            : "scale(1) translateY(0)",
        }}
      >
        <div
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative rounded-[36px] p-10 sm:p-12 text-center transition-all duration-700 ${
            isFormationVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-[0.93] translate-y-4"
          }`}
          style={{
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition: isHovered
              ? "transform 0.15s cubic-bezier(0.2, 0.8, 0.4, 1), opacity 0.8s ease-out"
              : "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease-out",
            background: isDark
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.72) 0%, rgba(10, 16, 30, 0.62) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.84) 0%, rgba(245, 250, 255, 0.68) 100%)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.12)"
              : "1px solid rgba(255, 255, 255, 0.85)",
            boxShadow: isDark
              ? "0 30px 80px -15px rgba(0, 0, 0, 0.7), inset 0 1px 1.5px rgba(255, 255, 255, 0.18), inset 0 -1px 1px rgba(56, 189, 248, 0.25)"
              : "0 28px 70px -12px rgba(20, 50, 100, 0.08), 0 10px 24px -6px rgba(20, 50, 100, 0.03), inset 0 1px 1.5px rgba(255, 255, 255, 0.95), inset 0 -1px 1px rgba(56, 189, 248, 0.18)",
          }}
        >
          {/* Dynamic Specular Glass Sheen (Simulates Light Gliding across Optical Glass) */}
          <div
            className="absolute inset-0 rounded-[36px] pointer-events-none opacity-60 transition-opacity duration-500 overflow-hidden"
            style={{
              background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255, 255, 255, ${
                isDark ? "0.12" : "0.55"
              }) 0%, transparent 65%)`,
            }}
          />

          {/* Traveling Reflection Line across glass bevel */}
          <div
            className={`absolute -inset-[100%] rounded-full pointer-events-none opacity-40 mix-blend-overlay transition-transform duration-1000 ${
              isFormationVisible ? "translate-x-[200%] translate-y-[200%]" : "-translate-x-full -translate-y-full"
            }`}
            style={{
              background:
                "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.7) 48%, rgba(56,189,248,0.4) 52%, transparent 60%)",
            }}
          />

          {/* PHASE 3: CIIRC Hero Logo Identity */}
          <div className="relative flex flex-col items-center justify-center pt-2 pb-6">
            {/* Ambient Cyan Aura behind logo */}
            <div
              className={`absolute w-36 h-36 rounded-full bg-sky-400/20 dark:bg-sky-500/15 blur-2xl pointer-events-none transition-all duration-1000 ${
                isLogoVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            />

            {/* Authentic CIIRC Logo with optical clarity resolution */}
            <div
              className={`relative z-10 transition-all duration-900 ${
                isLogoVisible
                  ? "opacity-100 filter-none scale-100 translate-y-0"
                  : "opacity-0 blur-lg scale-95 translate-y-2"
              }`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <img
                src="/ciirc-logo-transparent.png"
                alt="CIIRC"
                className="h-[52px] sm:h-[58px] w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,102,204,0.12)]"
              />
            </div>

            {/* PHASE 4: Micro Tagline Descriptor */}
            <div
              className={`mt-6 text-[10.5px] sm:text-[11.5px] font-medium tracking-[0.24em] uppercase text-slate-500 dark:text-slate-400 transition-all duration-800 ${
                isTaglineVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              Centre for Intelligent &amp; Interactive Robotics
            </div>

            {/* PHASE 5: Welcome Message */}
            <h1
              className={`mt-4 text-[26px] sm:text-[30px] font-semibold tracking-[-0.025em] text-slate-900 dark:text-white transition-all duration-800 ${
                isWelcomeVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              Welcome to CIIRC
            </h1>
          </div>

          {/* PHASE 6: "Enter Workspace" Action Pill */}
          <div
            className={`mt-4 flex flex-col items-center justify-center transition-all duration-700 ${
              isReadyVisible
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-3 pointer-events-none"
            }`}
          >
            <button
              onClick={handleEnterWorkspace}
              autoFocus
              className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-[13px] font-medium tracking-tight text-slate-800 dark:text-slate-100 bg-white/90 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_4px_20px_rgba(0,102,204,0.08)] hover:shadow-[0_6px_24px_rgba(0,102,204,0.16)] active:scale-[0.97] transition-all duration-200 cursor-pointer overflow-hidden"
            >
              {/* Button light reflection overlay */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />

              <Sparkles className="w-3.5 h-3.5 text-sky-500 shrink-0" strokeWidth={2} />
              <span>Enter Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all shrink-0" strokeWidth={2} />

              <kbd className="hidden sm:inline-flex ml-1 items-center px-1.5 py-0.5 text-[10px] font-mono font-normal text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 rounded border border-slate-200/60 dark:border-slate-600/60">
                ↵
              </kbd>
            </button>

            {/* Ambient hint below button */}
            <p className="mt-3 text-[11px] text-slate-400/80 dark:text-slate-500/80 tracking-tight">
              Enterprise Admin Operating System v2.4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
