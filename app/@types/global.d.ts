declare var g: Graphics & {
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

declare var bangle: Bangle;
declare var WIDGETS: Widgets;