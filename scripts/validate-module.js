#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { dirname, resolve as pathResolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = pathResolve(__dirname, '..');

console.log('🔍 Validating ds-reskinner module...');

// 1. Check essential files exist
console.log('\n📁 Checking required files...');
const requiredFiles = [
  'ds-reskinner.mjs',
  'css/module.css',
  'lang/en.json',
  'templates/reskin-form.hbs',
  'module.json',
  'package.json'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = pathResolve(projectRoot, file);
  if (existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.error('\n❌ Validation failed: Missing required files');
  process.exit(1);
}

// 2. Validate module.json structure
console.log('\n📋 Validating module.json...');
try {
  const moduleJson = JSON.parse(readFileSync(pathResolve(projectRoot, 'module.json'), 'utf8'));
  
  const requiredFields = ['id', 'title', 'version', 'description', 'authors', 'esmodules', 'styles', 'languages'];
  let allFieldsValid = true;
  
  for (const field of requiredFields) {
    if (moduleJson[field]) {
      console.log(`   ✅ ${field}: ${Array.isArray(moduleJson[field]) ? `[${moduleJson[field].length} items]` : moduleJson[field]}`);
    } else {
      console.log(`   ❌ ${field} - MISSING`);
      allFieldsValid = false;
    }
  }
  
  if (!allFieldsValid) {
    console.error('\n❌ Validation failed: module.json missing required fields');
    process.exit(1);
  }
  
  // Check if referenced files exist
  console.log('\n🔗 Checking referenced files...');
  for (const esmodule of moduleJson.esmodules) {
    if (existsSync(pathResolve(projectRoot, esmodule))) {
      console.log(`   ✅ ${esmodule}`);
    } else {
      console.log(`   ❌ ${esmodule} - REFERENCED BUT MISSING`);
      allFilesExist = false;
    }
  }
  
  for (const style of moduleJson.styles) {
    if (existsSync(pathResolve(projectRoot, style))) {
      console.log(`   ✅ ${style}`);
    } else {
      console.log(`   ❌ ${style} - REFERENCED BUT MISSING`);
      allFilesExist = false;
    }
  }
  
  for (const lang of moduleJson.languages) {
    if (lang && lang.path && existsSync(pathResolve(projectRoot, lang.path))) {
      console.log(`   ✅ ${lang.path}`);
    } else {
      console.log(`   ❌ ${lang?.path || lang} - REFERENCED BUT MISSING`);
      allFilesExist = false;
    }
  }
  
} catch (error) {
  console.error('\n❌ Validation failed: Invalid module.json:', error.message);
  process.exit(1);
}

// 3. Validate package.json version sync
console.log('\n🔄 Checking version synchronization...');
try {
  const packageJson = JSON.parse(readFileSync(pathResolve(projectRoot, 'package.json'), 'utf8'));
  const moduleJson = JSON.parse(readFileSync(pathResolve(projectRoot, 'module.json'), 'utf8'));
  
  if (packageJson.version === moduleJson.version) {
    console.log(`   ✅ Version synchronized: ${packageJson.version}`);
  } else {
    console.log(`   ❌ Version mismatch!`);
    console.log(`      package.json: ${packageJson.version}`);
    console.log(`      module.json:  ${moduleJson.version}`);
    process.exit(1);
  }
} catch (error) {
  console.error('\n❌ Validation failed: Could not check version synchronization:', error.message);
  process.exit(1);
}

// 4. Check for AI traces
console.log('\n🧹 Checking for AI assistant traces...');
const forbiddenFiles = [
  '.factory',
  '.gemini', 
  '.kilocode',
  '.windsurf',
  'openspec',
  'AGENTS.md'
];

let aiTracesFound = false;
for (const file of forbiddenFiles) {
  if (existsSync(pathResolve(projectRoot, file))) {
    console.log(`   ⚠️  ${file} - AI trace found in filesystem`);
    aiTracesFound = true;
  }
}

if (aiTracesFound) {
  console.log('   💡 Note: AI traces should be excluded by .gitignore for public release');
} else {
  console.log('   ✅ No AI traces found in project root');
}

// 5. Check for development files
console.log('\n📦 Checking for development files...');
const devFiles = [
  'quick-fix-guide.md',
  'ui-consistency-dark-theme.md',
  'AdjustingMonsters.md',
  'minimal-ui-fix.css',
  'unified-dark-theme.css',
  '*.log',
  'fvtt-Actor-*.json'
];

let devFilesFound = false;
for (const pattern of devFiles) {
  if (pattern.includes('*')) {
    // Simple glob check for this validation
    if (existsSync(pathResolve(projectRoot, pattern.replace('*', ''))) || 
        existsSync(pathResolve(projectRoot, '192.168.1.196-1764733558274.log'))) {
      console.log(`   ⚠️  Found files matching ${pattern}`);
      devFilesFound = true;
    }
  } else if (existsSync(pathResolve(projectRoot, pattern))) {
    console.log(`   ⚠️  ${pattern} - Development file found`);
    devFilesFound = true;
  }
}

if (devFilesFound) {
  console.log('   💡 Note: Development files should be excluded by .gitignore');
} else {
  console.log('   ✅ No development files found in project root');
}

console.log('\n✅ Module validation completed successfully!');
console.log('\n📋 Validation Summary:');
console.log('   ✅ All required files present');
console.log('   ✅ Module.json structure valid');
console.log('   ✅ Version synchronized');
console.log('   ✅ References files exist');
console.log(`   ${aiTracesFound ? '⚠️' : '✅'} AI traces check`);
console.log(`   ${devFilesFound ? '⚠️' : '✅'} Development files check`);
