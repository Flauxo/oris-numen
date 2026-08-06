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
     * @param {number} drawProgress 0.0 to 1.0 for animation
     */
    static draw(ctx, cx, cy, radius, text, color, isEvil = false, drawProgress = 1.0) {
        if (!text || text.trim() === '') text = 'OrisNumen';
        
        const seed = this.hashString(text);
        const random = this.PRNG(seed);

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Parse the color to use with opacity
        // The color passed is usually a hex like #FF0000 or similar
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        // Base symmetry (organic forms often look great with 4, 6, or 8)
        const symmetries = isEvil ? [3, 5, 7, 9] : [4, 6, 8, 12];
        const symmetry = symmetries[Math.floor(random() * symmetries.length)];
        
        // Number of layers of waves/curves
        const layers = 8 + Math.floor(random() * 12); 

        for (let l = 0; l < layers; l++) {
            const layerRadius = radius * (0.2 + (0.8 * random()));
            const shapeType = Math.floor(random() * 5);
            
            // Thicker, transparent lines for organic overlapping effect
            const lineWidth = 4 + random() * 20;
            ctx.lineWidth = lineWidth;
            
            // Random transparency for each layer to create depth
            const alpha = 0.15 + random() * 0.4;
            
            // We use globalAlpha for the transparency overlapping
            ctx.globalAlpha = alpha;

            for (let s = 0; s < symmetry; s++) {
                const angle = (Math.PI * 2 / symmetry) * s;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(angle);
                
                ctx.beginPath();
                
                // Generous path length for lineDash animation of bezier curves
                let pathLen = layerRadius * 4; 
                const nextAngle = Math.PI * 2 / symmetry;
                
                // Generate random control points
                const cp1x = (random() - 0.5) * layerRadius * 2;
                const cp1y = (random() - 0.5) * layerRadius * 2;
                const cp2x = (random() - 0.5) * layerRadius * 2;
                const cp2y = (random() - 0.5) * layerRadius * 2;
                
                const endX = Math.cos(nextAngle) * layerRadius;
                const endY = Math.sin(nextAngle) * layerRadius;

                if (shapeType === 0) {
                    // S-Curve / Wave
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
                } else if (shapeType === 1) {
                    // Arching wave bridging adjacent points
                    ctx.moveTo(layerRadius, 0);
                    ctx.bezierCurveTo(
                        layerRadius + cp1x * 0.5, cp1y * 0.5,
                        endX + cp2x * 0.5, endY + cp2y * 0.5,
                        endX, endY
                    );
                } else if (shapeType === 2) {
                    // Leaf/Tear drop from center
                    ctx.moveTo(0, 0);
                    ctx.quadraticCurveTo(cp1x, layerRadius, endX, endY);
                } else if (shapeType === 3) {
                    // Swirl towards center
                    ctx.moveTo(layerRadius, 0);
                    ctx.bezierCurveTo(
                        layerRadius * 0.5, layerRadius * 0.5,
                        -layerRadius * 0.5, layerRadius * 0.5,
                        0, 0
                    );
                } else {
                    // Continuous overlapping loops (spirograph vibe)
                    ctx.moveTo(layerRadius * 0.5, 0);
                    ctx.bezierCurveTo(
                        layerRadius * 1.5, layerRadius * 0.8,
                        -layerRadius * 0.5, layerRadius * 0.8,
                        Math.cos(nextAngle) * layerRadius * 0.5, 
                        Math.sin(nextAngle) * layerRadius * 0.5
                    );
                }
                
                if (drawProgress < 1.0) {
                    // Multiply alpha by progress so it fades in while drawing
                    ctx.globalAlpha = alpha * Math.min(1.0, drawProgress * 1.5);
                    ctx.setLineDash([pathLen, pathLen]);
                    ctx.lineDashOffset = pathLen * (1 - drawProgress);
                } else {
                    ctx.setLineDash([]);
                }
                
                ctx.stroke();
                ctx.restore();
            }
        }
        
        // Central core spiral or dot
        ctx.globalAlpha = Math.min(1.0, drawProgress * 2);
        ctx.lineWidth = 2 + random() * 4;
        ctx.beginPath();
        const coreType = Math.floor(random() * 3);
        if (coreType === 0) {
            // Spiral
            for (let i = 0; i < 40 * drawProgress; i++) {
                const r = (radius * 0.15 * i) / 40;
                const a = i * 0.3;
                if (i === 0) ctx.moveTo(cx, cy);
                else ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
            }
            ctx.stroke();
        } else {
            // Concentric glowing rings
            for(let i=0; i<3; i++) {
                ctx.beginPath();
                ctx.arc(cx, cy, (radius * 0.05) + (i * radius * 0.03), 0, Math.PI * 2 * drawProgress);
                ctx.stroke();
            }
        }

        ctx.restore();
    }
}
