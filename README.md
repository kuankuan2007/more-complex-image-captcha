# more-complex-image-captcha

> Generating image captchas in Node.js

## About [svg-captcha](https://www.npmjs.com/package/svg-captcha)

This project forks the code from svg-captcha and extends and optimizes it to generate more complex image captchas.

## Translations

- [中文简体](README_CN.md)

### Features

- Random rotation, scaling, and movement for individual characters
- Utilizes [sharp](https://www.npmjs.com/package/sharp) for PNG formatting
- Adds Gaussian noise on top of PNGs
- Customizable thickness for noise lines
- Fine-grained color management using the [color](https://www.npmjs.com/package/color) library
- Developed entirely in TypeScript for easy maintenance and extension
- Parses SVG strings using [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser), moving beyond simple string concatenation

## Installation

```bash
npm i @kuankuan/more-complex-image-captcha
```

## Usage

### Compatible with `svg-captcha`

```js
const svgCaptcha = require('@kuankuan/more-complex-image-captcha');

const captcha = svgCaptcha.create(); // The create method is an alias for createSVG, kept for compatibility with svg-captcha
console.log(captcha);
// {data: '<svg.../svg>', text: 'abcd'}
```

### Sharp Interface

```js
const svgCaptcha = require('@kuankuan/more-complex-image-captcha');

const captchaImage = svgCaptcha.createImage();
console.log(captchaImage);
// {image: sharp(ReadableStream), text: 'abcd'}
```

## API

### `svgCaptcha.create(options)`

Extends the original `svg-captcha` with additional features.

#### New in more-complex-image-captcha

```ts
type Options = {
  ... // Other svg-captcha parameters
  noiseWidth?: number; // Width of noise lines
  decimalPlaces?: number; // Precision of SVG path coordinates
  colorSimilarityLimit?: number; // Limit for color similarity (0-1.1)
  disturbance?: {
    move?: {
      x?: {min?: number; max?: number}; // Defaults: -10, 10
      y?: {min?: number; max?: number}; // Defaults: -5, 5
    };
    rotate?: {min?: number; max?: number}; // Defaults: -90, 90
    scale?: {
      x?: {min?: number; max?: number}; // Defaults: 0.6, 1
      y?: {min?: number; max?: number}; // Defaults: 0.6, 1
    };
  };
};
```

#### Compatibility with svg-captcha

If no options are provided, the SVG image will have 4 characters by default.

- `size`: 4 // Length of captcha
- `ignoreChars`: '0o1i' // Excluded characters in captcha
- `noise`: 1 // Number of 干扰 lines
- `color`: true // Whether captcha characters have color; defaults to no color unless a background is set
- `background`: '#cc9966' or Color object // Background color of captcha image

The returned object has the following properties:

- `data`: string // SVG path data
- `text`: string // Captcha text

### `svgCaptcha.createImage(options)`

Adds an extra parameter to svgCaptcha.create:

```ts
type ImageOptions = {
  ... // Other parameters
  noisePoint?: {
    mean?: number;
    sigma?: number;
    enable?: boolean;
  };
};
```

The returned object includes:

- `image`: sharp (ReadableStream) // sharp object for image manipulation
- `text`: string // Captcha text

#### `svgCaptcha.createMathExpr(options)`

Similar to create api, you have the above options plus 3 additional:

- `mathMin`: 1 // the minimum value the math expression can be
- `mathMax`: 9 // the maximum value the math expression can be
- `mathOperator`: + // The operator to use, `+`, `-` or `+-` (for random `+` or `-`)

This function returns an object that has the following property:

- `data`: string // svg of the math expression
- `text`: string // the answer of the math expression

#### `svgCaptcha.loadFont(url)`

Load your own font and override the default font.

- `url`: string // path to your font This api is a wrapper around loadFont api of opentype.js.
  Your may need experiment around various options to make your own font accessible.
  See the following api.

#### `svgCaptcha.options`

Gain access to global setting object. It is used for create and createMathExpr api as the default options.

In addition to size, noise, color, and background, you can also set the following property:

- `width`: number // width of captcha
- `height`: number // height of captcha
- `fontSize`: number // captcha text size
- `charPreset`: string // random character preset

#### `svgCaptcha.randomText([size|options])`

return a random string.

#### `svgCaptcha(text, options)`

return a svg captcha based on text provided.

In pre 1.1.0 version you have to call these two functions,
now you can call create() to save some key strokes ;).

## License

[MIT](https://github.com/steambap/svg-captcha/blob/HEAD/LICENSE.md)
