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

    // Global interceptor for warning popup dismiss
    const interceptWarningClick = (e) => {
        if (e.target && (e.target.closest('.home-logo') || e.target.closest('.home-logo-circle'))) {
            return;
        }
        const popup = document.getElementById('warning-popup');
        if (popup && popup.classList.contains('show')) {
            popup.classList.remove('show');
            if (this._warningTimer) {
                clearTimeout(this._warningTimer);
                this._warningTimer = null;
            }
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    };
    document.addEventListener('click', interceptWarningClick, { capture: true });
    document.addEventListener('touchstart', interceptWarningClick, { capture: true, passive: false });

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

        const btnGuide = document.getElementById('btn-guide');
        if (btnGuide) btnGuide.addEventListener('click', () => this.showGuideCard());

        const btnCloseGuide = document.getElementById('btn-close-guide');
        if (btnCloseGuide) btnCloseGuide.addEventListener('click', () => this.closeGuideCard());
        
        const guideBackdrop = document.getElementById('guide-backdrop');
        if (guideBackdrop) guideBackdrop.addEventListener('click', () => this.closeGuideCard());

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
    let evilClickTimestamps = [];
    let evilWarningShown = false;
    
    const handleEvilClick = (e) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        // Only respond while in normal mode (not evil mode already)
        if (document.body.classList.contains('evil-mode')) return;

        const now = Date.now();
        evilClickTimestamps.push(now);
        evilClicks++;
        
        if (evilClickTimer) clearTimeout(evilClickTimer);
        
        evilClickTimer = setTimeout(() => {
            evilClicks = 0;
            evilClickTimestamps = [];
            evilWarningShown = false;
        }, 3000); 

        evilClickTimestamps = evilClickTimestamps.filter(t => now - t <= 1700);

        if (evilClickTimestamps.length >= 6 && !evilWarningShown) {
            evilWarningShown = true;
            const warningMsg = (Translations[this.currentLang] && Translations[this.currentLang]['warning.too_many_clicks']) 
                || 'Por favor, no pulses más veces en el símbolo.';
            this.showWarning(warningMsg, 'normal', 1500);
        }
        
        if (evilClicks >= 20) {
            evilClicks = 0;
            evilClickTimestamps = [];
            evilWarningShown = false;
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

    this.initUniverseFeature();
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
    
    if (window.OrisNoiseDetector) {
        if (screenId === 'write') {
            OrisNoiseDetector.start();
        } else {
            OrisNoiseDetector.stop();
        }
    }
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
    if (overlayHz) {
        overlayHz.textContent = `${freq.hz} Hz`;
        overlayHz.style.color = freq.color;
    }
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
    if (btnSend) {
        btnSend.style.backgroundColor = freq.color;
        btnSend.classList.remove('progressing');
        btnSend.style.setProperty('--progress-width', '0%');
        const sendText = Translations[this.currentLang] ? (Translations[this.currentLang]['btn.send'] || 'Canalizar Mensaje') : 'Canalizar Mensaje';
        btnSend.textContent = sendText;
    }

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

    if (window.OrisNoiseDetector && OrisNoiseDetector.isNoisy()) {
        const warningMsg = (Translations[this.currentLang] && Translations[this.currentLang]['warning.noise']) || 'Busca un lugar con menos ruido para canalizar el mensaje.';
        this.showWarning(warningMsg, this.currentFrequency === 'pazuzu' ? 'evil' : 'normal');
        return;
    }

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

    // Spam detection: 5 consecutive identical characters or 6 consecutive consonants
    const isSpam = /(.)\1{4,}/i.test(text) || /[bcdfghjklmnpqrstvwxyz]{6,}/i.test(text);

    if (text.length < 11 || containsProfanity || isSpam) {
        if (messageInput) messageInput.value = '';
        const warningMsg = Translations[this.currentLang] ? Translations[this.currentLang]['warning.short_message'] : 'No malgastes la energía, escribe un mensaje más sincero.';
        this.showWarning(warningMsg, 'normal', 3000);
        return;
    }

    // Progress bar animation on button
    const btnSend = document.getElementById('btn-send');
    if (btnSend) {
        btnSend.classList.add('progressing');
        const channelingText = Translations[this.currentLang] ? (Translations[this.currentLang]['btn.channeling'] || 'Canalizando...') : 'Canalizando...';
        btnSend.textContent = channelingText;
        
        btnSend.style.setProperty('--progress-width', '0%');
        let currentProgress = 0;
        let startTime = Date.now();
        const duration = 4000;
        
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                btnSend.style.setProperty('--progress-width', '100%');
                return;
            }
            if (window.OrisNoiseDetector && OrisNoiseDetector.isNoisy()) {
                btnSend.classList.remove('progressing');
                const sendText = Translations[this.currentLang] ? (Translations[this.currentLang]['btn.send'] || 'Canalizar Mensaje') : 'Canalizar Mensaje';
                btnSend.textContent = sendText;
                btnSend.style.setProperty('--progress-width', '0%');
                
                if (this._channelingTimeout) {
                    clearTimeout(this._channelingTimeout);
                    this._channelingTimeout = null;
                }
                
                const warningMsg = (Translations[this.currentLang] && Translations[this.currentLang]['warning.noise']) || 'Busca un lugar con menos ruido para canalizar el mensaje.';
                this.showWarning(warningMsg, this.currentFrequency === 'pazuzu' ? 'evil' : 'normal');
                return;
            }
            
            if (Math.random() < 0.20) { 
                const linear = (elapsed / duration) * 100;
                currentProgress = Math.min(95, Math.max(currentProgress, linear + (Math.random() * 25 - 10)));
                btnSend.style.setProperty('--progress-width', `${currentProgress}%`);
            }
            
            requestAnimationFrame(updateProgress);
        };
        requestAnimationFrame(updateProgress);
    }

    // Wait 4.0 seconds for the progress bar animation to finish
    this._channelingTimeout = setTimeout(() => {
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
                const coloredName = `<span style="color: ${freq.color}">${freq.name}</span>`;
                const formattedName = freqFormat.replace('{name}', coloredName);
                label.innerHTML = formatStr.replace('{name}', formattedName);
            }
            if (sublabel) sublabel.textContent = Translations[this.currentLang]['channeling.sublabel'];
            if (timer) timer.textContent = ChannelTimer.formatTime(ChannelTimer.duration);
        
            this.showScreen('channeling');
            document.documentElement.style.setProperty('--channeling-color', freq.color);
        
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
    }, 4000);
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

      // Extract text for sigil
      let text = '';
      if (isEvil) {
          const evilInput = document.getElementById('evil-input');
          text = evilInput ? evilInput.value : '';
      } else {
          const msgInput = document.getElementById('message-input');
          text = msgInput ? msgInput.value : '';
      }

      // Animate the sigil canvas
      const successCanvas = document.getElementById('success-sigil-canvas');
      if (freq && successCanvas) {
          successCanvas.style.color = freq.color; // For drop-shadow and glow
          
          let sigilProgress = 0;
          let startTime = null;
          const duration = 8000; // 12s to reflect complexity generation speed
          
          const drawFrame = (currentTime) => {
              if (!startTime) startTime = currentTime;
              let elapsed = currentTime - startTime;
              sigilProgress = Math.min(1.0, Math.max(0, elapsed / duration));
              
              const ctx = successCanvas.getContext('2d');
              ctx.clearRect(0, 0, successCanvas.width, successCanvas.height);
              
              if (typeof SigilGenerator !== 'undefined') {
                  SigilGenerator.draw(ctx, successCanvas.width / 2, successCanvas.height / 2, 280, text, freq.color, isEvil, sigilProgress);
              }
              
              if (sigilProgress < 1.0) {
                  requestAnimationFrame(drawFrame);
              }
          };
          requestAnimationFrame(drawFrame);
      }

      // Sigil Download Link

      const linkDownload = document.getElementById('link-download-sigil');

      // Show Sigil link in all modes, colored by the frequency (which is red for Pazuzu)
      if (text && text.trim().length > 0 && typeof SigilGenerator !== 'undefined') {
          if (linkDownload) {
              // Instantly reset state without transition
              linkDownload.style.transition = 'none';
              linkDownload.style.opacity = '';
              linkDownload.style.pointerEvents = '';
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
                  
                  // Fade out the download sigil button
                  linkDownload.style.opacity = '0';
                  linkDownload.style.pointerEvents = 'none';
                  
                  // Wait 250ms for sigil fade out, then fade in options
                  if (optionsContainer) {
                      setTimeout(() => {
                          optionsContainer.style.display = 'flex';
                          setTimeout(() => {
                              optionsContainer.style.opacity = '1';
                          }, 10);
                      }, 250);
                  }
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
                      if (optionsContainer) {
                    optionsContainer.style.display = 'none';
                    optionsContainer.style.opacity = '';
                }
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
      const numProverbs = 10; // 10 proverbs per frequency
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
            const coloredName = `<span style="color: ${freq.color}">${freq.name}</span>`;
            const formattedName = freqFormat.replace('{name}', coloredName);
            label.innerHTML = formatStr.replace('{name}', formattedName);
        }
        if (timer) timer.textContent = ChannelTimer.formatTime(ChannelTimer.remaining);

        this.showScreen('channeling');
        document.documentElement.style.setProperty('--channeling-color', freq.color);

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
    
    // Start sound slightly before the 'O' starts moving (approx 1.6s)
    setTimeout(() => {
      try { OrisAudio.playSplashSound(); } catch (e) { /* silent */ }
    }, 1600);

    // Extended splash time for new animation (6.7 seconds)
    setTimeout(() => {
      this.showScreen('home');
    }, 6700);
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
          const coloredName = `<span style="color: ${freq.color}">${freq.name}</span>`;
          const formattedName = freqFormat.replace('{name}', coloredName);
          label.innerHTML = formatStr.replace('{name}', formattedName);
      }
      if (sublabel) sublabel.textContent = Translations[this.currentLang]['channeling.sublabel.evil'] || 'para su transformación en energía maligna';
      if (timer) timer.textContent = ChannelTimer.formatTime(ChannelTimer.duration);
  
      this.showScreen('channeling');
      document.documentElement.style.setProperty('--channeling-color', freq.color);
  
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

  renderSigilCanvas(ctx, text, freq, isEvil, activeElementsSet, elapsed = null) {
      const width = 1080;
      const height = 1920;
      const isVideo = (elapsed !== null && elapsed !== undefined);
      
      // Background
      ctx.fillStyle = isEvil ? '#0a0a0a' : '#FAFAF5';
      ctx.fillRect(0, 0, width, height);
      
      // 1. Top Title ("Mensaje canalizado")
      const titleAlpha = isVideo ? Math.min(1.0, elapsed / 1.5) : 1.0;
      ctx.globalAlpha = titleAlpha;
      ctx.fillStyle = isEvil ? '#CC0000' : '#2A2A2A';
      ctx.font = '400 100px "Cormorant Garamond", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      const topTitle = (Translations[this.currentLang] && Translations[this.currentLang]['sigil.title']) || "Mensaje canalizado";
      ctx.fillText(topTitle, width / 2, 150);
      
      // 2. Draw Sigil
      let sigilRadius = 340;
      let sigilProgress = 1.0;
      if (isVideo) {
          sigilProgress = Math.min(1.0, elapsed / 7.0);
          const cycleDuration = 2.5;
          const cycleTime = elapsed % cycleDuration;
          const maxScale = 1.025;
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
          sigilRadius = 340 * pulseScale;
      }
      ctx.globalAlpha = 1.0;
      if (typeof SigilGenerator !== 'undefined') {
          SigilGenerator.draw(ctx, width / 2, 575, sigilRadius, text, freq.color, isEvil, sigilProgress);
      }
      
      // 3. Left-Aligned Info Section with Vertical Accent Bar
      const dataAlpha = isVideo ? Math.max(0, Math.min(1.0, (elapsed - 0.3) / 1.0)) : 1.0;
      ctx.globalAlpha = dataAlpha;
      
      let yPos = 1030;
      const leftX = 210;
      ctx.textAlign = 'left';
      
      const prayerType = (Translations[this.currentLang][`card.${this.currentFrequency}.desc`] || "Canalización Espiritual").toUpperCase();
      ctx.font = '500 36px "Inter", sans-serif';
      ctx.fillStyle = isEvil ? '#990000' : '#4A4A4A';
      ctx.fillText(prayerType, leftX, yPos);
      yPos += 70;
      
      ctx.font = '600 62px "Inter", sans-serif';
      ctx.fillStyle = freq.color;
      ctx.fillText(`${freq.name} (${freq.hz || freq.audioHz} Hz)`, leftX, yPos);
      yPos += 70;
      
      const elsToUse = activeElementsSet || this.activeElements;
      const elsArray = Array.from(elsToUse);
      if (elsArray.length > 0) {
          const elementColors = {
              'aire': '#7CA982',
              'tierra': '#997A9E',
              'agua': '#7096AB',
              'fuego': '#CBA858'
          };
          let prefixStr = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.elements"]) || "Elementos: ";
          let currentX = leftX;
          
          ctx.font = '500 36px "Inter", sans-serif';
          ctx.fillStyle = isEvil ? '#770000' : '#555555';
          ctx.fillText(prefixStr, currentX, yPos);
          currentX += ctx.measureText(prefixStr).width;
          
          for (let i = 0; i < elsArray.length; i++) {
              const el = elsArray[i];
              let elText = (Translations[this.currentLang][`elements.${el}`] || el).toLowerCase();
              ctx.font = '600 36px "Inter", sans-serif';
              ctx.fillStyle = elementColors[el] || '#666666';
              ctx.fillText(elText, currentX, yPos);
              currentX += ctx.measureText(elText).width;
              
              if (i < elsArray.length - 1) {
                  ctx.font = '500 36px "Inter", sans-serif';
                  let andStr = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.and"]) || " y ";
                  ctx.fillStyle = isEvil ? '#770000' : '#555555';
                  ctx.fillText(andStr, currentX, yPos);
                  currentX += ctx.measureText(andStr).width;
              }
          }
      } else {
          ctx.font = '500 36px "Inter", sans-serif';
          ctx.fillStyle = isEvil ? '#770000' : '#6A6A6A';
          let noneText = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.none"]) || "Elementos: Ninguno";
          ctx.fillText(noneText, leftX, yPos);
      }
      yPos += 62;
      
      ctx.font = '700 34px "Inter", sans-serif';
      ctx.fillStyle = isEvil ? '#770000' : '#6A6A6A';
      const timeStr = ChannelTimer.formatTime(ChannelTimer.duration);
      const dateStr = new Date().toLocaleDateString(this.currentLang);
      let durPrefix = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.duration"]) || "Duración";
      let datePrefix = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.date"]) || "Fecha";
      ctx.fillText(`${durPrefix}: ${timeStr}   •   ${datePrefix}: ${dateStr}`, leftX, yPos);
      
      ctx.strokeStyle = isEvil ? '#660000' : '#2C2C28';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(170, 990);
      ctx.lineTo(170, yPos + 8);
      ctx.stroke();
      
      // 4. Explanation Text (Inter typography, respecting bold words)
      const explAlpha = isVideo ? Math.max(0, Math.min(1.0, (elapsed - 4.5) / 1.5)) : 1.0;
      ctx.globalAlpha = explAlpha;
      
      let explY = yPos + 90;
      const explText = Translations[this.currentLang]['success.sigil_explanation'] || "";
      const regularFont = '400 36px "Inter", sans-serif';
      const boldFont = '600 36px "Inter", sans-serif';
      ctx.fillStyle = isEvil ? '#770000' : '#2C2C28';
      
      const wrapTextJustified = (context, textStr, startX, startY, maxW, lineH) => {
          context.textAlign = 'left';
          const paragraphs = textStr.split('\n');
          
          for (const p of paragraphs) {
              if (p.trim() === '') {
                  startY += lineH;
                  continue;
              }
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
                  for (let w of subwords) {
                      if (w !== '') wordList.push({ text: w, bold: isBold });
                  }
              }
              
              let lines = [];
              let currentLine = [];
              let currentWidth = 0;
              context.font = regularFont;
              const spaceW = context.measureText(' ').width;
              
              for (let wObj of wordList) {
                  context.font = wObj.bold ? boldFont : regularFont;
                  let wordW = context.measureText(wObj.text).width;
                  if (currentLine.length > 0 && currentWidth + spaceW + wordW > maxW) {
                      lines.push(currentLine);
                      currentLine = [wObj];
                      currentWidth = wordW;
                  } else {
                      currentLine.push(wObj);
                      currentWidth += (currentLine.length === 1 ? 0 : spaceW) + wordW;
                  }
              }
              if (currentLine.length > 0) lines.push(currentLine);
              
              for (let i = 0; i < lines.length; i++) {
                  const lineWords = lines[i];
                  const isLastLine = (i === lines.length - 1 || lineWords.length === 1);
                  let currentX = startX;
                  
                  if (isLastLine) {
                      for (let wObj of lineWords) {
                          context.font = wObj.bold ? boldFont : regularFont;
                          context.fillText(wObj.text, currentX, startY);
                          currentX += context.measureText(wObj.text).width + spaceW;
                      }
                  } else {
                      let totalWordsWidth = 0;
                      for (let wObj of lineWords) {
                          context.font = wObj.bold ? boldFont : regularFont;
                          totalWordsWidth += context.measureText(wObj.text).width;
                      }
                      const spaceBetween = (maxW - totalWordsWidth) / (lineWords.length - 1);
                      for (let wObj of lineWords) {
                          context.font = wObj.bold ? boldFont : regularFont;
                          context.fillText(wObj.text, currentX, startY);
                          currentX += context.measureText(wObj.text).width + spaceBetween;
                      }
                  }
                  startY += lineH;
              }
          }
      };
      
      wrapTextJustified(ctx, explText, 120, explY, 840, 54);
      
      // 5. Bottom Call to Action and Store Badges
      const storeAlpha = isVideo ? Math.max(0, Math.min(1.0, (elapsed - 5.0) / 1.5)) : 1.0;
      ctx.globalAlpha = storeAlpha;
      
      ctx.font = '400 80px "Cormorant Garamond", serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = isEvil ? '#CC0000' : '#222222';
      ctx.fillText("Oris Numen", width / 2, 1750);
      
      const centerX = width / 2;
      const iconY = 1810;
      
      // Vertical separator line
      ctx.beginPath();
      ctx.moveTo(centerX, iconY - 5);
      ctx.lineTo(centerX, iconY + 53);
      ctx.strokeStyle = isEvil ? '#CC0000' : '#222222';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      const playStartX = centerX - 48 - 45; // 45px padding from center, 48px icon width
      const playStartY = iconY;
      ctx.save();
      ctx.translate(playStartX, playStartY);
      ctx.scale(0.8, 0.8);
      
      const drawPoly = (color, points) => {
          ctx.fillStyle = color;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(points[0][0], points[0][1]);
          for (let i = 1; i < points.length; i++) {
              ctx.lineTo(points[i][0], points[i][1]);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
      };
      
      drawPoly('#0057FF', [[2, 2], [2, 58], [36, 30]]);
      drawPoly('#00F076', [[2, 2], [36, 30], [45, 23], [4, 0]]);
      drawPoly('#FF3131', [[2, 58], [45, 37], [36, 30], [4, 60]]);
      drawPoly('#FFC900', [[45, 23], [58, 30], [45, 37], [36, 30]]);
      ctx.restore();
      
      const appleStartX = centerX + 45; // 45px padding from center
      const appleStartY = iconY;
      ctx.save();
      ctx.translate(appleStartX, appleStartY);
      ctx.scale(2.0, 2.0);
      ctx.fillStyle = isEvil ? '#990000' : '#111111';
      const applePath = new Path2D("M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z");
      ctx.fill(applePath);
      ctx.restore();
      
      ctx.globalAlpha = 1.0;
  },

  downloadSigilImage(text, freq, isEvil, activeElementsSet) {
      try {
          const canvas = document.createElement('canvas');
          canvas.width = 1080;
          canvas.height = 1920; // Vertical format
          const ctx = canvas.getContext('2d');
          
          this.renderSigilCanvas(ctx, text, freq, isEvil, activeElementsSet, null);
          
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

  showGuideCard() {
      const overlay = document.getElementById('guide-overlay');
      if (overlay) {
          overlay.classList.add('active');
          try { OrisAudio.playButtonSound(); } catch(e){}
          
          const modal = overlay.querySelector('.guide-modal');
          const indicator = document.getElementById('guide-scroll-indicator');
          if (modal && indicator) {
              setTimeout(() => {
                  if (modal.scrollHeight > modal.clientHeight + 10) {
                      indicator.style.opacity = '1';
                      modal.onscroll = () => {
                          if (modal.scrollTop + modal.clientHeight >= modal.scrollHeight - 20) {
                              indicator.style.opacity = '0';
                          } else {
                              indicator.style.opacity = '1';
                          }
                      };
                  } else {
                      indicator.style.display = 'none';
                  }
              }, 300);
          }
      }
  },

  closeGuideCard() {
      const overlay = document.getElementById('guide-overlay');
      if (overlay) {
          overlay.classList.remove('active');
          try { OrisAudio.playButtonSound(); } catch(e){}
      }
  },

  openEvolutionCard() {
      const overlay = document.getElementById('evolution-overlay');
      if (overlay) {
          overlay.classList.add('active');
          if (typeof this.closeSidebar === 'function') this.closeSidebar();
          try { OrisAudio.playButtonSound(); } catch(e){}
          
          let history = [];
          try { history = JSON.parse(localStorage.getItem('oris_history') || '[]'); } catch(e){}
          let totalChannelings = parseInt(localStorage.getItem('oris_total_channelings') || '0', 10);
          
          const t = Translations[this.currentLang] || Translations['en'];
          
          // Update total channelings
          const countDisplay = document.getElementById('nucleus-count-display');
          if (countDisplay) {
              countDisplay.textContent = totalChannelings;
          }
          
          // Calculate percentages for 4 frequencies
          let freqCounts = { humilis: 0, revelatio: 0, absolutio: 0, gratia: 0 };
          let maxCount = 0;
          let dominantFreq = null;
          let totalValid = 0;
          
          history.forEach(item => {
              if (item.type && freqCounts[item.type] !== undefined) {
                  freqCounts[item.type]++;
                  totalValid++;
                  if (freqCounts[item.type] > maxCount) {
                      maxCount = freqCounts[item.type];
                  }
              }
          });
          
          if (maxCount > 0) {
              let candidates = Object.keys(freqCounts).filter(k => freqCounts[k] === maxCount);
              dominantFreq = candidates[Math.floor(Math.random() * candidates.length)];
          }
          
          const numinosityState = document.getElementById('evolution-numinosity-state');
          const numinosityPercentage = document.getElementById('evolution-numinosity-percentage');
          
          if (numinosityState) {
              let stateKey = 'evolution.state.default';
              let stateColor = '#a09080';
              
              if (dominantFreq && this.FREQUENCIES && this.FREQUENCIES[dominantFreq]) {
                  stateKey = `evolution.state.${dominantFreq}`;
                  stateColor = this.FREQUENCIES[dominantFreq].color;
              }
              
              numinosityState.textContent = t[stateKey] || "Despertando";
              numinosityState.setAttribute('data-i18n', stateKey);
              numinosityState.style.color = stateColor;
              
              numinosityState.style.transition = 'none';
              numinosityState.style.opacity = '0';
              void numinosityState.offsetWidth;
              numinosityState.style.transition = 'opacity 1.5s ease';
              
              if (numinosityPercentage) {
                  if (dominantFreq && totalValid > 0) {
                      let percentage = Math.round((maxCount / totalValid) * 100);
                      numinosityPercentage.textContent = percentage + '%';
                      numinosityPercentage.style.color = stateColor;
                  } else {
                      numinosityPercentage.textContent = "";
                  }
              }

              const sunIcon = document.getElementById('numinosity-sun-icon');
              if (sunIcon) {
                  sunIcon.style.color = stateColor;
              }
          }
          
          // Update tabs active state (Icon and text color only)
          document.querySelectorAll('.breakdown-tab').forEach(tab => {
              tab.style.color = '#555';
              const svg = tab.querySelector('svg');
              if (svg) svg.style.stroke = 'currentColor';
              
              const f = tab.getAttribute('data-freq');
              if (f === dominantFreq && this.FREQUENCIES && this.FREQUENCIES[f]) {
                  const c = this.FREQUENCIES[f].color;
                  tab.style.color = c;
                  if (svg) svg.style.stroke = c;
              }
          });
          
          const canvas = document.getElementById('nucleus-canvas');
          if (canvas) {
              this.drawNucleusGraphic(canvas, freqCounts, totalValid);
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

  drawNucleusGraphic(canvas, freqCounts, total) {
      const ctx = canvas.getContext('2d');
      let start = performance.now();
      
      const targetRatios = {
          humilis: total > 0 ? (freqCounts.humilis / total) : 0,
          revelatio: total > 0 ? (freqCounts.revelatio / total) : 0,
          absolutio: total > 0 ? (freqCounts.absolutio / total) : 0,
          gratia: total > 0 ? (freqCounts.gratia / total) : 0
      };
      
      const draw = () => {
          const now = performance.now();
          const elapsed = (now - start) / 1000;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Use a slow 3.5s duration with a gentle 'easeOutBack' (overshoot and settle)
          const rawProgress = Math.min(elapsed / 3.5, 1);
          let animProgress = 1;
          if (rawProgress < 1) {
              const p = rawProgress - 1;
              animProgress = 1 + 2.70158 * Math.pow(p, 3) + 1.70158 * Math.pow(p, 2);
          }
          const numinosityState = document.getElementById('evolution-numinosity-state');
          if (numinosityState) {
              if (rawProgress >= 0.5) {
                  numinosityState.style.opacity = '1';
              } else {
                  numinosityState.style.opacity = '0';
              }
          }
          
          // Just draw the waves directly on the canvas. 
          // The SVG overlay in HTML perfectly handles the 'O' shape mask.
          Object.keys(targetRatios).forEach((freqKey, i) => {
              const target = targetRatios[freqKey];
              if (total === 0) return;
              
              const rawRatio = Math.max(target, freqCounts[freqKey] > 0 ? 0.05 : 0) * animProgress;
              const ratio = Math.min(rawRatio, 0.56 * animProgress);
              if (ratio <= 0) return;
              
              const fData = this.FREQUENCIES[freqKey];
              if (!fData) return;
              
              const waveHeight = canvas.height - (canvas.height * ratio);
              
              ctx.beginPath();
              ctx.moveTo(0, canvas.height);
              ctx.lineTo(0, waveHeight);
              
              for (let x = 0; x <= canvas.width; x += 10) {
                  const phase = elapsed * (1.2 + i * 0.2) + (i * 2.5);
                  const y = waveHeight + Math.sin(x * 0.04 + phase) * 6;
                  ctx.lineTo(x, y);
              }
              
              ctx.lineTo(canvas.width, canvas.height);
              ctx.closePath();
              
              ctx.fillStyle = fData.color;
              ctx.globalAlpha = 0.65;
              ctx.fill();
          });
          
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
                  if (e === 'aire') color = '#7CA982';
                  if (e === 'tierra') color = '#997A9E';
                  if (e === 'agua') color = '#7096AB';
                  if (e === 'fuego') color = '#CBA858';
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
              // Double-click guard to prevent race conditions on multi-taps
              if (el.dataset.deleting) return;
              el.dataset.deleting = 'true';

              try { OrisAudio.playDestructionSound(); } catch (e) {}
              
              // Absolute lock on height for smooth transition
              const startHeight = el.offsetHeight + 'px';
              el.style.minHeight = startHeight;
              el.style.maxHeight = startHeight;
              el.style.height = startHeight;
              // Do NOT set overflow: hidden yet, so the evaporating text doesn't get clipped as it floats up
              
              // Animate inner content so the outer container stays perfectly static
              Array.from(el.children).forEach(child => {
                  child.classList.add('dissolve-anim-fast');
              });
              
              // Wait for the dissolve animation (1.0s) + 0.4s empty hold = 1.4s (1400ms) before collapsing
              setTimeout(() => {
                  el.style.overflow = 'hidden';
                  el.style.transform = 'translateZ(0)'; // Force hardware acceleration
                  
                  requestAnimationFrame(() => {
                      el.style.transition = 'all 0.5s ease-in-out';
                      requestAnimationFrame(() => {
                          el.style.minHeight = '0px';
                          el.style.maxHeight = '0px';
                          el.style.height = '0px';
                          el.style.paddingTop = '0px';
                          el.style.paddingBottom = '0px';
                          el.style.borderBottomWidth = '0px';
                          el.style.opacity = '0';
                      });
                  });
              }, 1400);

              // After the collapse is done (1400ms + 550ms buffer), remove the element from DOM and state
              setTimeout(() => {
                  let history = JSON.parse(localStorage.getItem('oris_history') || '[]');
                  history = history.filter(item => item.id !== id);
                  localStorage.setItem('oris_history', JSON.stringify(history));
                  this.renderHistory();
              }, 1950);
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
          if (loadingContainer) {
              const loadingText = loadingContainer.querySelector('p');
              if (loadingText) {
                  loadingText.style.color = isEvil ? '#CC0000' : '#000000';
              }
          }
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
          
          this.renderSigilCanvas(ctx, text, freq, isEvil, activeElementsSet, elapsed);
          
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

,

    // --- Universe Feature ---
    initUniverseFeature() {
        const btnUniverseMessage = document.getElementById('btn-universe-message');
        const modalUniverse = document.getElementById('universe-modal-overlay');
        const btnCloseUniverseModal = document.getElementById('btn-close-universe-modal');
        const btnAcceptUniverse = document.getElementById('btn-accept-universe');
        const searchingContainer = document.getElementById('universe-searching-container');
        const receivedContainer = document.getElementById('universe-received-container');
        const searchingText = document.getElementById('universe-searching-text');
        const foundText = document.getElementById('universe-found-text');
        const btnUniverseClose = document.getElementById('btn-universe-close');
        
        if (btnUniverseMessage) {
            btnUniverseMessage.style.display = 'block'; // Make it visible when on success screen
            btnUniverseMessage.addEventListener('click', () => {
                const introContainer = document.getElementById('universe-intro-container');
                if (introContainer) {
                    introContainer.style.display = 'block';
                    introContainer.style.opacity = '1';
                }
                const receivedContainer = document.getElementById('universe-received-container');
                if (receivedContainer) {
                    receivedContainer.style.display = 'none';
                    receivedContainer.style.opacity = '0';
                }
                modalUniverse.classList.add('active');
            });
        }
        
        if (btnCloseUniverseModal) {
            btnCloseUniverseModal.addEventListener('click', () => {
                modalUniverse.classList.remove('active');
            });
        }
        
        const backdrop = modalUniverse ? modalUniverse.querySelector('.overlay-backdrop') : null;
        if (backdrop) {
            backdrop.addEventListener('click', () => {
                modalUniverse.classList.remove('active');
            });
        }
        
        if (btnAcceptUniverse) {
            btnAcceptUniverse.addEventListener('click', () => {
                if (!navigator.onLine) {
                    this.showWarning(this.getText('universe.no_internet') || "Se necesita conexión a internet.");
                    return;
                }
                const introContainer = document.getElementById('universe-intro-container');
                if (introContainer) {
                    introContainer.style.opacity = '0';
                    setTimeout(() => {
                        introContainer.style.display = 'none';
                        this.startUniverseSearch();
                    }, 300);
                } else {
                    this.startUniverseSearch();
                }
            });
        }
        
        if (btnUniverseClose) {
            btnUniverseClose.addEventListener('click', () => {
                receivedContainer.style.opacity = '0';
                setTimeout(() => {
                    receivedContainer.style.display = 'none';
                    modalUniverse.classList.remove('active');
                    if (btnUniverseMessage) btnUniverseMessage.style.display = 'none';
                }, 500);
            });
        }
    },
    
    startUniverseSearch() {
        const searchingContainer = document.getElementById('universe-searching-container');
        const searchingText = document.getElementById('universe-searching-text');
        const foundText = document.getElementById('universe-found-text');
        const counterText = document.getElementById('universe-searching-counter');
        const spinner = document.getElementById('universe-spinner');
        
        searchingContainer.style.display = 'flex';
        setTimeout(() => {
            searchingContainer.style.opacity = '1';
        }, 10);
        
        searchingText.style.display = 'block';
        searchingText.style.opacity = '1';
        foundText.style.display = 'none';
        foundText.style.opacity = '0';
        
        if (counterText) {
            counterText.style.display = 'block';
            counterText.textContent = '1s';
        }
        if (spinner) spinner.style.display = 'block';
        
        let seconds = 1;
        const intervalId = setInterval(() => {
            seconds++;
            if (counterText) counterText.textContent = seconds + 's';
        }, 1000);
        
        const randomSeconds = Math.floor(Math.random() * (37 - 5 + 1)) + 5;
        
        setTimeout(() => {
            clearInterval(intervalId);
            searchingText.style.opacity = '0';
            if (counterText) counterText.style.display = 'none';
            if (spinner) spinner.style.display = 'none';
            
            setTimeout(() => {
                searchingText.style.display = 'none';
                foundText.style.display = 'block';
                setTimeout(() => {
                    foundText.style.opacity = '1';
                }, 50);
                
                setTimeout(() => {
                    this.showUniverseMessage();
                }, 2000);
            }, 500);
        }, randomSeconds * 1000);
    },
    
    showUniverseMessage() {
        const searchingContainer = document.getElementById('universe-searching-container');
        const receivedContainer = document.getElementById('universe-received-container');
        const msgCountry = document.getElementById('universe-msg-country');
        const msgDetails = document.getElementById('universe-msg-details');
        const msgText = document.getElementById('universe-msg-text');
        
        if (!this.seenUniverseMessages) this.seenUniverseMessages = [];
        if (this.seenUniverseMessages.length >= universeMessages.length) {
            this.seenUniverseMessages = [];
        }

        // Select message
        let targetLang = this.currentLang;
        if (Math.random() > 0.30) {
            // Pick a random language that is NOT the current one (if possible) or just any random
            const langs = [...new Set(universeMessages.map(m => m.lang))];
            const otherLangs = langs.filter(l => l !== targetLang);
            if (otherLangs.length > 0) {
                targetLang = otherLangs[Math.floor(Math.random() * otherLangs.length)];
            }
        }
        
        let matchingMessages = universeMessages.filter(m => m.lang === targetLang && !this.seenUniverseMessages.includes(m));
        if (matchingMessages.length === 0) {
            // Fallback to any unseen message if no unseen messages for target language
            matchingMessages = universeMessages.filter(m => !this.seenUniverseMessages.includes(m));
        }
        
        const randomMsg = matchingMessages.length > 0 
            ? matchingMessages[Math.floor(Math.random() * matchingMessages.length)]
            : universeMessages[Math.floor(Math.random() * universeMessages.length)];
            
        this.seenUniverseMessages.push(randomMsg);
            
        // Populate
        msgCountry.textContent = randomMsg.country || 'Desconocido';
        msgText.textContent = randomMsg.text;
        
        // Details
        const now = new Date();
        const timeStr = `<strong>${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>`;
        const dateStr = `<strong>${now.toLocaleDateString([], { day: '2-digit', month: '2-digit' })}</strong>`;
        
        const getT = (key, fallback) => (Translations[this.currentLang] && Translations[this.currentLang][key]) || fallback;
        
        // Randomize frequency for the received message
        const freqKeys = ['humilis', 'revelatio', 'absolutio', 'gratia'];
        const randomFreqKey = freqKeys[Math.floor(Math.random() * freqKeys.length)];
        const freqObj = this.FREQUENCIES[randomFreqKey] || this.FREQUENCIES['humilis'];
        const freqName = freqObj.name;
        
        // Randomize elements (1 to 2 elements)
        const elKeys = ['aire', 'tierra', 'agua', 'fuego'];
        const randomElCount = Math.floor(Math.random() * 2) + 1;
        const shuffledEls = elKeys.sort(() => 0.5 - Math.random()).slice(0, randomElCount);
        const els = shuffledEls.map(e => getT('elements.' + e, e.charAt(0).toUpperCase() + e.slice(1)));
        
        let elStr = els.join(', ');
        
        msgDetails.innerHTML = `Color: ${freqName} <span style="color: ${freqObj.color}; font-weight: bold;">|</span> ${elStr} <span style="color: ${freqObj.color}; font-weight: bold;">|</span> ${timeStr} ${dateStr}`;
        msgText.style.color = freqObj.color;
        
        // Show
        searchingContainer.style.opacity = '0';
        setTimeout(() => {
            searchingContainer.style.display = 'none';
            receivedContainer.style.display = 'flex';
            setTimeout(() => {
                receivedContainer.style.opacity = '1';
            }, 50);
        }, 1000);
    }

};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => OrisApp.init());


