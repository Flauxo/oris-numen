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
      hz: 1418,
      audioHz: 1012,
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

    // Evolution Card Handlers
    const btnEvolution = document.getElementById('menu-item-evolution');
    if (btnEvolution) {
        btnEvolution.addEventListener('click', (e) => {
            e.preventDefault();
            this.openEvolutionCard();
        });
    }

    const btnCloseEvolution = document.getElementById('btn-close-evolution');
    if (btnCloseEvolution) {
        btnCloseEvolution.addEventListener('click', () => this.closeEvolutionCard());
    }

    const evolutionOverlay = document.getElementById('evolution-overlay');
    const evolutionBackdrop = evolutionOverlay ? evolutionOverlay.querySelector('.overlay-backdrop') : null;
    if (evolutionBackdrop) {
        evolutionBackdrop.addEventListener('click', () => this.closeEvolutionCard());
    }

    const testimonialsOverlay = document.getElementById('testimonials-overlay');
    const testimonialsBackdrop = testimonialsOverlay ? testimonialsOverlay.querySelector('.overlay-backdrop') : null;
    if (testimonialsBackdrop) {
        testimonialsBackdrop.addEventListener('click', () => this.closeTestimonialsCard());
    }

    const btnCloseTestimonials = document.getElementById('btn-close-testimonials');
    if (btnCloseTestimonials) {
        btnCloseTestimonials.addEventListener('click', () => this.closeTestimonialsCard());
    }

    // History Card Handlers
    const btnHistory = document.getElementById('menu-item-history');
    if (btnHistory) btnHistory.addEventListener('click', (e) => {
        e.preventDefault();
        this.openHistoryCard();
    });

    const historyOverlay = document.getElementById('history-overlay');
    const historyBackdrop = historyOverlay ? historyOverlay.querySelector('.overlay-backdrop') : null;
    if (historyBackdrop) {
        historyBackdrop.addEventListener('click', () => this.closeHistoryCard());
    }

    const btnCloseHistory = document.getElementById('btn-close-history');
    if (btnCloseHistory) {
        btnCloseHistory.addEventListener('click', () => this.closeHistoryCard());
    }

    // Share Overlay Handlers
    const shareOverlay = document.getElementById('share-overlay');
    const shareBackdrop = shareOverlay ? shareOverlay.querySelector('.overlay-backdrop') : null;
    if (shareBackdrop) {
        shareBackdrop.addEventListener('click', () => this.closeShareOverlay());
    }

    const btnCloseShare = document.getElementById('btn-close-share');
    if (btnCloseShare) {
        btnCloseShare.addEventListener('click', () => this.closeShareOverlay());
    }

    const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');
    if (btnShareWhatsapp) {
        btnShareWhatsapp.addEventListener('click', () => {
            if (this.currentShareText) {
                window.open(`https://wa.me/?text=${encodeURIComponent(this.currentShareText)}`, '_blank');
                this.closeShareOverlay();
            }
        });
    }

    const btnShareX = document.getElementById('btn-share-x');
    if (btnShareX) {
        btnShareX.addEventListener('click', () => {
            if (this.currentShareText) {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(this.currentShareText)}`, '_blank');
                this.closeShareOverlay();
            }
        });
    }

    const btnShareFacebook = document.getElementById('btn-share-facebook');
    if (btnShareFacebook) {
        btnShareFacebook.addEventListener('click', () => {
            if (this.currentShareText) {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.orisnumen.app')}&quote=${encodeURIComponent(this.currentShareText)}`, '_blank');
                this.closeShareOverlay();
            }
        });
    }

    const btnShareEmail = document.getElementById('btn-share-email');
    if (btnShareEmail) {
        btnShareEmail.addEventListener('click', () => {
            if (this.currentShareText) {
                const subject = (Translations[this.currentLang] && Translations[this.currentLang]['history.title']) || 'Oris Numen';
                window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(this.currentShareText)}`;
                this.closeShareOverlay();
            }
        });
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
        if (sidebarTitle) sidebarTitle.textContent = (Translations[this.currentLang] && Translations[this.currentLang]['menu.title']) ? Translations[this.currentLang]['menu.title'] : 'Menú';
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
    const homeLogo = document.querySelector('.home-logo');
    let evilClicks = 0;
    let evilClickTimer = null;
    
    const handleEvilClick = (e) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        // Only respond while in normal mode (not evil mode already)
        if (document.body.classList.contains('evil-mode')) return;

        evilClicks++;
        if (evilClickTimer) clearTimeout(evilClickTimer);
        
        evilClickTimer = setTimeout(() => {
            evilClicks = 0;
        }, 4000); 

        if (evilClicks >= 6 && evilClicks < 20) {
            const warningMsg = (Translations[this.currentLang] && Translations[this.currentLang]['warning.too_many_clicks']) 
                || 'Por favor, no pulses más veces en el símbolo.';
            this.showWarning(warningMsg, 'normal', 1300);
        }
        
        if (evilClicks >= 20) {
            evilClicks = 0;
            this.activateEvilMode();
        }
    };

    if (homeLogoCircle) {
        homeLogoCircle.addEventListener('click', handleEvilClick);
    }
    if (homeLogo) {
        homeLogo.addEventListener('click', handleEvilClick);
    }

    // Element buttons (aire, tierra, agua, fuego)
    document.querySelectorAll('.element-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const element = btn.getAttribute('data-element');
            
            // Check evil mode condition
            const isEvil = this.currentFrequency === 'pazuzu' || document.body.classList.contains('evil-mode');
            if (isEvil && element !== 'fuego') {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                const warningMsg = (Translations[this.currentLang] && Translations[this.currentLang]['warning.incompatible_element']) 
                    || 'Elemento incompatible en modo maligno';
                this.showWarning(warningMsg, 'evil', 1300);
                return false;
            }

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

    const btnEvilReturn = document.getElementById('btn-evil-return');
    if (btnEvilReturn) {
        btnEvilReturn.addEventListener('click', () => {
            const evilOverlay = document.getElementById('evil-overlay');
            if (evilOverlay) {
                evilOverlay.classList.remove('active');
            }
            document.body.classList.remove('evil-mode');
            const evilInput = document.getElementById('evil-input');
            if (evilInput) {
                evilInput.value = '';
            }
            if (typeof OrisAudio !== 'undefined') {
                OrisAudio.stopEvilAmbient();
            }
        });
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

    OrisAudio.playFrequencyPreview(freq.audioHz || freq.hz);

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
          const content = overlay.querySelector('.modal-content');
          if (content) content.scrollTop = 0;
          const card = overlay.querySelector('.modal-card');
          if (card) card.scrollTop = 0;
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
        OrisAudio.startFrequencyPad(freq.audioHz || freq.hz);
    
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
    this.saveToHistory();
    const activeElementsArray = Array.from(document.querySelectorAll('.element-btn.active')).map(btn => btn.getAttribute('data-element'));
    const activeElementsCopy = new Set(activeElementsArray);

    ChannelTimer.clearState();
    OrisAudio.stopFrequencyPad();
    OrisAudio.stopEvilAmbient();
    OrisAudio.stopAllElements();
    this.resetElementButtons();
    this.stopEvilVibration();

    // Set waveform to full before stopping
    WaveformRenderer.setProgress(1);

      // Brief delay to show completed waveform, then success
    setTimeout(() => {
      WaveformRenderer.stop();

      const freqId = this.currentFrequency;
      const freq = this.FREQUENCIES[freqId];
      const isEvil = freqId === 'pazuzu';

      // Color the success icon with the frequency color
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

        if (isEvil) {
            // Apply slow motion rotation after 1 second
            setTimeout(() => {
                crossInner.style.transition = 'transform 2s ease-in-out';
                crossInner.style.transform = 'rotate(180deg)';
            }, 1000);
        }
      }

      // Sigil Download Link
      let text = '';
      if (isEvil) {
          const evilInput = document.getElementById('evil-input');
          text = evilInput ? evilInput.value : '';
      } else {
          const msgInput = document.getElementById('message-input');
          text = msgInput ? msgInput.value : '';
      }

      const linkDownload = document.getElementById('link-download-sigil');

      // Do not show Sigil link in Evil Mode
      if (!isEvil && text && text.trim().length > 0 && typeof SigilGenerator !== 'undefined') {
          if (linkDownload) {
              // Instantly reset state without transition
              linkDownload.style.transition = 'none';
              linkDownload.classList.remove('show');
              void linkDownload.offsetWidth; // Force reflow
              linkDownload.style.transition = ''; // Restore CSS transition
              
              linkDownload.style.display = 'block';              
              setTimeout(() => {
                  linkDownload.classList.add('show');
              }, 1000); // Wait 1 second, then trigger CSS transition
              
              const optionsContainer = document.getElementById('download-options-container');
              const loadingContainer = document.getElementById('inline-loading-container');
              
              if (optionsContainer) optionsContainer.style.display = 'none';
              if (loadingContainer) loadingContainer.style.display = 'none';
              
              linkDownload.onclick = (e) => {
                  e.preventDefault();
                  if (OrisAudio.playButtonSound) OrisAudio.playButtonSound();
                  linkDownload.style.display = 'none';
                  if (optionsContainer) optionsContainer.style.display = 'flex';
              };
              
              const btnImg = document.getElementById('inline-download-image');
              if (btnImg) {
                  btnImg.onclick = (e) => {
                      e.preventDefault();
                      if (OrisAudio.playButtonSound) OrisAudio.playButtonSound();
                      this.downloadSigilImage(text, freq, isEvil, activeElementsCopy);
                  };
              }
              
              const btnVid = document.getElementById('inline-download-video');
              if (btnVid) {
                  btnVid.onclick = (e) => {
                      e.preventDefault();
                      if (OrisAudio.playButtonSound) OrisAudio.playButtonSound();
                      if (optionsContainer) optionsContainer.style.display = 'none';
                      if (loadingContainer) loadingContainer.style.display = 'block';
                      this.recordSigilVideo(text, freq, isEvil, activeElementsCopy);
                  };
              }
          }
      } else {
          if (linkDownload) linkDownload.style.display = 'none';
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
    OrisAudio.stopEvilAmbient();
    OrisAudio.stopAllElements();
    this.resetElementButtons();
    WaveformRenderer.reset();
    this.stopEvilVibration();
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
  showWarning(message, type = 'normal', duration = 3500) {
    const popup = document.getElementById('warning-popup');
    const text  = document.getElementById('warning-popup-text');
    if (!popup || !text) return;

    if (type === 'evil') {
        popup.classList.add('evil-warning');
    } else {
        popup.classList.remove('evil-warning');
    }

    text.textContent = message;
    popup.classList.add('show');

    if (this._warningTimer) clearTimeout(this._warningTimer);
    this._warningTimer = setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.classList.remove('evil-warning'), 400);
    }, duration);
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

        OrisAudio.startFrequencyPad(freq.audioHz || freq.hz);
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
    
    // Delay sound until the 'O' starts moving (approx 0.8s)
    setTimeout(() => {
      try { OrisAudio.playSplashSound(); } catch (e) { /* silent */ }
    }, 800);

    // Extended splash time for new animation (6.5 seconds)
    setTimeout(() => {
      this.showScreen('home');
    }, 6500);
  },
  
  /**
   * Activate evil mode
   */
  activateEvilMode() {
      const popup = document.getElementById('warning-popup');
      if (popup) {
          popup.classList.remove('show');
          popup.classList.remove('evil-warning');
      }
      if (this._warningTimer) clearTimeout(this._warningTimer);

      const evilOverlay = document.getElementById('evil-overlay');
      if (evilOverlay) {
          evilOverlay.classList.add('active');
      }
      // The body background transition to evil mode is delayed until channelEvilMode
      
      
      try {
          OrisAudio.playEvilAmbient();
      } catch (e) {
          console.error("Audio error", e);
      }
  },

  playGlitchEffect(element, durationMs) {
      return new Promise(resolve => {
          const originalText = element.value || "OMEN GLITCH ERROR";
          // If empty, fill it temporarily
          if (!element.value) element.value = originalText;
          
          const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?~`";
          const startTime = Date.now();
          
          const glitchInterval = setInterval(() => {
              const now = Date.now();
              if (now - startTime > durationMs) {
                  clearInterval(glitchInterval);
                  resolve();
                  return;
              }
              
              let glitched = "";
              for (let i = 0; i < originalText.length; i++) {
                  if (Math.random() > 0.3) {
                      glitched += charset[Math.floor(Math.random() * charset.length)];
                  } else {
                      glitched += originalText[i];
                  }
              }
              element.value = glitched;
          }, 50);
      });
  },

  /**
   * Channel evil mode
   */
  channelEvilMode() {
      const evilInput = document.getElementById('evil-input');
      
      // 1. Play glitch audio
      try {
          if (typeof OrisAudio !== 'undefined' && OrisAudio.playGlitchAudio) {
              OrisAudio.playGlitchAudio(2.0);
          }
      } catch (e) {
          console.error("Glitch audio error", e);
      }
      
      // 2. Play visual glitch on input for 2 seconds
      if (evilInput) {
          this.playGlitchEffect(evilInput, 2000).then(() => {
              this._startEvilChannelingSequence();
          });
      } else {
          setTimeout(() => {
              this._startEvilChannelingSequence();
          }, 2000);
      }
  },

  _startEvilChannelingSequence() {
      // Set the body to evil mode now, hidden under the opaque black overlay
      document.body.classList.add('evil-mode');

      // Hide home screen instantly to avoid seeing it during the fade
      const homeScreen = document.getElementById('home-screen');
      if (homeScreen) {
          homeScreen.style.transition = 'none';
          homeScreen.style.opacity = '0';
          setTimeout(() => {
              homeScreen.style.transition = '';
              homeScreen.style.opacity = '';
          }, 1000);
      }

      const evilOverlay = document.getElementById('evil-overlay');
      if (evilOverlay) {
          evilOverlay.classList.remove('active');
      }
      
      const evilInput = document.getElementById('evil-input');
      if (evilInput) {
          // Keep the value for the history/sigil! Don't clear it yet.
          // evilInput.value = ''; // We will clear it later or on exit
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
  
      // Start Evil Vibration
      this.startEvilVibration();

      ChannelTimer.reset();
      ChannelTimer.start(
        (remaining, progress) => this.onTimerTick(remaining, progress),
        () => this.onTimerComplete()
      );
  },
  startEvilVibration() {
      // Soft, irregular heartbeat pattern:
      // small thud (20ms), wait 100ms, stronger thud (40ms), wait 800-1200ms
      if (!navigator.vibrate) return;
      
      // Much stronger and heavier heartbeat pattern for evil mode
      const pattern = [0, 250, 100, 350];
      
      const triggerVibe = () => {
          if (typeof AndroidInterface !== 'undefined' && AndroidInterface.triggerNativeVibration) {
              AndroidInterface.triggerNativeVibration();
          } else if (navigator.vibrate) {
              navigator.vibrate(pattern);
          }
          const nextWait = 800 + Math.random() * 400; // 800 to 1200ms
          this._evilVibeTimer = setTimeout(triggerVibe, nextWait);
      };
      
      triggerVibe();
  },

  stopEvilVibration() {
      if (this._evilVibeTimer) {
          clearTimeout(this._evilVibeTimer);
          this._evilVibeTimer = null;
      }
      if (navigator.vibrate) {
          navigator.vibrate(0); // stop
      }
  },

  downloadSigilImage(text, freq, isEvil, activeElementsSet) {
      try {
          const canvas = document.createElement('canvas');
          canvas.width = 1080;
          canvas.height = 1920; // Vertical format
          const ctx = canvas.getContext('2d');
          
          // Background
          ctx.fillStyle = isEvil ? '#050505' : '#F4EEE6'; // Lighter beige
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw geometric border frame
          ctx.strokeStyle = freq.color;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          ctx.globalAlpha = isEvil ? 0.4 : 0.7;
          
          const drawFrame = (margin, outerPadding, lw) => {
              ctx.lineWidth = lw;
              ctx.beginPath();
              const r = 40; // corner radius
              const dipW = 80; // width of the dip
              
              const L = margin;
              const R = canvas.width - margin;
              const T = margin;
              const B = canvas.height - margin;
              
              const cx = canvas.width / 2;
              const cy = canvas.height / 2;
              
              // Top
              ctx.moveTo(L + r, T);
              ctx.lineTo(cx - dipW, T);
              ctx.lineTo(cx, outerPadding); 
              ctx.lineTo(cx + dipW, T);
              ctx.lineTo(R - r, T);
              ctx.arcTo(R, T, R, T + r, r);
              
              // Right
              ctx.lineTo(R, cy - dipW);
              ctx.lineTo(canvas.width - outerPadding, cy); 
              ctx.lineTo(R, cy + dipW);
              ctx.lineTo(R, B - r);
              ctx.arcTo(R, B, R - r, B, r);
              
              // Bottom
              ctx.lineTo(cx + dipW, B);
              ctx.lineTo(cx, canvas.height - outerPadding); 
              ctx.lineTo(cx - dipW, B);
              ctx.lineTo(L + r, B);
              ctx.arcTo(L, B, L, B - r, r);
              
              // Left
              ctx.lineTo(L, cy + dipW);
              ctx.lineTo(outerPadding, cy); 
              ctx.lineTo(L, cy - dipW);
              ctx.lineTo(L, T + r);
              ctx.arcTo(L, T, L + r, T, r);
              
              ctx.stroke();
          };
          
          drawFrame(45, 45, 3);
          drawFrame(65, 45, 2);
          drawFrame(85, 45, 1);
          
          ctx.globalAlpha = 1.0;
          
          // Oris Numen Title
          ctx.fillStyle = isEvil ? '#cc0000' : '#2A2A2A';
          ctx.font = '600 140px "Cormorant Garamond", serif';
          ctx.textAlign = 'center';
          ctx.fillText('Oris Numen', canvas.width / 2, 230);
          
          // Subtitle
          ctx.font = '400 35px "Inter", sans-serif';
          ctx.fillStyle = isEvil ? '#990000' : '#777777';
          const canvasSubtitle = Translations[this.currentLang]['success.share_channeling'] || "Comparte tu canalización";
          ctx.fillText(canvasSubtitle, canvas.width / 2, 300);
          
          // Draw Sigil
          if (typeof SigilGenerator !== 'undefined') {
              SigilGenerator.draw(ctx, canvas.width / 2, 670, 300, text, freq.color, isEvil);
          }
          
          let yPos = 1040;
          ctx.textAlign = 'center';

          // Type of prayer (Plegaria, Perdón, Confesión, etc.)
          const prayerType = (Translations[this.currentLang][`card.${this.currentFrequency}.desc`] || "Canalización Espiritual").toUpperCase();
          ctx.font = '500 38px "Inter", sans-serif';
          ctx.fillStyle = isEvil ? '#990000' : '#4A4A4A';
          ctx.fillText(prayerType, canvas.width / 2, yPos);
          yPos += 60;

          // Frequency
          ctx.font = '700 55px "Inter", sans-serif';
          ctx.fillStyle = freq.color;
          ctx.fillText(`${freq.name} (${freq.hz || freq.audioHz} Hz)`, canvas.width / 2, yPos);
          yPos += 75;

          // Elements with colors
          const elsToUse = activeElementsSet || this.activeElements;
          if (elsToUse.size > 0) {
              ctx.font = '700 35px "Inter", sans-serif';
              const elementColors = {
                  'aire': '#5CE1E6',
                  'agua': '#0057FF',
                  'fuego': '#FF3131',
                  'tierra': '#7ED957'
              };
              const elsArray = Array.from(elsToUse);
              let totalWidth = 0;
              const parts = [];
              
              let prefixStr = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.elements"]) || "Elementos: ";
              
              const prefixW = ctx.measureText(prefixStr).width;
              totalWidth += prefixW;
              
              for (let i = 0; i < elsArray.length; i++) {
                  const el = elsArray[i];
                  let elText = (Translations[this.currentLang][`elements.${el}`] || el).toLowerCase();
                  if (i < elsArray.length - 1) {
                      let andStr = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.and"]) || " y ";
                      elText += andStr;
                  }
                  const w = ctx.measureText(elText).width;
                  parts.push({ text: elText, color: elementColors[el] || '#666', width: w });
                  totalWidth += w;
              }
              
              let currentX = canvas.width / 2 - totalWidth / 2;
              ctx.textAlign = 'left';
              
              ctx.fillStyle = isEvil ? '#660000' : '#6A6A6A';
              ctx.fillText(prefixStr, currentX, yPos);
              currentX += prefixW;
              
              for (const p of parts) {
                  ctx.fillStyle = p.color;
                  ctx.fillText(p.text, currentX, yPos);
                  currentX += p.width;
              }
              ctx.textAlign = 'center';
          } else {
              ctx.font = '700 35px "Inter", sans-serif';
              ctx.fillStyle = '#6A6A6A';
              let noneText = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.none"]) || "Elementos: Ninguno";
              ctx.fillText(noneText, canvas.width / 2, yPos);
          }
          yPos += 65;

          // Duration & Date
          ctx.font = '400 35px "Inter", sans-serif';
          ctx.fillStyle = isEvil ? '#660000' : '#6A6A6A';
          const timeStr = ChannelTimer.formatTime(ChannelTimer.duration);
          const dateStr = new Date().toLocaleDateString(this.currentLang);
          
          let durPrefix = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.duration"]) || "Duración";
          let datePrefix = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.date"]) || "Fecha";
          
          ctx.fillText(`${durPrefix}: ${timeStr}   •   ${datePrefix}: ${dateStr}`, canvas.width / 2, yPos);
          yPos += 65;
          
          // Horizontal Line
          ctx.strokeStyle = isEvil ? '#440000' : '#CCCCCC';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2 - 400, yPos);
          ctx.lineTo(canvas.width / 2 + 400, yPos);
          ctx.stroke();
          
          // Gap below line needs to account for font height because text is drawn from bottom up
          yPos += 120;

          // Explanatory Text with justified word wrapping
          ctx.font = 'italic 50px "Cormorant Garamond", serif';
          ctx.fillStyle = isEvil ? '#550000' : '#333333';
          const explText = Translations[this.currentLang]['success.sigil_explanation'] || "Your prayer has been converted into a numeric seed...";
          
          const wrapTextJustified = (context, text, x, y, maxWidth, lineHeight) => {
              context.textAlign = 'left';
              const paragraphs = text.split('\n');
              const regularFont = 'italic 50px "Cormorant Garamond", serif';
              const boldFont = 'bold italic 50px "Cormorant Garamond", serif';
              
              for (const p of paragraphs) {
                  if (p.trim() === '') {
                      y += lineHeight;
                      continue;
                  }
                  
                  // Parse bold tags **word**
                  let rawParts = p.split(/(\*\*.*?\*\*)/g);
                  let wordList = [];
                  
                  for (let part of rawParts) {
                      if (!part) continue;
                      let isBold = false;
                      if (part.startsWith('**') && part.endsWith('**')) {
                          isBold = true;
                          part = part.substring(2, part.length - 2);
                      }
                      
                      let subwords = part.split(' ');
                      for (let i = 0; i < subwords.length; i++) {
                          if (subwords[i] !== '') {
                              wordList.push({ text: subwords[i], bold: isBold });
                          }
                      }
                  }
                  
                  let lineWords = [];
                  let currentLineWidth = 0;
                  context.font = regularFont;
                  const spaceWidth = context.measureText(' ').width;
                  
                  for (let n = 0; n < wordList.length; n++) {
                      let wObj = wordList[n];
                      context.font = wObj.bold ? boldFont : regularFont;
                      let wordWidth = context.measureText(wObj.text).width;
                      
                      if (lineWords.length > 0 && currentLineWidth + spaceWidth + wordWidth > maxWidth) {
                          let totalWordWidth = 0;
                          for (let lw of lineWords) {
                              context.font = lw.bold ? boldFont : regularFont;
                              totalWordWidth += context.measureText(lw.text).width;
                          }
                          
                          let spaceBetween = lineWords.length > 1 ? (maxWidth - totalWordWidth) / (lineWords.length - 1) : 0;
                          
                          let currentX = x;
                          for (let i = 0; i < lineWords.length; i++) {
                              context.font = lineWords[i].bold ? boldFont : regularFont;
                              context.fillText(lineWords[i].text, currentX, y);
                              currentX += context.measureText(lineWords[i].text).width + spaceBetween;
                          }
                          
                          lineWords = [wObj];
                          currentLineWidth = wordWidth;
                          y += lineHeight;
                      } else {
                          lineWords.push(wObj);
                          currentLineWidth += (lineWords.length === 1 ? 0 : spaceWidth) + wordWidth;
                      }
                  }
                  
                  let currentX = x;
                  for (let i = 0; i < lineWords.length; i++) {
                      context.font = lineWords[i].bold ? boldFont : regularFont;
                      context.fillText(lineWords[i].text, currentX, y);
                      currentX += context.measureText(lineWords[i].text).width + spaceWidth;
                  }
                  y += lineHeight;
              }
              context.textAlign = 'center'; // restore
          };
          wrapTextJustified(ctx, explText, canvas.width / 2 - 425, yPos, 850, 60);
          
          // Trigger download
          const date = new Date().toLocaleDateString('en-CA');
          const fileName = `OrisNumen-Sigil-${date.replace(/\//g, '-')}.png`;
          const dataUrl = canvas.toDataURL('image/png');
      
          if (window.AndroidInterface && window.AndroidInterface.saveImageBase64) {
              const successMsg = Translations[this.currentLang]['success.image_saved'] || "Imagen guardada en Galería";
              const errorMsg = Translations[this.currentLang]['error.image_saved'] || "Error al guardar imagen";
              window.AndroidInterface.saveImageBase64(dataUrl, fileName, successMsg, errorMsg);
          } else {
              const link = document.createElement('a');
              link.download = fileName;
              link.href = dataUrl;
              link.click();
          }
      } catch (err) {
          console.error("Error generating sigil: ", err);
      }
  },

  saveToHistory() {
      try {
          const freqId = this.currentFrequency;
          if (!freqId) return;
          const freq = this.FREQUENCIES[freqId];
          
          let text = '';
          if (freqId === 'pazuzu') {
              const evilInput = document.getElementById('evil-input');
              text = evilInput ? evilInput.value : '';
          } else {
              const msgInput = document.getElementById('message-input');
              text = msgInput ? msgInput.value : '';
          }

          if (!text || text.trim().length === 0) return; // don't save empty
          
          const activeElements = Array.from(document.querySelectorAll('.element-btn.active'))
                                      .map(btn => btn.getAttribute('data-element'));

          const historyItem = {
              id: Date.now(),
              type: freqId,
              duration: ChannelTimer.duration,
              elements: activeElements,
              text: text,
              date: Date.now()
          };

          let history = JSON.parse(localStorage.getItem('oris_history') || '[]');
          history.unshift(historyItem);
          localStorage.setItem('oris_history', JSON.stringify(history));
          
          let totalChannelings = parseInt(localStorage.getItem('oris_total_channelings') || '0', 10);
          totalChannelings++;
          localStorage.setItem('oris_total_channelings', totalChannelings);
      } catch (e) {
          console.error("Error saving history", e);
      }
  },

  openHistoryCard() {
      const overlay = document.getElementById('history-overlay');
      if (overlay) {
          this.renderHistory();
          overlay.classList.add('active');
          const listContainer = document.getElementById('history-list');
          if (listContainer) {
              listContainer.scrollTop = 0;
          }
          if (typeof this.closeSidebar === 'function') this.closeSidebar();
          try { OrisAudio.playButtonSound(); } catch(e){}
      }
  },

  closeHistoryCard() {
      const overlay = document.getElementById('history-overlay');
      if (overlay) {
          overlay.classList.remove('active');
          try { OrisAudio.playButtonSound(); } catch(e){}
      }
  },

  evolutionAnimId: null,

  openEvolutionCard() {
      const overlay = document.getElementById('evolution-overlay');
      if (overlay) {
          overlay.classList.add('active');
          if (typeof this.closeSidebar === 'function') this.closeSidebar();
          try { OrisAudio.playButtonSound(); } catch(e){}
          
          let totalChannelings = parseInt(localStorage.getItem('oris_total_channelings') || '0', 10);
          
          const t = Translations[this.currentLang] || Translations['en'];
          const countDisplay = document.getElementById('evolution-count-display');
          if (countDisplay) {
              const formatStr = t['evolution.count'] || "Número de canalizaciones: {count}";
              countDisplay.textContent = formatStr.replace('{count}', totalChannelings);
          }
          
          const halo = document.querySelector('.evolution-glow-halo');
          if (halo) {
              let rgb = '138, 43, 226';
              if (this.currentFrequency && this.FREQUENCIES && this.FREQUENCIES[this.currentFrequency]) {
                  rgb = this.FREQUENCIES[this.currentFrequency].colorRgb;
              }
              halo.style.boxShadow = `0 0 50px 20px rgba(${rgb}, 0.5)`;
          }
          
          const canvas = document.getElementById('evolution-canvas');
          if (canvas) {
              this.drawEvolutionMandala(canvas, totalChannelings);
          }
      }
  },

  closeEvolutionCard() {
      const overlay = document.getElementById('evolution-overlay');
      if (overlay) {
          overlay.classList.remove('active');
          try { OrisAudio.playButtonSound(); } catch(e){}
      }
      if (this.evolutionAnimId) {
          cancelAnimationFrame(this.evolutionAnimId);
          this.evolutionAnimId = null;
      }
  },

  drawEvolutionMandala(canvas, count) {
      const ctx = canvas.getContext('2d');
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      let start = performance.now();
      
      // Colors from 4 frequencies: gold/beige, blue/cyan, purple/magenta, red/dark
      const colors = ['#D4AF37', '#00FFFF', '#8A2BE2', '#FF4500', '#F8EFE4', '#4169E1', '#FF00FF', '#8B0000'];
      
      const draw = () => {
          const now = performance.now();
          const elapsed = (now - start) / 1000;
          
          // Clear background
          ctx.fillStyle = '#0a0a0a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Breathing pulse
          const pulse = 1.0 + 0.05 * Math.sin(elapsed * 2);
          
          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(pulse, pulse);
          
          // Draw seed
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 20;
          ctx.fill();
          
          // Draw layers based on count
          const maxLayers = Math.min(count, 30); // Prevent infinity
          for (let i = 1; i <= maxLayers; i++) {
              ctx.save();
              // Randomish but deterministic properties per layer
              const layerColor = colors[(i * 7) % colors.length];
              const sides = 2 + (i % 8); // 2(line), 3(tri), 4(sq), etc
              const radius = 20 + i * 15;
              const rotationDir = (i % 2 === 0) ? 1 : -1;
              const rotationSpeed = 0.5 - (i * 0.01);
              
              ctx.rotate(elapsed * rotationSpeed * rotationDir + (i * 0.5));
              
              ctx.beginPath();
              if (sides === 2) {
                  ctx.arc(0, 0, radius, 0, Math.PI * 2);
              } else {
                  for (let s = 0; s < sides; s++) {
                      const angle = (s * Math.PI * 2) / sides;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;
                      if (s === 0) ctx.moveTo(x, y);
                      else ctx.lineTo(x, y);
                  }
                  ctx.closePath();
              }
              
              ctx.strokeStyle = layerColor;
              ctx.lineWidth = 1.5;
              ctx.stroke();
              
              // Draw nodes
              if (sides > 2) {
                  for (let s = 0; s < sides; s++) {
                      const angle = (s * Math.PI * 2) / sides;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;
                      ctx.beginPath();
                      ctx.arc(x, y, 3, 0, Math.PI * 2);
                      ctx.fillStyle = layerColor;
                      ctx.fill();
                  }
              }
              ctx.restore();
          }
          
          ctx.restore();
          this.evolutionAnimId = requestAnimationFrame(draw);
      };
      
      if (this.evolutionAnimId) cancelAnimationFrame(this.evolutionAnimId);
      this.evolutionAnimId = requestAnimationFrame(draw);
  },

  closeSidebar() {
      const sidebarOverlay = document.getElementById('sidebar-overlay');
      if (sidebarOverlay) {
          sidebarOverlay.classList.remove('active');
      }
  },

  openShareOverlay() {
      const overlay = document.getElementById('share-overlay');
      if (overlay) {
          overlay.classList.add('active');
          try { OrisAudio.playButtonSound(); } catch(e){}
      }
  },

  closeShareOverlay() {
      const overlay = document.getElementById('share-overlay');
      if (overlay) {
          overlay.classList.remove('active');
          try { OrisAudio.playButtonSound(); } catch(e){}
      }
  },

  renderHistory() {
      const listContainer = document.getElementById('history-list');
      if (!listContainer) return;
      
      let history = [];
      try {
          history = JSON.parse(localStorage.getItem('oris_history') || '[]');
      } catch (e) {}

      listContainer.innerHTML = '';
      
      const t = Translations[this.currentLang] || Translations['en'];

      if (history.length === 0) {
          const emptyDiv = document.createElement('div');
          emptyDiv.className = 'history-empty';
          emptyDiv.textContent = t['history.empty'] || "No messages";
          listContainer.appendChild(emptyDiv);
          return;
      }

      history.forEach(item => {
          const freq = this.FREQUENCIES[item.type] || this.FREQUENCIES['humilis'];
          
          const wrapper = document.createElement('div');
          wrapper.className = 'history-item';
          wrapper.setAttribute('data-id', item.id);
          
          const content = document.createElement('div');
          content.className = 'history-item-content';
          
          const header = document.createElement('div');
          header.className = 'history-item-header';
          
          const typeSpan = document.createElement('span');
          typeSpan.className = 'history-item-type';
          const freqFormat = t['freq.format'] || "Frequency {name}";
          const freqFullNameStr = freqFormat.replace('{name}', freq.name) + ` (${freq.hz} Hz)`;
          
          typeSpan.style.color = freq.color;
          const typeName = item.type === 'pazuzu' ? 'Maleficus' : (t[`freq.${item.type}.type`] || freq.name);
          typeSpan.textContent = `${typeName} - ${freqFullNameStr}`;
          
          const metaDiv = document.createElement('div');
          metaDiv.className = 'history-meta';
          
          const formattedDuration = ChannelTimer.formatTime(item.duration);
          const durationText = (t['history.duration'] || "Duration: {time}").replace('{time}', formattedDuration);
          
          const d = new Date(item.date);
          const formattedDate = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          const dateText = (t['history.date'] || "Date: {date}").replace('{date}', formattedDate);
          
          let plainElementsTextValue = t['history.none'] || 'None';
          let htmlElementsTextValue = t['history.none'] || 'None';

          if (item.elements && item.elements.length > 0) {
              const plainArr = item.elements.map(e => t[`elements.${e}`] || e.charAt(0).toUpperCase() + e.slice(1));
              plainElementsTextValue = plainArr.join(', ');

              const htmlArr = item.elements.map(e => {
                  const translated = t[`elements.${e}`] || e.charAt(0).toUpperCase() + e.slice(1);
                  let color = '#7A7A72';
                  if (e === 'aire') color = '#B5D8D8';
                  if (e === 'tierra') color = '#8B7355';
                  if (e === 'agua') color = '#5A8BB5';
                  if (e === 'fuego') color = '#D45A5A';
                  return `<span style="color: ${color}; font-weight: 600;">${translated}</span>`;
              });
              htmlElementsTextValue = htmlArr.join(', ');
          }
          const htmlElementsText = (t['history.elements'] || "Elements: {elements}").replace('{elements}', htmlElementsTextValue);
          const plainElementsText = (t['history.elements'] || "Elements: {elements}").replace('{elements}', plainElementsTextValue);
          
          metaDiv.innerHTML = `<span>${durationText}</span><span>${dateText}</span><span>${htmlElementsText}</span>`;
          
          header.appendChild(typeSpan);
          header.appendChild(metaDiv);
          
          const textDiv = document.createElement('div');
          textDiv.className = 'history-text';
          textDiv.textContent = item.text;
          
          content.appendChild(header);
          content.appendChild(textDiv);
          
          const actionsDiv = document.createElement('div');
          actionsDiv.className = 'history-actions';
          
          const btnDelete = document.createElement('button');
          btnDelete.className = 'btn-history-action btn-delete-history';
          btnDelete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="purple" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>';
          btnDelete.title = t['history.delete'] || 'Delete';
          btnDelete.onclick = () => this.deleteHistoryItem(item.id);
          
          const btnShare = document.createElement('button');
          btnShare.className = 'btn-history-action btn-share-history';
          btnShare.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>';
          btnShare.title = t['history.share'] || 'Share';
          btnShare.onclick = () => {
              this.currentShareText = `${typeName} - ${freqFullNameStr}\n${durationText}\n${dateText}\n${plainElementsText}\n\n"${item.text}"\n\n${t['share.promo'] || "Si quieres canalizar tus mensajes únete a Oris Numen. Busca la app en tu store."} 🙏\nhttps://play.google.com/store/apps/details?id=com.orisnumen.app`;
              this.openShareOverlay();
          };
          
          actionsDiv.appendChild(btnDelete);
          actionsDiv.appendChild(btnShare);
          
          wrapper.appendChild(content);
          wrapper.appendChild(actionsDiv);
          
          listContainer.appendChild(wrapper);
      });
  },

  deleteHistoryItem(id) {
      try {
          const el = document.querySelector(`.history-item[data-id="${id}"]`);
          if (el) {
              try { OrisAudio.playDestructionSound(); } catch (e) {}
              el.classList.add('dissolve-anim-fast');
              setTimeout(() => {
                  let history = JSON.parse(localStorage.getItem('oris_history') || '[]');
                  history = history.filter(item => item.id !== id);
                  localStorage.setItem('oris_history', JSON.stringify(history));
                  this.renderHistory();
              }, 1000);
          } else {
              let history = JSON.parse(localStorage.getItem('oris_history') || '[]');
              history = history.filter(item => item.id !== id);
              localStorage.setItem('oris_history', JSON.stringify(history));
              this.renderHistory();
          }
      } catch (e) {}
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

,
  recordSigilVideo(text, freq, isEvil, activeElementsSet) {
      try {
          const loadingContainer = document.getElementById('inline-loading-container');
          const optionsContainer = document.getElementById('download-options-container');
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      const fps = 30;
      const durationSec = 12;
      
      const stream = canvas.captureStream(fps);
      
      const destNode = OrisAudio.ctx.createMediaStreamDestination();
      const videoGain = OrisAudio.ctx.createGain();
      videoGain.gain.setValueAtTime(0, OrisAudio.ctx.currentTime);
      videoGain.gain.linearRampToValueAtTime(1, OrisAudio.ctx.currentTime + 1.2);
      
      // Mute device speakers while generating video, but route to videoGain
      if (OrisAudio.speakerGain) {
          OrisAudio.speakerGain.gain.setValueAtTime(0, OrisAudio.ctx.currentTime);
      } else {
          try { OrisAudio.masterGain.disconnect(OrisAudio.ctx.destination); } catch(e){}
      }
      OrisAudio.masterGain.connect(videoGain);
      videoGain.connect(destNode);
      const audioTracks = destNode.stream.getAudioTracks();
      if (audioTracks.length > 0) {
          stream.addTrack(audioTracks[0]);
      }
      
      OrisAudio.startFrequencyPad(freq.audioHz || freq.hz);
      const elsArray = Array.from(activeElementsSet || this.activeElements);
      elsArray.forEach(el => OrisAudio.startElement(el));
      
      setTimeout(() => {
          videoGain.gain.setValueAtTime(videoGain.gain.value, OrisAudio.ctx.currentTime);
          videoGain.gain.linearRampToValueAtTime(0, OrisAudio.ctx.currentTime + 1.2);
      }, 6800);
      setTimeout(() => {
          if (OrisAudio.stopFrequencyPad) OrisAudio.stopFrequencyPad();
          if (OrisAudio.stopEvilAmbient) OrisAudio.stopEvilAmbient();
          if (OrisAudio.stopAllElements) OrisAudio.stopAllElements();
      }, 10000);
      let mimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported('video/mp4')) mimeType = 'video/mp4';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });
      const chunks = [];
      mediaRecorder.ondataavailable = e => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
          if (loadingContainer) loadingContainer.style.display = 'none';
          if (optionsContainer) optionsContainer.style.display = 'flex';
          
          OrisAudio.masterGain.disconnect(videoGain);
          videoGain.disconnect();
          
          // Restore audio to device speakers after reverb has fully decayed
          setTimeout(() => {
              if (OrisAudio && OrisAudio.ctx && OrisAudio.masterGain) {
                  if (OrisAudio.speakerGain) {
                      OrisAudio.speakerGain.gain.setValueAtTime(1, OrisAudio.ctx.currentTime);
                  } else {
                      try { OrisAudio.masterGain.connect(OrisAudio.ctx.destination); } catch(e) {}
                  }
              }
          }, 2000);
          
          const blob = new Blob(chunks, { type: mimeType });
          const ext = mimeType === 'video/mp4' ? 'mp4' : 'webm';
          const dateStr = new Date().toLocaleDateString('en-CA').replace(/\//g, '-');
          const fileName = `OrisNumen-Sigil-${dateStr}.${ext}`;
          
          if (window.AndroidInterface && window.AndroidInterface.saveVideoBase64) {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                  const successMsg = Translations[this.currentLang]['success.video_saved'] || "Video guardado en Galería";
                  const errorMsg = Translations[this.currentLang]['error.video_saved'] || "Error al guardar video";
                  window.AndroidInterface.saveVideoBase64(reader.result, fileName, successMsg, errorMsg);
              };
          } else {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              link.click();
              URL.revokeObjectURL(url);
          }
      };

      mediaRecorder.start();
      
      const startTime = performance.now();
      const renderFrame = (currentTime) => {
          if (!currentTime) currentTime = performance.now();
          const elapsed = (currentTime - startTime) / 1000;
          
          if (elapsed >= durationSec) {
              mediaRecorder.stop();
              return;
          }
          
          const t = elapsed / durationSec;
          
          ctx.fillStyle = isEvil ? '#110000' : '#F8EFE4';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          let titleAlpha = Math.min(1.0, elapsed / 1.6);
          ctx.globalAlpha = titleAlpha;
          
          const drawFrame = (outerPadding, r, depth) => {
              const L = outerPadding;
              const R = canvas.width - outerPadding;
              const T = outerPadding;
              const B = canvas.height - outerPadding;
              const cx = canvas.width / 2;
              const cy = canvas.height / 2;
              const dipW = 80;
              const dipD = 25;
              
              ctx.strokeStyle = freq.color;
              ctx.lineWidth = depth;
              ctx.globalAlpha = titleAlpha * (0.5 + (depth * 0.1));
              
              ctx.beginPath();
              ctx.moveTo(L + r, T);
              ctx.lineTo(cx - dipW, T);
              ctx.lineTo(cx, T + dipD);
              ctx.lineTo(cx + dipW, T);
              ctx.lineTo(R - r, T);
              ctx.arcTo(R, T, R, T + r, r);
              ctx.lineTo(R, cy - dipW);
              ctx.lineTo(R - dipD, cy);
              ctx.lineTo(R, cy + dipW);
              ctx.lineTo(R, B - r);
              ctx.arcTo(R, B, R - r, B, r);
              ctx.lineTo(cx + dipW, B);
              ctx.lineTo(cx, B - dipD);
              ctx.lineTo(cx - dipW, B);
              ctx.lineTo(L + r, B);
              ctx.arcTo(L, B, L, B - r, r);
              ctx.lineTo(L, cy + dipW);
              ctx.lineTo(L + dipD, cy); 
              ctx.lineTo(L, cy - dipW);
              ctx.lineTo(L, T + r);
              ctx.arcTo(L, T, L + r, T, r);
              
              ctx.stroke();
          };
          
          drawFrame(45, 45, 3);
          drawFrame(65, 45, 2);
          drawFrame(85, 45, 1);
          
          ctx.globalAlpha = titleAlpha;
          
          ctx.textAlign = 'center';
          ctx.font = '300 120px "Cormorant Garamond", serif';
          ctx.fillStyle = isEvil ? '#CC0000' : '#0B0B0B';
          ctx.fillText("ORIS NUMEN", canvas.width / 2, 220);
          
          ctx.font = '400 35px "Inter", sans-serif';
          ctx.fillStyle = isEvil ? '#990000' : '#777777';
          const canvasSubtitle = Translations[this.currentLang]['success.share_channeling'] || "Comparte tu canalización";
          ctx.fillText(canvasSubtitle, canvas.width / 2, 300);
          ctx.globalAlpha = 1.0;
          
          const sigilProgress = Math.min(1.0, elapsed / 6.4);
          
          // Heartbeat pulse effect: grows for 1.5s, shrinks for 1.0s (2.5s cycle)
          const cycleDuration = 2.5;
          const cycleTime = elapsed % cycleDuration;
          const maxScale = 1.07;
          let pulseScale = 1.0;
          
          if (cycleTime < 1.5) {
              const p = cycleTime / 1.5;
              const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
              pulseScale = 1.0 + ((maxScale - 1.0) * ease);
          } else {
              const p = (cycleTime - 1.5) / 1.0;
              const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
              pulseScale = maxScale - ((maxScale - 1.0) * ease);
          }
          
          const pulseRadius = 300 * pulseScale;
          
          if (typeof SigilGenerator !== 'undefined') {
              SigilGenerator.draw(ctx, canvas.width / 2, 670, pulseRadius, text, freq.color, isEvil, sigilProgress);
          }
          
          let yPos = 1040;
          
          let dataAlpha = Math.max(0, Math.min(1.0, (t - 0.3) / 0.2));
          ctx.globalAlpha = dataAlpha;
          const prayerType = (Translations[this.currentLang][`card.${this.currentFrequency}.desc`] || "Canalización Espiritual").toUpperCase();
          ctx.font = '500 38px "Inter", sans-serif';
          ctx.fillStyle = isEvil ? '#990000' : '#4A4A4A';
          ctx.fillText(prayerType, canvas.width / 2, yPos);
          yPos += 60;
          
          ctx.font = '700 55px "Inter", sans-serif';
          ctx.fillStyle = freq.color;
          ctx.fillText(`${freq.name} (${freq.hz || freq.audioHz} Hz)`, canvas.width / 2, yPos);
          yPos += 75;
          
          if (elsArray.length > 0) {
              const elementColors = { 'aire': '#5CE1E6', 'agua': '#0057FF', 'fuego': '#FF3131', 'tierra': '#7ED957' };
              let prefixStr = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.elements"]) || "Elementos: ";
              const prefixW = ctx.measureText(prefixStr).width;
              let totalWidth = prefixW;
              const parts = [];
              for (let i = 0; i < elsArray.length; i++) {
                  const el = elsArray[i];
                  let elText = (Translations[this.currentLang][`elements.${el}`] || el).toLowerCase();
                  if (i < elsArray.length - 1) {
                      let andStr = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.and"]) || " y ";
                      elText += andStr;
                  }
                  const w = ctx.measureText(elText).width;
                  parts.push({ text: elText, color: elementColors[el] || '#666', width: w });
                  totalWidth += w;
              }
              let currentX = canvas.width / 2 - totalWidth / 2;
              ctx.textAlign = 'left';
              ctx.fillStyle = isEvil ? '#660000' : '#6A6A6A';
              ctx.fillText(prefixStr, currentX, yPos);
              currentX += prefixW;
              for (const p of parts) {
                  ctx.fillStyle = p.color;
                  ctx.fillText(p.text, currentX, yPos);
                  currentX += p.width;
              }
              ctx.textAlign = 'center';
          } else {
              ctx.font = '700 35px "Inter", sans-serif';
              ctx.fillStyle = '#6A6A6A';
              let noneText = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.none"]) || "Elementos: Ninguno";
              ctx.fillText(noneText, canvas.width / 2, yPos);
          }
          yPos += 65;
          
          ctx.font = '400 35px "Inter", sans-serif';
          ctx.fillStyle = isEvil ? '#660000' : '#6A6A6A';
          const timeStr = ChannelTimer.formatTime(ChannelTimer.duration);
          const dateStr = new Date().toLocaleDateString(this.currentLang);
          let durPrefix = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.duration"]) || "Duración";
          let datePrefix = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.date"]) || "Fecha";
          ctx.fillText(`${durPrefix}: ${timeStr}       ${datePrefix}: ${dateStr}`, canvas.width / 2, yPos);
          yPos += 65;
          
          ctx.strokeStyle = isEvil ? '#440000' : '#CCCCCC';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2 - 400, yPos);
          ctx.lineTo(canvas.width / 2 + 400, yPos);
          ctx.stroke();
          yPos += 120;
          
          let explAlpha = Math.max(0, Math.min(1.0, (elapsed - 5.0) / 2.0));
          ctx.globalAlpha = explAlpha;
          ctx.font = 'italic 50px "Cormorant Garamond", serif';
          ctx.fillStyle = isEvil ? '#550000' : '#333333';
          const explText = Translations[this.currentLang]['success.sigil_explanation'] || "";
          
          const wrapTextJustified = (context, text, x, y, maxWidth, lineHeight) => {
              context.textAlign = 'left';
              const paragraphs = text.split('\n');
              const regularFont = 'italic 50px "Cormorant Garamond", serif';
              const boldFont = 'bold italic 50px "Cormorant Garamond", serif';
              for (const p of paragraphs) {
                  const words = p.split(' ');
                  const lines = [];
                  let currentLine = [];
                  let currentWidth = 0;
                  for (let w of words) {
                      let isBold = false;
                      if (w.includes('**')) {
                          isBold = true;
                          w = w.replace(/\*\*/g, '');
                      }
                      context.font = isBold ? boldFont : regularFont;
                      const wordWidth = context.measureText(w).width;
                      if (currentWidth + wordWidth + (currentLine.length * 10) > maxWidth && currentLine.length > 0) {
                          lines.push(currentLine);
                          currentLine = [];
                          currentWidth = 0;
                      }
                      currentLine.push({ text: w, bold: isBold, width: wordWidth });
                      currentWidth += wordWidth;
                  }
                  if (currentLine.length > 0) lines.push(currentLine);
                  for (let j = 0; j < lines.length; j++) {
                      const lineWords = lines[j];
                      if (j === lines.length - 1 || lineWords.length === 1) {
                          let currentX = x;
                          for (let i = 0; i < lineWords.length; i++) {
                              context.font = lineWords[i].bold ? boldFont : regularFont;
                              context.fillText(lineWords[i].text, currentX, y);
                              currentX += lineWords[i].width + context.measureText(" ").width;
                          }
                      } else {
                          const totalTextWidth = lineWords.reduce((sum, w) => sum + w.width, 0);
                          const spaceRemaining = maxWidth - totalTextWidth;
                          const spaceWidth = spaceRemaining / (lineWords.length - 1);
                          let currentX = x;
                          for (let i = 0; i < lineWords.length; i++) {
                              context.font = lineWords[i].bold ? boldFont : regularFont;
                              context.fillText(lineWords[i].text, currentX, y);
                              currentX += lineWords[i].width + spaceWidth;
                          }
                      }
                      y += lineHeight;
                  }
              }
              context.textAlign = 'center';
          };
          wrapTextJustified(ctx, explText, canvas.width / 2 - 425, yPos, 850, 60);
          
          ctx.globalAlpha = 1.0;
          
          requestAnimationFrame(renderFrame);
      };
      
      renderFrame();
      } catch (err) {
          console.error("Error generating video: ", err);
          
          if (OrisAudio && OrisAudio.ctx && OrisAudio.masterGain) {
              try { OrisAudio.masterGain.connect(OrisAudio.ctx.destination); } catch(e) {}
          }
          
          const loadingContainer = document.getElementById('inline-loading-container');
          if (loadingContainer) loadingContainer.style.display = 'none';
          const optionsContainer = document.getElementById('download-options-container');
          if (optionsContainer) optionsContainer.style.display = 'flex';
          alert("Error generating video: " + err.message);
      }
  }

};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => OrisApp.init());

