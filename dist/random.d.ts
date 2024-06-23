import { CaptchaOptions } from './index.js';
export { randomColor as color, randomColorFromBgs as colorFromBgs, randomGreyColor as greyColor, } from './colorControl.js';
export declare const int: (min: number, max: number) => number;
export declare const float: (min: number, max: number) => number;
export declare function captchaText(options: CaptchaOptions): string;
export declare function mathExpr(min?: number, max?: number, operator?: string): {
    equation: string;
    text: string;
};
