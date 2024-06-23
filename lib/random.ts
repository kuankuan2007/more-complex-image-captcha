'use strict';
import { CaptchaOptions } from './index.js';
export {
  randomColor as color,
  randomColorFromBgs as colorFromBgs,
  randomGreyColor as greyColor,
} from './colorControl.js';

const randomInt = function (min: number, max: number) {
  return Math.floor(randomFloat(min, max));
};
const randomFloat = function (min: number, max: number) {
  return min + Math.random() * (max - min);
};

const stripCharsFromString = function (string: string, chars: string) {
  return string.split('').filter((char) => chars.indexOf(char) === -1);
};

export const int = randomInt;
export const float = randomFloat;

export function captchaText(options: CaptchaOptions) {
  const size = options.size;
  const ignoreChars = options.ignoreChars;
  let i = -1;
  let out = '';
  let chars: string | string[] = options.charPreset;

  if (ignoreChars) {
    chars = stripCharsFromString(chars, ignoreChars);
  }

  const len = chars.length - 1;

  while (++i < size) {
    out += chars[randomInt(0, len)];
  }

  return out;
}

const mathExprPlus = function (leftNumber: number, rightNumber: number) {
  const text = (leftNumber + rightNumber).toString();
  const equation = leftNumber + '+' + rightNumber;
  return { text, equation };
};

const mathExprMinus = function (leftNumber: number, rightNumber: number) {
  const text = (leftNumber - rightNumber).toString();
  const equation = leftNumber + '-' + rightNumber;
  return { text, equation };
};

export function mathExpr(
  min: number = 1,
  max: number = 9,
  operator: string = '+'
): { equation: string; text: string } {
  const left = randomInt(min, max);
  const right = randomInt(min, max);
  if (operator === '+') {
    return mathExprPlus(left, right);
  } else if (operator === '-') {
    return mathExprMinus(left, right);
  } else {
    return randomInt(1, 2) % 2 ? mathExprPlus(left, right) : mathExprMinus(left, right);
  }
}
