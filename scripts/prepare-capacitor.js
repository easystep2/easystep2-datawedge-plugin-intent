const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

// Paths
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const capacitorDistDir = path.join(distDir, 'capacitor');
const capacitorSrcDir = path.join(rootDir, 'src', 'capacitor');

// Create directories if they don't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

if (!fs.existsSync(capacitorDistDir)) {
    fs.mkdirSync(capacitorDistDir);
} else {
    // Clean the directory if it already exists
    rimraf.sync(`${capacitorDistDir}/*`);
}

// Copy package.json from the capacitor directory
if (fs.existsSync(path.join(capacitorSrcDir, 'package.json'))) {
    const capacitorPackageJson = require(path.join(capacitorSrcDir, 'package.json'));
    // Ensure the version matches the root package.json
    const rootPackageJson = require(path.join(rootDir, 'package.json'));
    capacitorPackageJson.version = rootPackageJson.version;

    fs.writeFileSync(
        path.join(capacitorDistDir, 'package.json'),
        JSON.stringify(capacitorPackageJson, null, 2)
    );
} else {
    console.error('Error: package.json not found in capacitor directory');
    process.exit(1);
}

// Copy README and LICENSE
try {
    fs.copyFileSync(
        path.join(rootDir, 'README.md'),
        path.join(capacitorDistDir, 'README.md')
    );
    fs.copyFileSync(
        path.join(rootDir, 'LICENSE'),
        path.join(capacitorDistDir, 'LICENSE')
    );
} catch (err) {
    console.warn('Warning: Could not copy README.md or LICENSE file', err);
}

// Copy dist files
fs.mkdirSync(path.join(capacitorDistDir, 'esm'), { recursive: true });

// Copy compiled JS files
copyDirSync(path.join(distDir, 'esm'), path.join(capacitorDistDir, 'esm'));
fs.copyFileSync(
    path.join(distDir, 'plugin.js'),
    path.join(capacitorDistDir, 'plugin.js')
);
if (fs.existsSync(path.join(distDir, 'plugin.js.map'))) {
    fs.copyFileSync(
        path.join(distDir, 'plugin.js.map'),
        path.join(capacitorDistDir, 'plugin.js.map')
    );
}

// Copy Android platform files from capacitor directory
if (fs.existsSync(path.join(capacitorSrcDir, 'android'))) {
    copyDirSync(
        path.join(capacitorSrcDir, 'android'),
        path.join(capacitorDistDir, 'android')
    );
} else {
    console.warn('Warning: android directory not found in capacitor directory');
}

// Update package.json capacitor android src
const capacitorPackageJsonPath = path.join(capacitorDistDir, 'package.json');
const capacitorPackageJson = require(capacitorPackageJsonPath);
capacitorPackageJson.capacitor.android.src = 'android';
capacitorPackageJson.main = 'plugin.js';
capacitorPackageJson.module = 'esm/index.js';
capacitorPackageJson.types = 'esm/index.d.ts';
fs.writeFileSync(
    capacitorPackageJsonPath,
    JSON.stringify(capacitorPackageJson, null, 2)
);

// Copy hooks directory if it exists in capacitor directory
if (fs.existsSync(path.join(capacitorSrcDir, 'hooks'))) {
    copyDirSync(
        path.join(capacitorSrcDir, 'hooks'),
        path.join(capacitorDistDir, 'hooks')
    );
    console.log('✓ Copied hooks directory');
}

console.log('✅ Capacitor platform prepared successfully');

// Helper function to copy directories recursively
function copyDirSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
