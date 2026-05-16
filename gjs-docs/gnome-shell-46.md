# Port Extensions to GNOME Shell 46

TIP

There were no relevant changes to `metadata.json` in GNOME 46.

Extension [​](./gnome-shell-46.md)
-----------------------------------------------------------------------------------

TIP

There were no relevant changes to `extension.js` in GNOME 46.

GNOME Shell [​](./gnome-shell-46.md)
---------------------------------------------------------------------------------------

### `appDisplay` [​](./gnome-shell-46.md)

`ui/appDisplay.js/FolderIcon` now uses `overview-tile app-folder` style class instead of `app-well-app app-folder`.

And the edit icon for `ui/appDisplay.js/AppFolderDialog` folder name entry now uses `icon-button` style class instead of `edit-folder-button`.

Also `app-well-app` style class renamed to `overview-tile` and `app-well-app-running-dot` renamed to `app-grid-running-dot` for `ui/appDisplay.js/AppIcon`.

### `Calendar` [​](./gnome-shell-46.md)

`ui/calendar.js/Calendar` uses `calendar-day-heading` instead of `calendar-day calendar-day-heading` style class for weekday labels.

### `CtrlAtlTab` [​](./gnome-shell-46.md)

`ui/ctrlAltTab.js/CtrlAltTabManager` uses `shell-focus-windows-symbolic` icon instead of `focus-windows-symbolic`.

### `WorldClocksSection` [​](./gnome-shell-46.md)

`ui/dateMenu.js/WorldClocksSection`'s header now uses `no-world-clocks` style class name when no world clocks have been set by the user.

### `WeatherSection` [​](./gnome-shell-46.md)

`ui/dateMenu.js/WeatherSection` now uses `no-location` style class name when the weather location can not be retrieved.

### `MessagesIndicator` [​](./gnome-shell-46.md)

`ui/dateMenu.js/MessagesIndicator` now uses `messages-indicator` style class name.

### `Message` [​](./gnome-shell-46.md)

Since the message list has been changed on GNOME Shell 46, `ui/messageList.js/Message` has new header (`ui/messageList.js/MessageHeader`) and time label (`ui/messageList.js/TimeLabel`).

Also `ui/messageList.js/Message` has `datetime` getter and setter for the time label.

The message box under message header has `message-box` style class name.

### `MessageTray` [​](./gnome-shell-46.md)

`ui/messageTray.js/NotificationPolicy` has new static `newForApp()` method that can create a new policy for the app.

`ui/messageTray.js/Notification` has new `iconName` getter and setter.

The new `ui/messageTray.js/getSystemSource()` allows you to get a system notification source that `Main.notify()` and most Shell notifications use.

### `PopupMenu` [​](./gnome-shell-46.md)

`ui/popupMenu.js/Ornament` enum added new `NO_DOT` to have less ambiguous symbols for radio options. This ornament will use `ornament-dot-checked-symbolic` and `ornament-dot-unchecked-symbolic` icons.

`ui/popupMenu.js/Switch` is using `switch-on-symbolic` and `switch-off-symbolic` icons for on and off.

### `Screenshot` [​](./gnome-shell-46.md)

Since session mode can disallow the screencast (`sessionMode.allowScreencast`), `ui/screenshot.js/UIMode` enum added new `SCREENSHOT_ONLY`.

Also, `ui/screenshot.js/ScreenshotUI` has new `screenshot-taken` and `closed` signals.

### New Keybindings [​](./gnome-shell-46.md)

New keybindings added in `ui/windowManager/WindowManager` since GNOME Shell 46 using new key bindings for opening a new instance of pinned applications (`Super + Ctrl + Number`).

### `BackgroundAppMenuItem` close icon [​](./gnome-shell-46.md)

The style class for background app menu item close button changed from `close-button` to `icon-button`.

### Keyboard Model Configuration Support [​](./gnome-shell-46.md)

Since keyboard model configuration support has been added (`xkb-model`), `ui/status/keyboard.js/InputSourceSystemSettings` has new getter and setter for `keyboardModel` and emitting `keyboard-model-changed` when the keyboard mode is getting changed.

### `ExtensionState` [​](./gnome-shell-46.md)

`misc/extensionUtils.js/ExtensionState` enum renamed some of the states:

Old

New

`ENABLED`

`ACTIVE`

`DISABLED`

`INACTIVE`

`DISABLING`

`DEACTIVATING`

`ENABLING`

`ACTIVATING`

### `St.Bin` Expand Properties [​](./gnome-shell-46.md)

`St.Bin` and all sub classes like `Button`, `QuickSettingsItem`, ... now only expand according to its expand properties (`x-expand` and `y-expand`), not when the alignment is set to `Clutter.ActorAlign.FILL`.

### `St.Button` [​](./gnome-shell-46.md)

`St.Button` label now defaults to plain text not Pango markup.

### `Clutter.cairo` Hellpers [​](./gnome-shell-46.md)

GNOME Shell 46 dropped `Clutter.cairo` helpers. If you are using `Clutter.cairo_set_source_color()` in `St.DrawingArea`, `cairo.Context` can use `setSourceColor()` instead (`cr.setSourceColor()`).

### `Meta.Barrier.display` [​](./gnome-shell-46.md)

`Meta.Barrier.display` is now deprecated. To get the backend barrier you can use `global.backend` which returns `Meta.Barrier.backend`.

### `Shell.BlurEffect` [​](./gnome-shell-46.md)

The `sigma` in `Shell.BlurEffect` should be replaced by `radius`. Since the sigma value is `radius / 2.0`, the `radius` value will be `sigma * 2.0`.

GJS [​](./gnome-shell-46.md)
-----------------------------------------------------------------------

### `Clutter.Container` [​](./gnome-shell-46.md)

`Clutter.Container` was removed. To feature test you can do:

js

    if (Clutter.Container === undefined) {
        console.log('No Clutter Container');
    }

[`Clutter.Container.add_actor()`](https://gjs-docs.gnome.org/clutter13~13/clutter.container#method-add_actor) and [`Clutter.Container.remove_actor()`](https://gjs-docs.gnome.org/clutter13~13/clutter.container#method-remove_actor) are deprecated and you should use [`Clutter.Actor.add_child()`](https://gjs-docs.gnome.org/clutter13~13/clutter.actor#method-add_child) and [`Clutter.Actor.remove_child()`](https://gjs-docs.gnome.org/clutter13~13/clutter.actor#method-remove_child) instead.

So, instead of `actor-added` and `actor-removed` signals you can use `child-added` and `child-removed`.

### `Gio.UnixInputStream` [​](./gnome-shell-46.md)

`Gio.UnixInputStream` is moved to [GioUnix](https://gjs-docs.gnome.org/giounix20~2.0/) and you should use `GioUnix.InputStream` instead.

---
Created with web2skill, from [Inled Group](https://inled.es)