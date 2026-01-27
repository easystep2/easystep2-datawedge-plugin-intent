import { WebPlugin } from '@capacitor/core';
import type { IntentShimPlugin, IntentResult } from './definitions';

export class IntentShimWeb extends WebPlugin implements IntentShimPlugin {
    private intentListeners: ((intent: IntentResult) => void)[] = [];
    private debug: boolean = false;

    constructor() {
        super();
        this.log('IntentShim Web: Initialized');
    }

    async registerBroadcastReceiver(options: { filterActions: string[] }): Promise<void> {
        this.log(`IntentShim Web: registerBroadcastReceiver with filters ${JSON.stringify(options.filterActions)}`);
        throw this.unimplemented('Not available in web environment');
    }

    async unregisterBroadcastReceiver(): Promise<void> {
        this.log('IntentShim Web: unregisterBroadcastReceiver');
        throw this.unimplemented('Not available in web environment');
    }

    async sendBroadcast(options: { action: string; extras?: any }): Promise<void> {
        this.log(`IntentShim Web: sendBroadcast ${options.action}`);
        throw this.unimplemented('Not available in web environment');
    }

    async startActivity(options: { action: string; url?: string; type?: string; extras?: any }): Promise<void> {
        this.log(`IntentShim Web: startActivity ${options.action}`);
        // For web, we can at least try to open URLs
        if (options.url && options.action === 'android.intent.action.VIEW') {
            window.open(options.url, '_blank');
            return;
        }
        throw this.unimplemented('Full intent functionality not available in web environment');
    }

    async getIntent(): Promise<{ action: string; data: string; type: string; extras: any }> {
        this.log('IntentShim Web: getIntent');
        throw this.unimplemented('Not available in web environment');
    }

    async startActivityForResult(options: {
        action: string; url?: string; type?: string; extras?: any; requestCode: number
    }): Promise<void> {
        this.log(`IntentShim Web: startActivityForResult ${options.action}`);
        throw this.unimplemented('Not available in web environment');
    }

    async sendResult(options: { extras?: any; resultCode?: number }): Promise<void> {
        this.log(`IntentShim Web: sendResult with resultCode ${options.resultCode || 'none'} and extras ${JSON.stringify(options.extras || {})}`);
        throw this.unimplemented('Not available in web environment');
    }

    onIntent(callback: (intent: IntentResult) => void): void {
        this.log('IntentShim Web: onIntent listener registered');
        this.intentListeners.push(callback);
    }

    async packageExists(packageName: string): Promise<{ exists: boolean }> {
        this.log(`IntentShim Web: packageExists ${packageName}`);
        return { exists: false };
    }

    async setDebugMode(options: { enabled: boolean }): Promise<void> {
        this.debug = options.enabled;
        this.log(`IntentShim Web: Debug mode ${options.enabled ? 'enabled' : 'disabled'}`);
    }

    private log(message: string): void {
        if (this.debug) {
            console.log(message);
        }
    }
}
