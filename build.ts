import esbuild from 'esbuild';
import ts from 'typescript';
import chokidar from 'chokidar';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import external from './external.json';
const { log } = console;

const bundleCode = async (): Promise<void> => {
  // to change the module type to CommonJS
  // the option
  const bundle = await esbuild.build({
    entryPoints: ['app/app.ts'],
    bundle: true,
    write: false,
    external: [...external as string[]],
    format: 'cjs'
    // other ESBuild options...
  });
  
  // to get the string of bundled code:
  const stringCode = bundle.outputFiles[0].text;
  const result = ts.transpileModule(stringCode, { compilerOptions: { module: ts.ModuleKind.None }});
  
  if (!existsSync('dist')) mkdirSync('dist');
  writeFileSync('dist/app.js', result.outputText);
}

// Set up Chokidar to watch your source files
const watcher = chokidar.watch('app/**/*', {
  // ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

// On change, bundle the code
['add', 'change', 'unlink'].forEach(event =>
    watcher.on(event, bundleCode));

watcher.on('ready', () => {
  bundleCode();
});
