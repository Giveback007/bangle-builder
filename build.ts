import esbuild from 'esbuild';
import ts from 'typescript';
import chokidar from 'chokidar';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import external from './external.json';
const { log } = console;

function debounce<F extends (...args: any[]) => void>(func: F, wait: number) {
  let timeout: number;
  return function executedFunction(...args: Parameters<F>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait) as any;
  };
};

const build = async (): Promise<void> => {
  try {
    const bundle = await esbuild.build({
      entryPoints: ['app/app.ts'],
      bundle: true,
      write: false,
      external: [...external as string[]],
      format: 'cjs'
      // other ESBuild options...
    });
    
    const stringCode = bundle.outputFiles[0].text;
    const result = ts.transpileModule(stringCode, { compilerOptions: { module: ts.ModuleKind.None }});
    
    if (!existsSync('dist')) mkdirSync('dist');
    writeFileSync('dist/app.js', result.outputText);
  } catch (error: any) {
    if (error.errors && error.errors[0] && error.errors[0].location) {
      const { file, line, column } = error.errors[0].location;
      log(`An error occurred in file ${file} at line ${line}, column ${column}: ${error.errors[0].text}`);
    } else {
      log('\n\n\nAn error occurred during the build:\n\n', error);
    }
  }
}

// Set up Chokidar to watch your source files
const watcher = chokidar.watch('app/**/*', {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

// On change, build the code
const debounceBuild = debounce(build, 300);
['add', 'change', 'unlink', 'ready']
  .forEach(event => watcher.on(event, debounceBuild));
