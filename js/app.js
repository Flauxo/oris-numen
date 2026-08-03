/**
 * Oris Numen - Main Application Logic
 * Orchestrates screens, audio, waveform, and timer
 */
const OrisApp = {
  currentScreen: 'splash',
  currentFrequency: null,

  FREQUENCIES: {
    humilis: {
      name: 'Humilis',
      fullName: 'Frecuencia Humilis',
      hz: 88,
      color: '#7B5EA7',
      colorRgb: '123, 94, 167',
      type: 'Plegaria',
      purpose: 'Canalizar plegarias de petición, ruegos personales y necesidades urgentes del alma.',
      effect: 'Eleva la voz del suplicante desde la humildad terrenal directamente hacia lo divino.'
    },
    revelatio: {
      name: 'Revelatio',
      fullName: 'Frecuencia Revelatio',
      hz: 555,
      color: '#D4845A',
      colorRgb: '212, 132, 90',
      type: 'Confesión',
      purpose: 'Canalizar confesiones honestas, desahogos íntimos y la verdad desnuda del corazón.',
      effect: 'Rompe las barreras del ego, permitiendo mostrar las debilidades humanas sin miedo al juicio.'
    },
    absolutio: {
      name: 'Absolutio',
      fullName: 'Frecuencia Absolutio',
      hz: 777,
      color: '#5A8BB5',
      colorRgb: '90, 139, 181',
      type: 'Perdón',
      purpose: 'Canalizar pedidos de perdón, arrepentimiento y la búsqueda de paz espiritual.',
      effect: 'Libera la culpa acumulada y abre el espíritu para recibir la compasión y la gracia divina.'
    },
    gratia: {
      name: 'Gratia',
      fullName: 'Frecuencia Gratia',
      hz: 1012,
      color: '#D4B85A',
      colorRgb: '212, 184, 90',
      type: 'Agradecimiento',
      purpose: 'Canalizar oraciones de agradecimiento, bendiciones por lo recibido y alabanza pura.',
      effect: 'Eleva la vibración del alma al sintonizarla con la gratitud absoluta y la paz interior.'
    }
  },

  PROVERBS: {
    humilis: [
      "En la debilidad, encontramos nuestra mayor fortaleza ante lo divino.",
      "El que pide con un corazón sincero, ya ha sido escuchado.",
      "No hay ruego pequeño cuando la fe que lo eleva es inmensa.",
      "La plegaria es el puente invisible que une el suelo con el cielo.",
      "Habla desde el vacío de tu ser, para que la gracia pueda llenarlo."
    ],
    revelatio: [
      "La verdad te hará libre, pues no hay sombra que resista a la luz.",
      "Desnudar el alma es el primer paso hacia su verdadera sanación.",
      "Aquello que confiesas deja de ser un peso y se convierte en sabiduría.",
      "En la vulnerabilidad de la confesión reside el coraje más puro.",
      "Nombrar tus miedos ante el silencio es arrebatarles su poder."
    ],
    absolutio: [
      "Perdonar es soltar a un prisionero y descubrir que el prisionero eras tú.",
      "El agua borra la mancha, pero el perdón renueva todo el espíritu.",
      "Aquel que busca misericordia, ya ha empezado a purificar su camino.",
      "Donde abunda el error, sobreabunda la gracia que todo lo redime.",
      "Suelta la carga de la culpa; el amanecer no castiga a la noche."
    ],
    gratia: [
      "Un corazón agradecido es el altar más sublime para recibir bendiciones.",
      "Dar gracias es reconocer que la vida misma es un regalo inmerecido.",
      "En la gratitud, lo que tenemos se vuelve suficiente y se multiplica.",
      "La alegría es el eco natural de un espíritu que sabe agradecer.",
      "Alabar la luz es la mejor forma de asegurar que nunca nos falte."
    ]
  },

  init() {
    // Setup AudioContext on first user gesture
    const initAudio = () => {
      OrisAudio.init();
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
    document.addEventListener('click', initAudio);
    document.addEventListener('touchstart', initAudio);

    // Card click handlers → show info overlay
    document.querySelectorAll('.message-card').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.dataset.type;
        if (type) this.showFrequencyInfo(type);
      });
    });

    // Overlay buttons
    const btnCloseOverlay = document.getElementById('btn-close-overlay');
    if (btnCloseOverlay) btnCloseOverlay.addEventListener('click', () => this.closeOverlay());

    const btnWrite = document.getElementById('btn-write');
    if (btnWrite) btnWrite.addEventListener('click', () => this.goToWriteScreen());

    // Close overlay on backdrop click
    const backdrop = document.querySelector('.overlay-backdrop');
    if (backdrop) backdrop.addEventListener('click', () => this.closeOverlay());

    // Button handlers
    const btnBack = document.getElementById('btn-back');
    if (btnBack) btnBack.addEventListener('click', () => this.goBack());

    const btnSend = document.getElementById('btn-send');
    if (btnSend) btnSend.addEventListener('click', () => this.sendMessage());

    const btnCancel = document.getElementById('btn-cancel');
    if (btnCancel) btnCancel.addEventListener('click', () => this.cancelChanneling());

    const btnHome = document.getElementById('btn-home');
    if (btnHome) btnHome.addEventListener('click', () => this.goHome());

    // Write Card Handlers
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('click', () => this.openWriteCard());
    }

    const writeCardOverlay = document.getElementById('write-card-overlay');
    const writeCardBackdrop = writeCardOverlay ? writeCardOverlay.querySelector('.overlay-backdrop') : null;
    if (writeCardBackdrop) {
        writeCardBackdrop.addEventListener('click', () => this.closeWriteCard());
    }

    const btnConfirmText = document.getElementById('btn-confirm-text');
    if (btnConfirmText) {
        btnConfirmText.addEventListener('click', () => this.confirmWriteCard());
    }

    const writeCardInput = document.getElementById('write-card-input');
    const charCounter = document.getElementById('char-counter');
    if (writeCardInput && charCounter) {
        writeCardInput.addEventListener('input', () => {
            const length = writeCardInput.value.length;
            charCounter.textContent = `${length}/250`;
        });
    }

    // Waveform init
    WaveformRenderer.init('waveform-canvas');

    // Visibility change handler for timer persistence
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && ChannelTimer.isRunning) {
        ChannelTimer.saveState(this.currentFrequency);
      }
    });

    // Check for saved timer state (resume after minimize)
    const restored = this.checkSavedState();

    // Start splash only if no saved state was restored
    if (!restored) {
      this.startSplash();
    }
  },

  /**
   * Switch between screens
   */
  showScreen(screenId) {
    const allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(s => s.classList.remove('active'));

    const next = document.getElementById(`${screenId}-screen`);
    if (next) next.classList.add('active');

    this.currentScreen = screenId;
  },

  /**
   * Show frequency info overlay (new step: Card click → Overlay)
   */
  showFrequencyInfo(type) {
    this.currentFrequency = type;
    const freq = this.FREQUENCIES[type];
    if (!freq) return;

    OrisAudio.playFrequencyPreview(freq.hz);

    // Populate overlay
    const dot = document.getElementById('overlay-freq-dot');
    const name = document.getElementById('overlay-freq-name');
    const hz = document.getElementById('overlay-freq-hz');
    const purpose = document.getElementById('overlay-purpose');
    const effect = document.getElementById('overlay-effect');
    const btnWrite = document.getElementById('btn-write');

    if (dot) {
      dot.style.color = freq.color;
      dot.style.backgroundColor = freq.color;
    }
    if (name) name.textContent = freq.fullName;
    if (hz) hz.textContent = `${freq.hz} Hz`;
    if (purpose) purpose.textContent = freq.purpose;
    if (effect) effect.textContent = freq.effect;
    if (btnWrite) btnWrite.style.backgroundColor = freq.color;

    // Show overlay
    const overlay = document.getElementById('freq-info-overlay');
    if (overlay) overlay.classList.add('active');
  },

  /**
   * Close the frequency info overlay
   */
  closeOverlay() {
    const overlay = document.getElementById('freq-info-overlay');
    if (overlay) overlay.classList.remove('active');
  },

  /**
   * Proceed from overlay to write screen
   */
  goToWriteScreen() {
    const freq = this.FREQUENCIES[this.currentFrequency];
    if (!freq) return;

    OrisAudio.playButtonSound();

    // Close overlay
    this.closeOverlay();

    // Update write screen elements
    const freqName = document.getElementById('write-freq-name');
    const freqHz = document.getElementById('write-freq-hz');
    const freqDot = document.getElementById('write-freq-dot');
    const purpose = document.getElementById('write-purpose');
    const effect = document.getElementById('write-effect');
    const messageInput = document.getElementById('message-input');
    const btnSend = document.getElementById('btn-send');

    if (freqName) freqName.textContent = freq.fullName;
    if (freqHz) freqHz.textContent = `${freq.hz} Hz`;
    if (freqDot) freqDot.style.color = freq.color;
    if (purpose) purpose.textContent = freq.type;
    if (effect) effect.textContent = freq.effect;
    if (messageInput) {
      messageInput.value = '';
      messageInput.classList.remove('dissolve-anim'); // Ensure it's reset
      messageInput.style.borderBottomColor = freq.color;
    }
    const otherElements = document.querySelectorAll('.freq-indicator-container, .freq-info, .btn-back, .write-footer');
    otherElements.forEach(el => el.classList.remove('dissolve-anim', 'dissolve-anim-second'));
    if (btnSend) btnSend.style.backgroundColor = freq.color;

    // Setup write card line and button colors
    const writeCardLine = document.getElementById('write-card-line');
    const btnConfirmText = document.getElementById('btn-confirm-text');
    if (writeCardLine) writeCardLine.style.backgroundColor = freq.color;
    if (btnConfirmText) btnConfirmText.style.backgroundColor = freq.color;

    // Small delay so the overlay closing animation plays first
    setTimeout(() => {
      this.showScreen('write');
    }, 200);
  },

  /**
   * Write Card Overlay Methods
   */
  openWriteCard() {
    const overlay = document.getElementById('write-card-overlay');
    const writeCardInput = document.getElementById('write-card-input');
    const messageInput = document.getElementById('message-input');
    const charCounter = document.getElementById('char-counter');
    
    if (overlay && writeCardInput && messageInput) {
      writeCardInput.value = messageInput.value;
      if (charCounter) charCounter.textContent = `${writeCardInput.value.length}/250`;
      overlay.classList.add('active');
      setTimeout(() => writeCardInput.focus(), 100);
    }
  },

  closeWriteCard() {
    const overlay = document.getElementById('write-card-overlay');
    const writeCardInput = document.getElementById('write-card-input');
    if (overlay) overlay.classList.remove('active');
    if (writeCardInput) writeCardInput.blur();
  },

  confirmWriteCard() {
    const writeCardInput = document.getElementById('write-card-input');
    const messageInput = document.getElementById('message-input');
    if (writeCardInput && messageInput) {
      messageInput.value = writeCardInput.value;
    }
    this.closeWriteCard();
  },

  /**
   * Send message — start channeling process with destruction animation
   */
  sendMessage() {
    const freq = this.FREQUENCIES[this.currentFrequency];
    if (!freq) return;

    // Apply destruction animation and sound
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
      messageInput.classList.add('dissolve-anim');
    }
    const otherElements = document.querySelectorAll('.freq-indicator-container, .freq-info, .btn-back, .write-footer');
    
    // Trigger second phase after 0.5s (overlap)
    setTimeout(() => {
      otherElements.forEach(el => el.classList.add('dissolve-anim-second'));
    }, 500);
    
    if (OrisAudio.playDestructionSound) {
        OrisAudio.playDestructionSound();
    } else {
        OrisAudio.playButtonSound();
    }

    // Wait 2.0 seconds for animation to finish before proceeding
    setTimeout(() => {
        // Update channeling screen
        const label = document.getElementById('channeling-label');
        const sublabel = document.getElementById('channeling-sublabel');
        const timer = document.getElementById('timer-display');
    
        if (label) label.textContent = `Canalizando a través de la ${freq.fullName}...`;
        if (sublabel) sublabel.textContent = 'para su transformación en energía';
        if (timer) timer.textContent = ChannelTimer.formatTime(ChannelTimer.duration);
    
        this.showScreen('channeling');
    
        // Start frequency pad audio
        OrisAudio.startFrequencyPad(freq.hz);
    
        // Start waveform animation
        WaveformRenderer.setupWaves(freq.hz);
        WaveformRenderer.setColor(freq.color);
        WaveformRenderer.setProgress(0);
        WaveformRenderer.start();
    
        // Start countdown timer
        ChannelTimer.reset();
        ChannelTimer.start(
          (remaining, progress) => this.onTimerTick(remaining, progress),
          () => this.onTimerComplete()
        );
    }, 1800);
  },

  /**
   * Timer tick — update display and waveform
   */
  onTimerTick(remaining, progress) {
    const timer = document.getElementById('timer-display');
    if (timer) timer.textContent = ChannelTimer.formatTime(remaining);
    WaveformRenderer.setProgress(progress);
  },

  /**
   * Timer complete — show success
   */
  onTimerComplete() {
    ChannelTimer.clearState();
    OrisAudio.stopFrequencyPad();

    // Set waveform to full before stopping
    WaveformRenderer.setProgress(1);

      // Brief delay to show completed waveform, then success
    setTimeout(() => {
      WaveformRenderer.stop();

      // Color the success icon with the frequency color
      const freq = this.FREQUENCIES[this.currentFrequency];
      const successIcon = document.querySelector('.success-icon');
      if (freq && successIcon) {
        successIcon.style.color = freq.color;
      }
      
      // Set random proverb
      const proverbEl = document.getElementById('success-proverb');
      const proverbs = this.PROVERBS[this.currentFrequency];
      if (proverbEl && proverbs && proverbs.length > 0) {
        const randomIndex = Math.floor(Math.random() * proverbs.length);
        proverbEl.textContent = `"${proverbs[randomIndex]}"`;
        proverbEl.style.color = freq ? freq.color : 'inherit';
      }

      OrisAudio.playSuccessSound();
      this.showScreen('success');
    }, 800);
  },

  /**
   * Cancel channeling without confirmation
   */
  cancelChanneling() {
    ChannelTimer.reset();
    OrisAudio.stopFrequencyPad();
    WaveformRenderer.reset();
    this.goHome();
  },

  /**
   * Go back from write screen to home
   */
  goBack() {
    OrisAudio.playButtonSound();
    this.showScreen('home');
  },

  /**
   * Return to home screen
   */
  goHome() {
    OrisAudio.playButtonSound();
    this.currentFrequency = null;
    this.showScreen('home');
  },

  /**
   * Check for saved timer state and resume if found
   */
  checkSavedState() {
    const savedState = ChannelTimer.restoreState();
    if (savedState && savedState.frequencyType) {
      this.currentFrequency = savedState.frequencyType;
      const freq = this.FREQUENCIES[this.currentFrequency];

      if (freq) {
        const label = document.getElementById('channeling-label');
        const timer = document.getElementById('timer-display');
        if (label) label.textContent = `Canalizando a través de la ${freq.fullName}...`;
        if (timer) timer.textContent = ChannelTimer.formatTime(ChannelTimer.remaining);

        this.showScreen('channeling');

        WaveformRenderer.setColor(freq.color);
        WaveformRenderer.setProgress(ChannelTimer.getProgress());
        WaveformRenderer.start();

        ChannelTimer.start(
          (rem, prog) => this.onTimerTick(rem, prog),
          () => this.onTimerComplete()
        );

        OrisAudio.startFrequencyPad(freq.hz);
        return true;
      }
    }
    return false;
  },

  /**
   * Splash screen sequence
   */
  startSplash() {
    this.showScreen('splash');
    try { OrisAudio.playSplashSound(); } catch (e) { /* silent */ }

    setTimeout(() => {
      this.showScreen('home');
    }, 3000);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => OrisApp.init());
