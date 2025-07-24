const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const srcCapacitorDir = path.join(rootDir, 'src', 'capacitor');
const distDir = path.join(rootDir, 'dist');
const distCapacitorDir = path.join(distDir, 'capacitor');
const buildOutputDir = path.join(distDir, 'esm');

console.log('Preparing Capacitor plugin...');

// Ensure dist/capacitor directory exists
if (!fs.existsSync(distCapacitorDir)) {
    fs.mkdirSync(distCapacitorDir, { recursive: true });
}

// Create package.json with correct paths
console.log('Creating package.json...');
const packageJson = {
    name: "com-easystep2-datawedge-plugin-intent-capacitor",
    version: require(path.join(rootDir, 'package.json')).version,
    description: "Capacitor plugin for Android Intents",
    main: "plugin.js", // Direct path, no dist/ prefix
    module: "esm/index.js", // Direct path, no dist/ prefix
    types: "esm/index.d.ts", // Direct path, no dist/ prefix
    author: "Easystep2",
    license: "MIT",
    repository: {
        type: "git",
        url: "git+https://github.com/easystep2/easystep2-datawedge-plugin-intent.git"
    },
    keywords: [
        "capacitor",
        "plugin",
        "intent",
        "datawedge",
        "zebra",
        "scanner",
        "barcode"
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
    JSON.stringify(packageJson, null, 2)
);

// Copy Android implementation
console.log('Copying Android implementation...');
const capacitorAndroidDir = path.join(srcCapacitorDir, 'android');
if (fs.existsSync(capacitorAndroidDir)) {
    const distAndroidDir = path.join(distCapacitorDir, 'android');
    copyDirContentsSync(capacitorAndroidDir, distAndroidDir);
} else {
    console.log('Android directory not found.');
}

// Copy TypeScript compiled output to esm/ folder - with additional cleanup step
console.log('Copying TypeScript output...');
if (fs.existsSync(buildOutputDir)) {
    const distEsmDir = path.join(distCapacitorDir, 'esm');
    if (!fs.existsSync(distEsmDir)) {
        fs.mkdirSync(distEsmDir, { recursive: true });
    }

    // Copy the TypeScript output to the Capacitor directory
    copyDirContentsSync(buildOutputDir, distEsmDir);

    // Option to remove the original dist/esm folder since it's duplicated
    // Only do this if the copy was successful
    if (fs.existsSync(distEsmDir) &&
        fs.readdirSync(distEsmDir).length > 0) {
        console.log('Removing redundant dist/esm folder...');
        fs.rmSync(buildOutputDir, { recursive: true, force: true });
        console.log('- Removed dist/esm');
    }
} else {
    console.error('Error: No TypeScript build output found in dist/esm!');
    process.exit(1);
}

// Update rollup output paths to look in the right place
console.log('Copying rollup bundle output...');
// Check if rollup output is in dist root or in a subdirectory
const possiblePluginLocations = [
    // Check in dist root (current assumption)
    {
        js: path.join(distDir, 'plugin.js'),
        jsMap: path.join(distDir, 'plugin.js.map'),
        cjs: path.join(distDir, 'plugin.cjs.js'),
        cjsMap: path.join(distDir, 'plugin.cjs.js.map')
    },
    // Check in dist/capacitor (in case rollup outputs there)
    {
        js: path.join(distCapacitorDir, 'plugin.js'),
        jsMap: path.join(distCapacitorDir, 'plugin.js.map'),
        cjs: path.join(distCapacitorDir, 'plugin.cjs.js'),
        cjsMap: path.join(distCapacitorDir, 'plugin.cjs.js.map')
    },
];

// Try to find plugin files in possible locations
let pluginFound = false;
for (const location of possiblePluginLocations) {
    if (fs.existsSync(location.js) || fs.existsSync(location.cjs)) {
        pluginFound = true;

        // Copy plugin.js if it exists
        if (fs.existsSync(location.js)) {
            // Only copy if the source is not already in the destination
            if (location.js !== path.join(distCapacitorDir, 'plugin.js')) {
                fs.copyFileSync(location.js, path.join(distCapacitorDir, 'plugin.js'));
                console.log('- Copied plugin.js');
            }
            // Copy sourcemap if it exists
            if (fs.existsSync(location.jsMap) &&
                location.jsMap !== path.join(distCapacitorDir, 'plugin.js.map')) {
                fs.copyFileSync(location.jsMap, path.join(distCapacitorDir, 'plugin.js.map'));
                console.log('- Copied plugin.js.map');
            }
        }

        // Copy plugin.cjs.js if it exists
        if (fs.existsSync(location.cjs)) {
            // Only copy if the source is not already in the destination
            if (location.cjs !== path.join(distCapacitorDir, 'plugin.cjs.js')) {
                fs.copyFileSync(location.cjs, path.join(distCapacitorDir, 'plugin.cjs.js'));
                console.log('- Copied plugin.cjs.js');
            }
            // Copy sourcemap if it exists
            if (fs.existsSync(location.cjsMap) &&
                location.cjsMap !== path.join(distCapacitorDir, 'plugin.cjs.js.map')) {
                fs.copyFileSync(location.cjsMap, path.join(distCapacitorDir, 'plugin.cjs.js.map'));
                console.log('- Copied plugin.cjs.js.map');
            }
        }

        break;
    }
}

// If rollup output wasn't found, show a warning
if (!pluginFound) {
    console.warn('⚠️ Warning: Could not find plugin.js or plugin.cjs.js rollup output files.');
    console.warn('Make sure the rollup configuration outputs to the correct location.');
}

// Clean up any files in the dist root that should be in dist/capacitor
console.log('Cleaning up dist directory...');
const filesToRemove = ['plugin.js', 'plugin.js.map', 'plugin.cjs.js', 'plugin.cjs.js.map'];
filesToRemove.forEach(file => {
    const filePath = path.join(distDir, file);
    if (fs.existsSync(filePath)) {
        // Only remove if we've already copied it to dist/capacitor
        if (fs.existsSync(path.join(distCapacitorDir, file))) {
            fs.unlinkSync(filePath);
            console.log(`- Removed ${file} from dist root`);
        }
    }
});

// Check for and remove any nested dist folder
const nestedDistDir = path.join(distCapacitorDir, 'dist');
if (fs.existsSync(nestedDistDir)) {
    console.log('Removing redundant nested dist folder...');
    fs.rmSync(nestedDistDir, { recursive: true, force: true });
}

// Helper function to copy directory contents
function copyDirContentsSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    if (!fs.existsSync(src)) {
        console.error(`Source directory ${src} doesn't exist!`);
        return;
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirContentsSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Print final structure
console.log('\nFinal Capacitor plugin structure:');
function listDir(dir, indent = '') {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach(entry => {
        console.log(`${indent}${entry.isDirectory() ? '📁' : '📄'} ${entry.name}`);
        if (entry.isDirectory()) {
            listDir(path.join(dir, entry.name), indent + '  ');
    }
    });
}

listDir(distCapacitorDir);
console.log('✅ Capacitor plugin preparation completed!');
console.log('\nIMPORTANT: For npm packaging, only use the dist/capacitor directory.');
console.log('Example command: cd dist/capacitor && npm pack');
