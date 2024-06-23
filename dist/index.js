import chToPath from './chToPath.js';
import * as random from './random.js';
import * as optionMngr from './optionManager.js';
import Color from 'color';
import { XMLBuilder } from 'fast-xml-parser';
import sharp from 'sharp';
const builder = new XMLBuilder({
    attributeNamePrefix: '@_',
    ignoreAttributes: false,
});
const opts = optionMngr.options;
const getLineNoise = function (width, height, options) {
    const hasColor = options.color;
    const noiseLines = [];
    const min = options.inverse ? 7 : 1;
    const max = options.inverse ? 15 : 9;
    let i = -1;
    while (++i < options.noise) {
        const start = `${random.int(1, 21)} ${random.int(1, height - 1)}`;
        const end = `${random.int(width - 21, width - 1)} ${random.int(1, height - 1)}`;
        const mid1 = `${random.int(width / 2 - 21, width / 2 + 21)} ${random.int(1, height - 1)}`;
        const mid2 = `${random.int(width / 2 - 21, width / 2 + 21)} ${random.int(1, height - 1)}`;
        const color = hasColor ? random.color() : random.greyColor(min, max);
        noiseLines.push({
            '@_d': `M${start} C${mid1},${mid2},${end}`,
            '@_stroke': color.toString(),
            '@_stroke-width': options.noiseWidth,
            '@_stroke-cap': 'round',
            '@_fill': 'none',
        });
    }
    return noiseLines;
};
const getText = function (text, width, height, options) {
    const len = text.length;
    const spacing = (width - 2) / (len + 1);
    const min = options.inverse ? 10 : 0;
    const max = options.inverse ? 14 : 4;
    let i = -1;
    const out = [];
    while (++i < len) {
        const x = spacing * (i + 1);
        const y = height / 2;
        const charPath = chToPath(text[i], Object.assign({}, options, { x, y }));
        const color = options.color
            ? options.background
                ? random.colorFromBgs(options.background instanceof Color
                    ? options.background
                    : new Color(options.background), options.colorSimilarityLimit)
                : random.color()
            : random.greyColor(min, max);
        out.push({
            '@_fill': color.toString(),
            '@_d': charPath,
        });
    }
    return out;
};
const createCaptcha = function (text, options) {
    const width = options.width;
    const height = options.height;
    const bg = options.background ? new Color(options.background) : void 0;
    if (bg) {
        options.color = true;
    }
    const root = {
        svg: {
            '@_xmlns': 'http://www.w3.org/2000/svg',
            '@_width': width,
            '@_height': height,
            '@_viewBox': `0,0,${width},${height}`,
            rect: [bg ? { '@_width': '100%', '@_height': '100%', '@_fill': bg === null || bg === void 0 ? void 0 : bg.toString() } : void 0],
            path: [...getLineNoise(width, height, options), ...getText(text, width, height, options)],
        },
    };
    return builder.build(root);
};
function buildOption(options) {
    return Object.assign({}, opts, options);
}
export function createSVG(options) {
    const builtOption = buildOption(options);
    const text = random.captchaText(builtOption);
    return { text, data: createCaptcha(text, builtOption) };
}
// Compatible with svg-captcha library
export const create = createSVG;
export function createImage(options) {
    var _a;
    const builtOption = buildOption(options);
    const text = random.captchaText(builtOption);
    let image = sharp(Buffer.from(createCaptcha(text, builtOption)))
        .resize(builtOption.width, builtOption.height)
        .png();
    if ((_a = builtOption.noisePoint) === null || _a === void 0 ? void 0 : _a.enable) {
        image = noisePoint(image, builtOption);
    }
    return {
        text,
        image,
    };
}
function noisePoint(img, option) {
    var _a, _b, _c, _d;
    return img.composite([
        {
            input: {
                create: {
                    width: option.width,
                    height: option.height,
                    channels: 4,
                    background: { r: 0, g: 0, b: 0, alpha: 0 },
                    noise: {
                        type: 'gaussian',
                        mean: (_b = (_a = option.noisePoint) === null || _a === void 0 ? void 0 : _a.mean) !== null && _b !== void 0 ? _b : 64,
                        sigma: (_d = (_c = option.noisePoint) === null || _c === void 0 ? void 0 : _c.sigma) !== null && _d !== void 0 ? _d : 30,
                    },
                },
            },
        },
    ]);
}
export function createMathExpr(options) {
    const expr = random.mathExpr(options.mathMin, options.mathMax, options.mathOperator);
    const text = expr.text;
    const data = createCaptcha(expr.equation, options);
    return { text, data };
}
export const randomText = random.captchaText;
export const options = opts;
export const loadFont = optionMngr.loadFont;
//# sourceMappingURL=index.js.map