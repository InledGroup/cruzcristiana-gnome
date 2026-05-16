# Port Extensions to GNOME Shell 50

TIP

There were no relevant changes to `metadata.json` in GNOME 50.

Extension [​](./gnome-shell-50.md)
-----------------------------------------------------------------------------------

TIP

There were no relevant changes to `extension.js` in GNOME 50.

Preferences [​](./gnome-shell-50.md)
---------------------------------------------------------------------------------------

TIP

There were no relevant changes to `prefs.js` in GNOME 50.

GNOME Shell [​](./gnome-shell-50.md)
---------------------------------------------------------------------------------------

### `easeAsync()` [​](./gnome-shell-50.md)

GNOME Shell 50 adds a new `easeAsync()` function which is the async variant of `ease()`. When the transition is completed, the promise is resolved:

js

    await actor.easeAsync({
        translation_y: 0,
        duration: 300,
        mode: Clutter.AnimationMode.EASE_OUT_QUAD,
    });

For transition interruption, the promise is rejected, and you can catch the CANCELLED error.

If you want to ignore CANCELLED errors but otherwise log them via `logError()`, there is a new `logErrorUnlessCancelled()` helper function in `misc/errorUtils.js`.

### Time Limits Manager and Parental Control [​](./gnome-shell-50.md)

When the parental controls session limits are reached, GNOME Shell 50 shows a new widget instead of the unlock prompt.

`gdm/authPrompt.js` has a new `ParentalControlsShield` class for this widget. `AuthPrompt._parentalControlsShield` holds the instance after calling `AuthPrompt.setAuthBlocked()`.

`misc/timeLimitsManager.js` holds the `parentalControlsManager` and calls the `TimeLimitsManager._onSessionLimitsChanged()` on `session-limits-changed` signal.

Also, you can use these properties from `TimeLimitsManager` to check whether the feature is enabled:

*   `parentalControlsSessionLimitsEnabled`
*   `wellbeingDailyLimitEnabled`

You can access the instance with `Main.timeLimitsManager`.

In `parentalControlsManager.js`, you can get the `ParentalControlsManager` instance by `getDefault()` function.

The `ParentalControlsManager` adds `appFilterEnabled()` and `sessionLimitsEnabled()` to check the status. Additionally, there is `anyParentalControlsEnabled` property to check whether any parental controls are supported and enabled for the current user.

### Keyboard Manager [​](./gnome-shell-50.md)

`misc/keyboardManager.js` removed `releaseKeyboard()` and `holdKeyboard()` since they don't have any input-method caller.

### Input Indicator [​](./gnome-shell-50.md)

`OutputIndicator` in `ui/status/volume.js` adds a new `_updatePrivacyIndicator()` method since the indicator no longer uses `privacy-indicator` style classname when the microphone is muted.

### Calendar [​](./gnome-shell-50.md)

There is a new `org.gnome.desktop.calendar.week-start-day` settings and `ui/calendar.js` adds a new `_getWeekStartDay()` function for that.

### Restart [​](./gnome-shell-50.md)

`show-restart-message` and `restart` signals aren't emitted in `global.display` anymore.

Also, `RunDialog._restart()` method has been removed form `ui/runDialog.js` since restart is only available on X11 and GNOME Shell 50 removed X11 support.

### Slider [​](./gnome-shell-50.md)

`Slider` in `ui/slider.js` added `addMark()` and `clearMarks()` helper methods.

### `gnome-extensions` [​](./gnome-shell-50.md)

The `install` command for `gnome-extensions` has added a `print-uuid` flag. With this flag, the extension UUID is printed on success.

### `gnome-shell-test-tool` [​](./gnome-shell-50.md)

`gnome-shell-test-tool` added the `--extension` option to install and enable an extension zip package before starting GNOME Shell:

bash

    gnome-shell-test-tool --extension extension-package.zip tests/testMyExtension.js

GJS [​](./gnome-shell-50.md)
-----------------------------------------------------------------------

### One-shot timeout and idle functions [​](./gnome-shell-50.md)

To make the idle and timeouts introspectable, and make them clear that they are only called once, `GLib` added three new one-shot functions:

*   `GLib.idle_add_once()`
*   `GLib.timeout_add_once()`
*   `GLib.timeout_add_seconds_once()`

---
Created with web2skill, from [Inled Group](https://inled.es)