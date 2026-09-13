/**
 * CIIRC First Boot Audio Engine
 * High-fidelity, real-time procedural sound synthesizer tailored specifically
 * to the CIIRC Liquid Glass 3D Wordmark animation.
 *
 * Sound Architecture:
 * 1. Deep Atmospheric Sub-Harmonic Rise (0.0s - 1.2s): Warm lowpass-filtered acoustic bed.
 * 2. Sequential Crystalline Glass Tines (0.32s - 1.04s): Delicate optical glass micro-resonances for c-i-i-r-c.
 * 3. Master Optical Glass Harmonic Chime (1.15s - 2.4s): Rich multi-node glass resonance (E maj9 crystalline chord).
 * 4. Specular Refraction Shimmer Sweep (1.35s - 2.1s): Stereo-panned resonant prismatic beam sweep.
 * 5. Smooth exponential decay fading cleanly into the dashboard workspace.
 */

class CIIRCIntroAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeNodes: (AudioNode | number)[] = [];
  private isPlaying: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ciirc_intro_sound_enabled");
        this.isMuted = saved === "false";
      } catch {}
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem("ciirc_intro_sound_enabled", muted ? "false" : "true");
    } catch {}
    if (muted) {
      this.stop();
    }
  }

  public toggleMuted(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Triggers the full cinematic intro audio score synchronized with animation phases
   */
  public play() {
    if (this.isMuted || this.isPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isPlaying = true;
    const now = ctx.currentTime;

    // Master Dynamics Compressor & Limiter for pristine acoustics
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, now);
    compressor.knee.setValueAtTime(12, now);
    compressor.ratio.setValueAtTime(4, now);
    compressor.attack.setValueAtTime(0.003, now);
    compressor.release.setValueAtTime(0.25, now);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.38, now); // Comfortable, premium listening volume

    compressor.connect(masterGain);
    masterGain.connect(ctx.destination);

    // ========================================================
    // 1. Warm Atmospheric Sub & Caustic Bloom (0.0s - 1.8s)
    // ========================================================
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    const subFilter = ctx.createBiquadFilter();

    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(65.41, now); // C2
    subOsc.frequency.exponentialRampToValueAtTime(130.81, now + 1.2); // Rises gently to C3

    subFilter.type = "lowpass";
    subFilter.frequency.setValueAtTime(160, now);
    subFilter.frequency.exponentialRampToValueAtTime(320, now + 1.2);

    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.linearRampToValueAtTime(0.18, now + 0.6);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(compressor);

    subOsc.start(now);
    subOsc.stop(now + 1.9);

    // ========================================================
    // 2. Sequential Letter Glass Chimes (c - i - i - r - c)
    // Delays: 320ms, 500ms, 680ms, 860ms, 1040ms
    // ========================================================
    const letterPitches = [
      { base: 523.25, ratio: 2.756 }, // c: C5
      { base: 659.25, ratio: 2.756 }, // i: E5
      { base: 783.99, ratio: 2.756 }, // i: G5
      { base: 987.77, ratio: 2.756 }, // r: B5
      { base: 1174.66, ratio: 2.756 }, // c: D6
    ];

    const letterDelays = [0.32, 0.5, 0.68, 0.86, 1.04];

    letterDelays.forEach((delay, idx) => {
      const hitTime = now + delay;
      const pitch = letterPitches[idx];

      // Physical glass tine: fundamental sine + crystal harmonic overtone
      const tineOsc1 = ctx.createOscillator();
      const tineOsc2 = ctx.createOscillator();
      const tineGain = ctx.createGain();

      tineOsc1.type = "sine";
      tineOsc1.frequency.setValueAtTime(pitch.base, hitTime);

      tineOsc2.type = "triangle";
      tineOsc2.frequency.setValueAtTime(pitch.base * pitch.ratio, hitTime);

      // Stereo pan slightly across the letters
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (panner) {
        const panPos = -0.5 + (idx / (letterDelays.length - 1)) * 1.0;
        panner.pan.setValueAtTime(panPos, hitTime);
      }

      tineGain.gain.setValueAtTime(0.0001, hitTime);
      tineGain.gain.linearRampToValueAtTime(0.075, hitTime + 0.015);
      tineGain.gain.exponentialRampToValueAtTime(0.0001, hitTime + 0.48);

      tineOsc1.connect(tineGain);
      tineOsc2.connect(tineGain);

      if (panner) {
        tineGain.connect(panner);
        panner.connect(compressor);
      } else {
        tineGain.connect(compressor);
      }

      tineOsc1.start(hitTime);
      tineOsc1.stop(hitTime + 0.5);
      tineOsc2.start(hitTime);
      tineOsc2.stop(hitTime + 0.5);
    });

    // ========================================================
    // 3. Coalescing Liquid Glass Harmonic Chord (1.15s)
    // E-maj9 / C# chord with physical optical bell overtones
    // ========================================================
    const settleTime = now + 1.15;
    const glassChord = [
      { freq: 261.63, amp: 0.12 }, // C4
      { freq: 392.0, amp: 0.14 },  // G4
      { freq: 493.88, amp: 0.15 }, // B4
      { freq: 659.25, amp: 0.13 }, // E5
      { freq: 783.99, amp: 0.12 }, // G5
      { freq: 987.77, amp: 0.1 },  // B5
      { freq: 1174.66, amp: 0.08 },// D6
      { freq: 2093.0, amp: 0.04 }, // C7 (High crystalline tip)
    ];

    glassChord.forEach((voice) => {
      const osc = ctx.createOscillator();
      const voiceGain = ctx.createGain();

      osc.type = "sine";
      // Slight detune for liquid organic shimmer
      const detuneCents = (Math.random() - 0.5) * 6;
      osc.frequency.setValueAtTime(voice.freq, settleTime);
      osc.detune.setValueAtTime(detuneCents, settleTime);

      voiceGain.gain.setValueAtTime(0.0001, settleTime);
      voiceGain.gain.linearRampToValueAtTime(voice.amp, settleTime + 0.045);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, settleTime + 1.45);

      osc.connect(voiceGain);
      voiceGain.connect(compressor);

      osc.start(settleTime);
      osc.stop(settleTime + 1.5);
    });

    // ========================================================
    // 4. Specular Refractive Light Shimmer Sweep (1.35s - 2.1s)
    // Diamond-cut glass prism sweep glides from left to right
    // ========================================================
    const shimmerStart = now + 1.35;
    const shimmerDuration = 0.75;

    // Filtered crystalline noise beam
    const bufferSize = ctx.sampleRate * shimmerDuration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.Q.setValueAtTime(10, shimmerStart);
    bandpass.frequency.setValueAtTime(2800, shimmerStart);
    bandpass.frequency.exponentialRampToValueAtTime(5600, shimmerStart + 0.4);
    bandpass.frequency.exponentialRampToValueAtTime(2400, shimmerStart + shimmerDuration);

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0.0001, shimmerStart);
    shimmerGain.gain.linearRampToValueAtTime(0.09, shimmerStart + 0.25);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, shimmerStart + shimmerDuration);

    const sweepPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (sweepPanner) {
      sweepPanner.pan.setValueAtTime(-0.7, shimmerStart);
      sweepPanner.pan.linearRampToValueAtTime(0.7, shimmerStart + shimmerDuration);
    }

    whiteNoise.connect(bandpass);
    bandpass.connect(shimmerGain);

    if (sweepPanner) {
      shimmerGain.connect(sweepPanner);
      sweepPanner.connect(compressor);
    } else {
      shimmerGain.connect(compressor);
    }

    whiteNoise.start(shimmerStart);
    whiteNoise.stop(shimmerStart + shimmerDuration);

    // ========================================================
    // 5. High Crystalline Sparkle Chimes in the Specular Beam
    // ========================================================
    const glintFrequencies = [2489.0, 3135.9, 3951.0, 4978.0];
    glintFrequencies.forEach((freq, idx) => {
      const glintTime = shimmerStart + 0.12 + idx * 0.11;
      const gOsc = ctx.createOscillator();
      const gGain = ctx.createGain();

      gOsc.type = "sine";
      gOsc.frequency.setValueAtTime(freq, glintTime);

      gGain.gain.setValueAtTime(0.0001, glintTime);
      gGain.gain.linearRampToValueAtTime(0.045, glintTime + 0.01);
      gGain.gain.exponentialRampToValueAtTime(0.0001, glintTime + 0.35);

      gOsc.connect(gGain);
      gGain.connect(compressor);

      gOsc.start(glintTime);
      gOsc.stop(glintTime + 0.38);
    });

    // Cleanup when done
    setTimeout(() => {
      this.isPlaying = false;
    }, 2600);
  }

  public stop() {
    this.isPlaying = false;
    if (this.ctx && this.ctx.state !== "closed") {
      try {
        // Suspend context to immediately halt all scheduled oscillators
        this.ctx.suspend().catch(() => {});
      } catch {}
    }
  }
}

// Export singleton instance
export const introAudio = new CIIRCIntroAudioEngine();
