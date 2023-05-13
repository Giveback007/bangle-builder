declare var g: Graphics & {
    setFontAlign(alignX: number, alignY: number): void;
    setFont(font: string, size: number): void;
    flip(): void;
    theme: {
        /** foreground colour */
        fg: number,
        /** background colour */
        bg: number,
        /** accented foreground colour */
        fg2: number,
        /** accented background colour */
        bg2: number,
        /** highlighted foreground colour */
        fgH: number,
        /** highlighted background colour */
        bgH: number,
        /** Is background dark (e.g. foreground should be a light colour) */
        dark: boolean,
    }
};

namespace E {
    export function showScroller(options: {
      h: number,
      c: number,
      draw: (idx: number, rect: { x: number, y: number, w: number, h: number }) => void,
      select: (idx: number, touch: { x: number, y: number }) => void,
      back?: () => void,
      remove?: () => void,
    }): void;
}

declare var bangle: Bangle;
declare var WIDGETS: Widgets;
