*Please be aware that this application / sample is provided as-is for demonstration purposes without any guarantee of support*
=========================================================

# EasyStep2 DataWedge Plugin Intent

This is an updated and maintained version of the original [darryncampbell-cordova-plugin-intent](https://github.com/darryncampbell/darryncampbell-cordova-plugin-intent) plugin, now named `com.easystep2.datawedge.plugin.intent-cordova`.

[![npm version](http://img.shields.io/npm/v/com.easystep2.datawedge.plugin.intent.svg?style=flat-square)](https://www.npmjs.com/package/com-easystep2-datawedge-plugin-intent-cordova "View this project on npm")

## Enhancements by EasyStep2
- Fixed compatibility issues with Angular 14+
- Support for both Cordova and Capacitor in a single package
- Regularly updated and maintained

The original plugin badges are preserved for reference:

[![Original npm version](http://img.shields.io/npm/v/com-darryncampbell-cordova-plugin-intent.svg?style=flat-square&label=original)](https://npmjs.org/package/com-darryncampbell/darryncampbell-cordova-plugin-intent "View original project on npm")
[![Original npm downloads](http://img.shields.io/npm/dm/com-darryncampbell-cordova-plugin-intent.svg?style=flat-square&label=original%20downloads)](https://npmjs.org/package/com-darryncampbell/darryncampbell-cordova-plugin-intent "View original project on npm")
[![Original npm total downloads](http://img.shields.io/npm/dt/com-darryncampbell-cordova-plugin-intent.svg?style=flat-square&label=original%20total)](https://npmjs.org/package/com-darryncampbell/darryncampbell-cordova-plugin-intent "View original project on npm")
[![Original npm licence](http://img.shields.io/npm/l/com-darryncampbell-cordova-plugin-intent.svg?style=flat-square&label=license)](https://npmjs.org/package/com-darryncampbell/darryncampbell-cordova-plugin-intent "View original project on npm")

Note: the original plugin was the underlying implementation for https://www.npmjs.com/package/@ionic-native/web-intent and https://ionicframework.com/docs/native/web-intent/

# Android X support
- For Android X Support please use version >= [2.x.x](https://www.npmjs.com/package/com.easystep2.datawedge.plugin.intent) 
- For Android Support Library please refer to the original plugin version [1.3.x](https://www.npmjs.com/package/com-darryncampbell-cordova-plugin-intent/v/1.3.0)

# Interaction with Camera Plugin
If you are installing this plugin along with cordova-plugin-camera you **MUST install cordova-plugin-camera first.**

# Overview
This Cordova plugin provides a general purpose shim layer for the Android intent mechanism, exposing various ways to handle sending and receiving intents.

## Credits
This project is based on code released under the following MIT projects:
- https://github.com/darryncampbell/darryncampbell-cordova-plugin-intent
- https://github.com/napolitano/cordova-plugin-intent (marked as no longer maintained)
- https://github.com/Initsogar/cordova-webintent.git (no longer available on github but the project is forked here: https://github.com/darryncampbell/cordova-webintent)

This project is also released under MIT. Credit is given in the code where appropriate.

## IntentShim
This plugin defines a `window.plugins.intentShim` object which provides an API for interacting with the Android intent mechanism on any Android device.

## Testing / Example
An example application is available at https://github.com/darryncampbell/plugin-intent-api-exerciser to demonstrate the API and can be used to test the functionality.

## Installation

### Cordova
```bash
# Install from npm
npm install com-easystep2-datawedge-plugin-intent-cordova
cordova plugin add com-easystep2-datawedge-plugin-intent-cordova

# Or install directly from GitHub
cordova plugin add https://github.com/easystep2/easystep2-datawedge-plugin-intent.git
```

### Ionic Capacitor
```bash
# Install from npm
npm install com-easystep2-datawedge-plugin-intent-capacitor

# Or install directly from GitHub
npm install https://github.com/easystep2/easystep2-datawedge-plugin-intent.git

# Then sync your project
npx cap sync
```

## Uninstallation

### Cordova
```bash
cordova plugin remove com-easystep2-datawedge-plugin-intent-cordova
npm uninstall com-easystep2-datawedge-plugin-intent-cordova
```

### Ionic Capacitor
```bash
npm uninstall com-easystep2-datawedge-plugin-intent-capacitor
npx cap sync
```

## Package Architecture
This project has been restructured to support both Cordova and Capacitor applications from a single codebase, with specific npm packages for each platform.

### Support for Multiple Platforms
The plugin provides:
- `com-easystep2-datawedge-plugin-intent-cordova` for Cordova projects
- `com-easystep2-datawedge-plugin-intent-capacitor` for Capacitor projects
- Consistent API across both platforms
- Simplified maintenance and updates

### Migration from Previous Versions
If you were previously using a different version:

```bash
# For Cordova projects
cordova plugin remove com.easystep2.datawedge.plugin.intent
npm uninstall com.easystep2.datawedge.plugin.intent
npm install com-easystep2-datawedge-plugin-intent-cordova
cordova plugin add com-easystep2-datawedge-plugin-intent-cordova

# For Capacitor projects
npm uninstall com.easystep2.datawedge.plugin.intent
npm install com-easystep2-datawedge-plugin-intent-capacitor
npx cap sync
```

## Version Bump Guidelines
When bumping versions, follow semantic versioning:
- **MAJOR**: Breaking changes
- **MINOR**: New features without breaking changes
- **PATCH**: Bug fixes without breaking changes

## Troubleshooting

### Common Issues
- **Intent not firing**: Verify your broadcast receiver is properly registered
- **Data not received**: Check your intent extras format and data types
- **Conflicts with other plugins**: Install this plugin after other intent-related plugins
- **Angular issues**: For Angular 14+, use version 2.x.x or later

### DataWedge Specific Issues
If you're using this plugin with Zebra DataWedge:
- Ensure your DataWedge profile is configured correctly
- Verify the intent output is enabled
- Confirm the intent action and category match your registration

### Platform-Specific Issues
- **Cordova**: If you experience issues with older Cordova versions, check compatibility in the plugin.xml
- **Capacitor**: For Capacitor 3+, ensure you're using plugin version 2.x.x or higher

### Debug Mode
Enable debug mode for more verbose logging:

```javascript
window.plugins.intentShim.setDebugMode(true);
```

## Supported Platforms
- Android

## intentShim.registerBroadcastReceiver

Registers a broadcast receiver for the specified filters

    window.plugins.intentShim.registerBroadcastReceiver(filters, callback);

### Description

The `intentShim.registerBroadcastReceiver` function registers a dynamic broadcast receiver for the specified list of filters and invokes the specified callback when any of those filters are received

### Example

Register a broadcast receiver for two filters:

    window.plugins.intentShim.registerBroadcastReceiver({
        filterActions: [
            'com.easystep2.datawedge.plugin.broadcastIntent.ACTION',
            'com.easystep2.datawedge.plugin.broadcastIntent.ACTION_2'
            ]
        },
        function(intent) {
            console.log('Received broadcast intent: ' + JSON.stringify(intent.extras));
        }
    );


## intentShim.unregisterBroadcastReceiver

Unregisters any BroadcastRecivers

    window.plugins.intentShim.unregisterBroadcastReceiver();

### Description

The `intentShim.unregisterBroadcastReceiver` function unregisters all broadcast receivers registered with `intentShim.registerBroadcastReceiver(filters, callback);`.  No further broadcasts will be received for any registered filter after this call.

### Android Quirks

The developer is responsible for calling unregister / register when their application goes into the background or comes back to the foreground, if desired.

### Example

Unregister the broadcast receiver when the application receives an onPause event:

    bindEvents: function() {
        document.addEventListener('pause', this.onPause, false);
    },
    onPause: function()
    {
        window.plugins.intentShim.unregisterBroadcastReceiver();
    }

## intentShim.sendBroadcast

Sends a broadcast intent

    window.plugins.intentShim.sendBroadcast(action, extras, successCallback, failureCallback);

### Description

The `intentShim.sendBroadcast` function sends an Android broadcast intent with a specified action

### Example

Send a broadcast intent to a specified action that contains a random number in the extras

    window.plugins.intentShim.startActivity(
        {
            action: "com.easystep2.datawedge.plugin.intent.ACTION",
            extras: {
                    'random.number': Math.floor((Math.random() * 1000) + 1)
            }
        },
        function() {},
        function() {alert('Failed to open URL via Android Intent')}
    );


## intentShim.onIntent

Returns the content of the intent used whenever the application activity is launched

    window.plugins.intentShim.onIntent(callback);

### Description

The `intentShim.onIntent` function returns the intent which launched the Activity and maps to the Android Activity's onNewIntent() method, https://developer.android.com/reference/android/app/Activity.html#onNewIntent(android.content.Intent).  The registered callback is invoked whenever the activity is launched

### Android Quirks

By default the android application will be created with launch mode set to 'SingleTop'.  If you wish to change this to 'SingleTask' you can do so by modifying `config.xml` as follows:

    <platform name="android">
        ...
        <preference name="AndroidLaunchMode" value="singleTask"/>
    </platform>
See https://www.mobomo.com/2011/06/android-understanding-activity-launchmode/ for more information on the differences between the two.

### Example

Registers a callback to be invoked

    window.plugins.intentShim.onIntent(function (intent) {
        console.log('Received Intent: ' + JSON.stringify(intent.extras));
    });

## intentShim.startActivity

Starts a new activity using an intent built from action, url, type, extras or some subset of those parameters

    window.plugins.intentShim.startActivity(params, successCallback, failureCallback);

### Description

The `intentShim.startActivity` function maps to Android's activity method startActivity, https://developer.android.com/reference/android/app/Activity.html#startActivity(android.content.Intent) to launch a new activity.

### Android Quirks

Some common actions are defined as constants in the plugin, see below.

### Examples

Launch the maps activity

    window.plugins.intentShim.startActivity(
    {
        action: window.plugins.intentShim.ACTION_VIEW,
        url: 'geo:0,0?q=London'
    },
    function() {},
    function() {alert('Failed to open URL via Android Intent')}
    );

Launch the web browser

    window.plugins.intentShim.startActivity(
    {
        action: window.plugins.intentShim.ACTION_VIEW,
        url: 'http://www.google.co.uk'
    },
    function() {},
    function() {alert('Failed to open URL via Android Intent')}
    );

## intentShim.getIntent

Retrieves the intent that launched the activity

    window.plugins.intentShim.getIntent(resultCallback, failureCallback);

### Description

The `intentShim.getIntent` function maps to Android's activity method getIntent, https://developer.android.com/reference/android/app/Activity.html#getIntent() to return the intent that started this activity.

### Example

    window.plugins.intentShim.getIntent(
        function(intent)
        {
            console.log('Action' + JSON.stringify(intent.action));
            var intentExtras = intent.extras;
            if (intentExtras == null)
                intentExtras = "No extras in intent";
            console.log('Launch Intent Extras: ' + JSON.stringify(intentExtras));
        },
        function()
        {
            console.log('Error getting launch intent');
        });


## intentShim.startActivityForResult

Starts a new activity and return the result to the application

    window.plugins.intentShim.startActivityForResult(params, resultCallback, failureCallback);

### Description

The `intentShim.startActivityForResult` function maps to Android's activity method startActivityForResult, https://developer.android.com/reference/android/app/Activity.html#startActivityForResult(android.content.Intent, int) to launch a new activity and the resulting data is returned via the resultCallback.

### Android Quirks

Some common actions are defined as constants in the plugin, see below.

### Example

Pick an Android contact

    window.plugins.intentShim.startActivityForResult(
    {
        action: window.plugins.intentShim.ACTION_PICK,
        url: "content://com.android.contacts/contacts",
        requestCode: 1
    },
    function(intent)
    {
        if (intent.extras.requestCode == 1)
        {
            console.log('Picked contact: ' + intent.data);
        }
    },
    function()
    {
        console.log("StartActivityForResult failure");
    });

## intentShim.sendResult

Assuming this application was started with `intentShim.startActivityForResult`, send a result back

    window.plugins.intentShim.sendResult(args, callback);

### Description

The `intentShim.sendResult` function returns an `Activity.RESULT_OK` Intent to the activity that started this application, along with any extras that you want to send along (as `args.extras` object), and a `callback` function. It then calls Android Activity's finish() method, https://developer.android.com/reference/android/app/Activity.html#finish().

### Android Quirks

Both `args` and `callback` arguments have to be provided. If you do not need the functionality, send an empty object and an empty function

    window.plugins.intentShim.sendResult({}, function() {});

### Example

    window.plugins.intentShim.sendResult(
        {
            extras: {
                'Test Intent': 'Successfully sent',
                'Test Intent int': 42,
                'Test Intent bool': true,
                'Test Intent double': parseFloat("142.12")
            }
        },
        function() {
        
        }
    );

## intentShim.packageExists
Returns a boolean indicating if a specific package is installed on the device.

```js
window.plugins.intentShim.packageExists(packageName, callback);
```

### Description

The `intentShim.packageExists` function returns a boolean indicating if a specific [package](https://developer.android.com/studio/build/configure-app-module#set_the_application_id) is installed on the current device.

### Example
```js
const packageName = 'com.android.contacts';

window.plugins.intentShim.packageExists(packageName, (exists) => {
    if (exists) {
        console.log(`${packageName} exists!`);
    } else {
        console.log(`${packageName} does not exist...`);
    }
});
```

## Predefined Constants

The following constants are defined in the plugin for use in JavaScript
- window.plugins.intentShim.ACTION_SEND
- window.plugins.intentShim.ACTION_VIEW
- window.plugins.intentShim.EXTRA_TEXT
- window.plugins.intentShim.EXTRA_SUBJECT
- window.plugins.intentShim.EXTRA_STREAM
- window.plugins.intentShim.EXTRA_EMAIL
- window.plugins.intentShim.ACTION_CALL
- window.plugins.intentShim.ACTION_SENDTO
- window.plugins.intentShim.ACTION_GET_CONTENT
- window.plugins.intentShim.ACTION_PICK

## Tested Versions

Tested with Cordova version 6.5.0 and Cordova Android version 6.2.1
