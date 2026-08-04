class SigilGenerator {
    // Generate a hash from string (djb2 algorithm)
    static hashString(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i); // hash * 33 + c
        }
        return hash;
    }

    // Simple PRNG (Mulberry32)
    static PRNG(a) {
        return function() {
            var t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    /**
     * Draws a sigil onto the provided canvas context
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} cx Center X
     * @param {number} cy Center Y
     * @param {number} radius Max radius of the sigil
     * @param {string} text Text to base the sigil on
     * @param {string} color Color of the lines
     * @param {boolean} isEvil Whether to use chaotic/sharp shapes
     */
    static draw(ctx, cx, cy, radius, text, color, isEvil = false) {
        if (!text || text.trim() === '') text = 'OrisNumen';
        
        const seed = this.hashString(text);
        const random = this.PRNG(seed);

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        // Base symmetry
        const symmetries = isEvil ? [5, 7, 9, 11] : [6, 8, 12, 16];
        const symmetry = symmetries[Math.floor(random() * symmetries.length)];
        
        // Number of layers/rings of geometry
        const layers = 5 + Math.floor(random() * 6); 

        for (let l = 0; l < layers; l++) {
            const layerRadius = radius * (0.2 + (0.8 * random()));
            const shapeType = Math.floor(random() * 5);
            const lineWidth = 3 + random() * 4;
            
            ctx.lineWidth = lineWidth;
            
            // For each symmetrical segment
            for (let s = 0; s < symmetry; s++) {
                const angle = (Math.PI * 2 / symmetry) * s;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(angle);
                
                ctx.beginPath();
                
                if (shapeType === 0) {
                    // Circle segment
                    ctx.arc(0, 0, layerRadius, 0, Math.PI * 2 / symmetry);
                } else if (shapeType === 1) {
                    // Polygon lines
                    const nextAngle = Math.PI * 2 / symmetry;
                    ctx.moveTo(layerRadius, 0);
                    ctx.lineTo(Math.cos(nextAngle) * layerRadius, Math.sin(nextAngle) * layerRadius);
                } else if (shapeType === 2) {
                    // Curves / petals
                    ctx.moveTo(0, 0);
                    const cpAngle = isEvil ? (Math.PI / 4) : (Math.PI / symmetry);
                    ctx.quadraticCurveTo(
                        Math.cos(cpAngle/2) * layerRadius * 1.5,
                        Math.sin(cpAngle/2) * layerRadius * 1.5,
                        Math.cos(cpAngle) * layerRadius,
                        Math.sin(cpAngle) * layerRadius
                    );
                } else if (shapeType === 3) {
                    // Inner star
                    ctx.moveTo(layerRadius * 0.5, 0);
                    const nextAngle = Math.PI * 2 / symmetry;
                    ctx.lineTo(Math.cos(nextAngle/2) * layerRadius, Math.sin(nextAngle/2) * layerRadius);
                    ctx.lineTo(Math.cos(nextAngle) * layerRadius * 0.5, Math.sin(nextAngle) * layerRadius * 0.5);
                } else {
                    // Dots / runes
                    const dotRadius = 1 + random() * 2;
                    ctx.arc(layerRadius, 0, dotRadius, 0, Math.PI * 2);
                    ctx.fill();
                    if (isEvil) {
                        ctx.moveTo(layerRadius, -10);
                        ctx.lineTo(layerRadius, 10);
                        ctx.moveTo(layerRadius - 10, 0);
                        ctx.lineTo(layerRadius + 10, 0);
                    }
                }
                
                ctx.stroke();
                ctx.restore();
            }
        }
        
        // Central core
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.arc(cx, cy, radius * 0.08, 0, Math.PI * 2);
        if (random() > 0.5) ctx.fill(); else ctx.stroke();

        ctx.restore();
    }
}
