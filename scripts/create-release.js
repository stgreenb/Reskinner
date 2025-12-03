#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, resolve as pathResolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = pathResolve(__dirname, '..');

// Get package.json version
const packageJson = JSON.parse(readFileSync(pathResolve(projectRoot, 'package.json'), 'utf8'));
const version = packageJson.version;

console.log(`🚀 Creating release for ds-reskinner v${version}`);

// 1. Build the module
console.log('📦 Building module...');
try {
  execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// 2. Validate all required files exist
console.log('🔍 Validating required files...');
const requiredFiles = [
  'ds-reskinner.mjs',
  'css/module.css',
  'lang/en.json',
  'templates/reskin-form.hbs',
  'module.json'
];

const missingFiles = requiredFiles.filter(file => !existsSync(pathResolve(projectRoot, file)));
if (missingFiles.length > 0) {
  console.error('❌ Missing required files:', missingFiles.join(', '));
  process.exit(1);
}
console.log('✅ All required files present');

// 3. Read module.json to verify version
const moduleJson = JSON.parse(readFileSync(pathResolve(projectRoot, 'module.json'), 'utf8'));
if (moduleJson.version !== version) {
  console.error(`❌ Version mismatch: package.json (${version}) vs module.json (${moduleJson.version})`);
  process.exit(1);
}

// 4. Generate changelog (last 10 commits)
console.log('📝 Generating changelog...');
try {
  const changelogOutput = execSync('git log --oneline -10', { cwd: projectRoot, encoding: 'utf8' });
  console.log('📋 Recent changes:');
  console.log(changelogOutput);
} catch (error) {
  console.warn('⚠️  Could not generate changelog:', error.message);
}

// 5. Create git tag
console.log(`🏷️  Creating git tag v${version}...`);
try {
  execSync(`git add -A`, { cwd: projectRoot });
  execSync(`git commit -m "Release v${version}"`, { cwd: projectRoot });
  execSync(`git tag v${version}`, { cwd: projectRoot });
  console.log('✅ Git tag created');
} catch (error) {
  console.error('❌ Failed to create git tag:', error.message);
  process.exit(1);
}

// 6. Check distribution package
const distDir = pathResolve(projectRoot, 'dist');
const expectedZip = pathResolve(distDir, `ds-reskinner-v${version}.zip`);

if (existsSync(expectedZip)) {
  console.log(`✅ Distribution package created: ${expectedZip}`);
  
  // Show package info
  const stats = require('fs').statSync(expectedZip);
  const fileSizeKB = Math.round(stats.size / 1024);
  console.log(`📊 Package size: ${fileSizeKB} KB`);
  
  console.log('\n🎉 Release preparation complete!');
  console.log('\nNext steps:');
  console.log('1. Push changes and tag to GitHub:');
  console.log(`   git push origin main`);
  console.log(`   git push origin v${version}`);
  console.log('\n2. Create GitHub release with the following:');
  console.log(`   - Title: ds-reskinner v${version}`);
  console.log(`   - Asset: ${expectedZip}`);
  console.log('   - Description: Include recent changelog');
} else {
  console.warn('⚠️  Distribution package not found in dist/');
  console.log('📦 You may need to create it manually');
}

console.log(`\n📋 Release Summary for v${version}:`);
console.log(`   Version: ${version}`);
console.log(`   Module ID: ${moduleJson.id}`);
console.log(`   Required files: ✅ Validated`);
console.log(`   Git tag: ✅ Created`);
