'use strict';
import * as random from './random.js';
import assert from 'assert';
function pointMapFactory(map) {
    return (cmd) => {
        if (cmd.type === 'M' || cmd.type === 'L') {
            const { x, y } = map({ x: cmd.x, y: cmd.y });
            cmd.x = x;
            cmd.y = y;
        }
        else if (cmd.type === 'Q' || cmd.type === 'C') {
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
function interferencePath(path, opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
    // rotate
    const radians = (Math.PI / 180) *
        random.float((_c = (_b = (_a = opts.disturbance) === null || _a === void 0 ? void 0 : _a.rotate) === null || _b === void 0 ? void 0 : _b.min) !== null && _c !== void 0 ? _c : -90, (_f = (_e = (_d = opts.disturbance) === null || _d === void 0 ? void 0 : _d.rotate) === null || _e === void 0 ? void 0 : _e.max) !== null && _f !== void 0 ? _f : 90);
    path.commands = path.commands.map(pointMapFactory(({ x, y }) => {
        let cosTheta = Math.cos(radians);
        let sinTheta = Math.sin(radians);
        let newX = cosTheta * (x - opts.x) + sinTheta * (y - opts.y) + opts.x;
        let newY = cosTheta * (y - opts.y) - sinTheta * (x - opts.x) + opts.y;
        return { x: newX, y: newY };
    }));
    //scale
    const scaleX = random.float((_k = (_j = (_h = (_g = opts.disturbance) === null || _g === void 0 ? void 0 : _g.scale) === null || _h === void 0 ? void 0 : _h.x) === null || _j === void 0 ? void 0 : _j.min) !== null && _k !== void 0 ? _k : 0.6, (_p = (_o = (_m = (_l = opts.disturbance) === null || _l === void 0 ? void 0 : _l.scale) === null || _m === void 0 ? void 0 : _m.x) === null || _o === void 0 ? void 0 : _o.max) !== null && _p !== void 0 ? _p : 1);
    const scaleY = random.float((_t = (_s = (_r = (_q = opts.disturbance) === null || _q === void 0 ? void 0 : _q.scale) === null || _r === void 0 ? void 0 : _r.y) === null || _s === void 0 ? void 0 : _s.min) !== null && _t !== void 0 ? _t : 0.6, (_x = (_w = (_v = (_u = opts.disturbance) === null || _u === void 0 ? void 0 : _u.scale) === null || _v === void 0 ? void 0 : _v.y) === null || _w === void 0 ? void 0 : _w.max) !== null && _x !== void 0 ? _x : 1);
    path.commands = path.commands.map(pointMapFactory(({ x, y }) => {
        return { x: (x - opts.x) * scaleX + opts.x, y: (y - opts.y) * scaleY + opts.y };
    }));
    //move
    const moveX = random.float((_1 = (_0 = (_z = (_y = opts.disturbance) === null || _y === void 0 ? void 0 : _y.move) === null || _z === void 0 ? void 0 : _z.x) === null || _0 === void 0 ? void 0 : _0.min) !== null && _1 !== void 0 ? _1 : -10, (_5 = (_4 = (_3 = (_2 = opts.disturbance) === null || _2 === void 0 ? void 0 : _2.move) === null || _3 === void 0 ? void 0 : _3.x) === null || _4 === void 0 ? void 0 : _4.max) !== null && _5 !== void 0 ? _5 : 10);
    const moveY = random.float((_9 = (_8 = (_7 = (_6 = opts.disturbance) === null || _6 === void 0 ? void 0 : _6.move) === null || _7 === void 0 ? void 0 : _7.y) === null || _8 === void 0 ? void 0 : _8.min) !== null && _9 !== void 0 ? _9 : -5, (_13 = (_12 = (_11 = (_10 = opts.disturbance) === null || _10 === void 0 ? void 0 : _10.move) === null || _11 === void 0 ? void 0 : _11.y) === null || _12 === void 0 ? void 0 : _12.max) !== null && _13 !== void 0 ? _13 : 5);
    path.commands = path.commands.map(pointMapFactory(({ x, y }) => {
        return { x: x + moveX, y: y + moveY };
    }));
}
export default function (text, opts) {
    const ch = text[0];
    assert(ch, 'expect a string');
    const fontSize = opts.fontSize;
    const fontScale = fontSize / opts.font.unitsPerEm;
    const glyph = opts.font.charToGlyph(ch);
    const width = glyph.advanceWidth ? glyph.advanceWidth * fontScale : 0;
    const left = opts.x - width / 2;
    const height = (glyph.yMax && glyph.yMin ? glyph.yMax - glyph.yMin : opts.ascender + opts.descender) *
        fontScale;
    const top = opts.y + height / 2;
    const path = glyph.getPath(left, top, fontSize);
    interferencePath(path, opts);
    return path.toPathData(opts.decimalPlaces);
}
//# sourceMappingURL=chToPath.js.map