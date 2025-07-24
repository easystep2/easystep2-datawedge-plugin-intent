const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

// Paths
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const cordovaDistDir = path.join(distDir, 'cordova');
const cordovaSrcDir = path.join(rootDir, 'cordova');

// Create directories if they don't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

if (!fs.existsSync(cordovaDistDir)) {
    fs.mkdirSync(cordovaDistDir);
} else {
    // Clean the directory if it already exists
    rimraf.sync(`${cordovaDistDir}/*`);
}

// Copy package.json for Cordova
if (fs.existsSync(path.join(cordovaSrcDir, 'package.json'))) {
    const cordovaPackageJson = require(path.join(cordovaSrcDir, 'package.json'));
    // Ensure the version matches the root package.json
    const rootPackageJson = require(path.join(rootDir, 'package.json'));
    cordovaPackageJson.version = rootPackageJson.version;

    fs.writeFileSync(
        path.join(cordovaDistDir, 'package.json'),
        JSON.stringify(cordovaPackageJson, null, 2)
    );
} else if (fs.existsSync(path.join(rootDir, 'plugin.xml'))) {
    // Create a basic package.json from plugin.xml info
    const rootPackageJson = require(path.join(rootDir, 'package.json'));
    const cordovaPackageJson = {
        name: "com-easystep2-datawedge-plugin-intent",
        version: rootPackageJson.version,
        description: rootPackageJson.description,
        cordova: {
            id: "com-easystep2-datawedge-plugin-intent",
            platforms: ["android"]
        },
        keywords: [
            ...rootPackageJson.keywords,
            "ecosystem:cordova",
            "cordova-android"
        ],
        author: rootPackageJson.author,
        license: rootPackageJson.license
    };

    fs.writeFileSync(
        path.join(cordovaDistDir, 'package.json'),
        JSON.stringify(cordovaPackageJson, null, 2)
    );
} else {
    console.error('Error: Neither cordova/package.json nor plugin.xml found');
    process.exit(1);
}

// Copy plugin.xml
if (fs.existsSync(path.join(rootDir, 'plugin.xml'))) {
    fs.copyFileSync(
        path.join(rootDir, 'plugin.xml'),
        path.join(cordovaDistDir, 'plugin.xml')
    );
} else if (fs.existsSync(path.join(cordovaSrcDir, 'plugin.xml'))) {
    fs.copyFileSync(
        path.join(cordovaSrcDir, 'plugin.xml'),
        path.join(cordovaDistDir, 'plugin.xml')
    );
} else {
    console.error('Error: plugin.xml not found');
    process.exit(1);
}

// Copy README and LICENSE
try {
    fs.copyFileSync(
        path.join(rootDir, 'README.md'),
        path.join(cordovaDistDir, 'README.md')
    );
    fs.copyFileSync(
        path.join(rootDir, 'LICENSE'),
        path.join(cordovaDistDir, 'LICENSE')
    );
} catch (err) {
    console.warn('Warning: Could not copy README.md or LICENSE file', err);
}

// Copy www directory
const wwwSrcDir = fs.existsSync(path.join(cordovaSrcDir, 'www')) ?
    path.join(cordovaSrcDir, 'www') :
    path.join(rootDir, 'www');

if (fs.existsSync(wwwSrcDir)) {
    copyDirSync(wwwSrcDir, path.join(cordovaDistDir, 'www'));
    console.log('✓ Copied www directory');
} else {
    console.error('Error: www directory not found');
    process.exit(1);
}

// Copy src/android directory
const srcAndroidDir = path.join(cordovaSrcDir, 'android');

if (fs.existsSync(srcAndroidDir)) {
    copyDirSync(srcAndroidDir, path.join(cordovaDistDir, 'src', 'android'));
    console.log('✓ Copied src/android directory');
} else {
    console.warn('Warning: src/android directory not found in cordova folder');
}

// Copy hooks directory - important for Cordova lifecycle scripts
const hooksDir = fs.existsSync(path.join(cordovaSrcDir, 'hooks')) ?
    path.join(cordovaSrcDir, 'hooks') :
    path.join(rootDir, 'hooks');

if (fs.existsSync(hooksDir)) {
    copyDirSync(hooksDir, path.join(cordovaDistDir, 'hooks'));
    console.log('✓ Copied hooks directory');
}

console.log('✅ Cordova platform prepared successfully');

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
