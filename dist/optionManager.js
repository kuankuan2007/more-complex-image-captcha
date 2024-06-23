import path from 'node:path';
import opentype from 'opentype.js';
import charPreset from './charPreset.js';
console.log(path);
const fontPath = './fonts/Comismsh.ttf';
const font = opentype.loadSync(fontPath);
const ascender = font.ascender;
const descender = font.descender;
const options = {
    width: 150,
    height: 50,
    noise: 1,
    color: false,
    size: 4,
    ignoreChars: '',
    fontSize: 56,
    colorSimilarityLimit: 0.5,
    decimalPlaces: 2,
    noiseWidth: 1.5,
    charPreset,
    font,
    ascender,
    descender,
};
const loadFont = (filepath) => {
    const font = opentype.loadSync(filepath);
    options.font = font;
    options.ascender = font.ascender;
    options.descender = font.descender;
};
export { options, loadFont };
//# sourceMappingURL=optionManager.js.map