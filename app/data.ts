export const clr = {
    wht: [1, 1, 1],
    blc: [0, 0, 0],
    red: [1, 0, 0],
    grn: [0, 1, 0],
    blu: [0, 0, 1],
    ylw: [1, 1, 0],
    mgt: [1, 0, 1],
    cyn: [0, 1, 1]
};

export const theme = g.theme.dark ? {
    "fg": clr.wht, // White foreground
    "bg": clr.blc, // Black background
    "fg2": clr.blu, // Blue for secondary elements
    "bg2": clr.blc, // Black background for secondary elements
    "fgH": clr.red, // Red for highlights
    "bgH": clr.blc, // Black background for highlights
    "dark": true
} : {
    "fg": clr.blc, // Black foreground
    "bg": clr.wht, // White background
    "fg2": clr.grn, // Green for secondary elements
    "bg2": clr.wht, // White background for secondary elements
    "fgH": clr.red, // Red for highlights
    "bgH": clr.wht, // White background for highlights
    "dark": false
};