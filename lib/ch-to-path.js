'use strict';
const assert = require('assert');

// function rndPathCmd(cmd) {
//   console.log(cmd);
//   const r = Math.random() * 0.2 - 0.1;
//   if (['M', 'L'].includes(cmd.type)) {
//     cmd.x += r;
//     cmd.y += r;
//   } else if (['Q', 'C'].includes(cmd.type)) {
//     cmd.x += r;
//     cmd.y += r;
//     cmd.x1 += r;
//     cmd.y1 += r;
//   }
//   return cmd;
// }

module.exports = function (text, opts) {
  const ch = text[0];
  assert(ch, 'expect a string');

  const fontSize = opts.fontSize;
  const fontScale = fontSize / opts.font.unitsPerEm;

  const glyph = opts.font.charToGlyph(ch);
  const width = glyph.advanceWidth ? glyph.advanceWidth * fontScale : 0;
  const left = opts.x - width / 2;
  console.log(glyph);
  const height = (glyph.yMax - glyph.yMin || opts.ascender + opts.descender) * fontScale;
  const top = opts.y + height / 2;
  const path = glyph.getPath(left, top, fontSize);

  const pathData = path.toPathData();

  return pathData;
};
