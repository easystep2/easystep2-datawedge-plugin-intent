const fs = require('fs');
const path = require('path');

// Define the paths to all version-containing files
const FILES = {
    rootPackage: path.join(__dirname, '..', 'package.json'),
    capacitorPackage: path.join(__dirname, '..', 'src', 'capacitor', 'package.json'),
    cordovaPackage: path.join(__dirname, '..', 'src', 'cordova', 'package.json'),
    cordovaPlugin: path.join(__dirname, '..', 'src', 'cordova', 'plugin.xml')
};

// Get version from CLI arguments or from root package.json
function getTargetVersion() {
    const versionArg = process.argv.find(arg => arg.startsWith('--version='));
    if (versionArg) {
        return versionArg.split('=')[1];
    }

    // If no version specified, use the root package.json version
    const rootPackage = JSON.parse(fs.readFileSync(FILES.rootPackage, 'utf8'));
    return rootPackage.version;
}

function updateJsonFile(filePath, version) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File not found: ${path.relative(process.cwd(), filePath)}`);
        return;
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    content.version = version;
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
    console.log(`✅ Updated ${path.relative(process.cwd(), filePath)} to version ${version}`);
}

function updatePluginXml(filePath, version) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File not found: ${path.relative(process.cwd(), filePath)}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Only replace the version attribute value
    content = content.replace(/(<plugin[^>]*\bversion=")[^"]*(")/, `$1${version}$2`);

    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${path.relative(process.cwd(), filePath)} to version ${version}`);
}

function syncVersions() {
    const version = getTargetVersion();
    console.log(`🔄 Synchronizing all packages to version ${version}`);

    // Update JSON files
    updateJsonFile(FILES.rootPackage, version);
    updateJsonFile(FILES.capacitorPackage, version);
    updateJsonFile(FILES.cordovaPackage, version);

    // Update plugin.xml
    updatePluginXml(FILES.cordovaPlugin, version);

    console.log('✨ All version files synchronized successfully!');
}

syncVersions();