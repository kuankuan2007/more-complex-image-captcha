# more-complex-image-captcha

> 在 node.js 中生成图片验证码

## 关于[svg-captcha](https://www.npmjs.com/package/svg-captcha)

本项目是 fork 该项目的代码，并在其基础上进行了扩展和优化。用于生成更复杂的图片验证码。

## Translations

[English](README.md)

### 特点单个字符的随机旋转、缩放、移动

- 内部使用[sharp](https://www.npmjs.com/package/sharp)格式化为 png
- 支持在 png 的基础上增加高斯早点
- 支持单独设置干扰线条的粗细
- 更精细化的颜色管理(使用[color](https://www.npmjs.com/package/color)库)
- 全项目使用 Typescript 开发，方便维护扩展
- 使用[fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser)解析 svg 字符串，摆脱单纯的字符串拼接

## 安装

```bash
npm i @kuankuan/more-complex-image-captcha
```

## 使用方法

### 兼容 `svg-captcha`

```js
var svgCaptcha = require('svg-captcha');

var c = svgCaptcha.create(); //create方法是createSVG方法的别名，之所以有这个方法是为了兼容svg-captcha
console.log(c);
// {data: '<svg.../svg>', text: 'abcd'}
```

### sharp 接口

```js
var svgCaptcha = require('svg-captcha');

var c = svgCaptcha.createImage();
console.log(c);
// {data: '<svg.../svg>', text: 'abcd'}
```

## API

### `svgCaptcha.create(options)`

`@kuankuan/more-complex-image-captcha`在原 `svg-captcha`基础上进行了扩展。

#### more-complex-image-captcha 新增

```ts
type option = {
  ...// svg-captcha 的其他参数
  noiseWidth?: number;// 干扰线宽度
  decimalPlaces: number;// svg路径的精确位数
  colorSimilarityLimit？: number;// 颜色相似度的限制值(0-1.1)
  disturbance?: {
    move?: {
      x?: {
        min?: number; // default -10
        max?: number; // default 10
      };
      y?: {
        min?: number; // default -5
        max?: number; // default 5
      };
    };
    rotate?: {
      min?: number; // default -90
      max?: number; // default 90
    };
    scale?: {
      x?: {
        min?: number; // default 0.6
        max?: number; // default 1
      };
      y?: {
        min?: number; // default 0.6
        max?: number; // default 1
      };
    };
  };
};
```

#### 兼容 svg-captcha

如果没有任何参数，则生成的 svg 图片有 4 个字符。

- `size`: 4 // 验证码长度
- `ignoreChars`: '0o1i' // 验证码字符中排除 0o1i
- `noise`: 1 // 干扰线条的数量
- `color`: true // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
- `background`: '#cc9966'/`Color`对象 // 验证码图片背景颜色

该函数返回的对象拥有以下属性

- `data`: string // svg 路径
- `text`: string // 验证码文字

### `svgCaptcha.createImage(options)`

在 `svgCaptcha.create`的参数上新增了了一个

```ts
type Option = {
  ...// 其他参数
  noisePoint?: {
    mean?: number;
    sigma?: number;
    enable?: boolean;
  };
};
```

该函数返回的对象拥有以下属性

- `image`: sharp // sharp 对象，是一个 ReadableStream
- `text`: string // 验证码文字

### `svgCaptcha.createMathExpr(options)`

和前面的 api 的参数和返回值都一样。不同的是这个 api 生成的 svg 是一个算数式，而
text 属性上是算数式的结果。不过用法和之前是完全一样的。

### `svgCaptcha.loadFont(url)`

加载字体，覆盖内置的字体。

- `url`: string // 字体文件存放路径
  该接口会调用 opentype.js 同名的接口。
  你可能需要更改一些配置才能让你得字体好看。
  详见下面的这个接口：

### `svgCaptcha.options`

这是全局配置对象。
create 和 createMathExpr 接口的默认配置就是使用的这个对象。

除了 size, noise, color, 和 background 之外，你还可以修改以下属性：

- `width`: number // width of captcha
- `height`: number // height of captcha
- `fontSize`: number // captcha text size
- `charPreset`: string // random character preset

### `svgCaptcha.randomText([size|options])`

返回随机字符串

### `svgCaptcha(text, options)`

返回基于 text 参数生成得 svg 路径
在 1.1.0 版本之前你需要调用上面的两个接口，但是现在只需要调用 create()
一个接口就行，可以少打几个字了 (^\_^)/

## License

[MIT](LICENSE.md)
