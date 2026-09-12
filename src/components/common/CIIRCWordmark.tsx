"use client";

import React from "react";
import { CIIRC_LETTERS } from "../intro/ciircVectors";

interface CIIRCWordmarkProps {
  className?: string;
  dotColor?: string;
  letterColor?: string;
}

export function CIIRCWordmark({
  className = "h-7 w-auto",
  dotColor,
  letterColor,
}: CIIRCWordmarkProps) {
  // Extract paths from mathematically smoothed brand vectors
  const c1Path = CIIRC_LETTERS[0].path;
  
  // i1 has stem followed by dot
  const i1Parts = CIIRC_LETTERS[1].path.split(" M 386.60 10.24");
  const i1Stem = i1Parts[0];
  const i1Dot = "M 386.60 10.24" + (i1Parts[1] || "");

  // i2 has dot followed by stem
  const i2Parts = CIIRC_LETTERS[2].path.split(" M 539.02 161.18");
  const i2Dot = i2Parts[0];
  const i2Stem = "M 539.02 161.18" + (i2Parts[1] || "");

  const rPath = CIIRC_LETTERS[3].path;
  const c2Path = CIIRC_LETTERS[4].path;

  return (
    <svg
      viewBox="-15 -10 1180 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-colors duration-200 overflow-visible`}
      aria-label="CIIRC Logo"
    >
      {/* Letter c */}
      <path
        d={c1Path}
        className={letterColor || "fill-[#0066cc] dark:fill-sky-400"}
      />

      {/* Letter i1 stem */}
      <path
        d={i1Stem}
        className={letterColor || "fill-[#0066cc] dark:fill-sky-400"}
      />

      {/* Letter i1 dot (electric cyan brand accent) */}
      <path
        d={i1Dot}
        className={dotColor || "fill-[#00d2ff] dark:fill-cyan-300"}
      />

      {/* Letter i2 stem */}
      <path
        d={i2Stem}
        className={letterColor || "fill-[#0066cc] dark:fill-sky-400"}
      />

      {/* Letter i2 dot (electric cyan brand accent) */}
      <path
        d={i2Dot}
        className={dotColor || "fill-[#00d2ff] dark:fill-cyan-300"}
      />

      {/* Letter r */}
      <path
        d={rPath}
        className={letterColor || "fill-[#0066cc] dark:fill-sky-400"}
      />

      {/* Letter c */}
      <path
        d={c2Path}
        className={letterColor || "fill-[#0066cc] dark:fill-sky-400"}
      />
    </svg>
  );
}
