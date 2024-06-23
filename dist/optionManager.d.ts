import opentype from 'opentype.js';
declare const options: {
    width: number;
    height: number;
    noise: number;
    color: boolean;
    size: number;
    ignoreChars: string;
    fontSize: number;
    colorSimilarityLimit: number;
    decimalPlaces: number;
    noiseWidth: number;
    charPreset: string;
    font: opentype.Font;
    ascender: number;
    descender: number;
};
declare const loadFont: (filepath: string) => void;
export { options, loadFont };
