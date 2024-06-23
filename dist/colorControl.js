import Color from 'color';
import * as random from './random.js';
export function randomColorFromBgs(bgColor, similarityLimit) {
    const target = randomColor();
    if (getColorSimilarity(bgColor, target) < similarityLimit) {
        return randomColorFromBgs(bgColor, similarityLimit);
    }
    return target;
}
export function randomColor() {
    return new Color(`rgb(${random.int(0, 255)}, ${random.int(0, 255)}, ${random.int(0, 255)})`);
}
export function getColorSimilarity(color1, color2) {
    const dL = (color1.l() - color2.l()) / 100;
    const dA = (color1.a() - color2.a()) / 256;
    const dB = (color1.b() - color2.b()) / 256;
    return Math.sqrt(dL * dL + dA * dA + dB * dB);
}
export function randomGreyColor(min = 1, max = 9) {
    const int = random.int(min, max).toString(16);
    return new Color(`#${int}${int}${int}`);
}
//# sourceMappingURL=colorControl.js.map