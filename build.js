import chokidar from 'chokidar';
import ts from 'typescript';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import path from 'path';
const { log } = console;

// -- UTILS -- //
const importRegex = /\bimport\s+(?:.+\s+from\s+)?[\'"]([^"\']+)["\']/g;

const time = (date = new Date) => {
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    let strTime = `${h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s} ${ampm}`;
    return strTime;
}

/**
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
};


// -- BUILD -- //
const build = async () => {
    const appRoot = 'app';
    const entry = path.join(appRoot, 'app.ts');
    const to = 'dist/app.js';

    try {
        let tsCode = readFileSync(entry, 'utf-8');
        let match;

        while ((match = importRegex.exec(tsCode)) !== null) {
            const fullImportPath = path.join(appRoot, match[1]);
            const importContents = readFileSync(fullImportPath, 'utf8');

            // Replace the import statement with the contents of the imported file
            tsCode = tsCode.replace(match[0], importContents);
        }

        const result = ts.transpileModule(tsCode, { compilerOptions: { module: ts.ModuleKind.CommonJS }});
        
        if (!existsSync('dist')) mkdirSync('dist');
        writeFileSync(to, result.outputText);
        
        log(`\n✅ [${time()}]: Build successful! from: "${entry}" to: "${to}" \n`);
    
    } catch (/** @type {any} */ error) {
        log(`\n❌ [${time()}]: Build failed!`)
        if (error?.errors?.[0]?.location) {
            const { file, line, column } = error.errors[0].location;
            log(`ERROR at [${file}:${line}:${column}]: "${error.errors[0].text}"`);
        } else {
            log('An error occurred during the build:\n\n', error);
        }
    }
};


// -- WATCH -- //
const watcher = chokidar.watch('app/**/*', {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });
  
  // On change, build the code
const debounceBuild = debounce(build, 350);
['add', 'change', 'unlink', 'ready']
    .forEach(event => watcher.on(event, debounceBuild));