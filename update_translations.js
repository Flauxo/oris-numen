const fs = require('fs');
const path = './js/translations.js';
let content = fs.readFileSync(path, 'utf8');

// Replacements for modal_text1
content = content.replace(/("universe\.modal_text1":\s*")([^"]+)(")/g, function(match, p1, p2, p3) {
    if (p2.includes('Aceptas enviar')) return p1 + p2 + ' Por favor, este mensaje guárdalo en tu interior y no lo compartas.' + p3;
    if (p2.includes('You agree')) return p1 + p2 + ' Please, keep this message inside you and do not share it.' + p3;
    if (p2.includes('Accetti di')) return p1 + p2 + ' Per favore, conserva questo messaggio dentro di te e non condividerlo.' + p3;
    if (p2.includes('Assentiris')) return p1 + p2 + ' Quaeso, hunc nuntium intus custodi nec eum communica.' + p3;
    if (p2.includes('您同意')) return p1 + p2 + ' 请将这条信息保存在您内心，不要分享。' + p3;
    return match;
});

// Replacements for found
content = content.replace(/"universe\.found":\s*"Found"/g, '"universe.found": "Message found"');
content = content.replace(/"universe\.found":\s*"Encontrado"/g, '"universe.found": "Mensaje encontrado"');
content = content.replace(/"universe\.found":\s*"Trovato"/g, '"universe.found": "Messaggio trovato"');
content = content.replace(/"universe\.found":\s*"Inventus"/g, '"universe.found": "Nuntius inventus"');
content = content.replace(/"universe\.found":\s*"已找到"/g, '"universe.found": "找到信息"');
content = content.replace(/"universe\.found":\s*"找到"/g, '"universe.found": "找到信息"');

fs.writeFileSync(path, content, 'utf8');
