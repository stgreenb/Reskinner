import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve as pathResolve } from 'path';
import { fileURLToPath } from 'url';

// Get package.json version as single source of truth
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagePath = pathResolve(__dirname, 'package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const MODULE_VERSION = packageJson.version;

export default [
  {
    input: 'src/module.js',
    output: {
      file: 'ds-reskinner.mjs',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      // Inject version from package.json during build
      {
        name: 'inject-version',
        transform(code) {
          return code.replace(/const MODULE_VERSION = '[^']*';/, `const MODULE_VERSION = '${MODULE_VERSION}';`);
        }
      },
      // Update module.json version from package.json
      {
        name: 'update-module-version',
        generateBundle() {
          const moduleJsonPath = pathResolve(__dirname, 'module.json');
          const moduleJson = JSON.parse(readFileSync(moduleJsonPath, 'utf8'));
          moduleJson.version = MODULE_VERSION;
          writeFileSync(moduleJsonPath, JSON.stringify(moduleJson, null, 2));
          console.log(`[update-module-version] Updated module.json to version ${MODULE_VERSION}`);
        }
      },
      copy({
        targets: [
          { src: 'src/styles.css', dest: 'css', rename: 'module.css' }
        ]
      })
    ],
    watch: {
      clearScreen: false
    },
    external: ['foundry']
  }
];
