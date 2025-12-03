import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { dirname, resolve as pathResolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { createReadStream, createWriteStream } from 'fs';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';

// Get package.json version as single source of truth
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagePath = pathResolve(__dirname, 'package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const MODULE_VERSION = packageJson.version;

// Validation function to ensure all required files exist
function validateRequiredFiles() {
  const requiredFiles = [
    'ds-reskinner.mjs',
    'css/module.css',
    'lang/en.json',
    'templates/reskin-form.hbs',
    'module.json'
  ];
  
  const missingFiles = requiredFiles.filter(file => !existsSync(pathResolve(__dirname, file)));
  if (missingFiles.length > 0) {
    throw new Error(`Missing required files for release: ${missingFiles.join(', ')}`);
  }
  console.log('[validation] All required files present for release');
}

// Function to create distribution zip
async function createDistributionPackage() {
  const distDir = pathResolve(__dirname, 'dist');
  const packageDir = pathResolve(distDir, `ds-reskinner-v${MODULE_VERSION}`);
  
  // Create dist directory
  if (!existsSync(distDir)) {
    execSync('mkdir dist', { cwd: __dirname });
  }
  
  // Clean previous package directory
  if (existsSync(packageDir)) {
    if (process.platform === 'win32') {
      execSync(`rmdir /s /q "${packageDir}"`, { cwd: __dirname });
    } else {
      execSync(`rm -rf "${packageDir}"`, { cwd: __dirname });
    }
  }
  
  // Create package directory
  execSync(`mkdir "${packageDir}"`, { cwd: __dirname });
  
  // Copy essential files to package directory
  const filesToPackage = [
    'ds-reskinner.mjs',
    'ds-reskinner.mjs.map',
    'module.json',
    'css/module.css',
    'lang/en.json',
    'templates/reskin-form.hbs',
    'LICENSE'
  ];
  
  for (const file of filesToPackage) {
    if (existsSync(pathResolve(__dirname, file))) {
      const srcPath = pathResolve(__dirname, file);
      const destPath = pathResolve(packageDir, file);
      const destDir = dirname(destPath);
      
      if (!existsSync(destDir)) {
        if (process.platform === 'win32') {
          execSync(`mkdir "${destDir}"`, { cwd: __dirname });
        } else {
          execSync(`mkdir -p "${destDir}"`, { cwd: __dirname });
        }
      }
      
      if (process.platform === 'win32') {
        execSync(`copy "${srcPath}" "${destPath}"`, { cwd: __dirname });
      } else {
        execSync(`cp "${srcPath}" "${destPath}"`, { cwd: __dirname });
      }
    }
  }
  
  // Create zip file using PowerShell on Windows
  const zipPath = pathResolve(distDir, `ds-reskinner.zip`);
  if (process.platform === 'win32') {
    execSync(`powershell -command "Compress-Archive -Path '${packageDir}\\*' -DestinationPath '${zipPath}' -Force"`, { cwd: __dirname });
  } else {
    execSync(`cd "${packageDir}" && zip -r "${zipPath}" .`, { cwd: __dirname });
  }
  
  console.log(`[distribution] Created package: ${zipPath}`);
  return zipPath;
}

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
          // IMPORTANT: src/styles.css → css/module.css (SOURCE → GENERATED)
          // ALL CSS edits MUST be done in src/styles.css, never in css/module.css
          { src: 'src/styles.css', dest: 'css', rename: 'module.css' }
        ]
      }),
      // Validate required files exist
      {
        name: 'validate-files',
        generateBundle() {
          validateRequiredFiles();
        }
      },
      // Create distribution package
      {
        name: 'create-distribution',
        async generateBundle() {
          // Only create distribution if we're not in watch mode
          if (process.env.NODE_ENV !== 'watch') {
            await createDistributionPackage();
          }
        }
      }
    ],
    watch: {
      clearScreen: false
    },
    external: ['foundry']
  }
];
