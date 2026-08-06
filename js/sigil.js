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

    // Evaluate cubic bezier curve at t (0 to 1)
    static getBezier(t, p0, p1, p2, p3) {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;
        
        let x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
        let y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
        
        // Derivative (tangent)
        let dx = 3 * uu * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * tt * (p3.x - p2.x);
        let dy = 3 * uu * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * tt * (p3.y - p2.y);
        
        // Normalize tangent
        let len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) len = 1;
        
        // Normal vector (perpendicular)
        let nx = -dy / len;
        let ny = dx / len;
        
        return { x, y, nx, ny };
    }

    /**
     * Draws a sigil onto the provided canvas context
     */
    static draw(ctx, cx, cy, radius, text, color, isEvil = false, drawProgress = 1.0) {
        if (!text || text.trim() === '') text = 'OrisNumen';
        
        const seed = this.hashString(text);
        const random = this.PRNG(seed);

        ctx.save();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;

        // Base symmetry (organic forms)
        const symmetries = isEvil ? [3, 5, 7] : [4, 5, 6, 8];
        const symmetry = symmetries[Math.floor(random() * symmetries.length)];
        
        // Number of layers of waves/ribbons (more layers, higher transparency)
        const layers = 10 + Math.floor(random() * 15); 

        // To make it look like watercolor/soft ribbons, we use composite operations
        // and very low alpha.
        ctx.globalCompositeOperation = isEvil ? 'source-over' : 'multiply'; // or 'screen' if background is dark, but success screen has bg-card. 
        // We'll stick to 'source-over' but very transparent to be safe on all backgrounds.
        ctx.globalCompositeOperation = 'source-over';

        for (let l = 0; l < layers; l++) {
            const layerRadius = radius * (0.2 + (0.8 * random()));
            
            // Generate random control points for a cubic bezier ribbon
            const p0 = { x: 0, y: 0 };
            
            // We want organic shapes that flow.
            const angleOffset1 = random() * Math.PI * 2;
            const dist1 = random() * layerRadius * 1.5;
            const p1 = { x: Math.cos(angleOffset1) * dist1, y: Math.sin(angleOffset1) * dist1 };
            
            const angleOffset2 = random() * Math.PI * 2;
            const dist2 = random() * layerRadius * 1.5;
            const p2 = { x: Math.cos(angleOffset2) * dist2, y: Math.sin(angleOffset2) * dist2 };
            
            // End point usually on the symmetry circle
            const endAngle = (Math.PI * 2 / symmetry) * (random() > 0.5 ? 1 : 0.5);
            const p3 = { x: Math.cos(endAngle) * layerRadius, y: Math.sin(endAngle) * layerRadius };
            
            // Thickness properties
            const maxThickness = 15 + random() * 45; // Very thick ribbons
            // Transparency (much more transparent!)
            const alpha = 0.03 + random() * 0.08; 
            
            ctx.globalAlpha = alpha;

            // Generate the ribbon polygon
            const steps = 60;
            const targetSteps = Math.max(1, Math.ceil(steps * drawProgress));

            for (let s = 0; s < symmetry; s++) {
                const angle = (Math.PI * 2 / symmetry) * s;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(angle);
                
                ctx.beginPath();
                
                // Forward pass (positive normal offset)
                for (let i = 0; i <= targetSteps; i++) {
                    const t = i / steps;
                    const pt = this.getBezier(t, p0, p1, p2, p3);
                    // Thickness profile: starts at 0, peaks in middle, ends at 0 (or small)
                    const thickness = Math.sin(t * Math.PI) * maxThickness;
                    
                    const ox = pt.x + pt.nx * thickness / 2;
                    const oy = pt.y + pt.ny * thickness / 2;
                    
                    if (i === 0) ctx.moveTo(ox, oy);
                    else ctx.lineTo(ox, oy);
                }
                
                // Backward pass (negative normal offset)
                for (let i = targetSteps; i >= 0; i--) {
                    const t = i / steps;
                    const pt = this.getBezier(t, p0, p1, p2, p3);
                    const thickness = Math.sin(t * Math.PI) * maxThickness;
                    
                    const ox = pt.x - pt.nx * thickness / 2;
                    const oy = pt.y - pt.ny * thickness / 2;
                    
                    ctx.lineTo(ox, oy);
                }
                
                ctx.closePath();
                ctx.fill();
                
                // Draw a 100% opaque, thin, homogeneous core line down the center
                // We use globalAlpha to animate it in, but it peaks at 1.0 (100% opaque)
                ctx.globalAlpha = Math.min(1.0, drawProgress * 1.5); 
                ctx.lineWidth = 1 + random() * 1.5; // Fine, homogeneous line
                
                ctx.beginPath();
                for (let i = 0; i <= targetSteps; i++) {
                    const t = i / steps;
                    const pt = this.getBezier(t, p0, p1, p2, p3);
                    if (i === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                }
                ctx.stroke();
                
                // Restore transparency for the next operations
                ctx.globalAlpha = alpha;
                
                ctx.restore();
            }
        }
        
        // Central core (soft glowing orb)
        if (drawProgress > 0) {
            ctx.save();
            ctx.translate(cx, cy);
            
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.15 * drawProgress);
            // Convert hex color to rgba for the gradient
            // We'll just use a hack since color might be var() or hex. 
            // We just use globalAlpha instead.
            ctx.globalAlpha = 0.1 * drawProgress;
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.15 * drawProgress, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = 0.2 * drawProgress;
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.05 * drawProgress, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }

        ctx.restore();
    }
}
