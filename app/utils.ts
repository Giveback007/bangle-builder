
export function debounce(func: Function, wait: number) {
    let timeoutId: number;
    return function() {
      const args = arguments;
      clearTimeout(timeoutId || 0);
      timeoutId = setTimeout(function() {
        // @ts-ignore
        func.apply(this, args);
      }, wait) as any;
    };
}

export function decp(x: string) {
  return require("heatshrink").decompress(atob(x));
}
