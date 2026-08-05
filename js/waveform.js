const WaveformRenderer = {
  canvas: null,
  ctx: null,
  animationId: null,
  progress: 0,          // Target progress (set by timer, 0-1)
  displayProgress: 0,   // Smoothly interpolated progress for rendering
  targetColor: '#7B5EA7',
  isAnimating: false,
  time: 0,
  waves: [],

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.setupWaves();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },

  setupWaves(frequencyHz = 100) {
    this.currentFreqHz = frequencyHz;
    // Generate deterministic pseudo-random values based on frequencyHz
    // so the same frequency always produces the same waveform pattern
    let seed = frequencyHz;
    const rand = () => {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    // Determine number of waves (3 to 5)
    let numWaves = 3 + Math.floor(rand() * 3);
    if (frequencyHz === 88) numWaves = 5; // humilis
    if (frequencyHz === 777) numWaves = 2; // absolutio

    this.waves = [];
    
    // Create base speed and amplitude variations based on frequency
    const baseSpeed = 0.01 + rand() * 0.03;
    const baseAmp = 80 + rand() * 90;

    for (let i = 0; i < numWaves; i++) {
        // Vary frequency slightly per wave
        const freq = 0.005 + rand() * 0.015;
        // Direction and speed
        let speed = baseSpeed * (rand() > 0.5 ? 1 : -1) * (0.8 + rand() * 0.6);
        if (frequencyHz === 1418) speed *= 4.5; // gratia moves very fast

        // Amplitude falls off for higher indices
        const amp = baseAmp * (1.0 - (i * 0.15)) * (0.7 + rand() * 0.6);
        
        this.waves.push({
            amplitude: amp,
            frequency: freq,
            speed: speed,
            phase: rand() * Math.PI * 2,
            irregularity: 1.0 + rand() * 2.0 // Used in drawWave for complex harmonics
        });
    }
  },

  setColor(hexColor) {
    this.targetColor = hexColor;
  },

  setProgress(progress) {
    this.progress = Math.max(0, Math.min(1, progress));
  },

  start() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.time = 0;
    this.displayProgress = this.progress;
    this.render();
  },

  stop() {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  render() {
    if (!this.isAnimating) return;

    const width = this.canvas.width;
    const height = this.canvas.height;

    // Smooth interpolation: displayProgress gradually catches up to progress
    // Using a lerp factor that creates ultra-smooth, continuous movement
    const lerpFactor = 0.03;
    this.displayProgress += (this.progress - this.displayProgress) * lerpFactor;

    // Clamp to avoid tiny floating-point jitter at boundaries
    if (Math.abs(this.displayProgress - this.progress) < 0.0001) {
      this.displayProgress = this.progress;
    }

    this.ctx.clearRect(0, 0, width, height);

    this.waves.forEach((wave, i) => {
      this.drawWave(wave, i);
    });

    this.time += 1;
    this.animationId = requestAnimationFrame(() => this.render());
  },

  drawWave(wave, index) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerY = height / 2;

    const fillBoundary = width * this.displayProgress;
    const transitionWidth = 80; 

    const isEvil = (this.currentFreqHz === 666);

    this.ctx.beginPath();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    const points = [];
    // Extend x beyond the canvas to hide thick rounded end caps
    for (let x = -200; x <= width + 200; x += 4) {
      const irreg = wave.irregularity || 1.0;
      let y = centerY
        + wave.amplitude * Math.sin(x * wave.frequency + this.time * wave.speed + wave.phase)
        + (wave.amplitude * 0.3 * irreg) * Math.sin(x * wave.frequency * 2.7 + this.time * wave.speed * 1.3)
        + (wave.amplitude * 0.15 * irreg) * Math.sin(x * wave.frequency * 4.1 + this.time * wave.speed * 0.7);
        
      if (!isEvil) {
          y += height * 0.05; // Slightly lower center
      }
      points.push({ x, y });
    }

    if (isEvil) {
        // EVIL MODE: Use original thin stroked lines
        this.ctx.lineWidth = (this.currentFreqHz === 777) ? 8.0 : 3.5;
        
        if (this.displayProgress <= 0.001) {
            this.ctx.strokeStyle = 'rgba(200, 200, 195, 0.35)';
            this._tracePath(points);
            this.ctx.stroke();
        } else if (this.displayProgress >= 0.999) {
            this.ctx.strokeStyle = this.targetColor;
            this._tracePath(points);
            this.ctx.stroke();
        } else {
            const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
            const solidEnd = Math.max(0, (fillBoundary - transitionWidth) / width);
            const transEnd = Math.min(1, (fillBoundary + transitionWidth * 0.3) / width);

            gradient.addColorStop(0, this.targetColor);
            if (solidEnd > 0.01) gradient.addColorStop(solidEnd, this.targetColor);
            const midPoint = Math.min(1, (solidEnd + transEnd) / 2);
            gradient.addColorStop(midPoint, this._hexToRgba(this.targetColor, 0.5));
            gradient.addColorStop(transEnd, 'rgba(200, 200, 195, 0.35)');
            gradient.addColorStop(1, 'rgba(200, 200, 195, 0.35)');

            this.ctx.strokeStyle = gradient;
            this._tracePath(points);
            this.ctx.stroke();
        }
    } else {
        // NON-EVIL MODE: Thick translucent overlapping ribbons
        this.ctx.globalCompositeOperation = 'multiply';
        // Base thickness on canvas height (e.g. 25% of height) to make it a thick band
        this.ctx.lineWidth = height * 0.25; 
        
        this._tracePath(points);

        if (this.displayProgress <= 0.001) {
            this.ctx.strokeStyle = 'rgba(200, 200, 195, 0.17)';
            this.ctx.stroke();
        } else if (this.displayProgress >= 0.999) {
            this.ctx.strokeStyle = this._hexToRgba(this.targetColor, 0.17);
            this.ctx.stroke();
        } else {
            const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
            const solidEnd = Math.max(0, (fillBoundary - transitionWidth) / width);
            const transEnd = Math.min(1, (fillBoundary + transitionWidth * 0.3) / width);

            const targetColorRgba = this._hexToRgba(this.targetColor, 0.17);
            
            gradient.addColorStop(0, targetColorRgba);
            if (solidEnd > 0.01) gradient.addColorStop(solidEnd, targetColorRgba);
            const midPoint = Math.min(1, (solidEnd + transEnd) / 2);
            gradient.addColorStop(midPoint, this._hexToRgba(this.targetColor, 0.08));
            gradient.addColorStop(transEnd, 'rgba(200, 200, 195, 0.17)');
            gradient.addColorStop(1, 'rgba(200, 200, 195, 0.17)');

            this.ctx.strokeStyle = gradient;
            this.ctx.stroke();
        }
        this.ctx.globalCompositeOperation = 'source-over';
    }
  },

  /**
   * Trace a path through an array of {x, y} points
   */
  _tracePath(points) {
    if (points.length === 0) return;
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
  },

  /**
   * Convert hex color to rgba string
   */
  _hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  },

  reset() {
    this.stop();
    this.progress = 0;
    this.displayProgress = 0;
    this.time = 0;
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
};
