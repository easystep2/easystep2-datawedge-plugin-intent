export interface IntentShimPlugin {
  startActivity(options: { url: string }): Promise<{ value: string }>;
  sendBroadcast(options: { action: string, extras: { [key: string]: any } }): Promise<void>;
  registerBroadcastReceiver(options: { filterActions: string[], filterCategories: string[], filterDataSchemes: string[] }, callback: (message: any) => void): Promise<string>;
  unregisterBroadcastReceiver(options: { callbackId: string }): Promise<void>;
  onIntent(callback: (message: any) => void): Promise<string>;
  onActivityResult(callback: (message: any) => void): Promise<string>;
  getIntent(): Promise<any>;
  sendResult(options: { extras: { [key: string]: any } }): Promise<void>;
  realPathFromUri(options: { uri: string }): Promise<{ value: string }>;
  packageExists(options: { packageName: string }): Promise<{ value: boolean }>;
  checkAndRequestPermissions(): Promise<void>;
}
