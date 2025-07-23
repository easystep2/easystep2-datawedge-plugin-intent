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
    'src',                  // Native platform code
    'res',                  // Resources directory if present
    '.npmignore'            // If you have specific npm ignore rules
    // Add other files needed for Cordova
];

filesToCopy.forEach(file => {
    if (fs.existsSync(path.join(__dirname, '..', file))) {
        fs.copyFileSync(
            path.join(__dirname, '..', file),
            path.join(cordovaDir, file)
        );
    }
});

// Copy dist files
fs.cpSync(
    path.join(__dirname, '..', 'dist', 'esm'),
    path.join(cordovaDir, 'www'),
    { recursive: true }
);

console.log('Cordova plugin preparation complete!');
