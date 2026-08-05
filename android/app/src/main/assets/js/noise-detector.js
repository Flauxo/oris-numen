/**
 * Ambient Noise Detector
 * Monitors microphone input to enforce silence during channeling.
 */
class NoiseDetector {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.stream = null;
        this.isListening = false;
        this.currentVolume = 0;
        this.animationId = null;
    }

    async start() {
        if (this.isListening) return true;
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.5; // Fast response
            
            this.microphone = this.audioContext.createMediaStreamSource(this.stream);
            this.microphone.connect(this.analyser);
            
            this.isListening = true;
            this.monitor();
            console.log("Noise detector started.");
            return true;
        } catch (err) {
            console.error("Error accessing microphone for noise detection:", err);
            return false;
        }
    }

    monitor() {
        if (!this.isListening) return;
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        this.currentVolume = sum / dataArray.length; // Average amplitude 0-255
        
        this.animationId = requestAnimationFrame(() => this.monitor());
    }

    stop() {
        this.isListening = false;
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.microphone) this.microphone.disconnect();
        if (this.analyser) this.analyser.disconnect();
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        this.stream = null;
        this.audioContext = null;
    }

    /**
     * Returns true if environment is too noisy.
     * Threshold is very strict to ensure absolute silence.
     */
    isNoisy() {
        if (!this.isListening) return false;
        console.log("Current noise volume:", this.currentVolume);
        return this.currentVolume > 5;
    }
}

const OrisNoiseDetector = new NoiseDetector();
