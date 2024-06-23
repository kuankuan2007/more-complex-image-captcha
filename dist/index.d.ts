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
import * as random from './random.js';
import Color from 'color';
import sharp from 'sharp';
declare const opts: {
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
    font: import("opentype.js").Font; /**
     * default: false
     * if set to true, it will draw with light grey color
     * use if you have a site with dark theme
     * only active when color is set to false
     */
    ascender: number;
    descender: number;
};
type BuildOption<T> = T & typeof opts;
export declare function createSVG(options: ConfigObject): {
    text: string;
    data: string;
};
export declare const create: typeof createSVG;
export declare function createImage(options: ConfigObject & {
    noisePoint?: {
        mean: number;
        sigma: number;
        enable: boolean;
    };
}): {
    text: string;
    image: sharp.Sharp;
};
export declare function createMathExpr(options: CaptchaOptions): {
    text: string;
    data: any;
};
export declare const randomText: typeof random.captchaText;
export declare const options: {
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
    font: import("opentype.js").Font; /**
     * default: false
     * if set to true, it will draw with light grey color
     * use if you have a site with dark theme
     * only active when color is set to false
     */
    ascender: number;
    descender: number;
};
export declare const loadFont: (filepath: string) => void;
export {};
