import Color from 'color';
export declare function randomColorFromBgs(bgColor: Color, similarityLimit: number): Color<`rgb(${number}, ${number}, ${number})`>;
export declare function randomColor(): Color<`rgb(${number}, ${number}, ${number})`>;
export declare function getColorSimilarity(color1: Color, color2: Color): number;
export declare function randomGreyColor(min?: number, max?: number): Color<`#${string}${string}${string}`>;
