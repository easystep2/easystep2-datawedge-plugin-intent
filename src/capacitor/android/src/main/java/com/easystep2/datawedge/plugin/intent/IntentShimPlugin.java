package com.easystep2.datawedge.plugin.intent;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.Html;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@CapacitorPlugin(name = "IntentShim")
public class IntentShimPlugin extends Plugin {

    private static final String LOG_TAG = "IntentShimPlugin";
    private final Map<BroadcastReceiver, PluginCall> receiverCalls = new HashMap<>();
    private PluginCall onNewIntentCall = null;
    private Intent deferredIntent = null;

    @Override
    public void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);
        if (onNewIntentCall != null) {
            fireOnNewIntent(intent);
        } else {
            this.deferredIntent = intent;
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void onIntent(PluginCall call) {
        call.setKeepAlive(true);
        this.onNewIntentCall = call;
        if (this.deferredIntent != null) {
            fireOnNewIntent(this.deferredIntent);
            this.deferredIntent = null;
        }
    }

    @PluginMethod
    public void sendBroadcast(PluginCall call) {
        try {
            Intent intent = populateIntent(call.getData());
            getContext().sendBroadcast(intent);
            call.resolve();
        } catch (JSONException e) {
            call.reject("Error creating intent: " + e.getMessage());
        }
    }

    @PluginMethod
    public void startActivity(PluginCall call) {
        try {
            Intent intent = populateIntent(call.getData());
            getContext().startActivity(intent);
            call.resolve();
        } catch (JSONException e) {
            call.reject("Error creating intent: " + e.getMessage());
        }
    }

    @PluginMethod
    public void startActivityForResult(PluginCall call) {
        try {
            Intent intent = populateIntent(call.getData());
            int requestCode = call.getInt("requestCode", 1);
            startActivityForResult(call, intent, "activityResult");
        } catch (JSONException e) {
            call.reject("Error creating intent: " + e.getMessage());
        }
    }

    @ActivityCallback
    private void activityResult(PluginCall call, ActivityResult result) {
        if (call == null) {
            return;
        }
        Intent intent = result.getData();
        JSObject intentJson = getIntentJson(intent);
        intentJson.put("requestCode", result.getRequestCode());
        intentJson.put("resultCode", result.getResultCode());
        call.resolve(intentJson);
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void registerBroadcastReceiver(PluginCall call) {
        call.setKeepAlive(true);

        JSObject filters = call.getData();
        JSONArray filterActions = filters.getArray("filterActions");

        if (filterActions == null || filterActions.length() == 0) {
            call.reject("filterActions argument is required.");
            return;
        }

        IntentFilter filter = new IntentFilter();
        try {
            for (int i = 0; i < filterActions.length(); i++) {
                filter.addAction(filterActions.getString(i));
            }

            JSONArray filterCategories = filters.getArray("filterCategories");
            if (filterCategories != null) {
                for (int i = 0; i < filterCategories.length(); i++) {
                    filter.addCategory(filterCategories.getString(i));
                }
            }

            JSONArray filterDataSchemes = filters.getArray("filterDataSchemes");
            if (filterDataSchemes != null) {
                for (int i = 0; i < filterDataSchemes.length(); i++) {
                    filter.addDataScheme(filterDataSchemes.getString(i));
                }
            }
        } catch (JSONException e) {
            call.reject("Error parsing filters: " + e.getMessage());
            return;
        }

        BroadcastReceiver receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                PluginCall savedCall = receiverCalls.get(this);
                if (savedCall != null) {
                    savedCall.resolve(getIntentJson(intent));
                }
            }
        };

        getContext().registerReceiver(receiver, filter);
        receiverCalls.put(receiver, call);
    }

    @PluginMethod
    public void unregisterBroadcastReceiver(PluginCall call) {
        for (BroadcastReceiver receiver : receiverCalls.keySet()) {
            try {
                getContext().unregisterReceiver(receiver);
            } catch (Exception e) {
                Log.e(LOG_TAG, "Error unregistering broadcast receiver: " + e.getMessage());
            }
        }
        receiverCalls.clear();
        call.resolve();
    }

    @PluginMethod
    public void getIntent(PluginCall call) {
        Intent intent;
        if (this.deferredIntent != null) {
            intent = this.deferredIntent;
            this.deferredIntent = null;
        } else {
            intent = getActivity().getIntent();
        }
        call.resolve(getIntentJson(intent));
    }

    @PluginMethod
    public void sendResult(PluginCall call) {
        Intent result = new Intent();
        JSObject data = call.getData();
        if (data != null && data.has("extras")) {
            try {
                result.putExtras(toBundle(data.getJSObject("extras")));
            } catch (JSONException e) {
                 Log.e(LOG_TAG, "Error converting extras to bundle: " + e.getMessage());
            }
        }
        getActivity().setResult(Activity.RESULT_OK, result);
        getActivity().finish();
        call.resolve();
    }

    @PluginMethod
    public void packageExists(PluginCall call) {
        String packageName = call.getString("package");
        if (packageName == null) {
            call.reject("package argument is required");
            return;
        }
        try {
            getContext().getPackageManager().getPackageInfo(packageName, 0);
            call.resolve(new JSObject().put("exists", true));
        } catch (PackageManager.NameNotFoundException e) {
            call.resolve(new JSObject().put("exists", false));
        }
    }

    @PluginMethod
    public void setDebugMode(PluginCall call) {
        boolean enabled = call.getBoolean("enabled", false);
        Log.d(LOG_TAG, "Debug mode " + (enabled ? "enabled" : "disabled"));
        call.resolve();
    }

    private Intent populateIntent(JSObject obj) throws JSONException {
        Intent intent = new Intent();

        if (obj.has("action")) {
            intent.setAction(obj.getString("action"));
        }
        if (obj.has("type")) {
            intent.setType(obj.getString("type"));
        }
        if (obj.has("url")) {
            intent.setData(Uri.parse(obj.getString("url")));
        }
        if (obj.has("package")) {
            intent.setPackage(obj.getString("package"));
        }

        if (obj.has("component")) {
            JSObject component = obj.getJSObject("component");
            String pkg = component.getString("package");
            String cls = component.getString("class");
            if (pkg != null && cls != null) {
                intent.setComponent(new ComponentName(pkg, cls));
            }
        }

        if (obj.has("flags")) {
            JSONArray flags = obj.getJSONArray("flags");
            for (int i = 0; i < flags.length(); i++) {
                intent.addFlags(flags.getInt(i));
            }
        }

        if (obj.has("extras")) {
            intent.putExtras(toBundle(obj.getJSObject("extras")));
        }

        return intent;
    }

    private void fireOnNewIntent(Intent intent) {
        if (this.onNewIntentCall != null) {
            JSObject intentJson = getIntentJson(intent);
            this.onNewIntentCall.resolve(intentJson);
        }
    }

    private JSObject getIntentJson(Intent intent) {
        JSObject json = new JSObject();
        if (intent == null) {
            return json;
        }
        try {
            json.put("action", intent.getAction());
            json.put("data", intent.getDataString());
            json.put("type", intent.getType());
            json.put("package", intent.getPackage());
            json.put("extras", toJsonObject(intent.getExtras()));
            if (intent.getComponent() != null) {
                json.put("component", intent.getComponent().flattenToString());
            }
        } catch (Exception e) {
            Log.e(LOG_TAG, "Error converting intent to JSON: " + e.getMessage());
        }
        return json;
    }

    private static JSObject toJsonObject(Bundle bundle) {
        JSObject json = new JSObject();
        if (bundle == null) {
            return json;
        }
        for (String key : bundle.keySet()) {
            try {
                json.put(key, toJsonValue(bundle.get(key)));
            } catch (JSONException e) {
                Log.e(LOG_TAG, "Cannot convert bundle to JSON: " + e.getMessage(), e);
            }
        }
        return json;
    }

    private static Object toJsonValue(final Object value) throws JSONException {
        if (value == null) {
            return JSONObject.NULL;
        } else if (value instanceof Bundle) {
            return toJsonObject((Bundle) value);
        } else if (value.getClass().isArray()) {
            JSONArray result = new JSONArray();
            int length = Array.getLength(value);
            for (int i = 0; i < length; ++i) {
                result.put(toJsonValue(Array.get(value, i)));
            }
            return result;
        } else if (value instanceof ArrayList<?>) {
            JSONArray result = new JSONArray();
            for (Object item : (ArrayList<?>) value) {
                result.put(toJsonValue(item));
            }
            return result;
        } else if (value instanceof String ||
                   value instanceof Boolean ||
                   value instanceof Integer ||
                   value instanceof Long ||
                   value instanceof Double) {
            return value;
        } else {
            return String.valueOf(value);
        }
    }

    private Bundle toBundle(JSObject obj) throws JSONException {
        Bundle bundle = new Bundle();
        if (obj == null) {
            return bundle;
        }
        Iterator<String> keys = obj.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            Object value = obj.get(key);

            if (value instanceof String) {
                bundle.putString(key, (String) value);
            } else if (value instanceof Boolean) {
                bundle.putBoolean(key, (Boolean) value);
            } else if (value instanceof Integer) {
                bundle.putInt(key, (Integer) value);
            } else if (value instanceof Long) {
                bundle.putLong(key, (Long) value);
            } else if (value instanceof Double) {
                bundle.putDouble(key, (Double) value);
            } else if (value instanceof JSObject) {
                bundle.putBundle(key, toBundle((JSObject) value));
            } else if (value instanceof JSONArray) {
                // This part is complex; simplified for common cases
                // For DataWedge, string arrays or parcelable arrays are common
                ArrayList list = toArrayList((JSONArray) value);
                // Heuristic to determine array type
                if (!list.isEmpty()) {
                    if (list.get(0) instanceof String) {
                        bundle.putStringArrayList(key, list);
                    } else if (list.get(0) instanceof Bundle) {
                        bundle.putParcelableArrayList(key, list);
                    }
                }
            }
        }
        return bundle;
    }

    private ArrayList toArrayList(JSONArray array) throws JSONException {
        ArrayList list = new ArrayList();
        for (int i = 0; i < array.length(); i++) {
            Object value = array.get(i);
            if (value instanceof JSONObject) {
                list.add(toBundle(new JSObject(value.toString())));
            } else {
                list.add(value);
            }
        }
        return list;
    }
}
