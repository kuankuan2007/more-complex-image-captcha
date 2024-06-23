export type ConfigObject = {
  /**
   * default: true
   * The length of the random string
   */
  size?: number;
  /**
   * width of captcha
   */
  width?: number;
  /**
   * height of captcha
   */
  height?: number;
  /**
   * captcha text size
   */
  fontSize?: number;
  /**
   * random character preset
   */
  charPreset?: string;
  /**
   * default: false
   * if false, captcha will be black and white
   * otherwise, it will be randomly colorized
   */
  color?: boolean;
  /**
   * default: false
   * if set to true, it will draw with light grey color
   * use if you have a site with dark theme
   * only active when color is set to false
   */
  inverse?: boolean;
  /**
   * default: ''
   * filter out some characters
   */
  ignoreChars?: string;
  /**
   * default: 1
   * number of noise lines
   */
  noise?: number;
  /**
   * default: white
   * background color of svg image
   */
  background?: string | Color;
  /**
   * default: +
   * the math operator to use, "+", "-" or "+/-"
   * if unknown operator passed defaults to "+/-"
   */
  mathOperator?: string;
  /**
   * default: 1
   * min value of the math expression
   */
  mathMin?: number;
  /**
   * default: 9
   * max value of the math expression
   */
  mathMax?: number;
  disturbance?: {
    move?: {
      x?: {
        min?: number;
        max?: number;
      };
      y?: {
        min?: number;
        max?: number;
      };
    };
    rotate?: {
      min?: number;
      max?: number;
    };
    scale?: {
      x?: {
        min?: number;
        max?: number;
      };
      y?: {
        min?: number;
        max?: number;
      };
    };
  };
  noiseWidth?: number;
  colorSimilarityLimit?: number;
  decimalPlaces?: number;
};
export type CaptchaOptions = BuildOption<ConfigObject>;

import chToPath from './chToPath.js';
import * as random from './random.js';
import * as optionMngr from './optionManager.js';
import Color from 'color';
import { XMLBuilder } from 'fast-xml-parser';
import sharp, { Sharp } from 'sharp';
const builder = new XMLBuilder({
  attributeNamePrefix: '@_',
  ignoreAttributes: false,
});

const opts = optionMngr.options;

const getLineNoise = function (width: number, height: number, options: CaptchaOptions) {
  const hasColor = options.color;
  const noiseLines: object[] = [];
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

const getText = function (text: string, width: number, height: number, options: CaptchaOptions) {
  const len = text.length;
  const spacing = (width - 2) / (len + 1);
  const min = options.inverse ? 10 : 0;
  const max = options.inverse ? 14 : 4;
  let i = -1;
  const out: object[] = [];

  while (++i < len) {
    const x = spacing * (i + 1);
    const y = height / 2;
    const charPath = chToPath(text[i], Object.assign({}, options, { x, y }));

    const color = options.color
      ? options.background
        ? random.colorFromBgs(
            options.background instanceof Color
              ? options.background
              : new Color(options.background),
            options.colorSimilarityLimit
          )
        : random.color()
      : random.greyColor(min, max);
    out.push({
      '@_fill': color.toString(),
      '@_d': charPath,
    });
  }

  return out;
};

const createCaptcha = function (text: string, options: CaptchaOptions) {
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
      rect: [bg ? { '@_width': '100%', '@_height': '100%', '@_fill': bg?.toString() } : void 0],
      path: [...getLineNoise(width, height, options), ...getText(text, width, height, options)],
    },
  };

  return builder.build(root);
};
function buildOption<T extends object>(options: T): BuildOption<T> {
  return Object.assign({}, opts, options);
}
type BuildOption<T> = T & typeof opts;
export function createSVG(options: ConfigObject): {
  text: string;
  data: string;
} {
  const builtOption = buildOption(options);
  const text = random.captchaText(builtOption);
  return { text, data: createCaptcha(text, builtOption) };
}

// Compatible with svg-captcha library
export const create = createSVG;

export function createImage(
  options: ConfigObject & {
    noisePoint?: {
      mean: number;
      sigma: number;
      enable: boolean;
    };
  }
) {
  const builtOption = buildOption(options);
  const text = random.captchaText(builtOption);
  let image = sharp(Buffer.from(createCaptcha(text, builtOption)))
    .resize(builtOption.width, builtOption.height)
    .png();

  if (builtOption.noisePoint?.enable) {
    image = noisePoint(image, builtOption);
  }
  return {
    text,
    image,
  };
}
function noisePoint(
  img: Sharp,
  option: BuildOption<
    ConfigObject & {
      noisePoint?: {
        mean?: number;
        sigma?: number;
        enable?: boolean;
      };
    }
  >
) {
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
            mean: option.noisePoint?.mean ?? 64,
            sigma: option.noisePoint?.sigma ?? 30,
          },
        },
      },
    },
  ]);
}
export function createMathExpr(options: CaptchaOptions) {
  const expr = random.mathExpr(options.mathMin, options.mathMax, options.mathOperator);
  const text = expr.text;
  const data = createCaptcha(expr.equation, options);
  return { text, data };
}

export const randomText = random.captchaText;
export const options = opts;
export const loadFont = optionMngr.loadFont;
