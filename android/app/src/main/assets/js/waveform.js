const WaveformRenderer = {
  canvas: null,
  ctx: null,
  animationId: null,
  progress: 0,
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

  setupWaves() {
    this.waves = [
      { amplitude: 30, frequency: 0.02, speed: 0.03, phase: 0 },
      { amplitude: 20, frequency: 0.015, speed: -0.02, phase: Math.PI/3 },
      { amplitude: 15, frequency: 0.025, speed: 0.04, phase: Math.PI*2/3 }
    ];
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
    
    this.ctx.beginPath();
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 2.5;
    
    const fillBoundary = width * this.progress;

    // Create a linear gradient for smooth color transition
    const gradient = this.ctx.createLinearGradient(0, 0, width, 0);
    
    // Convert hex to rgba for the filled part
    gradient.addColorStop(0, this.targetColor);
    
    if (fillBoundary > 0 && fillBoundary < width) {
      const stop1 = Math.max(0, (fillBoundary - 20) / width);
      const stop2 = Math.min(1, (fillBoundary + 20) / width);
      gradient.addColorStop(stop1, this.targetColor);
      gradient.addColorStop(stop2, 'rgba(204, 204, 204, 0.3)');
    } else if (fillBoundary === 0) {
      gradient.addColorStop(0, 'rgba(204, 204, 204, 0.3)');
    } else {
      gradient.addColorStop(1, this.targetColor);
    }
    
    gradient.addColorStop(1, 'rgba(204, 204, 204, 0.3)');

    this.ctx.strokeStyle = gradient;

    for (let x = 0; x <= width; x += 2) {
      const y = centerY 
        + wave.amplitude * Math.sin(x * wave.frequency + this.time * wave.speed + wave.phase)
        + (wave.amplitude * 0.3) * Math.sin(x * wave.frequency * 2.7 + this.time * wave.speed * 1.3)
        + (wave.amplitude * 0.15) * Math.sin(x * wave.frequency * 4.1 + this.time * wave.speed * 0.7);
        
      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.stroke();
  },

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    // Scale all drawing operations by the dpr
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    // We don't scale context here because drawWave uses raw canvas dimensions
    // We just ensure canvas internal resolution matches display size
  },

  reset() {
    this.stop();
    this.progress = 0;
    this.time = 0;
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
};
