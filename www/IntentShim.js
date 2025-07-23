var argscheck = require('cordova/argscheck'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    cordova = require('cordova');


/**
 * This represents a thin shim layer over the Android Intent implementation
 * @constructor
 */
function IntentShim() {
    var me = this;

    /**
     * Check and request necessary permissions for Android 13+
     * 
     * @param {Function} successCallback - Function to call on success
     * @param {Function} errorCallback - Function to call on error
     */
    this.checkAndRequestPermissions = function (successCallback, errorCallback) {
        if (cordova.platformId === 'android') {
            cordova.exec(
                successCallback,
                errorCallback,
                "IntentShim",
                "checkAndRequestPermissions",
                []
            );
        } else {
            // Non-Android platforms don't need these specific permissions
            successCallback();
        }
    };

    /**
     * Modified startActivity to handle permissions for Android 13+
     */
    this.startActivity = function (params, successCallback, errorCallback) {
        // First check permissions, then proceed with action
        this.checkAndRequestPermissions(
            function () {
                cordova.exec(
                    successCallback,
                    errorCallback,
                    "IntentShim",
                    "startActivity",
                    [params]
                );
            },
            errorCallback
        );
    };

    /**
     * Modified startActivityForResult to handle permissions for Android 13+
     */
    this.startActivityForResult = function (params, successCallback, errorCallback) {
        // First check permissions, then proceed with action
        this.checkAndRequestPermissions(
            function () {
                cordova.exec(
                    successCallback,
                    errorCallback,
                    "IntentShim",
                    "startActivityForResult",
                    [params]
                );
            },
            errorCallback
        );
    };
}

IntentShim.prototype.ACTION_SEND = "android.intent.action.SEND";
IntentShim.prototype.ACTION_VIEW = "android.intent.action.VIEW";
IntentShim.prototype.ACTION_INSTALL_PACKAGE = "android.intent.action.INSTALL_PACKAGE";
IntentShim.prototype.ACTION_UNINSTALL_PACKAGE = "android.intent.action.UNINSTALL_PACKAGE";
IntentShim.prototype.EXTRA_TEXT = "android.intent.extra.TEXT";
IntentShim.prototype.EXTRA_SUBJECT = "android.intent.extra.SUBJECT";
IntentShim.prototype.EXTRA_STREAM = "android.intent.extra.STREAM";
IntentShim.prototype.EXTRA_EMAIL = "android.intent.extra.EMAIL";
IntentShim.prototype.ACTION_CALL = "android.intent.action.CALL";
IntentShim.prototype.ACTION_SENDTO = "android.intent.action.SENDTO";
//  StartActivityForResult
IntentShim.prototype.ACTION_GET_CONTENT = "android.intent.action.GET_CONTENT";
IntentShim.prototype.ACTION_PICK = "android.intent.action.PICK";
IntentShim.prototype.RESULT_CANCELED = 0; //  Activity.RESULT_CANCELED
IntentShim.prototype.RESULT_OK = -1; //  Activity.RESULT_OK

IntentShim.prototype.startActivity = function (params, successCallback, errorCallback) {
    argscheck.checkArgs('off', 'IntentShim.startActivity', arguments);
    exec(successCallback, errorCallback, "IntentShim", "startActivity", [params]);
};

IntentShim.prototype.startActivityForResult = function (params, successCallback, errorCallback) {
    argscheck.checkArgs('off', 'IntentShim.startActivityForResult', arguments);
    exec(successCallback, errorCallback, "IntentShim", "startActivityForResult", [params]);
};

IntentShim.prototype.sendBroadcast = function (params, successCallback, errorCallback) {
    argscheck.checkArgs('off', 'IntentShim.sendBroadcast', arguments);
    exec(successCallback, errorCallback, "IntentShim", "sendBroadcast", [params]);
};

IntentShim.prototype.startService = function (params, successCallback, errorCallback) {
    argscheck.checkArgs('off', 'IntentShim.startService', arguments);
    exec(successCallback, errorCallback, "IntentShim", "startService", [params]);
};

IntentShim.prototype.registerBroadcastReceiver = function (params, callback) {
    argscheck.checkArgs('of', 'IntentShim.registerBroadcastReceiver', arguments);
    exec(callback, null, "IntentShim", "registerBroadcastReceiver", [params]);
};

IntentShim.prototype.unregisterBroadcastReceiver = function () {
    argscheck.checkArgs('', 'IntentShim.unregisterBroadcastReceiver', arguments);
    exec(null, null, "IntentShim", "unregisterBroadcastReceiver", []);
};

IntentShim.prototype.onIntent = function (callback) {
    argscheck.checkArgs('f', 'IntentShim.onIntent', arguments);
    exec(callback, null, "IntentShim", "onIntent", [callback]);
};

IntentShim.prototype.onActivityResult = function (callback) {
    argscheck.checkArgs('f', 'IntentShim.onActivityResult', arguments);
    exec(callback, null, "IntentShim", "onActivityResult", [callback]);
};

IntentShim.prototype.getIntent = function (successCallback, failureCallback) {
    argscheck.checkArgs('ff', 'IntentShim.getIntent', arguments);
    exec(successCallback, failureCallback, "IntentShim", "getIntent", []);
};

IntentShim.prototype.sendResult = function (params, callback) {
    argscheck.checkArgs('of', 'IntentShim.sendResult', arguments);
    exec(callback, null, "IntentShim", "sendResult", [params]);
}

IntentShim.prototype.realPathFromUri = function (params, successCallback, errorCallback) {
    argscheck.checkArgs('off', 'IntentShim.realPathFromUri', arguments);
    exec(successCallback, errorCallback, "IntentShim", "realPathFromUri", [params]);
};

IntentShim.prototype.packageExists = function (packageName, successCallback) {
    argscheck.checkArgs('sf', 'IntentShim.packageExists', arguments);
    exec(successCallback, null, "IntentShim", "packageExists", [packageName]);
};

window.intentShim = new IntentShim();
window.plugins = window.plugins || {};
window.plugins.intentShim = window.intentShim;

module.exports = {
    ACTION_SEND: IntentShim.prototype.ACTION_SEND,
    ACTION_VIEW: IntentShim.prototype.ACTION_VIEW,
    ACTION_INSTALL_PACKAGE: IntentShim.prototype.ACTION_INSTALL_PACKAGE,
    ACTION_UNINSTALL_PACKAGE: IntentShim.prototype.ACTION_UNINSTALL_PACKAGE,
    EXTRA_TEXT: IntentShim.prototype.EXTRA_TEXT,
    EXTRA_SUBJECT: IntentShim.prototype.EXTRA_SUBJECT,
    EXTRA_STREAM: IntentShim.prototype.EXTRA_STREAM,
    EXTRA_EMAIL: IntentShim.prototype.EXTRA_EMAIL,
    ACTION_CALL: IntentShim.prototype.ACTION_CALL,
    ACTION_SENDTO: IntentShim.prototype.ACTION_SENDTO,
    ACTION_GET_CONTENT: IntentShim.prototype.ACTION_GET_CONTENT,
    ACTION_PICK: IntentShim.prototype.ACTION_PICK,
    RESULT_CANCELED: IntentShim.prototype.RESULT_CANCELED,
    RESULT_OK: IntentShim.prototype.RESULT_OK,

    startActivity: function (params, successCallback, errorCallback) {
        argscheck.checkArgs('off', 'IntentShim.startActivity', arguments);
        exec(successCallback, errorCallback, "IntentShim", "startActivity", [params]);
    },

    startActivityForResult: function (params, successCallback, errorCallback) {
        argscheck.checkArgs('off', 'IntentShim.startActivityForResult', arguments);
        exec(successCallback, errorCallback, "IntentShim", "startActivityForResult", [params]);
    },

    sendBroadcast: function (params, successCallback, errorCallback) {
        argscheck.checkArgs('off', 'IntentShim.sendBroadcast', arguments);
        exec(successCallback, errorCallback, "IntentShim", "sendBroadcast", [params]);
    },

    startService: function (params, successCallback, errorCallback) {
        argscheck.checkArgs('off', 'IntentShim.startService', arguments);
        exec(successCallback, errorCallback, "IntentShim", "startService", [params]);
    },

    registerBroadcastReceiver: function (params, callback) {
        argscheck.checkArgs('of', 'IntentShim.registerBroadcastReceiver', arguments);
        exec(callback, null, "IntentShim", "registerBroadcastReceiver", [params]);
    },

    unregisterBroadcastReceiver: function () {
        argscheck.checkArgs('', 'IntentShim.unregisterBroadcastReceiver', arguments);
        exec(null, null, "IntentShim", "unregisterBroadcastReceiver", []);
    },

    onIntent: function (callback) {
        argscheck.checkArgs('f', 'IntentShim.onIntent', arguments);
        exec(callback, null, "IntentShim", "onIntent", [callback]);
    },

    onActivityResult: function (callback) {
        argscheck.checkArgs('f', 'IntentShim.onActivityResult', arguments);
        exec(callback, null, "IntentShim", "onActivityResult", [callback]);
    },

    getIntent: function (successCallback, failureCallback) {
        argscheck.checkArgs('ff', 'IntentShim.getIntent', arguments);
        exec(successCallback, failureCallback, "IntentShim", "getIntent", []);
    },

    sendResult: function (params, callback) {
        argscheck.checkArgs('of', 'IntentShim.sendResult', arguments);
        exec(callback, null, "IntentShim", "sendResult", [params]);
    },

    realPathFromUri: function (params, successCallback, errorCallback) {
        argscheck.checkArgs('off', 'IntentShim.realPathFromUri', arguments);
        exec(successCallback, errorCallback, "IntentShim", "realPathFromUri", [params]);
    },

    packageExists: function (packageName, successCallback) {
        argscheck.checkArgs('sf', 'IntentShim.packageExists', arguments);
        exec(successCallback, null, "IntentShim", "packageExists", [packageName]);
    },

    /**
     * Check and request necessary permissions for Android 13+
     * 
     * @param {Function} successCallback - Function to call on success
     * @param {Function} errorCallback - Function to call on error
     */
    checkAndRequestPermissions: function (successCallback, errorCallback) {
        if (cordova.platformId === 'android') {
            cordova.exec(
                successCallback,
                errorCallback,
                "IntentShim",
                "checkAndRequestPermissions",
                []
            );
        } else {
            // Non-Android platforms don't need these specific permissions
            successCallback();
        }
    },

    /**
     * Modified startActivity to handle permissions for Android 13+
     */
    startActivity: function (params, successCallback, errorCallback) {
        // First check permissions, then proceed with action
        this.checkAndRequestPermissions(
            function () {
                cordova.exec(
                    successCallback,
                    errorCallback,
                    "IntentShim",
                    "startActivity",
                    [params]
                );
            },
            errorCallback
        );
    },

    /**
     * Modified startActivityForResult to handle permissions for Android 13+
     */
    startActivityForResult: function (params, successCallback, errorCallback) {
        // First check permissions, then proceed with action
        this.checkAndRequestPermissions(
            function () {
                cordova.exec(
                    successCallback,
                    errorCallback,
                    "IntentShim",
                    "startActivityForResult",
                    [params]
                );
            },
            errorCallback
        );
    },
};