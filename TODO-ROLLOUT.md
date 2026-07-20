# DataWedge Intent Plugin — Rollout TODO

Tracking doc for the plugin changes made ahead of the Angular v22 / Ionic 8+
"0 base" rollout. Delete or archive once the base version is tagged.

## Done in this change (v6.0.0 — MAJOR, breaking)

Released as a **major** bump because the public Capacitor API changed incompatibly.
(Only the Capacitor package + root were bumped to 6.0.0; the Cordova package stays on
its own 4.x line.)

- **`definitions.ts` rewritten** to match the native implementation and real usage:
  - Added typed `addListener('onIntent', …)` + `removeAllListeners()` (was called via
    `as any` from the app; Java already delivers through `notifyListeners("onIntent", …)`).
  - Added shared `IntentOptions` (now includes `package`, `component`, `flags`) and
    `BroadcastReceiverOptions` (now includes `filterCategories`, `filterDataSchemes`).
  - `IntentResult` now includes `package`, `component`, `resultCode`.
  - **Breaking:** `packageExists(packageName: string)` → `packageExists({ packageName })`.
    The old signature never worked (Java read the `"package"` key from the options object).
  - **Breaking:** removed `setDebugMode()` from the interface + web — it had **no native
    implementation** and threw "not implemented" on device.
- **`web.ts`** aligned to the new types; removed the custom `onIntent`/listener array
  (the Capacitor `WebPlugin` base already provides `addListener`/`removeAllListeners`).
- **`IntentShimPlugin.java`**: `packageExists` now reads the `"packageName"` key.

## Before rollout

- [ ] Publish `com-easystep2-datawedge-plugin-intent-capacitor@6.0.0` to the registry
      the app consumes. Until then the app installs it from a **vendored tarball**
      committed at `barcode-scanning-client/libs/*.tgz` (referenced via `file:`).
      - `npm run build:capacitor` → `cd dist/capacitor && npm pack` → publish.
      - After publishing, switch the app dependency back to `^6.0.0`.
- [ ] Confirm the Android side compiles in a real Capacitor app (needs Android SDK /
      Gradle — not verifiable in this workspace).
- [ ] Smoke-test on a Zebra device: scan delivery via `onIntent`, `SET_CONFIG`,
      `GET_ACTIVE_PROFILE`, `SWITCH_TO_PROFILE`.
- [ ] Decide the version story for the "0 base" (this bump is 6.0.0; reset if the base
      should start from a fresh version line).

## Backlog (reviewed, NOT done — out of the agreed scope)

These were identified during review but deferred:

- **Java cleanups (bucket "1e"):**
  - `startActivityForResult` computes an unused `int requestCode` local (dead code).
  - `unregisterBroadcastReceiver` clears the map but never releases the kept-alive
    `PluginCall`s (`bridge.releaseCall`) — minor leak.
  - `RECEIVER_EXPORTED` is intentional (DataWedge is a separate app) — add a comment.
  - Optionally re-implement `setDebugMode` natively instead of removing it.
- **Extra DataWedge APIs (section 3):** soft scan trigger, `GET_VERSION_INFO` on init,
  disable the KEYSTROKE output plugin, runtime symbology configuration.
