export interface IntentShimPlugin {
    // Core Intent functionality
    registerBroadcastReceiver(options: { filterActions: string[] }): Promise<void>;
    unregisterBroadcastReceiver(): Promise<void>;
    sendBroadcast(options: { action: string; extras?: any }): Promise<void>;
    startActivity(options: { action: string; url?: string; type?: string; extras?: any }): Promise<void>;
    getIntent(): Promise<{ action: string; data: string; type: string; extras: any }>;
    startActivityForResult(options: { action: string; url?: string; type?: string; extras?: any; requestCode: number }): Promise<void>;
    sendResult(options: { extras?: any; resultCode?: number }): Promise<void>;
    onIntent(callback: (intent: { action: string; data: string; type: string; extras: any }) => void): void;
    packageExists(packageName: string): Promise<{ exists: boolean }>;
    setDebugMode(options: { enabled: boolean }): Promise<void>;
}

// Intent response type
export interface IntentResult {
    action: string;
    data: string;
    type: string;
    extras: any;
    requestCode?: number;
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
