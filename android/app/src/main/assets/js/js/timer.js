const ChannelTimer = {
  duration: 15,        // 15 seconds for testing (change to 900 for production = 15 min)
  remaining: 15,
  intervalId: null,
  isRunning: false,
  startTime: null,
  
  onTick: null,
  onComplete: null,
  
  start(onTick, onComplete) {
    if (this.isRunning) return;
    
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.isRunning = true;
    
    if (!this.startTime) {
      this.startTime = Date.now();
    } else {
      // Adjust start time if we are resuming to account for elapsed time
      const elapsed = this.duration - this.remaining;
      this.startTime = Date.now() - (elapsed * 1000);
    }

    let lastSecond = -1;
    
    this.intervalId = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - this.startTime) / 1000);
      this.remaining = Math.max(0, this.duration - elapsedSeconds);
      
      if (this.remaining !== lastSecond) {
        lastSecond = this.remaining;
        
        if (this.onTick) {
          this.onTick(this.remaining, this.getProgress());
        }
        
        if (this.remaining <= 0) {
          this.stop();
          if (this.onComplete) {
            this.onComplete();
          }
        }
      }
    }, 100);
  },
  
  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },
  
  reset() {
    this.stop();
    // Random duration between 3:23 (203s) and 12:56 (776s)
    this.duration = Math.floor(Math.random() * (776 - 203 + 1)) + 203;
    this.remaining = this.duration;
    this.startTime = null;
    this.clearState();
  },
  
  fastForwardTo(seconds) {
      if (this.isRunning && this.remaining > seconds) {
          const now = Date.now();
          this.startTime = now - ((this.duration - seconds) * 1000);
          this.remaining = seconds;
      }
  },
  
  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  },
  
  getProgress() {
    return Math.max(0, Math.min(1, (this.duration - this.remaining) / this.duration));
  },
  
  saveState(frequencyType) {
    if (!this.isRunning) return;
    const state = {
      startTime: this.startTime,
      duration: this.duration,
      frequencyType: frequencyType
    };
    try {
      localStorage.setItem('oris_timer_state', JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save timer state', e);
    }
  },
  
  restoreState() {
    try {
      const saved = localStorage.getItem('oris_timer_state');
      if (saved) {
        const state = JSON.parse(saved);
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        
        if (elapsed < state.duration) {
          this.startTime = state.startTime;
          this.duration = state.duration;
          this.remaining = state.duration - elapsed;
          return state;
        } else {
          this.clearState();
        }
      }
    } catch (e) {
      console.warn('Failed to restore timer state', e);
    }
    return null;
  },
  
  clearState() {
    try {
      localStorage.removeItem('oris_timer_state');
    } catch (e) {
      // Ignore
    }
  }
};
