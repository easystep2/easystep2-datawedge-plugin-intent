import { WebPlugin } from '@capacitor/core';

import type { IntentShimPlugin } from './definitions';

export class IntentShimWeb extends WebPlugin implements IntentShimPlugin {
  async startActivity(options: { url: string }): Promise<{ value: string }> {
    console.log('startActivity', options);
    throw this.unimplemented('Not implemented on web.');
  }

  async sendBroadcast(options: { action: string, extras: { [key: string]: any } }): Promise<void> {
    console.log('sendBroadcast', options);
    throw this.unimplemented('Not implemented on web.');
  }

  async registerBroadcastReceiver(options: { filterActions: string[], filterCategories: string[], filterDataSchemes: string[] }, callback: (message: any) => void): Promise<string> {
    console.log('registerBroadcastReceiver', options, callback);
    throw this.unimplemented('Not implemented on web.');
  }

  async unregisterBroadcastReceiver(options: { callbackId: string }): Promise<void> {
    console.log('unregisterBroadcastReceiver', options);
    throw this.unimplemented('Not implemented on web.');
  }

  async onIntent(callback: (message: any) => void): Promise<string> {
    console.log('onIntent', callback);
    throw this.unimplemented('Not implemented on web.');
  }

  async onActivityResult(callback: (message: any) => void): Promise<string> {
    console.log('onActivityResult', callback);
    throw this.unimplemented('Not implemented on web.');
  }

  async getIntent(): Promise<any> {
    throw this.unimplemented('Not implemented on web.');
  }

  async sendResult(options: { extras: { [key: string]: any } }): Promise<void> {
    console.log('sendResult', options);
    throw this.unimplemented('Not implemented on web.');
  }

  async realPathFromUri(options: { uri: string }): Promise<{ value: string }> {
    console.log('realPathFromUri', options);
    throw this.unimplemented('Not implemented on web.');
  }

  async packageExists(options: { packageName: string }): Promise<{ value: boolean }> {
    console.log('packageExists', options);
    throw this.unimplemented('Not implemented on web.');
  }

  async checkAndRequestPermissions(): Promise<void> {
    throw this.unimplemented('Not implemented on web.');
  }
}
