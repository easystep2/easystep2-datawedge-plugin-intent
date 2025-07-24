import { registerPlugin } from '@capacitor/core';
import type { IntentShimPlugin } from './definitions';

// Register the plugin
const IntentShim = registerPlugin<IntentShimPlugin>('IntentShim');

// Export constants for direct usage in client code, matching the Cordova plugin's API
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

// Export the plugin interface and implementation
export * from './definitions';
export { IntentShim };
