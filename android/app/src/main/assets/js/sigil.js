class SigilGenerator {
    static hashString(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        return hash;
    }

    static PRNG(a) {
        return function() {
            var t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    static getShapePoint(type, t, layerRadius, nextAngle, isEvil, symmetry) {
        if (type === 0) { // Arc
            const a = t * nextAngle;
            return { x: layerRadius * Math.cos(a), y: layerRadius * Math.sin(a) };
        } else if (type === 1) { // Line
            return { 
                x: layerRadius + t * (Math.cos(nextAngle) * layerRadius - layerRadius),
                y: t * (Math.sin(nextAngle) * layerRadius)
            };
        } else if (type === 2) { // Quadratic Curve
            const cpAngle = isEvil ? (Math.PI / 4) : (Math.PI / symmetry);
            const cp = { x: Math.cos(cpAngle/2) * layerRadius * 1.5, y: Math.sin(cpAngle/2) * layerRadius * 1.5 };
            const end = { x: Math.cos(cpAngle) * layerRadius, y: Math.sin(cpAngle) * layerRadius };
            const u = 1 - t;
            return {
                x: u * u * 0 + 2 * u * t * cp.x + t * t * end.x,
                y: u * u * 0 + 2 * u * t * cp.y + t * t * end.y
            };
        } else if (type === 3) { // Star inner lines
            const mid = { x: Math.cos(nextAngle/2) * layerRadius, y: Math.sin(nextAngle/2) * layerRadius };
            const start = { x: layerRadius * 0.5, y: 0 };
            const end = { x: Math.cos(nextAngle) * layerRadius * 0.5, y: Math.sin(nextAngle) * layerRadius * 0.5 };
            if (t < 0.5) {
                const t2 = t * 2;
                return { x: start.x + t2 * (mid.x - start.x), y: start.y + t2 * (mid.y - start.y) };
            } else {
                const t2 = (t - 0.5) * 2;
                return { x: mid.x + t2 * (end.x - mid.x), y: mid.y + t2 * (end.y - mid.y) };
            }
        }
        return { x: 0, y: 0 };
    }

    static draw(ctx, cx, cy, radius, text, color, isEvil = false, drawProgress = 1.0) {
        if (!text || text.trim() === '') text = 'OrisNumen';
        
        const seed = this.hashString(text);
        const random = this.PRNG(seed);

        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;

        const symmetries = isEvil ? [5, 7, 9, 11] : [6, 8, 12, 16];
        const symmetry = symmetries[Math.floor(random() * symmetries.length)];
        const layers = 15 + Math.floor(random() * 12); 

        for (let l = 0; l < layers; l++) {
            const layerRadius = radius * (0.2 + (0.8 * random()));
            const shapeType = Math.floor(random() * 5);
            
            // Base thickness for this layer (4 to 24)
            const baseThickness = 4 + random() * 20;
            
            // Map thickness to alpha: thinner lines = higher opacity (up to 95%), thicker = 28%
            const thicknessRatio = (baseThickness - 4) / 20;
            const targetAlpha = 0.95 - thicknessRatio * (0.95 - 0.28);
            
            ctx.globalAlpha = targetAlpha * Math.min(1.0, drawProgress * 1.5);
            
            // Phase for the sine wave thickness to make it random per layer
            const thicknessPhase = random() * Math.PI * 2;
            const thicknessFreq = 1 + Math.floor(random() * 3);
            
            for (let s = 0; s < symmetry; s++) {
                const angle = (Math.PI * 2 / symmetry) * s;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(angle);
                
                const nextAngle = Math.PI * 2 / symmetry;
                
                if (shapeType < 4) {
                    const steps = 40;
                    const targetSteps = Math.max(1, Math.ceil(steps * drawProgress));
                    
                    ctx.beginPath();
                    
                    // Forward pass (positive normal offset)
                    for (let i = 0; i <= targetSteps; i++) {
                        const t = i / steps;
                        const pt = this.getShapePoint(shapeType, t, layerRadius, nextAngle, isEvil, symmetry);
                        
                        // Numeric derivative for normal vector
                        const ptNext = this.getShapePoint(shapeType, Math.min(1.0, t + 0.01), layerRadius, nextAngle, isEvil, symmetry);
                        const ptPrev = this.getShapePoint(shapeType, Math.max(0.0, t - 0.01), layerRadius, nextAngle, isEvil, symmetry);
                        
                        let dx = ptNext.x - ptPrev.x;
                        let dy = ptNext.y - ptPrev.y;
                        let len = Math.sqrt(dx*dx + dy*dy);
                        if (len === 0) len = 1;
                        let nx = -dy / len;
                        let ny = dx / len;
                        
                        // Fluctuating thickness along the path using sine wave
                        // Varies from 20% to 100% of baseThickness
                        const fluctuation = 0.6 + 0.4 * Math.sin(thicknessPhase + t * Math.PI * thicknessFreq);
                        const width = baseThickness * fluctuation;
                        
                        ctx.lineTo(pt.x + nx * width / 2, pt.y + ny * width / 2);
                    }
                    
                    // Backward pass (negative normal offset)
                    for (let i = targetSteps; i >= 0; i--) {
                        const t = i / steps;
                        const pt = this.getShapePoint(shapeType, t, layerRadius, nextAngle, isEvil, symmetry);
                        
                        const ptNext = this.getShapePoint(shapeType, Math.min(1.0, t + 0.01), layerRadius, nextAngle, isEvil, symmetry);
                        const ptPrev = this.getShapePoint(shapeType, Math.max(0.0, t - 0.01), layerRadius, nextAngle, isEvil, symmetry);
                        
                        let dx = ptNext.x - ptPrev.x;
                        let dy = ptNext.y - ptPrev.y;
                        let len = Math.sqrt(dx*dx + dy*dy);
                        if (len === 0) len = 1;
                        let nx = -dy / len;
                        let ny = dx / len;
                        
                        const fluctuation = 0.6 + 0.4 * Math.sin(thicknessPhase + t * Math.PI * thicknessFreq);
                        const width = baseThickness * fluctuation;
                        
                        ctx.lineTo(pt.x - nx * width / 2, pt.y - ny * width / 2);
                    }
                    
                    ctx.closePath();
                    ctx.fill();
                    
                } else {
                    // Dots / runes
                    const dotRadius = 1 + random() * 5;
                    ctx.beginPath();
                    ctx.arc(layerRadius, 0, dotRadius, 0, Math.PI * 2 * drawProgress);
                    ctx.fill();
                    
                    if (isEvil) {
                        ctx.beginPath();
                        ctx.lineWidth = baseThickness * 0.5;
                        const progLen = 10 * drawProgress;
                        ctx.moveTo(layerRadius, -progLen);
                        ctx.lineTo(layerRadius, progLen);
                        ctx.moveTo(layerRadius - progLen, 0);
                        ctx.lineTo(layerRadius + progLen, 0);
                        ctx.stroke();
                    }
                }
                
                ctx.restore();
            }
        }
        
        // Central core
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.arc(cx, cy, radius * 0.08, 0, Math.PI * 2);
        if (drawProgress > 0.5) {
            ctx.globalAlpha = 0.28 * Math.min(1.0, (drawProgress - 0.5) * 2);
            if (random() > 0.5) ctx.fill(); else ctx.stroke();
        }

        ctx.restore();
    }
}
