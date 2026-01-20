const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define bump types
const BUMP_TYPES = ['build', 'patch', 'minor', 'major'];

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

    // Calculate new version
    const versionParts = currentVersion.split('.');
    const major = Number(versionParts[0]);
    const minor = Number(versionParts[1]);
    const patch = Number(versionParts[2]);
    const build = versionParts.length > 3 ? Number(versionParts[3]) : -1;
    
    let newVersion;

    switch (bumpType) {
        case 'major':
            newVersion = `${major + 1}.0.0`;
            break;
        case 'minor':
            newVersion = `${major}.${minor + 1}.0`;
            break;
        case 'patch':
            newVersion = `${major}.${minor}.${patch + 1}`;
            break;
        case 'build':
            if (build >= 0) {
                newVersion = `${major}.${minor}.${patch}.${build + 1}`;
            } else {
                newVersion = `${major}.${minor}.${patch}.1`;
            }
            break;
        default: // 'patch' is the default from bumpType logic
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
