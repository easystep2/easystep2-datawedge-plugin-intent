const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define bump types
const BUMP_TYPES = ['patch', 'minor', 'major'];

function getCurrentVersion() {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return packageJson.version;
}

function bumpVersion() {
    // Get bump type from args
    const bumpArg = process.argv[2];
    const bumpType = BUMP_TYPES.includes(bumpArg) ? bumpArg : 'patch';

    const currentVersion = getCurrentVersion();
    console.log(`Current version: ${currentVersion}`);

    // Calculate new version using semver logic
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    let newVersion;

    switch (bumpType) {
        case 'major':
            newVersion = `${major + 1}.0.0`;
            break;
        case 'minor':
            newVersion = `${major}.${minor + 1}.0`;
            break;
        default:
            newVersion = `${major}.${minor}.${patch + 1}`;
    }

    console.log(`Bumping ${bumpType} version to: ${newVersion}`);

    // Use the sync script to update all files
    execSync(`node ${path.join(__dirname, 'sync-versions.js')} --version=${newVersion}`,
        { stdio: 'inherit' });

    return newVersion;
}

const newVersion = bumpVersion();

// Optionally create a git commit and tag
if (process.argv.includes('--commit')) {
    console.log('Creating git commit and tag...');
    execSync(`git commit -am "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });
    execSync(`git tag v${newVersion}`, { stdio: 'inherit' });
    console.log(`Git tag v${newVersion} created. Use 'git push --tags' to push it.`);
}