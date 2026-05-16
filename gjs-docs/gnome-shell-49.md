# Port Extensions to GNOME Shell 49

TIP

There were no relevant changes to `metadata.json` in GNOME 49.

Extension [​](./gnome-shell-49.md)
-----------------------------------------------------------------------------------

TIP

There were no relevant changes to `extension.js` in GNOME 49.

Preferences [​](./gnome-shell-49.md)
---------------------------------------------------------------------------------------

TIP

There were no relevant changes to `prefs.js` in GNOME 49.

GNOME Shell [​](./gnome-shell-49.md)
---------------------------------------------------------------------------------------

### Accessibility Toggles [​](./gnome-shell-49.md)

GNOME Shell 49 added some new quick toggles to the `ui/status/accessibility.js`:

*   `HighContrastToggle`
*   `MagnifierToggle`
*   `LargeTextToggle`
*   `ScreenReaderToggle`
*   `ScreenKeyboardToggle`
*   `VisualBellToggle`
*   `StickyKeysToggle`
*   `SlowKeysToggle`
*   `BounceKeysToggle`
*   `MouseKeysToggle`

For this version, they are only used in the GDM accessibility menu, but they will eventually find their way into quick settings in GNOME Shell 50.

Since the accessibility button moved to bottom of GDM, `a11y` was removed from the right side of GDM panel.

Also the accessibility indicator icon name renamed from `org.gnome.Settings-accessibility-symbolic` to `accessibility-menu-symbolic`.

### Brightness Manager [​](./gnome-shell-49.md)

GNOME Shell 49 includes the new `/misc/brightnessManager.js` file for monitor brightness management which was previously handled in gnome-settings-daemon.

The main instances of the brightness manager can be accessed with `Main.brightnessManager`. The Quick settings brightness slider in `ui/status/brightness.js` was adjusted accordingly and a `org.gnome.Shell.Brightness` D-Bus interface was added in `ui/shellDBus.js`.

### Do Not Disturb Toggle [​](./gnome-shell-49.md)

The `DoNotDisturbSwitch` class in `ui/calendar.js` has been removed. Its functionality has been replaced by the new `DoNotDisturbToggle` quick settings toggle button, which you can now find in `ui/status/doNotDisturb.js`.

Also, message indicator in date menu, now only uses `message-indicator-symbolic` icon name when it is visible.

### `WorkspaceSwitcherPopup` [​](./gnome-shell-49.md)

There's a new `MonitorWorkspaceSwitcherPopup` class, in `ui/workspaceSwitcherPopup.js`. The `WorkspaceSwitcherPopup` now uses this new class to create workspace switcher popups for all or primary monitors.

As a result of this change, the `_redisplay()` method in `WorkspaceSwitcherPopup` has been renamed to `_redisplayAllPopups()`.

### `Meta.Rectangle` [​](./gnome-shell-49.md)

Since GNOME Shell 45, `Meta.Rectangle` was deprecated. GNOME Shell 49 removed `Meta.Rectangle`, and if you are still using it, it should be replaced with `Mtk.Rectangle`.

### Screenshot Notification [​](./gnome-shell-49.md)

Screenshot now uses its own notification source. You can get the source with `ui/screenshot.js/getScreenshotNotificationSource()`.

### App Menu Button [​](./gnome-shell-49.md)

GNOME Shell 49 removes the `AppMenuButton` from `js/ui/panel.js`. This button was unused since GNOME Shell 45. So if your extension still relies on that code, you'll need to implement or copy it.

### `CaptivePortalHandler` [​](./gnome-shell-49.md)

`CaptivePortalHandler._portalHelperDone()` method in `ui/status/network.js` renamed to `_portalHelperStatusChanged()` and it's getting called when the `StatusChanged` signal is getting emitted from portal helper.

### `OsdWindowManager` [​](./gnome-shell-49.md)

To show the OSD on any combination of monitors, `OsdWindowManager` in `ui/osdWindow.js` now uses three show methods:

*   `show()`
*   `showOne()`
*   `showAll()`

You can use `showOne()` method if you still want to use the monitor index.

### `ScreenShield` [​](./gnome-shell-49.md)

To adapt `Meta.CursorTracker` changes, `ScreenShield` class in `ui/screenShield.js` added a new `_hidePointer()` method to hide the pointer.

### `NotificationsBox` players [​](./gnome-shell-49.md)

GNOME Shell 49 added the ability to quickly pause or resume media in unlock dialog. To do that, `NotificationsBox` class in `ui/unlockDialog.js` added two methods: `_addPlayer()` and `_removePlayer()`. Added players are stored in `_players` property.

### Debugging [​](./gnome-shell-49.md)

Since X11 is disabled by default, the nested mode is no longer available.

To get a nested shell instance you can use development kit:

bash

    dbus-run-session gnome-shell --devkit --wayland

GJS [​](./gnome-shell-49.md)
-----------------------------------------------------------------------

### `Meta` [​](./gnome-shell-49.md)

#### `Meta.WaylandClient` [​](./gnome-shell-49.md)

`Meta.WaylandClient` was redesigned and now exists for all wayland clients. The previous use case of spawning a subprocess as a wayland client can be achieved using `Meta.WaylandClient.new_subprocess`. Previous `Meta.WaylandClient` functionality can be achieved via `Meta.WaylandClient.owns_window` and new API exposed on `Meta.Window`.

#### `Meta.LogicalMonitor` and `Meta.Monitor` [​](./gnome-shell-49.md)

`Meta.LogicalMonitor` and `Meta.Monitor` have been added. Their use is rather limited at the moment but they are compatible with monitor related functions on `Meta.Display` via `Meta.LogicalMonitor.get_number`. The monitor related functions on `Meta.Display` will get phased out in future releases. They can be accessed via `meta.MonitorManager.get_logical_monitors`, `meta.MonitorManager.get_monitors`, `Meta.LogicalMonitor.get_monitors` and `Meta.Backend.get_current_logical_monitor`.

#### `Meta.Backlight` [​](./gnome-shell-49.md)

`Meta.Backlight` has been added. The backlights can be accessed via `Meta.Monitor.get_backlight` and replace the backlight handling previously done in gnome-settings-daemon. See the GNOME Shell section for the abstraction over the backlights.

#### `Meta.Window` [​](./gnome-shell-49.md)

`Meta.Window` removes the `Meta.MaximizeFlags` from the parameters for `maximize()` and `unmaximize()`. Also `get_maximized()` is removed and you can use `is_maximized()` instead. To maximize or unmaximize the window horizontally or vertically, you can call new methods `set_maximize_flags()` and `set_unmaximize_flags()`.

`Meta.Window.set_type`, `Meta.Window.hide_from_window_list` and `Meta.Window.show_in_window_list` were added which replaces functionality previously existing on `Meta.WaylandClient`.

#### `Meta.CursorTracker` [​](./gnome-shell-49.md)

`Meta.CursorTracker.set_pointer_visible()` method has been replaced by `inhibit_cursor_visibility()` and `uninhibit_cursor_visibility()`.

### Clutter [​](./gnome-shell-49.md)

#### `Clutter.ClickAction()` and `Clutter.TapAction()` [​](./gnome-shell-49.md)

`Clutter.ClickAction()` and `Clutter.TapAction()` have been removed. You should now use `Clutter.ClickGesture()` and `Clutter.LongPressGesture()` instead.

Extension Tools [​](./gnome-shell-49.md)
-----------------------------------------------------------------------------------------------

`gnome-extensions` added the `upload` command to ease the upload process to EGO:

bash

    gnome-extensions upload --accept-tos

You can then enter your EGO username and password. If you are using it in CI, you can use the `--user`, `--password` or `--password-file` options.

Please take measures to avoid exposing your password. Using the password in a command option risks exposing it in logs, the environment or the filesystem.

You can read more about the `upload` command in the manual (`man gnome-extensions`).

---
Created with web2skill, from [Inled Group](https://inled.es)