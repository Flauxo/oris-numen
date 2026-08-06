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
     */
    static draw(ctx, cx, cy, radius, text, color, isEvil = false, drawProgress = 1.0) {
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
        
        // Number of layers/rings of geometry - INCREASED for more complexity and overlapping
        const layers = 15 + Math.floor(random() * 12); 

        for (let l = 0; l < layers; l++) {
            const layerRadius = radius * (0.2 + (0.8 * random()));
            const shapeType = Math.floor(random() * 5);
            
            // Gruesos variables pero definidos
            const lineWidth = 3 + random() * 25;
            ctx.lineWidth = lineWidth;
            
            // Transparencia del 22% exacta
            ctx.globalAlpha = 0.22 * Math.min(1.0, drawProgress * 1.5);
            
            // For each symmetrical segment
            for (let s = 0; s < symmetry; s++) {
                const angle = (Math.PI * 2 / symmetry) * s;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(angle);
                
                ctx.beginPath();
                
                let pathLen = 100; // fallback
                const nextAngle = Math.PI * 2 / symmetry;
                
                if (shapeType === 0) {
                    // Circle segment
                    ctx.arc(0, 0, layerRadius, 0, nextAngle);
                    pathLen = layerRadius * nextAngle;
                } else if (shapeType === 1) {
                    // Polygon lines
                    ctx.moveTo(layerRadius, 0);
                    ctx.lineTo(Math.cos(nextAngle) * layerRadius, Math.sin(nextAngle) * layerRadius);
                    pathLen = 2 * layerRadius * Math.sin(nextAngle / 2);
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
                    // Approximate curve length
                    pathLen = layerRadius * 1.5; 
                } else if (shapeType === 3) {
                    // Inner star
                    ctx.moveTo(layerRadius * 0.5, 0);
                    ctx.lineTo(Math.cos(nextAngle/2) * layerRadius, Math.sin(nextAngle/2) * layerRadius);
                    ctx.lineTo(Math.cos(nextAngle) * layerRadius * 0.5, Math.sin(nextAngle) * layerRadius * 0.5);
                    const dx = Math.cos(nextAngle/2) * layerRadius - layerRadius * 0.5;
                    const dy = Math.sin(nextAngle/2) * layerRadius;
                    pathLen = 2 * Math.sqrt(dx * dx + dy * dy);
                } else {
                    // Dots / runes
                    const dotRadius = 1 + random() * 5;
                    ctx.arc(layerRadius, 0, dotRadius, 0, Math.PI * 2);
                    pathLen = 2 * Math.PI * dotRadius;
                    
                    if (drawProgress < 1.0) {
                        ctx.fill();
                    } else {
                        ctx.fill();
                    }
                    
                    if (isEvil) {
                        ctx.moveTo(layerRadius, -10);
                        ctx.lineTo(layerRadius, 10);
                        ctx.moveTo(layerRadius - 10, 0);
                        ctx.lineTo(layerRadius + 10, 0);
                        pathLen += 40;
                    }
                }
                
                if (drawProgress < 1.0) {
                    const len = pathLen; 
                    ctx.setLineDash([len, len]);
                    ctx.lineDashOffset = len * (1 - drawProgress);
                } else {
                    ctx.setLineDash([]);
                }
                
                                // Multi-stroke para efecto de grosor fluctuante dibujado a mano
                for (let i = 0; i < 3; i++) {
                    ctx.save();
                    ctx.lineWidth = lineWidth * (0.6 + random() * 0.8); // Variación de grosor
                    ctx.translate((random() - 0.5) * (lineWidth * 0.15), (random() - 0.5) * (lineWidth * 0.15)); // Ligero temblor proporcional al grosor
                    ctx.globalAlpha = 0.08 * Math.min(1.0, drawProgress * 1.5); // Opacidad distribuida para que sume ~22%
                    ctx.stroke();
                    ctx.restore();
                }
                ctx.restore();
            }
        }
        
        // Central core
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.arc(cx, cy, radius * 0.08, 0, Math.PI * 2);
        if (drawProgress > 0.5) {
            ctx.globalAlpha = 0.22 * Math.min(1.0, (drawProgress - 0.5) * 2);
            if (random() > 0.5) ctx.fill(); else ctx.stroke();
        }

        ctx.restore();
    }
}
