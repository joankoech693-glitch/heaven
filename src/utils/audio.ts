/**
 * Atmospheric Audio Engine using Web Audio API
 * Provides self-contained, offline-first ambient audio tracks:
 * 1. "Mechanical Typewriter Clacks"
 * 2. "Rain on a Windowpane"
 * 3. "Scratchy Quill Pen"
 */

class AudioAtmosphere {
  private ctx: AudioContext | null = null;
  private currentTrack: 'typewriter' | 'rain' | 'quill' | 'none' = 'none';
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private isMuted: boolean = false;
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public stopCurrent() {
    this.activeNodes.forEach(node => {
      if (typeof node === 'number') {
        window.clearInterval(node);
      } else {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // ignore cleanup errors
        }
      }
    });
    this.activeNodes = [];
    this.currentTrack = 'none';
  }

  // Play a single mechanical typewriter key clack (used when typing)
  public playTypewriterClack() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isMuted) return;

      const now = this.ctx.currentTime;

      // Noise burst for mechanical clack
      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 + (Math.random() * 600 - 300), now);
      filter.Q.setValueAtTime(3.5, now);

      // Low mechanical thud
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120 + Math.random() * 40, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.04);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.45, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      noise.start(now);
      osc.start(now);
      noise.stop(now + 0.05);
      osc.stop(now + 0.05);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Play single scratchy quill sound
  public playQuillScratch() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const duration = 0.06 + Math.random() * 0.06;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2600 + Math.random() * 800, now);
      filter.Q.setValueAtTime(4.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + duration);
    } catch {
      // ignore
    }
  }

  // Ambient track 1: Continuous Mechanical Typewriter clacking in background
  public playAmbientTypewriter() {
    this.stopCurrent();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.currentTrack = 'typewriter';

    // Rhythmically trigger typewriter taps with natural human variance
    const interval = window.setInterval(() => {
      if (this.currentTrack === 'typewriter' && !this.isMuted) {
        this.playTypewriterClack();
      }
    }, 280 + Math.random() * 120);

    this.activeNodes.push(interval);
  }

  // Ambient track 2: Rain on a Windowpane
  public playAmbientRain() {
    this.stopCurrent();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.currentTrack = 'rain';

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    // Pink noise generation for authentic rainfall
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start(0);
    this.activeNodes.push(whiteNoise);
    this.activeNodes.push(filter);
    this.activeNodes.push(rainGain);

    // Random gentle droplets on window pane
    const dropInterval = window.setInterval(() => {
      if (this.currentTrack !== 'rain' || this.isMuted || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const dropOsc = this.ctx.createOscillator();
      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(800 + Math.random() * 500, now);
      dropOsc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      const dropGain = this.ctx.createGain();
      dropGain.gain.setValueAtTime(0.08 + Math.random() * 0.05, now);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      dropOsc.connect(dropGain);
      dropGain.connect(this.masterGain);
      dropOsc.start(now);
      dropOsc.stop(now + 0.06);
    }, 450);

    this.activeNodes.push(dropInterval);
  }

  // Ambient track 3: Scratchy Quill Pen
  public playAmbientQuill() {
    this.stopCurrent();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.currentTrack = 'quill';

    const scratchInterval = window.setInterval(() => {
      if (this.currentTrack === 'quill' && !this.isMuted) {
        this.playQuillScratch();
      }
    }, 320 + Math.random() * 200);

    this.activeNodes.push(scratchInterval);
  }

  public setTrack(track: 'typewriter' | 'rain' | 'quill' | 'none') {
    if (this.currentTrack === track && track !== 'none') {
      this.stopCurrent();
      return;
    }

    if (track === 'typewriter') {
      this.playAmbientTypewriter();
    } else if (track === 'rain') {
      this.playAmbientRain();
    } else if (track === 'quill') {
      this.playAmbientQuill();
    } else {
      this.stopCurrent();
    }
  }

  public getTrack() {
    return this.currentTrack;
  }
}

export const audioAtmosphere = new AudioAtmosphere();
