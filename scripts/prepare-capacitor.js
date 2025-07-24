const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const srcCapacitorDir = path.join(rootDir, 'src', 'capacitor');
const distCapacitorDir = path.join(rootDir, 'dist', 'capacitor');
const buildOutputDir = path.join(rootDir, 'dist', 'esm');
const distEsmDir = path.join(distCapacitorDir, 'dist', 'esm');

// Ensure dist directory exists
if (!fs.existsSync(distCapacitorDir)) {
    fs.mkdirSync(distCapacitorDir, { recursive: true });
}

// Copy package.json from src/capacitor to dist/capacitor
console.log('Copying capacitor package.json...');
const capacitorPackageJsonPath = path.join(srcCapacitorDir, 'package.json');

if (fs.existsSync(capacitorPackageJsonPath)) {
    const packageJson = require(capacitorPackageJsonPath);
    // Ensure version matches root package
    const rootPackage = require(path.join(rootDir, 'package.json'));
    packageJson.version = rootPackage.version;

    fs.writeFileSync(
        path.join(distCapacitorDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );
} else {
    console.log('Warning: No package.json found in src/capacitor, creating default one');
    const defaultPackageJson = {
        name: "com-easystep2-datawedge-plugin-intent-capacitor",
        version: require(path.join(rootDir, 'package.json')).version,
        description: "Capacitor plugin for Android Intents",
        main: "dist/plugin.js",
        module: "dist/esm/index.js",
        types: "dist/esm/index.d.ts",
        author: "Easystep2",
        license: "MIT",
        repository: {
            type: "git",
            url: "git+https://github.com/easystep2/easystep2-datawedge-plugin-intent.git"
        },
        keywords: [
            "capacitor",
            "plugin",
            "intent"
        ],
        peerDependencies: {
            "@capacitor/core": ">=4.0.0"
        },
        capacitor: {
            android: {
                src: "android"
            }
        }
    };

    fs.writeFileSync(
        path.join(distCapacitorDir, 'package.json'),
        JSON.stringify(defaultPackageJson, null, 2)
    );
}

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

// Copy Android implementation if exists
const capacitorAndroidDir = path.join(srcCapacitorDir, 'android');
if (fs.existsSync(capacitorAndroidDir)) {
    console.log('Copying Android implementation...');

    // Create the android directory in dist
    const distAndroidDir = path.join(distCapacitorDir, 'android');
    if (!fs.existsSync(distAndroidDir)) {
        fs.mkdirSync(distAndroidDir, { recursive: true });
    }

    // Copy Android directory recursively
    copyDirSync(capacitorAndroidDir, distCapacitorDir);
}

// Copy any additional configuration files
const configFiles = ['tsconfig.json', 'rollup.config.js'];
configFiles.forEach(file => {
    const srcFile = path.join(srcCapacitorDir, file);
    if (fs.existsSync(srcFile)) {
        console.log(`Copying ${file}...`);
        fs.copyFileSync(srcFile, path.join(distCapacitorDir, file));
    } else {
        console.log(`Warning: ${file} not found in src/capacitor`);
    }
});

// Copy build output to dist/capacitor
console.log('Copying TypeScript build output...');
if (fs.existsSync(buildOutputDir)) {
    // Create the dist/esm directory if it doesn't exist
    if (!fs.existsSync(distEsmDir)) {
        fs.mkdirSync(distEsmDir, { recursive: true });
    }

    // Copy built files to dist/capacitor/dist/esm
    copyDirSync(buildOutputDir, path.join(distCapacitorDir, 'dist'));
} else {
    console.error('Error: No build output found. Run "npm run build:ts" first.');
    process.exit(1);
}

console.log('✅ Capacitor platform prepared successfully');
