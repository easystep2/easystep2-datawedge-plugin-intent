const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist/capacitor directory if it doesn't exist
const capacitorDir = path.join(__dirname, '..', 'dist', 'capacitor');
if (!fs.existsSync(capacitorDir)) {
    fs.mkdirSync(capacitorDir, { recursive: true });
}

// Copy necessary files to dist/capacitor
console.log('Copying files for Capacitor plugin...');

// Copy package.json and update it for publishing
const packageJson = require('../package.json');
const capacitorPackage = {
    ...packageJson,
    name: packageJson.name.replace('-dev', ''),
    scripts: {
        // Include only scripts relevant for the published package
    },
    devDependencies: undefined,
    // Add any Capacitor-specific fields
};

fs.writeFileSync(
    path.join(capacitorDir, 'package.json'),
    JSON.stringify(capacitorPackage, null, 2)
);

// Copy other necessary files for Capacitor
const filesToCopy = [
    'README.md',
    'LICENSE',
    // Add other files needed for Capacitor
];

filesToCopy.forEach(file => {
    if (fs.existsSync(path.join(__dirname, '..', file))) {
        fs.copyFileSync(
            path.join(__dirname, '..', file),
            path.join(capacitorDir, file)
        );
    }
});

// Copy dist files
fs.cpSync(
    path.join(__dirname, '..', 'dist', 'esm'),
    path.join(capacitorDir, 'esm'),
    { recursive: true }
);

console.log('Capacitor plugin preparation complete!');
