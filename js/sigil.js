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

    static draw(ctx, cx, cy, radius, text, color, isEvil = false, drawProgress = 1.0) {
        if (!text || text.trim() === '') text = 'OrisNumen';
        
        const seed = this.hashString(text);
        const random = this.PRNG(seed);

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        // 1. Background Halo (very soft, blurry aura)
        if (drawProgress > 0) {
            ctx.save();
            ctx.globalAlpha = 0.05 * Math.min(1.0, drawProgress * 2);
            ctx.translate(cx, cy);
            const numAuras = 5;
            for (let i = 0; i < numAuras; i++) {
                ctx.beginPath();
                ctx.arc(0, 0, radius * (0.5 + i * 0.1), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // Base symmetry
        const symmetries = isEvil ? [3, 5, 7] : [4, 6, 8];
        const symmetry = symmetries[Math.floor(random() * symmetries.length)];
        
        // We will generate multiple "bundles" of waves/curves.
        const numBundles = 6 + Math.floor(random() * 8); 

        // Use multiply or source-over for overlapping translucent lines
        ctx.globalCompositeOperation = 'source-over';

        for (let b = 0; b < numBundles; b++) {
            const bundleRadius = radius * (0.3 + (0.6 * random()));
            
            // Base control points for the bundle
            const angleOffset1 = random() * Math.PI * 2;
            const dist1 = random() * bundleRadius * 1.5;
            const p1 = { x: Math.cos(angleOffset1) * dist1, y: Math.sin(angleOffset1) * dist1 };
            
            const angleOffset2 = random() * Math.PI * 2;
            const dist2 = random() * bundleRadius * 1.5;
            const p2 = { x: Math.cos(angleOffset2) * dist2, y: Math.sin(angleOffset2) * dist2 };
            
            const endAngle = (Math.PI * 2 / symmetry) * (random() > 0.5 ? 1.0 : 0.5);
            const p3 = { x: Math.cos(endAngle) * bundleRadius, y: Math.sin(endAngle) * bundleRadius };
            
            // Number of strands in this bundle
            const numStrands = 3 + Math.floor(random() * 6);
            
            // Base thickness for this bundle
            const baseThickness = 8 + random() * 16;
            
            for (let s = 0; s < symmetry; s++) {
                const angle = (Math.PI * 2 / symmetry) * s;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(angle);
                
                // Draw strands
                for (let strand = 0; strand < numStrands; strand++) {
                    ctx.beginPath();
                    
                    // Offset for this strand
                    const offsetX = (strand - numStrands/2) * (baseThickness * 0.4);
                    const offsetY = (strand - numStrands/2) * (baseThickness * 0.4);
                    
                    ctx.moveTo(offsetX * 0.2, offsetY * 0.2);
                    ctx.bezierCurveTo(
                        p1.x + offsetX, p1.y + offsetY,
                        p2.x + offsetX, p2.y + offsetY,
                        p3.x + offsetX * 0.2, p3.y + offsetY * 0.2
                    );
                    
                    // Strand properties
                    ctx.lineWidth = baseThickness * (0.8 + random() * 0.4);
                    // High transparency to allow stacking
                    ctx.globalAlpha = (0.05 + random() * 0.05) * Math.min(1.0, drawProgress * 1.5);
                    
                    if (drawProgress < 1.0) {
                        const pathLen = bundleRadius * 3; 
                        ctx.setLineDash([pathLen, pathLen]);
                        ctx.lineDashOffset = pathLen * (1 - drawProgress);
                    } else {
                        ctx.setLineDash([]);
                    }
                    
                    ctx.stroke();
                }
                ctx.restore();
            }
        }
        
        // Central Spiral Core
        ctx.save();
        ctx.translate(cx, cy);
        ctx.globalAlpha = 0.15 * Math.min(1.0, drawProgress * 1.5);
        ctx.lineWidth = 10;
        ctx.beginPath();
        const spiralRot = random() * Math.PI * 2;
        ctx.rotate(spiralRot);
        for (let i = 0; i < 60 * drawProgress; i++) {
            const r = (radius * 0.15 * i) / 60;
            const a = i * 0.25;
            if (i === 0) ctx.moveTo(0, 0);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.stroke();
        
        // A sharper thinner line inside the spiral for definition
        ctx.globalAlpha = 0.4 * Math.min(1.0, drawProgress * 1.5);
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        ctx.restore();
    }
}
