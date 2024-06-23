import { CaptchaOptions } from '.';
export default function (text: string, opts: CaptchaOptions & {
    x: number;
    y: number;
}): string;
