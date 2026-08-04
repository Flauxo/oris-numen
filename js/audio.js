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

    // Grave "tick" sound
    osc.type = 'sine';
    
    // Pitch drops very fast (percussive)
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.05);

    // Very short volume envelope
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);

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
    const targetGain = frequencyHz < 100 ? 0.9 : 0.18; // Reduced Humilis volume
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
    if (this.splashPlayed) return;
    this.splashPlayed = true;

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
    const targetGain = frequencyHz < 100 ? 1.1 : 0.2; // Reduced Humilis volume
    padGain.gain.setValueAtTime(0, t);
    padGain.gain.linearRampToValueAtTime(targetGain, t + 2.5);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    padGain.connect(filter);
    filter.connect(this.masterGain);

    // LFO for volume modulation (swelling/breathing effect)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    // Very slow modulation creates a swelling irregular effect
    lfo.frequency.value = 0.05 + (frequencyHz % 50) * 0.002;
    
    const tremoloGain = this.ctx.createGain();
    tremoloGain.gain.value = 0.7; // Base volume
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.3; // Fluctuate by +/- 0.3 (0.4 to 1.0)
    lfo.connect(lfoGain);
    lfoGain.connect(tremoloGain.gain);
    lfo.start(t);
    
    tremoloGain.connect(padGain);

    // 1. Main sine
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = frequencyHz;
    osc1.connect(tremoloGain);
    osc1.start(t);

    // 2. Octave triangle (quiet)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = frequencyHz * 2;
    const gain2 = this.ctx.createGain();
    gain2.gain.value = frequencyHz < 100 ? 0.8 : 0.05; // Massive boost harmonic for low freq
    osc2.connect(gain2);
    gain2.connect(tremoloGain);
    osc2.start(t);

    // 3. Detuned sine for chorus width
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = frequencyHz + 2;
    const gain3 = this.ctx.createGain();
    gain3.gain.value = 0.5;
    osc3.connect(gain3);
    gain3.connect(tremoloGain);
    osc3.start(t);

    this.padOscillators = [
      { osc: osc1 }, { osc: osc2 }, { osc: osc3 }, { osc: lfo }
    ];

    // Extra harmonic for very low bass translation on mobile speakers
    if (frequencyHz < 100) {
      const osc4 = this.ctx.createOscillator();
      osc4.type = 'triangle';
      osc4.frequency.value = frequencyHz * 3;
      const gain4 = this.ctx.createGain();
      gain4.gain.value = 0.5; // Boost from 0.1 to 0.5
      osc4.connect(gain4);
      gain4.connect(tremoloGain);
      osc4.start(t);
      this.padOscillators.push({ osc: osc4 });
    }
    
    // Monster voices for Pazuzu
    if (frequencyHz === 666) {
        const monsterOsc = this.ctx.createOscillator();
        monsterOsc.type = 'sawtooth';
        monsterOsc.frequency.value = 60; // Deep growl
        
        // Detune LFO for the monster (changing pitch and detuning)
        const monsterLfo = this.ctx.createOscillator();
        monsterLfo.type = 'sine';
        monsterLfo.frequency.value = 0.3; // Slow sweep
        const monsterLfoGain = this.ctx.createGain();
        monsterLfoGain.gain.value = 40; // Wide detune range
        monsterLfo.connect(monsterLfoGain);
        monsterLfoGain.connect(monsterOsc.frequency);
        monsterLfo.start(t);
        
        // Formant filter to simulate throat/voice
        const monsterFilter = this.ctx.createBiquadFilter();
        monsterFilter.type = 'bandpass';
        monsterFilter.frequency.value = 350;
        monsterFilter.Q.value = 4.0;
        
        // Second LFO to sweep the formant (changing vowels)
        const vowelLfo = this.ctx.createOscillator();
        vowelLfo.type = 'sine';
        vowelLfo.frequency.value = 0.15;
        const vowelGain = this.ctx.createGain();
        vowelGain.gain.value = 250;
        vowelLfo.connect(vowelGain);
        vowelGain.connect(monsterFilter.frequency);
        vowelLfo.start(t);
        
        const monsterVol = this.ctx.createGain();
        monsterVol.gain.value = 1.2; // Loud enough to be heard clearly
        
        monsterOsc.connect(monsterFilter);
        monsterFilter.connect(monsterVol);
        monsterVol.connect(padGain); // Routed through main pad fade in/out
        
        monsterOsc.start(t);
        
        this.padOscillators.push({ osc: monsterOsc }, { osc: monsterLfo }, { osc: vowelLfo });
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

  async playEvilAmbient() {
    await this._ensureContext();
    if (!this.ctx) return;
    this.stopEvilAmbient();

    const t = this.ctx.currentTime;
    
    this.evilNodes = [];
    
    // --- 1. Master Evil Ambient (Continuous Drones + Fire) ---
    const masterEvilGain = this.ctx.createGain();
    masterEvilGain.gain.setValueAtTime(0, t);
    masterEvilGain.gain.linearRampToValueAtTime(0.6, t + 2);
    masterEvilGain.connect(this.masterGain);
    // Put masterEvilGain at index 0 so stopEvilAmbient can fade it out
    this.evilNodes.push(masterEvilGain);

    const frequencies = [65.41, 77.78, 98.00]; // C2, Eb2, G2 (C minor chord)
    
    // Drones
    frequencies.forEach(freq => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = freq * 3;
        
        // Slow LFO for filter
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1 + Math.random() * 0.2;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = freq;
        
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        
        const gain = this.ctx.createGain();
        gain.gain.value = 0.2;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterEvilGain);
        
        osc.start(t);
        lfo.start(t);
        
        this.evilNodes.push(osc, lfo, gain, filter, lfoGain);
    });

    // Fire crackling (filtered noise)
    const bufferSizeCrack = this.ctx.sampleRate * 5; // 5 second loop
    const bufferCrack = this.ctx.createBuffer(1, bufferSizeCrack, this.ctx.sampleRate);
    const dataCrack = bufferCrack.getChannelData(0);
    for (let i = 0; i < bufferSizeCrack; i++) {
        // Sporadic spikes for crackling
        dataCrack[i] = Math.random() > 0.99 ? (Math.random() * 2 - 1) * 2 : 0;
        // Background rumble
        dataCrack[i] += (Math.random() * 2 - 1) * 0.1;
    }
    
    const fireNoise = this.ctx.createBufferSource();
    fireNoise.buffer = bufferCrack;
    fireNoise.loop = true;
    
    const fireFilter = this.ctx.createBiquadFilter();
    fireFilter.type = 'lowpass';
    fireFilter.frequency.value = 800;
    
    const fireGain = this.ctx.createGain();
    fireGain.gain.value = 0.4;
    
    fireNoise.connect(fireFilter);
    fireFilter.connect(fireGain);
    fireGain.connect(masterEvilGain);
    
    fireNoise.start(t);
    this.evilNodes.push(fireNoise, fireFilter, fireGain);


    // --- 2. Initial Chorus Effect (One-shot) ---
    const duration = 4.0;
    const masterChorusGain = this.ctx.createGain();
    // Start immediately at a higher volume
    masterChorusGain.gain.setValueAtTime(0.4, t);
    masterChorusGain.gain.linearRampToValueAtTime(0.8, t + 0.1);
    // Rise in volume (exponential)
    masterChorusGain.gain.exponentialRampToValueAtTime(1.5, t + duration - 0.1);
    // Abrupt end
    masterChorusGain.gain.setValueAtTime(1.5, t + duration - 0.05);
    masterChorusGain.gain.linearRampToValueAtTime(0.001, t + duration);
    
    masterChorusGain.connect(this.masterGain);
    this.evilNodes.push(masterChorusGain);

    // Formant frequencies for a deep, dark 'O' / 'A'
    const f1 = 450;
    const f2 = 850;

    frequencies.forEach(freq => {
        // 3 oscillators per note for chorus effect
        for (let i = 0; i < 3; i++) {
            const osc = this.ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.detune.value = (i - 1) * 15;
            osc.frequency.value = freq;
            
            const filter1 = this.ctx.createBiquadFilter();
            filter1.type = 'bandpass';
            filter1.frequency.value = f1;
            filter1.Q.value = 5;
            
            const filter2 = this.ctx.createBiquadFilter();
            filter2.type = 'bandpass';
            filter2.frequency.value = f2;
            filter2.Q.value = 5;
            
            osc.connect(filter1);
            osc.connect(filter2);
            
            const oscGain = this.ctx.createGain();
            oscGain.gain.value = 0.6;
            
            filter1.connect(oscGain);
            filter2.connect(oscGain);
            
            oscGain.connect(masterChorusGain);
            
            osc.start(t);
            osc.stop(t + duration + 0.1);
            this.evilNodes.push(osc, filter1, filter2, oscGain);
        }
    });

    // Add aspirated noise (breath)
    const bufferSizeNoise = this.ctx.sampleRate * (duration + 0.5);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSizeNoise, this.ctx.sampleRate);
    const outputNoise = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSizeNoise; i++) {
        outputNoise[i] = Math.random() * 2 - 1;
    }
    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 600; 
    noiseFilter.Q.value = 1.5;
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 1.0;
    
    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterChorusGain);
    
    noiseSrc.start(t);
    noiseSrc.stop(t + duration + 0.1);
    
    this.evilNodes.push(noiseSrc, noiseFilter, noiseGain);
  },

  stopEvilAmbient() {
      if (!this.evilNodes || !this.ctx) return;
      const t = this.ctx.currentTime;
      
      // Find the master evil gain and fade it out
      if (this.evilNodes.length > 0) {
          const master = this.evilNodes[0];
          if (master.gain) {
              master.gain.setValueAtTime(master.gain.value, t);
              master.gain.linearRampToValueAtTime(0, t + 2);
          }
          
          setTimeout(() => {
              this.evilNodes.forEach(node => {
                  try {
                      if (node.stop) node.stop();
                      if (node.disconnect) node.disconnect();
                  } catch (e) {}
              });
              this.evilNodes = [];
          }, 2100);
      }
  },

  dispose() {
    this.stopFrequencyPad();
    this.stopEvilAmbient();
    this.stopAllElements();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  },

  // ── Elemental ambient sounds ──────────────────────────────────────────

  elementNodes: {}, // { aire: [...nodes], tierra: [...nodes], agua: [...nodes], fuego: [...nodes] }
  elementGains: {},

  stopAllElements() {
    ['aire', 'tierra', 'agua', 'fuego'].forEach(el => this.stopElement(el));
  },

  stopElement(element) {
    if (!this.elementGains[element] || !this.ctx) return;
    const t = this.ctx.currentTime;
    const g = this.elementGains[element];
    if (g && g.gain) {
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0, t + 1.2);
    }
    setTimeout(() => {
      (this.elementNodes[element] || []).forEach(n => {
        try { if (n.stop) n.stop(); } catch(e) {}
        try { if (n.disconnect) n.disconnect(); } catch(e) {}
      });
      this.elementNodes[element] = [];
      this.elementGains[element] = null;
    }, 1300);
  },

  async startElement(element) {
    await this._ensureContext();
    if (!this.ctx) return;
    // Stop if already running
    this.stopElement(element);
    await new Promise(r => setTimeout(r, 50));

    const t = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0, t);
    masterGain.gain.linearRampToValueAtTime(0.28, t + 1.5);
    masterGain.connect(this.masterGain);

    this.elementGains[element] = masterGain;
    this.elementNodes[element] = [masterGain];

    if (element === 'agua') {
      // Rain: layered pink noise through bandpass filters
      const sampleRate = this.ctx.sampleRate;
      const bufLen = sampleRate * 4;
      const buf = this.ctx.createBuffer(1, bufLen, sampleRate);
      const data = buf.getChannelData(0);
      let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
      for (let i = 0; i < bufLen; i++) {
        const w = Math.random()*2-1;
        b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
        b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
        b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
        data[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11; b6=w*0.115926;
      }
      // Light rain layer
      const rain1 = this.ctx.createBufferSource();
      rain1.buffer = buf; rain1.loop = true;
      const f1 = this.ctx.createBiquadFilter();
      f1.type='bandpass'; f1.frequency.value=4000; f1.Q.value=0.4;
      const g1 = this.ctx.createGain(); g1.gain.value=1.2;
      rain1.connect(f1); f1.connect(g1); g1.connect(masterGain);
      rain1.start(t);
      // Heavier drops layer
      const rain2 = this.ctx.createBufferSource();
      rain2.buffer = buf; rain2.loop = true;
      const f2 = this.ctx.createBiquadFilter();
      f2.type='lowpass'; f2.frequency.value=800; f2.Q.value=0.5;
      const g2 = this.ctx.createGain(); g2.gain.value=0.5;
      rain2.connect(f2); f2.connect(g2); g2.connect(masterGain);
      rain2.start(t + 0.03);
      // LFO for rain intensity variation
      const lfo = this.ctx.createOscillator();
      lfo.type='sine'; lfo.frequency.value=0.15;
      const lfoG = this.ctx.createGain(); lfoG.gain.value=0.08;
      lfo.connect(lfoG); lfoG.connect(masterGain.gain);
      lfo.start(t);
      this.elementNodes[element].push(rain1, rain2, lfo, f1, f2, g1, g2, lfoG);

    } else if (element === 'aire') {
      // Wind: filtered noise with slow LFO sweep
      const sampleRate = this.ctx.sampleRate;
      const bufLen = sampleRate * 3;
      const buf = this.ctx.createBuffer(1, bufLen, sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random()*2-1;

      const wind = this.ctx.createBufferSource();
      wind.buffer = buf; wind.loop = true;
      const f1 = this.ctx.createBiquadFilter();
      f1.type='bandpass'; f1.frequency.value=600; f1.Q.value=0.5;
      const f2 = this.ctx.createBiquadFilter();
      f2.type='lowpass'; f2.frequency.value=1200;
      const gWind = this.ctx.createGain(); gWind.gain.value=0.9;
      wind.connect(f1); f1.connect(f2); f2.connect(gWind); gWind.connect(masterGain);
      wind.start(t);
      // LFO sweeps filter for gusting effect
      const lfo = this.ctx.createOscillator();
      lfo.type='sine'; lfo.frequency.value=0.08;
      const lfoG = this.ctx.createGain(); lfoG.gain.value=400;
      lfo.connect(lfoG); lfoG.connect(f1.frequency);
      lfo.start(t);
      // Second wind layer (high whistle)
      const wind2 = this.ctx.createBufferSource();
      wind2.buffer = buf; wind2.loop = true;
      const fHigh = this.ctx.createBiquadFilter();
      fHigh.type='bandpass'; fHigh.frequency.value=2200; fHigh.Q.value=2.5;
      const gHigh = this.ctx.createGain(); gHigh.gain.value=0.3;
      wind2.connect(fHigh); fHigh.connect(gHigh); gHigh.connect(masterGain);
      wind2.start(t + 0.05);
      const lfo2 = this.ctx.createOscillator();
      lfo2.type='sine'; lfo2.frequency.value=0.22;
      const lfoG2 = this.ctx.createGain(); lfoG2.gain.value=0.12;
      lfo2.connect(lfoG2); lfoG2.connect(masterGain.gain);
      lfo2.start(t);
      this.elementNodes[element].push(wind, wind2, lfo, lfo2, f1, f2, fHigh, gWind, gHigh, lfoG, lfoG2);

    } else if (element === 'fuego') {
      // Fire: crackling noise + low rumble
      const sampleRate = this.ctx.sampleRate;
      const bufLen = sampleRate * 5;
      const buf = this.ctx.createBuffer(1, bufLen, sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        // Sporadic crackle spikes
        data[i] = Math.random() > 0.992 ? (Math.random()*2-1)*1.8 : 0;
        // Low roar base
        data[i] += (Math.random()*2-1)*0.12;
      }
      const fire = this.ctx.createBufferSource();
      fire.buffer = buf; fire.loop = true;
      const fCrackle = this.ctx.createBiquadFilter();
      fCrackle.type='lowpass'; fCrackle.frequency.value=1000;
      const gFire = this.ctx.createGain(); gFire.gain.value=1.0;
      fire.connect(fCrackle); fCrackle.connect(gFire); gFire.connect(masterGain);
      fire.start(t);
      // Low rumble drone
      const osc = this.ctx.createOscillator();
      osc.type='sawtooth'; osc.frequency.value=55;
      const fRumble = this.ctx.createBiquadFilter();
      fRumble.type='lowpass'; fRumble.frequency.value=180;
      const gRumble = this.ctx.createGain(); gRumble.gain.value=0.18;
      osc.connect(fRumble); fRumble.connect(gRumble); gRumble.connect(masterGain);
      osc.start(t);
      // LFO for fire breathing motion
      const lfo = this.ctx.createOscillator();
      lfo.type='sine'; lfo.frequency.value=0.18;
      const lfoG = this.ctx.createGain(); lfoG.gain.value=0.1;
      lfo.connect(lfoG); lfoG.connect(masterGain.gain);
      lfo.start(t);
      this.elementNodes[element].push(fire, osc, lfo, fCrackle, fRumble, gFire, gRumble, lfoG);

    } else if (element === 'tierra') {
      // Earth: deep rumble + occasional stone impacts
      const sampleRate = this.ctx.sampleRate;
      const bufLen = sampleRate * 6;
      const buf = this.ctx.createBuffer(1, bufLen, sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        // Random stone impacts (less frequent than crackle)
        if (Math.random() > 0.9985) {
          // Short percussive burst
          const decayLen = Math.floor(sampleRate * 0.04);
          for (let j = 0; j < decayLen && i+j < bufLen; j++) {
            data[i+j] += (Math.random()*2-1) * Math.exp(-j/800) * 1.5;
          }
        }
        data[i] += (Math.random()*2-1)*0.06;
      }
      const earth = this.ctx.createBufferSource();
      earth.buffer = buf; earth.loop = true;
      const fEarth = this.ctx.createBiquadFilter();
      fEarth.type='lowpass'; fEarth.frequency.value=400;
      const gEarth = this.ctx.createGain(); gEarth.gain.value=1.1;
      earth.connect(fEarth); fEarth.connect(gEarth); gEarth.connect(masterGain);
      earth.start(t);
      // Sub bass rumble
      const osc = this.ctx.createOscillator();
      osc.type='sine'; osc.frequency.value=38;
      const gBass = this.ctx.createGain(); gBass.gain.value=0.22;
      osc.connect(gBass); gBass.connect(masterGain);
      osc.start(t);
      // Slow LFO
      const lfo = this.ctx.createOscillator();
      lfo.type='sine'; lfo.frequency.value=0.07;
      const lfoG = this.ctx.createGain(); lfoG.gain.value=0.07;
      lfo.connect(lfoG); lfoG.connect(masterGain.gain);
      lfo.start(t);
      this.elementNodes[element].push(earth, osc, lfo, fEarth, gEarth, gBass, lfoG);
    }
  }
};
