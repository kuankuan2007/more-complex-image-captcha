'use strict';

import { Path, PathCommand } from 'opentype.js';
import * as random from './random.js';
import { CaptchaOptions } from '.';

import assert from 'assert';

function pointMapFactory(map: (point: { x: number; y: number }) => { x: number; y: number }) {
  return (cmd: PathCommand) => {
    if (cmd.type === 'M' || cmd.type === 'L') {
      const { x, y } = map({ x: cmd.x, y: cmd.y });
      cmd.x = x;
      cmd.y = y;
    } else if (cmd.type === 'Q' || cmd.type === 'C') {
      const { x, y } = map({ x: cmd.x, y: cmd.y });
      cmd.x = x;
      cmd.y = y;
      const { x: x1, y: y1 } = map({ x: cmd.x1, y: cmd.y1 });
      cmd.x1 = x1;
      cmd.y1 = y1;
    }
    return cmd;
  };
}
function interferencePath(
  path: Path,
  opts: CaptchaOptions & {
    x: number;
    y: number;
  }
) {
  // rotate
  const radians =
    (Math.PI / 180) *
    random.float(opts.disturbance?.rotate?.min ?? -90, opts.disturbance?.rotate?.max ?? 90);
  path.commands = path.commands.map(
    pointMapFactory(({ x, y }) => {
      let cosTheta = Math.cos(radians);
      let sinTheta = Math.sin(radians);
      let newX = cosTheta * (x - opts.x) + sinTheta * (y - opts.y) + opts.x;
      let newY = cosTheta * (y - opts.y) - sinTheta * (x - opts.x) + opts.y;
      return { x: newX, y: newY };
    })
  );
  //scale
  const scaleX = random.float(
    opts.disturbance?.scale?.x?.min ?? 0.6,
    opts.disturbance?.scale?.x?.max ?? 1
  );
  const scaleY = random.float(
    opts.disturbance?.scale?.y?.min ?? 0.6,
    opts.disturbance?.scale?.y?.max ?? 1
  );
  path.commands = path.commands.map(
    pointMapFactory(({ x, y }) => {
      return { x: (x - opts.x) * scaleX + opts.x, y: (y - opts.y) * scaleY + opts.y };
    })
  );
  //move
  const moveX = random.float(
    opts.disturbance?.move?.x?.min ?? -10,
    opts.disturbance?.move?.x?.max ?? 10
  );
  const moveY = random.float(
    opts.disturbance?.move?.y?.min ?? -5,
    opts.disturbance?.move?.y?.max ?? 5
  );
  path.commands = path.commands.map(
    pointMapFactory(({ x, y }) => {
      return { x: x + moveX, y: y + moveY };
    })
  );
}
export default function (
  text: string,
  opts: CaptchaOptions & {
    x: number;
    y: number;
  }
) {
  const ch = text[0];
  assert(ch, 'expect a string');

  const fontSize = opts.fontSize;
  const fontScale = fontSize / opts.font.unitsPerEm;

  const glyph = opts.font.charToGlyph(ch);
  const width = glyph.advanceWidth ? glyph.advanceWidth * fontScale : 0;
  const left = opts.x - width / 2;

  const height =
    (glyph.yMax && glyph.yMin ? glyph.yMax - glyph.yMin : opts.ascender + opts.descender) *
    fontScale;
  const top = opts.y + height / 2;
  const path = glyph.getPath(left, top, fontSize);
  interferencePath(path, opts);
  return path.toPathData(opts.decimalPlaces);
}
