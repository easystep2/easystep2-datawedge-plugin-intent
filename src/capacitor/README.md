# Easystep2 DataWedge Plugin (Capacitor)

A Capacitor plugin for Android Intents that integrates with Zebra DataWedge.

## Installation

```bash
npm install com-easystep2-datawedge-plugin-intent-capacitor
npx cap sync
```

## Platforms

- Android

## Usage

```typescript
import { IntentShim } from 'com-easystep2-datawedge-plugin-intent-capacitor';

// Register for barcode scan broadcast
async function registerDataWedgeBroadcastReceiver() {
  await IntentShim.registerBroadcastReceiver({ 
    filterActions: ['com.symbol.datawedge.api.RESULT_ACTION'] 
  });
  
  // Listen for broadcasts
  IntentShim.addListener('broadcastReceived', (intent) => {
    if (intent.extras && intent.extras.com_symbol_datawedge_data_string) {
      // Process barcode data
      const barcodeData = intent.extras.com_symbol_datawedge_data_string;
      console.log('Scanned barcode:', barcodeData);
    }
  });
}

// Configure DataWedge profile
async function configureDataWedgeProfile() {
  await IntentShim.sendBroadcast({
    action: 'com.symbol.datawedge.api.ACTION',
    extras: {
      'com.symbol.datawedge.api.CREATE_PROFILE': 'MyProfile',
      'com.symbol.datawedge.api.PROFILE_CONFIG': {
        'PLUGIN_CONFIG': {
          'BARCODE_PLUGIN': {
            'SCANNER_SELECTION': 'auto',
            'SCANNER_INPUT_ENABLED': true
          }
        },
        'APP_LIST': [{
          'PACKAGE_NAME': 'io.ionic.myapp', // Replace with your app's package name
          'ACTIVITY_LIST': ['*']
        }]
      }
    }
  });
}
```

## API

### IntentShim

#### Methods

- `registerBroadcastReceiver(options: { filterActions: string[] }): Promise<void>`
- `unregisterBroadcastReceiver(): Promise<void>`
- `sendBroadcast(options: { action: string; extras?: any }): Promise<void>`
- `startActivity(options: { action: string; url?: string; type?: string; extras?: any }): Promise<void>`
- `getIntent(): Promise<{ action: string; data: string; type: string; extras: any }>`
- `startActivityForResult(options: { action: string; url?: string; type?: string; extras?: any; requestCode: number }): Promise<void>`
- `sendResult(options: { extras?: any; resultCode?: number }): Promise<void>`
- `packageExists(packageName: string): Promise<{ exists: boolean }>`
- `setDebugMode(options: { enabled: boolean }): Promise<void>`

#### Listeners

- `addListener('broadcastReceived', callback): Promise<PluginListenerHandle>`
- `addListener('onIntent', callback): Promise<PluginListenerHandle>`
- `addListener('onActivityResult', callback): Promise<PluginListenerHandle>`

#### Constants

```typescript
import { 
  ACTION_SEND, ACTION_VIEW, EXTRA_TEXT, EXTRA_SUBJECT, EXTRA_STREAM, 
  EXTRA_EMAIL, ACTION_CALL, ACTION_SENDTO, ACTION_GET_CONTENT, ACTION_PICK 
} from 'com-easystep2-datawedge-plugin-intent-capacitor';
```

## Zebra DataWedge Integration

For detailed information about integrating with Zebra DataWedge, please refer to:
- [Official Zebra DataWedge API Documentation](https://techdocs.zebra.com/datawedge/latest/guide/api/)
- [DataWedge Intent API sample](https://github.com/ZebraDevs/DataWedge-API-Exerciser)

## License

MIT
