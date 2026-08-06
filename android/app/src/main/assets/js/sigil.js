class SigilGenerator {
    static cache = {};

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

    static buildCache(cacheKey, text, isEvil) {
        const seed = this.hashString(text);
        const random = this.PRNG(seed);
        
        const symmetries = isEvil ? [5, 7, 9, 11] : [6, 8, 12, 16];
        const symmetry = symmetries[Math.floor(random() * symmetries.length)];
        const layers = 15 + Math.floor(random() * 12);
        
        const baseRadius = 300.0;
        const steps = 40;
        
        const layersData = [];
        let centerDotStroke = false;
        
        for (let l = 0; l < layers; l++) {
            const layerRadius = baseRadius * (0.2 + (0.8 * random()));
            const shapeType = Math.floor(random() * 5);
            
            const baseThickness = 4 + random() * 20;
            const thicknessRatio = (baseThickness - 4) / 20;
            const targetAlpha = 0.95 - thicknessRatio * (0.95 - 0.28);
            
            const thicknessPhase = random() * Math.PI * 2;
            const thicknessFreq = 1 + Math.floor(random() * 3);
            
            const symmetryData = [];
            
            for (let s = 0; s < symmetry; s++) {
                const angle = (Math.PI * 2 / symmetry) * s;
                const nextAngle = Math.PI * 2 / symmetry;
                
                if (shapeType < 4) {
                    // precompute all points
                    const fwdX = new Float32Array(steps + 1);
                    const fwdY = new Float32Array(steps + 1);
                    const bwdX = new Float32Array(steps + 1);
                    const bwdY = new Float32Array(steps + 1);
                    
                    for (let i = 0; i <= steps; i++) {
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
                        
                        fwdX[i] = pt.x + nx * width / 2;
                        fwdY[i] = pt.y + ny * width / 2;
                        bwdX[i] = pt.x - nx * width / 2;
                        bwdY[i] = pt.y - ny * width / 2;
                    }
                    symmetryData.push({ isDot: false, angle, fwdX, fwdY, bwdX, bwdY });
                } else {
                    const dotRadius = 1 + random() * 5;
                    symmetryData.push({ isDot: true, angle, dotRadius, layerRadius });
                }
            }
            layersData.push({ targetAlpha, shapeType, symmetryData });
        }
        
        centerDotStroke = random() > 0.5;
        
        this.cache[cacheKey] = { symmetry, layersData, centerDotStroke };
    }

    static draw(ctx, cx, cy, radius, text, color, isEvil = false, drawProgress = 1.0) {
        if (!text || text.trim() === '') text = 'OrisNumen';
        
        const cacheKey = text + "_" + isEvil;
        if (!this.cache[cacheKey]) {
            this.buildCache(cacheKey, text, isEvil);
        }
        
        const data = this.cache[cacheKey];
        const scaleFactor = radius / 300.0;

        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        
        ctx.translate(cx, cy);
        ctx.scale(scaleFactor, scaleFactor);

        const steps = 40;

        for (let l = 0; l < data.layersData.length; l++) {
            const layer = data.layersData[l];
            ctx.globalAlpha = layer.targetAlpha * Math.min(1.0, drawProgress * 1.5);
            
            for (let s = 0; s < layer.symmetryData.length; s++) {
                const sym = layer.symmetryData[s];
                
                ctx.save();
                ctx.rotate(sym.angle);
                
                if (!sym.isDot) {
                    const targetSteps = Math.max(1, Math.ceil(steps * drawProgress));
                    
                    ctx.beginPath();
                    
                    ctx.moveTo(sym.fwdX[0], sym.fwdY[0]);
                    for (let i = 1; i <= targetSteps; i++) {
                        ctx.lineTo(sym.fwdX[i], sym.fwdY[i]);
                    }
                    
                    for (let i = targetSteps; i >= 0; i--) {
                        ctx.lineTo(sym.bwdX[i], sym.bwdY[i]);
                    }
                    
                    ctx.closePath();
                    ctx.fill();
                    
                } else {
                    ctx.beginPath();
                    ctx.arc(sym.layerRadius, 0, sym.dotRadius, 0, Math.PI * 2 * drawProgress);
                    ctx.fill();
                }
                
                ctx.restore();
            }
        }

        // Center dot
        ctx.beginPath();
        ctx.arc(0, 0, 300.0 * 0.08, 0, Math.PI * 2);
        if (drawProgress > 0.5) {
            ctx.globalAlpha = 0.28 * Math.min(1.0, (drawProgress - 0.5) * 2);
            if (data.centerDotStroke) ctx.fill(); else ctx.stroke();
        }

        ctx.restore();
    }
}