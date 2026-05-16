# Port Extensions to GNOME Shell 47

Metadata [​](./gnome-shell-47.md)
---------------------------------------------------------------------------------

TIP

There were no relevant changes to `metadata.json` in GNOME 47.

Extension [​](./gnome-shell-47.md)
-----------------------------------------------------------------------------------

TIP

There were no relevant changes to `extension.js` in GNOME 47.

Preferences [​](./gnome-shell-47.md)
---------------------------------------------------------------------------------------

`getPreferencesWidget` and `fillPreferencesWindow` in `prefs.js` are now awaited when the preference window is opened.

GNOME Shell [​](./gnome-shell-47.md)
---------------------------------------------------------------------------------------

### `GtkNotificationDaemonAppSource` [​](./gnome-shell-47.md)

There is a new dbus parameter for the `ui/notificationDaemon.js/GtkNotificationDaemonAppSource.constructor()`.

Also, there is a new `emitActionInvoked()` method in this class to emit the `ActionInvoked` signal to the dbus.

### `overviewControls` [​](./gnome-shell-47.md)

`ui/overviewControls.js/ControlsManagerLayout` class no longer uses `_spacing` property. Instead, the `spacing` parameter added to the `_computeWorkspacesBoxForState()` and `_getAppDisplayBoxForState()` methods.

### `PopupBaseMenuItem` [​](./gnome-shell-47.md)

`PopupBaseMenuItem` no longer uses `selected` style class name when the menu item is selected. Instead, it is using `:selected` pseudo class.

### `misc/util.js` [​](./gnome-shell-47.md)

`ui/messageList.js/_fixMarkup()` moved to `misc/util.js/fixMarkup()`.

### Accent Color [​](./gnome-shell-47.md)

GNOME Shell 47 added the accent color to the Settings. The selected accent color is stored in the `org.gnome.desktop.interface.accent-color`.

To apply the accent color in `stylesheet.css`, you can use `-st-accent-color` and `-st-accent-fg-color`:

css

    #panel {
        background-color: -st-accent-color;
    }

GJS [​](./gnome-shell-47.md)
-----------------------------------------------------------------------

`Clutter.Color` [​](./gnome-shell-47.md)
---------------------------------------------------------------------------------------------

`Clutter.Color` has been removed from the API. Its functionality was merged into [`Cogl.Color()`](https://gjs-docs.gnome.org/cogl15~15/cogl.color), which should be used instead.

---
Created with web2skill, from [Inled Group](https://inled.es)