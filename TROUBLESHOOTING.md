# Capacitor Intent Plugin - Troubleshooting Guide

## Common Issues and Solutions

### "Intent not available" Error on Android

This error typically occurs when:

1. **Plugin not properly installed**: Make sure you have installed and synced the plugin correctly
2. **Missing setDebugMode method**: This has been fixed in version 5.1.1
3. **Version mismatches**: Ensure all package.json files have consistent versions
4. **Plugin not registered**: The plugin might not be properly registered with Capacitor

## Installation Steps

```bash
# Install the plugin
npm install com-easystep2-datawedge-plugin-intent-capacitor@5.1.1

# Sync the project
npx cap sync

# Build for Android
npx cap build android
```

## Usage Example

```typescript
import { IntentShim } from 'com-easystep2-datawedge-plugin-intent-capacitor';

// Enable debug mode to see more detailed logs
await IntentShim.setDebugMode({ enabled: true });

// Register for DataWedge intents
await IntentShim.registerBroadcastReceiver({
  filterActions: ['com.symbol.datawedge.api.RESULT_ACTION']
});

// Listen for intents
IntentShim.onIntent((intent) => {
  console.log('Received intent:', intent);
});
```

## Debugging Steps

1. **Check if the plugin is properly registered**:
   ```typescript
   // This should not throw an error
   await IntentShim.packageExists('com.zebra.mdna.scanner');
   ```

2. **Enable debug mode**:
   ```typescript
   await IntentShim.setDebugMode({ enabled: true });
   ```

3. **Check device logs**:
   ```bash
   adb logcat | grep IntentShim
   ```

## Version Changes in 5.1.1

- Added missing `setDebugMode` method to Android implementation
- Fixed version synchronization across all packages
- Updated package.json paths for proper Capacitor registration
- Improved error handling and debugging capabilities

## Android Permissions

Make sure your app has the necessary permissions in `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />
```

For targeting Android 11+ (API 30+), you might also need package visibility declarations.