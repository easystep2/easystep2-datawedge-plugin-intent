import { WebPlugin } from '@capacitor/core';
import type {
    IntentShimPlugin,
    IntentResult,
    IntentOptions,
    BroadcastReceiverOptions,
} from './definitions';

export class IntentShimWeb extends WebPlugin implements IntentShimPlugin {
    async registerBroadcastReceiver(options: BroadcastReceiverOptions): Promise<void> {
        console.warn(`IntentShim Web: registerBroadcastReceiver ${JSON.stringify(options.filterActions)}`);
        throw this.unimplemented('Not available in web environment');
    }

    async unregisterBroadcastReceiver(): Promise<void> {
        throw this.unimplemented('Not available in web environment');
    }

    async sendBroadcast(options: IntentOptions): Promise<void> {
        console.warn(`IntentShim Web: sendBroadcast ${options.action}`);
        throw this.unimplemented('Not available in web environment');
    }

    async startActivity(options: IntentOptions): Promise<void> {
        // For web, we can at least try to open URLs
        if (options.url && options.action === 'android.intent.action.VIEW') {
            window.open(options.url, '_blank');
            return;
        }
        throw this.unimplemented('Full intent functionality not available in web environment');
    }

    async getIntent(): Promise<IntentResult> {
        throw this.unimplemented('Not available in web environment');
    }

    async startActivityForResult(_options: IntentOptions & { requestCode: number }): Promise<IntentResult> {
        throw this.unimplemented('Not available in web environment');
    }

    async sendResult(_options: { extras?: any; resultCode?: number }): Promise<void> {
        throw this.unimplemented('Not available in web environment');
    }

    async packageExists(_options: { packageName: string }): Promise<{ exists: boolean }> {
        return { exists: false };
    }
}
