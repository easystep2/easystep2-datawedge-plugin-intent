const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist/cordova directory if it doesn't exist
const cordovaDir = path.join(__dirname, '..', 'dist', 'cordova');
if (!fs.existsSync(cordovaDir)) {
    fs.mkdirSync(cordovaDir, { recursive: true });
}

// Copy necessary files to dist/cordova
console.log('Copying files for Cordova plugin...');

// Copy package.json and update it for publishing
const packageJson = require('../package.json');
const cordovaPackage = {
    ...packageJson,
    name: packageJson.name.replace('-dev', '-cordova'),
    scripts: {
        // Only keep essential scripts for the published package
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    devDependencies: undefined,
    // Add Cordova-specific fields
    "cordova": {
        "id": "com-easystep2-datawedge-plugin-intent-cordova",
        "platforms": ["android"]
    }
};

fs.writeFileSync(
    path.join(cordovaDir, 'package.json'),
    JSON.stringify(cordovaPackage, null, 2)
);

// Copy other necessary files for Cordova
const filesToCopy = [
    'README.md',
    'LICENSE',
    'plugin.xml',           // Essential for Cordova plugins
    'www/datawedge.js',     // Main plugin JS interface
    '.npmignore'            // If you have specific npm ignore rules
    // Add other files needed for Cordova
];

// Copy files - not directories
filesToCopy.forEach(file => {
    if (fs.existsSync(path.join(__dirname, '..', file))) {
        const sourcePath = path.join(__dirname, '..', file);
        const destPath = path.join(cordovaDir, file);

        // Create parent directory if it doesn't exist
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Only use copyFileSync for files, not directories
        if (fs.statSync(sourcePath).isFile()) {
            fs.copyFileSync(sourcePath, destPath);
        }
    }
});

// Handle directories separately
const directoriesToCopy = [
    'src',                  // Native platform code
    'res'                   // Resources directory if present
];

// Recursive function to copy directories
function copyDir(src, dest) {
    // Create destination directory
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // Read source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });

    // Copy each entry
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Recursive copy for directories
            copyDir(srcPath, destPath);
        } else {
            // Copy file
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copy directories
directoriesToCopy.forEach(dir => {
    const sourcePath = path.join(__dirname, '..', dir);
    const destPath = path.join(cordovaDir, dir);

    if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isDirectory()) {
        copyDir(sourcePath, destPath);
    }
});

// Copy dist files
fs.cpSync(
    path.join(__dirname, '..', 'dist', 'esm'),
    path.join(cordovaDir, 'www'),
    { recursive: true }
);

console.log('Cordova plugin preparation complete!');
