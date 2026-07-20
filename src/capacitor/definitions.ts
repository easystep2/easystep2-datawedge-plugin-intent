import type { PluginListenerHandle } from '@capacitor/core';

/** A component target (package + class) for an explicit Intent. */
export interface IntentComponent {
    package: string;
    class: string;
}

/** Options shared by startActivity / startActivityForResult / sendBroadcast. */
export interface IntentOptions {
    action?: string;
    url?: string;
    type?: string;
    /** Restrict the intent to a specific package. */
    package?: string;
    /** Target an explicit component (package + class). */
    component?: IntentComponent;
    /** Android intent flags to OR together. */
    flags?: number[];
    extras?: Record<string, any>;
}

/** Options for registering an Android BroadcastReceiver. */
export interface BroadcastReceiverOptions {
    filterActions: string[];
    filterCategories?: string[];
    filterDataSchemes?: string[];
}

// Intent response type
export interface IntentResult {
    action: string;
    data: string;
    type: string;
    package?: string;
    component?: string;
    extras: any;
    requestCode?: number;
    resultCode?: number;
}

export interface IntentShimPlugin {
    // Core Intent functionality
    registerBroadcastReceiver(options: BroadcastReceiverOptions): Promise<void>;
    unregisterBroadcastReceiver(): Promise<void>;
    sendBroadcast(options: IntentOptions): Promise<void>;
    startActivity(options: IntentOptions): Promise<void>;
    getIntent(): Promise<IntentResult>;
    startActivityForResult(options: IntentOptions & { requestCode: number }): Promise<IntentResult>;
    sendResult(options: { extras?: any; resultCode?: number }): Promise<void>;
    packageExists(options: { packageName: string }): Promise<{ exists: boolean }>;

    /**
     * Listen for intents delivered by a registered BroadcastReceiver
     * (e.g. Zebra DataWedge scans and API result actions).
     */
    addListener(
        eventName: 'onIntent',
        listenerFunc: (intent: IntentResult) => void,
    ): Promise<PluginListenerHandle>;

    /** Remove all registered `onIntent` listeners. */
    removeAllListeners(): Promise<void>;
}

// Constants that match the Android implementation
export const ACTION_SEND = 'android.intent.action.SEND';
export const ACTION_VIEW = 'android.intent.action.VIEW';
export const EXTRA_TEXT = 'android.intent.extra.TEXT';
export const EXTRA_SUBJECT = 'android.intent.extra.SUBJECT';
export const EXTRA_STREAM = 'android.intent.extra.STREAM';
export const EXTRA_EMAIL = 'android.intent.extra.EMAIL';
export const ACTION_CALL = 'android.intent.action.CALL';
export const ACTION_SENDTO = 'android.intent.action.SENDTO';
export const ACTION_GET_CONTENT = 'android.intent.action.GET_CONTENT';
export const ACTION_PICK = 'android.intent.action.PICK';
