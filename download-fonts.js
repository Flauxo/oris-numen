const fs = require('fs');
const https = require('https');
const path = require('path');

const cssUrl = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap";
const fontsDir = path.join(__dirname, 'fonts');
const cssPath = path.join(__dirname, 'css', 'fonts.css');

if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
}

https.get(cssUrl, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
    }
}, (res) => {
    let cssData = '';
    res.on('data', chunk => cssData += chunk);
    res.on('end', () => {
        const urlRegex = /url\((https:\/\/[^)]+)\)/g;
        let match;
        let fontCounter = 0;
        let newCssData = cssData;
        
        const downloads = [];

        while ((match = urlRegex.exec(cssData)) !== null) {
            const fontUrl = match[1];
            const ext = path.extname(new URL(fontUrl).pathname) || '.woff2';
            const fontName = `font_${fontCounter++}${ext}`;
            const fontPath = path.join(fontsDir, fontName);
            
            // Replace url in CSS
            newCssData = newCssData.replace(fontUrl, `../fonts/${fontName}`);
            
            downloads.push(new Promise((resolve, reject) => {
                https.get(fontUrl, (fontRes) => {
                    const fileStream = fs.createWriteStream(fontPath);
                    fontRes.pipe(fileStream);
                    fileStream.on('finish', () => {
                        fileStream.close();
                        resolve();
                    });
                }).on('error', reject);
            }));
        }
        
        fs.writeFileSync(cssPath, newCssData);
        
        Promise.all(downloads).then(() => {
            console.log("Fonts downloaded successfully.");
        }).catch(err => {
            console.error("Error downloading fonts:", err);
        });
    });
}).on('error', err => {
    console.error("Error fetching CSS:", err);
});
