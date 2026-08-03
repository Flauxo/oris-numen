/**
 * Oris Numen - Main Application Logic
 * Orchestrates screens, audio, waveform, and timer
 */
const OrisApp = {
  currentScreen: 'splash',
  currentFrequency: null,
  currentLang: 'en', // Default language

  FREQUENCIES: {
    humilis: {
      name: 'Humilis',
      fullName: 'Frecuencia Humilis',
      hz: 88,
      color: '#7B5EA7',
      colorRgb: '123, 94, 167',
    },
    revelatio: {
      name: 'Revelatio',
      fullName: 'Frecuencia Revelatio',
      hz: 555,
      color: '#D4845A',
      colorRgb: '212, 132, 90',
    },
    absolutio: {
      name: 'Absolutio',
      fullName: 'Frecuencia Absolutio',
      hz: 777,
      color: '#5A8BB5',
      colorRgb: '90, 139, 181',
    },
    gratia: {
      name: 'Gratia',
      fullName: 'Frecuencia Gratia',
      hz: 1012,
      color: '#D4B85A',
      colorRgb: '212, 184, 90',
    },
    pazuzu: {
      name: 'Pazuzu',
      fullName: 'Frecuencia Pazuzu',
      hz: 666,
      color: '#ff3333',
      colorRgb: '255, 51, 51',
    }
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

    // Initialize translations
    const savedLang = localStorage.getItem('oris-lang') || 'en';
    this.setLanguage(savedLang);

    // Card click handlers → show info overlay
    document.querySelectorAll('.message-card').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.dataset.type;
        if (type) this.showFrequencyInfo(type);
      });
    });

    // Global button/link sound
    document.querySelectorAll('button, a').forEach(el => {
        el.addEventListener('click', () => {
            try { OrisAudio.playButtonSound(); } catch(e) {}
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

    // About Card Handlers
    const btnAbout = document.getElementById('menu-item-about');
    if (btnAbout) btnAbout.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAboutCard();
    });

    const aboutOverlay = document.getElementById('about-overlay');
    const aboutBackdrop = aboutOverlay ? aboutOverlay.querySelector('.overlay-backdrop') : null;
    if (aboutBackdrop) {
        aboutBackdrop.addEventListener('click', () => this.closeAboutCard());
    }

    const btnCloseAbout = document.getElementById('btn-close-about');
    if (btnCloseAbout) {
        btnCloseAbout.addEventListener('click', () => this.closeAboutCard());
    }

    // How It Works Card Handlers
    const btnHowItWorks = document.getElementById('menu-item-how-it-works');
    if (btnHowItWorks) btnHowItWorks.addEventListener('click', (e) => {
        e.preventDefault();
        this.openHowItWorksCard();
    });

    const howItWorksOverlay = document.getElementById('how-it-works-overlay');
    const howItWorksBackdrop = howItWorksOverlay ? howItWorksOverlay.querySelector('.overlay-backdrop') : null;
    if (howItWorksBackdrop) {
        howItWorksBackdrop.addEventListener('click', () => this.closeHowItWorksCard());
    }

    const btnCloseHowItWorks = document.getElementById('btn-close-how-it-works');
    if (btnCloseHowItWorks) {
        btnCloseHowItWorks.addEventListener('click', () => this.closeHowItWorksCard());
    }

    // Testimonials Card Handlers
    const btnTestimonials = document.getElementById('menu-item-testimonials');
    if (btnTestimonials) btnTestimonials.addEventListener('click', (e) => {
        e.preventDefault();
        this.openTestimonialsCard();
    });

    const testimonialsOverlay = document.getElementById('testimonials-overlay');
    const testimonialsBackdrop = testimonialsOverlay ? testimonialsOverlay.querySelector('.overlay-backdrop') : null;
    if (testimonialsBackdrop) {
        testimonialsBackdrop.addEventListener('click', () => this.closeTestimonialsCard());
    }

    const btnCloseTestimonials = document.getElementById('btn-close-testimonials');
    if (btnCloseTestimonials) {
        btnCloseTestimonials.addEventListener('click', () => this.closeTestimonialsCard());
    }

    // Upgrades Card Handlers
    const btnUpgrades = document.getElementById('menu-item-upgrades');
    if (btnUpgrades) btnUpgrades.addEventListener('click', (e) => {
        e.preventDefault();
        this.openUpgradesCard();
    });

    const upgradesOverlay = document.getElementById('upgrades-overlay');
    const upgradesBackdrop = upgradesOverlay ? upgradesOverlay.querySelector('.overlay-backdrop') : null;
    if (upgradesBackdrop) {
        upgradesBackdrop.addEventListener('click', () => this.closeUpgradesCard());
    }

    const btnCloseUpgrades = document.getElementById('btn-close-upgrades');
    if (btnCloseUpgrades) {
        btnCloseUpgrades.addEventListener('click', () => this.closeUpgradesCard());
    }

    const btnUnlockUpgrades = document.getElementById('btn-unlock-upgrades');
    if (btnUnlockUpgrades) {
        btnUnlockUpgrades.addEventListener('click', () => {
            OrisAudio.playButtonSound();
            window.location.href = "https://play.google.com/store/apps/details?id=com.orisnumen.app";
        });
    }

    // Sidebar Menu Handlers
    const btnHamburger = document.getElementById('btn-hamburger');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const btnCloseSidebar = document.getElementById('btn-close-sidebar');
    const sidebarBackdrop = sidebarOverlay ? sidebarOverlay.querySelector('.overlay-backdrop') : null;

    const sidebarTitle = document.getElementById('sidebar-title');
    const sidebarMainMenu = document.getElementById('sidebar-main-menu');
    const sidebarLangMenu = document.getElementById('sidebar-lang-menu');
    const menuItemLang = document.getElementById('menu-item-lang');

    let isSidebarLangView = false;

    const resetSidebar = () => {
        isSidebarLangView = false;
        if (sidebarMainMenu) sidebarMainMenu.classList.remove('hidden');
        if (sidebarLangMenu) sidebarLangMenu.classList.add('hidden');
        if (sidebarTitle) sidebarTitle.textContent = 'Menú';
        if (btnCloseSidebar) btnCloseSidebar.innerHTML = '&times;';
    };

    if (btnHamburger) {
        btnHamburger.addEventListener('click', () => {
            resetSidebar();
            sidebarOverlay.classList.add('active');
        });
    }

    if (btnCloseSidebar) {
        btnCloseSidebar.addEventListener('click', () => {
            if (isSidebarLangView) {
                // Go back to main menu
                resetSidebar();
            } else {
                sidebarOverlay.classList.remove('active');
            }
        });
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', () => sidebarOverlay.classList.remove('active'));
    }

    if (menuItemLang) {
        menuItemLang.addEventListener('click', (e) => {
            e.preventDefault();
            isSidebarLangView = true;
            sidebarMainMenu.classList.add('hidden');
            sidebarLangMenu.classList.remove('hidden');
            sidebarTitle.textContent = Translations[this.currentLang]['menu.language'] || 'Idioma';
            btnCloseSidebar.innerHTML = '&larr;'; // Arrow back
        });
    }

    // Language selection handlers
    document.querySelectorAll('#sidebar-lang-menu a').forEach(langItem => {
        langItem.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = langItem.getAttribute('data-lang');
            if (selectedLang) {
                this.setLanguage(selectedLang);
                // Close sidebar and return to home screen
                sidebarOverlay.classList.remove('active');
                resetSidebar();
                this.goHome();
            }
        });
    });

    // Evil mode logic
    const homeLogoCircle = document.querySelector('.home-logo-circle');
    let evilClicks = 0;
    let evilClickTimer = null;
    
    const handleEvilClick = (e) => {
        e.preventDefault(); // Prevent double-tap zoom on mobile
        evilClicks++;
        if (evilClickTimer) clearTimeout(evilClickTimer);
        
        // 2-second timeout window between clicks is more forgiving on mobile
        evilClickTimer = setTimeout(() => {
            evilClicks = 0;
        }, 2000); 
        
        if (evilClicks >= 20) {
            evilClicks = 0;
            this.activateEvilMode();
        }
    };

    if (homeLogoCircle) {
        homeLogoCircle.addEventListener('click', handleEvilClick);
        homeLogoCircle.addEventListener('touchstart', handleEvilClick, {passive: false});
    }

    // Element buttons (aire, tierra, agua, fuego)
    document.querySelectorAll('.element-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const element = btn.getAttribute('data-element');
            const color = btn.getAttribute('data-color');
            const isActive = btn.classList.contains('active');
            if (isActive) {
                btn.classList.remove('active');
                btn.style.color = '';
                btn.style.borderColor = '';
                btn.style.removeProperty('--elem-color');
                btn.style.removeProperty('--elem-color-dim');
                OrisAudio.stopElement(element);
            } else {
                btn.classList.add('active');
                btn.style.color = color;
                btn.style.borderColor = color;
                btn.style.setProperty('--elem-color', color);
                btn.style.setProperty('--elem-color-dim', `${color}33`);
                OrisAudio.startElement(element);
            }
        });
    });

    const btnEvilChannel = document.getElementById('btn-evil-channel');
    if (btnEvilChannel) {
        btnEvilChannel.addEventListener('click', () => this.channelEvilMode());
    }

    // Auto-advance to home after splash
    setTimeout(() => {
      this.showScreen('home');
      OrisAudio.playSplashSound();
    }, 2000);

    const writeCardInput = document.getElementById('write-card-input');
    const charCounter = document.getElementById('char-counter');
    if (writeCardInput && charCounter) {
        writeCardInput.addEventListener('input', () => {
            const length = writeCardInput.value.length;
            charCounter.textContent = `${length}/250`;
        });
    }

    // Timer easter egg logic
    const timerDisplay = document.getElementById('timer-display');
    let timerClicks = 0;
    let timerClickTimeout = null;
    
    if (timerDisplay) {
        timerDisplay.addEventListener('click', () => {
            timerClicks++;
            if (timerClickTimeout) clearTimeout(timerClickTimeout);
            
            timerClickTimeout = setTimeout(() => {
                timerClicks = 0;
            }, 1000);
            
            if (timerClicks >= 5) {
                timerClicks = 0;
                ChannelTimer.fastForwardTo(5);
            }
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

    this.currentFrequency = type;

    const overlay = document.getElementById('freq-info-overlay');
    const overlayDot = document.getElementById('overlay-freq-dot');
    const overlayName = document.getElementById('overlay-freq-name');
    const overlayHz = document.getElementById('overlay-freq-hz');
    const overlayPurpose = document.getElementById('overlay-purpose');
    const overlayEffect = document.getElementById('overlay-effect');

    if (overlayDot) overlayDot.style.backgroundColor = freq.color;
    if (overlayDot) overlayDot.style.boxShadow = `0 0 15px rgba(${freq.colorRgb}, 0.6)`;
    if (overlayName) {
        const formatStr = Translations[this.currentLang]['freq.format'] || '{name}';
        overlayName.textContent = formatStr.replace('{name}', freq.name);
        overlayName.style.color = freq.color;
    }
    const btnWrite = document.getElementById('btn-write');
    if (btnWrite) {
        btnWrite.style.backgroundColor = freq.color;
        btnWrite.style.boxShadow = `0 4px 15px rgba(${freq.colorRgb}, 0.4)`;
    }
    if (overlayHz) overlayHz.textContent = `${freq.hz} Hz`;
    if (overlayPurpose) overlayPurpose.textContent = Translations[this.currentLang][`freq.${type}.purpose`];
    if (overlayEffect) overlayEffect.textContent = Translations[this.currentLang][`freq.${type}.effect`];

    // Show overlay
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
    const writeDot = document.getElementById('write-freq-dot');
    const writePurpose = document.getElementById('write-purpose');
    const writeEffect = document.getElementById('write-effect');
    const messageInput = document.getElementById('message-input');
    const btnSend = document.getElementById('btn-send');
    const btnWrite = document.getElementById('btn-write');

    if (freqName) {
        const formatStr = Translations[this.currentLang]['freq.format'] || '{name}';
        freqName.textContent = formatStr.replace('{name}', freq.name);
    }
    if (freqHz) freqHz.textContent = `${freq.hz} Hz`;
    if (writeDot) writeDot.style.color = freq.color;
    if (writePurpose) writePurpose.textContent = Translations[this.currentLang][`freq.${this.currentFrequency}.type`];
    if (writeEffect) writeEffect.textContent = Translations[this.currentLang][`freq.${this.currentFrequency}.effect`];
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
   * Open the about card
   */
  openAboutCard() {
      const aboutOverlay = document.getElementById('about-overlay');
      if (aboutOverlay) {
          aboutOverlay.classList.add('active');
          this.closeSidebar(); // close sidebar if open
          OrisAudio.playButtonSound();
      }
  },

  /**
   * Close the about card
   */
  closeAboutCard() {
      const aboutOverlay = document.getElementById('about-overlay');
      if (aboutOverlay) {
          aboutOverlay.classList.remove('active');
          OrisAudio.playButtonSound();
      }
  },

  /**
   * Open the how it works card
   */
  openHowItWorksCard() {
      const overlay = document.getElementById('how-it-works-overlay');
      if (overlay) {
          overlay.classList.add('active');
          this.closeSidebar(); // close sidebar if open
          OrisAudio.playButtonSound();
      }
  },

  /**
   * Close the how it works card
   */
  closeHowItWorksCard() {
      const overlay = document.getElementById('how-it-works-overlay');
      if (overlay) {
          overlay.classList.remove('active');
          OrisAudio.playButtonSound();
      }
  },

  /**
   * Open the testimonials card
   */
  openTestimonialsCard() {
      const overlay = document.getElementById('testimonials-overlay');
      if (overlay) {
          overlay.classList.add('active');
          this.closeSidebar(); // close sidebar if open
          OrisAudio.playButtonSound();
      }
  },

  /**
   * Close the testimonials card
   */
  closeTestimonialsCard() {
      const overlay = document.getElementById('testimonials-overlay');
      if (overlay) {
          overlay.classList.remove('active');
          OrisAudio.playButtonSound();
      }
  },

  /**
   * Open the upgrades card
   */
  openUpgradesCard() {
      const overlay = document.getElementById('upgrades-overlay');
      if (overlay) {
          overlay.classList.add('active');
          this.closeSidebar(); // close sidebar if open
          OrisAudio.playButtonSound();
      }
  },

  /**
   * Close the upgrades card
   */
  closeUpgradesCard() {
      const overlay = document.getElementById('upgrades-overlay');
      if (overlay) {
          overlay.classList.remove('active');
          OrisAudio.playButtonSound();
      }
  },
  /**
   * Send message — start channeling process with destruction animation
   */
  sendMessage() {
    const freq = this.FREQUENCIES[this.currentFrequency];
    if (!freq) return;

    // Profanity / prohibited terms list (violence, explicit, profanity & variations)
    const BAD_WORDS = [
      // Español: Tacos, insultos, violencia y sexualidad
      'puta', 'puto', 'mierda', 'coño', 'joder', 'polla', 'polas', 'pola', 'pene', 'vagina', 'chulo', 'cabron', 'cabrona', 'pendejo', 'pendeja', 'maricon', 'zorra', 'zorro', 'gilipollas', 'hostia', 'hijo de puta', 'hijadeputa', 'hijodeputa',
      'matar', 'matare', 'matalo', 'matala', 'asesinar', 'asesinato', 'descuartizar', 'aniquilar', 'bomba', 'nuclear', 'felacion', 'follar', 'sexo', 'chichi', 'chocho', 'paja', 'mamada', 'orgasmo', 'violacion', 'violar',
      
      // English: Violence, sexual & profanity
      'fuck', 'fucking', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy', 'cock', 'nigger', 'faggot',
      'kill', 'killer', 'murder', 'murderer', 'dismember', 'annihilate', 'bomb', 'blow up', 'blowup', 'blowjob', 'fellatio', 'sex', 'rape',
      
      // Français
      'merde', 'putain', 'connard', 'salope', 'encule', 'tuer', 'assassiner', 'bombe', 'sexe', 'baiser', 'suce',
      
      // Italiano
      'stronzo', 'stronza', 'cazzo', 'merda', 'vaffanculo', 'puttana', 'uccidere', 'assassinare', 'bomba', 'sesso', 'fottere', 'bocchino'
    ];

    // Validate message length (< 11 characters) or profanity
    const messageInput = document.getElementById('message-input');
    const text = messageInput ? messageInput.value.trim() : '';
    const normalizedText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const containsProfanity = BAD_WORDS.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(normalizedText) || normalizedText.includes(word);
    });

    if (text.length < 11 || containsProfanity) {
        if (messageInput) messageInput.value = '';
        const warningMsg = Translations[this.currentLang] ? Translations[this.currentLang]['warning.short_message'] : 'Escribe un mensaje con más sinceridad.';
        this.showWarning(warningMsg);
        return;
    }

    // Apply destruction animation and sound
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
    
        if (label) {
            const formatStr = Translations[this.currentLang]['channeling.label'] || 'Canalizando a través de la {name}...';
            const freqFormat = Translations[this.currentLang]['freq.format'] || '{name}';
            label.textContent = formatStr.replace('{name}', freqFormat.replace('{name}', freq.name));
        }
        if (sublabel) sublabel.textContent = Translations[this.currentLang]['channeling.sublabel'];
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
    OrisAudio.stopAllElements();
    this.resetElementButtons();

    // Set waveform to full before stopping
    WaveformRenderer.setProgress(1);

      // Brief delay to show completed waveform, then success
    setTimeout(() => {
      WaveformRenderer.stop();

      // Color the success icon with the frequency color
      const freq = this.FREQUENCIES[this.currentFrequency];
      const successIcon = document.querySelector('.success-icon');
      const crossInner = document.querySelector('.cross-inner');
      if (freq && successIcon && crossInner) {
        successIcon.style.color = freq.color;
        
        // Ensure pulse-glow is active
        successIcon.classList.add('pulse-glow');
        
        // Reset rotation state immediately
        crossInner.style.transition = 'none';
        crossInner.style.transform = 'rotate(0deg)';
        void crossInner.offsetWidth; // Force reflow

        if (this.currentFrequency === 'pazuzu') {
            // Apply slow motion rotation after 1 second
            setTimeout(() => {
                crossInner.style.transition = 'transform 2s ease-in-out';
                crossInner.style.transform = 'rotate(180deg)';
            }, 1000);
        }
      }
      
      // Set random proverb
      const proverbEl = document.getElementById('success-proverb');
      const numProverbs = 5; // 5 proverbs per frequency
      if (proverbEl && this.currentFrequency) {
        const randomIndex = Math.floor(Math.random() * numProverbs);
        const translatedProverb = Translations[this.currentLang][`proverb.${this.currentFrequency}.${randomIndex}`];
        proverbEl.textContent = `"${translatedProverb}"`;
        proverbEl.style.color = freq ? freq.color : 'inherit';
      }

      // Update success subtitle based on frequency
      const successSubtitle = document.querySelector('.success-subtitle');
      if (successSubtitle) {
          if (this.currentFrequency === 'pazuzu') {
              successSubtitle.textContent = Translations[this.currentLang]['success.subtitle.evil'];
          } else {
              successSubtitle.textContent = Translations[this.currentLang]['success.subtitle.divine'];
          }
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
    OrisAudio.stopAllElements();
    this.resetElementButtons();
    WaveformRenderer.reset();
    this.goHome();
  },

  /**
   * Go back from write screen to home
   */
  goBack() {
    document.body.classList.remove('evil-mode');
    OrisAudio.playButtonSound();
    this.showScreen('home');
  },

  /**
   * Return to home screen
   */
  goHome() {
    document.body.classList.remove('evil-mode');
    const crossInner = document.querySelector('.cross-inner');
    if (crossInner) {
        crossInner.style.transition = 'none';
        crossInner.style.transform = 'rotate(0deg)';
    }
    OrisAudio.playButtonSound();
    this.currentFrequency = null;
    this.resetElementButtons();
    this.showScreen('home');
  },

  resetElementButtons() {
    document.querySelectorAll('.element-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.style.boxShadow = '';
    });
  },

  /**
   * Show a solemn warning popup, auto-dismiss after 3.5s
   */
  showWarning(message) {
    const popup = document.getElementById('warning-popup');
    const text  = document.getElementById('warning-popup-text');
    if (!popup || !text) return;

    text.textContent = message;
    popup.classList.add('show');

    if (this._warningTimer) clearTimeout(this._warningTimer);
    this._warningTimer = setTimeout(() => {
        popup.classList.remove('show');
    }, 3500);
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
        if (label) {
            const formatStr = Translations[this.currentLang]['channeling.label'] || 'Canalizando a través de la {name}...';
            const freqFormat = Translations[this.currentLang]['freq.format'] || '{name}';
            label.textContent = formatStr.replace('{name}', freqFormat.replace('{name}', freq.name));
        }
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
  },
  
  /**
   * Activate evil mode
   */
  activateEvilMode() {
      const evilOverlay = document.getElementById('evil-overlay');
      if (evilOverlay) {
          evilOverlay.classList.add('active');
      }
      document.body.classList.add('evil-mode');
      
      try {
          OrisAudio.playEvilAmbient();
      } catch (e) {
          console.error("Audio error", e);
      }
  },

  /**
   * Channel evil mode
   */
  channelEvilMode() {
      const evilOverlay = document.getElementById('evil-overlay');
      if (evilOverlay) {
          evilOverlay.classList.remove('active');
      }
      
      const evilInput = document.getElementById('evil-input');
      if (evilInput) {
          evilInput.value = '';
      }
      
      try {
          OrisAudio.stopEvilAmbient();
      } catch (e) {
          console.error("Audio error", e);
      }
      
      this.currentFrequency = 'pazuzu';
      const freq = this.FREQUENCIES[this.currentFrequency];
      
      const label = document.getElementById('channeling-label');
      const sublabel = document.getElementById('channeling-sublabel');
      const timer = document.getElementById('timer-display');
  
      if (label) {
          const formatStr = Translations[this.currentLang]['channeling.label'] || 'Canalizando a través de la {name}...';
          const freqFormat = Translations[this.currentLang]['freq.format'] || '{name}';
          label.textContent = formatStr.replace('{name}', freqFormat.replace('{name}', freq.name));
      }
      if (sublabel) sublabel.textContent = Translations[this.currentLang]['channeling.sublabel.evil'] || 'para su transformación en energía maligna';
      if (timer) timer.textContent = ChannelTimer.formatTime(ChannelTimer.duration);
  
      this.showScreen('channeling');
  
      try {
          OrisAudio.startFrequencyPad(freq.hz);
      } catch (e) {}
  
      WaveformRenderer.setupWaves(freq.hz);
      WaveformRenderer.setColor(freq.color);
      WaveformRenderer.setProgress(0);
      WaveformRenderer.start();
  
      ChannelTimer.reset();
      ChannelTimer.start(
        (remaining, progress) => this.onTimerTick(remaining, progress),
        () => this.onTimerComplete()
      );
  },

  /**
   * Set Language and update DOM
   */
  setLanguage(lang) {
    if (!Translations || !Translations[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('oris-lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (Translations[lang][key]) {
        if (el.hasAttribute('data-i18n-html')) {
            el.innerHTML = Translations[lang][key];
        } else {
            el.textContent = Translations[lang][key];
        }
      }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const attrStr = el.getAttribute('data-i18n-attr');
      const parts = attrStr.split(':');
      
      let attrName, key;
      if (parts.length === 2) {
        attrName = parts[0];
        key = parts[1];
      } else if (parts.length === 1) {
        attrName = parts[0];
        key = el.getAttribute('data-i18n');
      }
      
      if (attrName && key && Translations[lang][key]) {
        el.setAttribute(attrName, Translations[lang][key]);
      }
    });

    document.querySelectorAll('[data-freq-card]').forEach(el => {
        const type = el.getAttribute('data-freq-card');
        const freq = this.FREQUENCIES[type];
        if (freq) {
            const formatStr = Translations[lang]['freq.format'] || '{name}';
            el.textContent = `${formatStr.replace('{name}', freq.name)} · ${freq.hz} Hz`;
        }
    });
    
    if (this.currentFrequency) {
      const freq = this.FREQUENCIES[this.currentFrequency];
      const writePurpose = document.getElementById('write-purpose');
      const writeEffect = document.getElementById('write-effect');
      const writeFreqName = document.getElementById('write-freq-name');
      const overlayFreqName = document.getElementById('overlay-freq-name');
      
      const formatStr = Translations[lang]['freq.format'] || '{name}';
      
      if (writePurpose) writePurpose.textContent = Translations[this.currentLang][`freq.${this.currentFrequency}.type`] || '';
      if (writeEffect) writeEffect.textContent = Translations[this.currentLang][`freq.${this.currentFrequency}.effect`] || '';
      if (writeFreqName && freq) writeFreqName.textContent = formatStr.replace('{name}', freq.name);
      if (overlayFreqName && freq) overlayFreqName.textContent = formatStr.replace('{name}', freq.name);
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => OrisApp.init());
