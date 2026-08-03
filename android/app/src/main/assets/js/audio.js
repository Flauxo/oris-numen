const OrisAudio = {
  ctx: null,
  masterGain: null,
  padOscillators: [],
  padGainNode: null,
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

    // subtle reverb tail
    const delay = this.ctx.createDelay();
    delay.delayTime.value = 0.05;
    const delayGain = this.ctx.createGain();
    delayGain.gain.value = 0.1;
    gain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(this.masterGain);
  },

  /**
   * Play a 2-second preview of a frequency pad with fade in/out
   * Used when tapping a card on the home screen
   */
  async playFrequencyPreview(frequencyHz) {
    await this._ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const duration = 2.0;
    const fadeIn = 0.4;
    const fadeOut = 0.5;

    // Master gain for the preview with envelope
    const previewGain = this.ctx.createGain();
    const targetGain = frequencyHz < 100 ? 1.5 : 0.18; // Massive boost for low frequencies (from 0.7 to 1.5)
    previewGain.gain.setValueAtTime(0, t);
    previewGain.gain.linearRampToValueAtTime(targetGain, t + fadeIn);
    previewGain.gain.setValueAtTime(targetGain, t + duration - fadeOut);
    previewGain.gain.linearRampToValueAtTime(0, t + duration);

    // Low-pass filter for warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    previewGain.connect(filter);
    filter.connect(this.masterGain);

    // Main sine
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = frequencyHz;
    osc1.connect(previewGain);
    osc1.start(t);
    osc1.stop(t + duration + 0.1);

    // Detuned sine for chorus width
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = frequencyHz + 2;
    const g2 = this.ctx.createGain();
    g2.gain.value = 0.4;
    osc2.connect(g2);
    g2.connect(previewGain);
    osc2.start(t);
    osc2.stop(t + duration + 0.1);

    // Quiet octave triangle for harmonics
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.value = frequencyHz * 2;
    const g3 = this.ctx.createGain();
    g3.gain.value = frequencyHz < 100 ? 0.6 : 0.04; // Massive boost for low freq harmonic
    osc3.connect(g3);
    g3.connect(previewGain);
    osc3.start(t);
    osc3.stop(t + duration + 0.1);

    // Extra harmonic (fifth above octave) for very low bass translation on mobile
    if (frequencyHz < 100) {
      const osc4 = this.ctx.createOscillator();
      osc4.type = 'triangle';
      osc4.frequency.value = frequencyHz * 3;
      const g4 = this.ctx.createGain();
      g4.gain.value = 0.4; // Boost from 0.08 to 0.4
      osc4.connect(g4);
      g4.connect(previewGain);
      osc4.start(t);
      osc4.stop(t + duration + 0.1);
    }
  },

  async playSplashSound() {
    await this._ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Main sine
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, t); // Boost to 130Hz for better mobile audibility

    // Add a triangle wave for extra harmonics so it cuts through small speakers
    const oscTri = this.ctx.createOscillator();
    oscTri.type = 'triangle';
    oscTri.frequency.setValueAtTime(130, t);
    const triGain = this.ctx.createGain();

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(1.5, t + 1); // Drive it harder
    gain.gain.setValueAtTime(1.5, t + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 3);

    triGain.gain.setValueAtTime(0, t);
    triGain.gain.linearRampToValueAtTime(0.5, t + 1);
    triGain.gain.setValueAtTime(0.5, t + 1.2);
    triGain.gain.exponentialRampToValueAtTime(0.001, t + 3);

    osc.connect(gain);
    oscTri.connect(triGain);
    gain.connect(this.masterGain);
    triGain.connect(this.masterGain);

    osc.start(t);
    oscTri.start(t);
    osc.stop(t + 3.1);
    oscTri.stop(t + 3.1);
  },

  async startFrequencyPad(frequencyHz) {
    await this._ensureContext();
    if (!this.ctx) return;
    this.stopFrequencyPad();

    this.isPlaying = true;
    const t = this.ctx.currentTime;

    const padGain = this.ctx.createGain();
    const targetGain = frequencyHz < 100 ? 1.8 : 0.2; // Massive boost for low frequencies (from 0.8 to 1.8)
    padGain.gain.setValueAtTime(0, t);
    padGain.gain.linearRampToValueAtTime(targetGain, t + 2.5);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    padGain.connect(filter);
    filter.connect(this.masterGain);

    // LFO for pitch modulation (accelerate/decelerate effect)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    // Very slow modulation creates a swelling/breathing irregular effect
    lfo.frequency.value = 0.05 + (frequencyHz % 50) * 0.002;
    const lfoGain = this.ctx.createGain();
    // Modulation depth
    lfoGain.gain.value = frequencyHz < 150 ? 1.5 : 4.0;
    lfo.connect(lfoGain);
    lfo.start(t);

    // 1. Main sine
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = frequencyHz;
    lfoGain.connect(osc1.frequency);
    osc1.connect(padGain);
    osc1.start(t);

    // 2. Octave triangle (quiet)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = frequencyHz * 2;
    // Scale LFO depth for harmonic
    const lfoGain2 = this.ctx.createGain();
    lfoGain2.gain.value = 2.0;
    lfoGain.connect(lfoGain2);
    lfoGain2.connect(osc2.frequency);
    const gain2 = this.ctx.createGain();
    gain2.gain.value = frequencyHz < 100 ? 0.8 : 0.05; // Massive boost harmonic for low freq
    osc2.connect(gain2);
    gain2.connect(padGain);
    osc2.start(t);

    // 3. Detuned sine for chorus width
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = frequencyHz + 2;
    lfoGain.connect(osc3.frequency);
    const gain3 = this.ctx.createGain();
    gain3.gain.value = 0.5;
    osc3.connect(gain3);
    gain3.connect(padGain);
    osc3.start(t);

    this.padOscillators = [
      { osc: osc1 }, { osc: osc2 }, { osc: osc3 }, { osc: lfo }
    ];

    // Extra harmonic for very low bass translation on mobile speakers
    if (frequencyHz < 100) {
      const osc4 = this.ctx.createOscillator();
      osc4.type = 'triangle';
      osc4.frequency.value = frequencyHz * 3;
      const lfoGain3 = this.ctx.createGain();
      lfoGain3.gain.value = 3.0;
      lfoGain.connect(lfoGain3);
      lfoGain3.connect(osc4.frequency);
      const gain4 = this.ctx.createGain();
      gain4.gain.value = 0.5; // Boost from 0.1 to 0.5
      osc4.connect(gain4);
      gain4.connect(padGain);
      osc4.start(t);
      this.padOscillators.push({ osc: osc4 });
    }

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

  /**
   * Success sound: Short 3-voice celestial choir
   * Uses multiple oscillators with vibrato and formant filtering
   * to simulate a brief angelic choir chord (C5-E5-G5)
   */
  async playSuccessSound() {
    await this._ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 3 choir voices forming a major chord
    const voices = [
      { freq: 523.25, detune: 3 },   // C5 - soprano
      { freq: 659.25, detune: -2 },   // E5 - mezzo
      { freq: 783.99, detune: 4 },    // G5 - alto
    ];

    // Master gain envelope: gentle swell in, sustain, graceful fade
    const choirMaster = this.ctx.createGain();
    choirMaster.gain.setValueAtTime(0, t);
    choirMaster.gain.linearRampToValueAtTime(0.22, t + 0.4);
    choirMaster.gain.setValueAtTime(0.22, t + 1.0);
    choirMaster.gain.exponentialRampToValueAtTime(0.001, t + 2.8);
    choirMaster.connect(this.masterGain);

    // Reverb-like delay for spaciousness
    const reverbDelay = this.ctx.createDelay();
    reverbDelay.delayTime.value = 0.09;
    const reverbGain = this.ctx.createGain();
    reverbGain.gain.value = 0.25;
    const reverbDelay2 = this.ctx.createDelay();
    reverbDelay2.delayTime.value = 0.18;
    const reverbGain2 = this.ctx.createGain();
    reverbGain2.gain.value = 0.12;

    choirMaster.connect(reverbDelay);
    reverbDelay.connect(reverbGain);
    reverbGain.connect(this.masterGain);
    choirMaster.connect(reverbDelay2);
    reverbDelay2.connect(reverbGain2);
    reverbGain2.connect(this.masterGain);

    voices.forEach(voice => {
      // Main sine oscillator
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = voice.freq;

      // Detuned copy for width/chorus
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = voice.freq + voice.detune;

      // Sub-harmonic for warmth
      const oscSub = this.ctx.createOscillator();
      oscSub.type = 'triangle';
      oscSub.frequency.value = voice.freq * 0.5;
      const subGain = this.ctx.createGain();
      subGain.gain.value = 0.06;

      // Vibrato (natural voice wavering)
      const vibrato = this.ctx.createOscillator();
      vibrato.type = 'sine';
      vibrato.frequency.value = 4.5 + Math.random() * 2; // 4.5-6.5 Hz
      const vibratoDepth = this.ctx.createGain();
      vibratoDepth.gain.value = 3; // ±3 Hz pitch deviation
      vibrato.connect(vibratoDepth);
      vibratoDepth.connect(osc1.frequency);
      vibratoDepth.connect(osc2.frequency);

      // Per-voice gain
      const voiceGain = this.ctx.createGain();
      voiceGain.gain.value = 0.45;

      // Formant filter (bandpass to simulate vocal resonance)
      const formant = this.ctx.createBiquadFilter();
      formant.type = 'bandpass';
      formant.frequency.value = 1200 + Math.random() * 600;
      formant.Q.value = 1.2;

      // Connect voice chain
      osc1.connect(voiceGain);
      osc2.connect(voiceGain);
      oscSub.connect(subGain);
      subGain.connect(voiceGain);
      voiceGain.connect(formant);
      formant.connect(choirMaster);

      // Start and stop all oscillators
      osc1.start(t);
      osc2.start(t);
      oscSub.start(t);
      vibrato.start(t);

      osc1.stop(t + 3);
      osc2.stop(t + 3);
      oscSub.stop(t + 3);
      vibrato.stop(t + 3);
    });
  },

  async playDestructionSound() {
    await this._ensureContext();
    if (!this.ctx) return;
    
    const t = this.ctx.currentTime;
    const duration = 1.8; // 1.8 seconds wave sound
    
    // Create white noise buffer
    const bufferSize = this.ctx.sampleRate * duration; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Simple pink noise approximation for softer water sound
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Lowpass filter to simulate water movement
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 0.8;
    
    // Filter frequency envelope (wave crashing)
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(1500, t + 0.5); // Crash
    filter.frequency.exponentialRampToValueAtTime(300, t + duration); // Recede
    
    // Gain envelope (fade in, peak, fade out)
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.5); // Crash volume (lowered)
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration); // Recede
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start(t);
  },

  dispose() {
    this.stopFrequencyPad();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
};
