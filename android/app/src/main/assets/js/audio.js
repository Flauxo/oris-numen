const OrisAudio = {
  ctx: null,
  masterGain: null,
  padOscillators: [],
  isPlaying: false,

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 1.0;
    } catch (e) {
      console.warn('AudioContext not supported', e);
    }
  },

  async _ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  },

  async playButtonSound() {
    await this._ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.21);

    // subtle reverb copy
    const delay = this.ctx.createDelay();
    delay.delayTime.value = 0.05;
    const delayGain = this.ctx.createGain();
    delayGain.gain.value = 0.1;
    gain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(this.masterGain);
  },

  async playSplashSound() {
    await this._ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 1);
    gain.gain.setValueAtTime(0.4, t + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 3.1);
  },

  async startFrequencyPad(frequencyHz) {
    await this._ensureContext();
    if (!this.ctx) return;
    this.stopFrequencyPad(); // clean up previous if any

    this.isPlaying = true;
    const t = this.ctx.currentTime;

    const padGain = this.ctx.createGain();
    padGain.gain.setValueAtTime(0, t);
    padGain.gain.linearRampToValueAtTime(0.2, t + 2.5);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    padGain.connect(filter);
    filter.connect(this.masterGain);

    // 1. Main sine
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = frequencyHz;
    osc1.connect(padGain);
    osc1.start(t);

    // 2. Octave triangle
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = frequencyHz * 2;
    const gain2 = this.ctx.createGain();
    gain2.gain.value = 0.05;
    osc2.connect(gain2);
    gain2.connect(padGain);
    osc2.start(t);

    // 3. Detuned sine
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = frequencyHz + 2;
    const gain3 = this.ctx.createGain();
    gain3.gain.value = 0.5;
    osc3.connect(gain3);
    gain3.connect(padGain);
    osc3.start(t);

    this.padOscillators = [
      { osc: osc1, gain: null },
      { osc: osc2, gain: gain2 },
      { osc: osc3, gain: gain3 }
    ];
    this.padGainNode = padGain;
  },

  stopFrequencyPad() {
    if (!this.isPlaying || !this.ctx || !this.padGainNode) return;
    
    const t = this.ctx.currentTime;
    this.padGainNode.gain.cancelScheduledValues(t);
    this.padGainNode.gain.setValueAtTime(this.padGainNode.gain.value, t);
    this.padGainNode.gain.linearRampToValueAtTime(0, t + 2);

    this.padOscillators.forEach(node => {
      node.osc.stop(t + 2.1);
    });

    setTimeout(() => {
      this.padOscillators = [];
      this.padGainNode = null;
      this.isPlaying = false;
    }, 2200);
  },

  async playSuccessSound() {
    await this._ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    const playNote = (freq, startTime) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    };

    // Root, Major Third, Fifth (assuming base around 440)
    playNote(440, t);
    playNote(554.37, t + 0.2);
    playNote(659.25, t + 0.4);
  },

  dispose() {
    this.stopFrequencyPad();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
};
