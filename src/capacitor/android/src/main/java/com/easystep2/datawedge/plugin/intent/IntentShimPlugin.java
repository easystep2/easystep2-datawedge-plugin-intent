package com.easystep2.datawedge.plugin.intent;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@CapacitorPlugin(name = "IntentShim")
public class IntentShimPlugin extends Plugin {
    private static final String TAG = "IntentShim";
    private BroadcastReceiver broadcastReceiver = null;
    private boolean debugEnabled = false;


    // Store broadcast receivers and callbacks
    private final Map<BroadcastReceiver, PluginCall> receiverCallbacks = new HashMap<>();
    private PluginCall onNewIntentCall = null;
    private PluginCall onActivityResultCall = null;
    private Intent deferredIntent = null;

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");
        JSObject ret = new JSObject();
        ret.put("value", value);
        call.resolve(ret);
    }

    @PluginMethod
    public void registerBroadcastReceiver(PluginCall call) {
        try {
            JSObject options = call.getObject("options", new JSObject());
            // filterActions: string[]
            if (!options.has("filterActions")) {
                call.reject("filterActions required");
                return;
            }
            // Build intent filter
            IntentFilter filter = new IntentFilter();
            for (Object action : options.getJSONArray("filterActions")) {
                filter.addAction(action.toString());
            }
            if (options.has("filterCategories")) {
                for (Object cat : options.getJSONArray("filterCategories")) {
                    filter.addCategory(cat.toString());
                }
            }
            if (options.has("filterDataSchemes")) {
                for (Object scheme : options.getJSONArray("filterDataSchemes")) {
                    filter.addDataScheme(scheme.toString());
                }
            }
            BroadcastReceiver receiver = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    JSObject intentJson = getIntentJson(intent);
                    call.resolve(intentJson);
                }
            };
            getActivity().registerReceiver(receiver, filter);
            receiverCallbacks.put(receiver, call);
        } catch (Exception e) {
            call.reject("Failed to register receiver: " + e.getMessage());
        }
    }

    @PluginMethod
    public void unregisterBroadcastReceiver(PluginCall call) {
        for (BroadcastReceiver receiver : receiverCallbacks.keySet()) {
            try {
                getActivity().unregisterReceiver(receiver);
            } catch (Exception ignored) {}
        }
        receiverCallbacks.clear();
        call.resolve();
    }

    @PluginMethod
    public void sendBroadcast(PluginCall call) {
        try {
            JSObject obj = call.getObject("intent", new JSObject());
            Intent intent = populateIntent(obj);
            getActivity().sendBroadcast(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to send broadcast: " + e.getMessage());
        }
    }

    @PluginMethod
    public void startActivity(PluginCall call) {
        try {
            JSObject obj = call.getObject("intent", new JSObject());
            Intent intent = populateIntent(obj);
            getActivity().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to start activity: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getIntent(PluginCall call) {
        Intent intent = getActivity().getIntent();
        JSObject intentJson = getIntentJson(intent);
        call.resolve(intentJson);
    }

    @PluginMethod
    public void startActivityForResult(PluginCall call) {
        try {
            JSObject obj = call.getObject("intent", new JSObject());
            Intent intent = populateIntent(obj);
            int requestCode = obj.has("requestCode") ? obj.getInteger("requestCode") : 1;
            this.onActivityResultCall = call;
            startActivityForResult(call, intent, requestCode);
        } catch (Exception e) {
            call.reject("Failed to start activity for result: " + e.getMessage());
        }
    }

    @PluginMethod
    public void sendResult(PluginCall call) {
        try {
            JSObject obj = call.getObject("intent", new JSObject());
            Intent result = populateIntent(obj);
            getActivity().setResult(Activity.RESULT_OK, result);
            getActivity().finish();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to send result: " + e.getMessage());
        }
    }

    @PluginMethod
    public void onIntent(PluginCall call) {
        this.onNewIntentCall = call;
        if (this.deferredIntent != null) {
            JSObject intentJson = getIntentJson(this.deferredIntent);
            call.resolve(intentJson);
            this.deferredIntent = null;
        }
    }

    @PluginMethod
    public void packageExists(PluginCall call) {
        try {
            String packageName = call.getString("packageName");
            PackageManager pm = getActivity().getApplicationContext().getPackageManager();
            try {
                pm.getPackageInfo(packageName, 0);
                JSObject ret = new JSObject();
                ret.put("exists", true);
                call.resolve(ret);
            } catch (PackageManager.NameNotFoundException e) {
                JSObject ret = new JSObject();
                ret.put("exists", false);
                call.resolve(ret);
            }
        } catch (Exception e) {
            call.reject("Failed to check package: " + e.getMessage());
        }
    }

    @PluginMethod
    public void setDebugMode(PluginCall call) {
        this.debugEnabled = call.getBoolean("enabled", false);
        call.resolve();
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);
        if (onActivityResultCall != null) {
            JSObject result = new JSObject();
            result.put("requestCode", requestCode);
            result.put("resultCode", resultCode);
            result.put("intent", getIntentJson(data));
            onActivityResultCall.resolve(result);
            onActivityResultCall = null;
        }
    }

    @Override
    public void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);
        if (onNewIntentCall != null) {
            JSObject intentJson = getIntentJson(intent);
            onNewIntentCall.resolve(intentJson);
        } else {
            this.deferredIntent = intent;
        }
    }

    // Helper: Convert JSObject to Android Intent
    private Intent populateIntent(JSObject obj) {
        Intent i = new Intent();
        if (obj.has("action")) i.setAction(obj.getString("action"));
        if (obj.has("type")) i.setType(obj.getString("type"));
        if (obj.has("data")) i.setData(Uri.parse(obj.getString("data")));
        if (obj.has("package")) i.setPackage(obj.getString("package"));
        if (obj.has("flags")) i.setFlags(obj.getInteger("flags"));
        if (obj.has("extras")) {
            JSObject extras = obj.getJSObject("extras");
            for (String key : extras.keys()) {
                Object value = extras.get(key);
                if (value instanceof String) i.putExtra(key, (String)value);
                else if (value instanceof Boolean) i.putExtra(key, (Boolean)value);
                else if (value instanceof Integer) i.putExtra(key, (Integer)value);
                else if (value instanceof Double) i.putExtra(key, (Double)value);
                // Add more types as needed
            }
        }
        return i;
    }

    // Helper: Convert Android Intent to JSObject
    private JSObject getIntentJson(Intent intent) {
        JSObject intentJSON = new JSObject();
        if (intent == null) return intentJSON;
        intentJSON.put("type", intent.getType());
        Bundle extras = intent.getExtras();
        JSObject extrasJson = new JSObject();
        if (extras != null) {
            for (String key : extras.keySet()) {
                Object value = extras.get(key);
                extrasJson.put(key, value);
            }
        }
        intentJSON.put("extras", extrasJson);
        intentJSON.put("action", intent.getAction());
        intentJSON.put("categories", intent.getCategories());
        intentJSON.put("flags", intent.getFlags());
        intentJSON.put("component", intent.getComponent() != null ? intent.getComponent().flattenToString() : null);
        intentJSON.put("data", intent.getDataString());
        intentJSON.put("package", intent.getPackage());
        return intentJSON;
    }

    private void log(String message) {
        if (debugEnabled) {
            Log.d(TAG, message);
        }
    }
}