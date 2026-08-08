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
        this.isStarting = false;
    }

    async start() {
        if (this.isListening || this.isStarting) return true;
        this.isStarting = true;
        
        const getUserMedia = (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) 
            ? navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)
            : (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia)
                ? (constraints) => new Promise((resolve, reject) => {
                    const fn = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                    fn.call(navigator, constraints, resolve, reject);
                  })
                : null;
                
        if (!getUserMedia) {
            console.error("getUserMedia no está soportado");
            return false;
        }

        try {
            this.stream = await getUserMedia({ audio: true, video: false });
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.5; // Fast response
            
            this.microphone = this.audioContext.createMediaStreamSource(this.stream);
            this.microphone.connect(this.analyser);
            
            this.isListening = true;
            this.isStarting = false;
            this.monitor();
            console.log("Noise detector started.");
            return true;
        } catch (err) {
            this.isStarting = false;
            console.error("Error accessing microphone for noise detection:", err);
            alert("Error de micrófono: " + err.message);
            return false;
        }
    }

    monitor() {
        if (!this.isListening) return;
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        let count = 0;
        // Ignorar las frecuencias más bajas (primeros bins) que capturan zumbidos eléctricos o ruido estático constante
        for (let i = 4; i < dataArray.length; i++) {
            sum += dataArray[i];
            count++;
        }
        this.currentVolume = count > 0 ? (sum / count) : 0;
        
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
     */
    isNoisy() {
        if (!this.isListening) {
            return false;
        }
        console.log("Current noise average:", this.currentVolume);
        // Ahora usamos la media sin el ruido eléctrico. 40 es un umbral razonable para ruido alto
        // Se ha incrementado a 95 para permitir un poco más de ruido ambiental.
        return this.currentVolume > 60;
    }
}

window.OrisNoiseDetector = new NoiseDetector();
