# Port Extensions to GNOME Shell 45

ESM [​](./gnome-shell-45.md)
-----------------------------------------------------------------------

GNOME Shell 45 moved to ESM (ECMAScript modules). That means you **MUST** use the standard `import` declaration instead of relying on the previous `imports.*` approach.

If you are not familiar with ESM yet, please read the [MDN guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to learn about modules in general. For GNOME Shell extensions, modules can be split into 3 categories:

1.  GI libraries are imported as defaults with a module specifier using a `gi://` URI scheme. So import them with `import SOME_NAME from 'gi://LIBRARY_NAME'`.
2.  GNOME Shell files are imported as [resources](https://gjs-docs.gnome.org/gio20~2.0/gio.resource) with a `resource://` URI scheme. See the examples below.
3.  Your own files are imported with relative paths.

Here're some examples of importing modules in the old and the new way:

*   importing GObject-Introspection generated (gi) libraries
    
    js
    
        // Before GNOME 45
        const GLib = imports.gi.GLib;
        
        // GNOME 45
        import GLib from 'gi://GLib';
    
*   importing versioned gi libraries
    
    js
    
        // Before GNOME 45
        imports.gi.versions.Soup = '3.0';
        const Soup = imports.gi.Soup;
        
        // GNOME 45
        import Soup from 'gi://Soup?version=3.0';
    
*   importing native GNOME Shell modules (e.g., from the [ui directory](https://gitlab.gnome.org/GNOME/gnome-shell/-/tree/main/js/ui))
    
    js
    
        // Before GNOME 45
        const Main = imports.ui.main;
        
        // GNOME 45
        import * as Main from 'resource:///org/gnome/shell/ui/main.js';
    
*   importing native GNOME Shell modules (e.g., from the [misc directory](https://gitlab.gnome.org/GNOME/gnome-shell/-/tree/main/js/misc))
    
    js
    
        // Before GNOME 45
        const Util = imports.misc.util;
        
        // GNOME 45
        import * as Util from 'resource:///org/gnome/shell/misc/util.js';
    
*   importing parts of a module
    
    js
    
        // Before GNOME 45
        const {panel, wm} = imports.ui.main;
        
        // GNOME 45
        import {panel, wm} from 'resource:///org/gnome/shell/ui/main.js';
    
*   importing your own modules that are part of your extension's code base
    
    js
    
        // Before GNOME 45
        const Me = imports.misc.extensionUtils.getCurrentExtension();
        const MyModule = Me.imports.MyModule;
        
        // GNOME 45
        import * as MyModule from './MyModule.js';
    

`extension.js` vs `prefs.js`

The GNOME Shell resource path to be used while importing from within `prefs.js` is a bit different compared to imports in `extension.js`. In `prefs.js`, resource paths start with `resource:///org/gnome/Shell/Extensions/js/`, while in the `extension.js` case, they start with `resource:///org/gnome/shell/`.

For example, here's how you'd import the `misc/config` module:

*   In `extension.js`:
    
    js
    
        import * as Config from 'resource:///org/gnome/shell/misc/config.js';
    
*   in `prefs.js` (please note the path is case sensitive):
    
    js
    
        import * as Config from 'resource:///org/gnome/Shell/Extensions/js/misc/config.js';
    

### `shell-version` [​](./gnome-shell-45.md)

Since ESM files contain `import` and `export` keywords, your extension modules won't be compatible with older GNOME Shell versions. You should remove the old shell versions and only use `45` in `shell-version` in your `metadata.json`!

The good news is that [e.g.o](https://extensions.gnome.org/) supports multi versioning - you can still submit multiple packages with different shell versions.

`extensionUtils` [​](./gnome-shell-45.md)
-----------------------------------------------------------------------------------------------

`extensionUtils` no longer contains helper functions extensions usually use. Instead, you can use `Extension`'s and `ExtensionBase`'s properties and methods.

Additionally, the `extension` module is offering translation functions (`gettext`, `ngettext` and `pgettext`).

For example, here we use `getSettings()` and `gettext()`:

js

    import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
    
    export default class MyTestExtension extends Extension {
        enable() {
            this._settings = this.getSettings();
            console.log(_('This is a translatable text'));
        }
    
        disable() {
            this._settings = null;
        }
    }

If subclassing [`Extension`](./extension.md) and [`ExtensionPreferences`](./extension.md), you can lookup the extension object from any module by using the static methods:

js

    import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
    
    
    let extensionObject, extensionSettings;
    
    // Getting the extension object by UUID
    extensionObject = Extension.lookupByUUID('example@gjs.guide');
    extensionSettings = extensionObject.getSettings();
    console.log(extensionObject.metadata);
    
    // Getting the extension object by URL
    extensionObject = Extension.lookupByURL(import.meta.url);
    extensionSettings = extensionObject.getSettings();
    console.log(extensionObject.metadata);

The properties and methods you can use:

Property/Method

Output

Description

`initTranslations()`

`null`

Consider this method deprecated. Only specify `gettext-domain` in `metadata.json`. GNOME Shell can automatically initiate the translation for you when it sees the `gettext-domain` key in `metadata.json`.

`getSettings()`

`Gio.Settings`

Still can read `settings-schema` from `metadata.json`.

`openPreferences()`

`null`

Opens the preferences window if your extension has one.

`uuid`

`string`

Extension's UUID value

`dir`

`Gio.File`

Extension's directory path as an instance of `Gio.File`

`path`

`string`

Extension's directory path as a string

`metadata`

`object`

Metadata object built from `metadata.json`

Extension [​](./gnome-shell-45.md)
-----------------------------------------------------------------------------------

`extension.js` **MUST** export a default class containing `enable()` and `disable()` methods:

js

    export default class MyTestExtension {
        enable() {
        }
    
        disable() {
        }
    }

Preferences [​](./gnome-shell-45.md)
---------------------------------------------------------------------------------------

If your extension is using `prefs.js`, you should export a default class extending `ExtensionPreferences` from the `prefs` module with `fillPreferencesWindow` method.

All `ExtensionBase`'s properties and methods mentioned before can be used here as well.

Just like the `extension` module, the `prefs` module is also offering translation functions.

js

    import Adw from 'gi://Adw';
    
    import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
    
    export default class MyExtensionPreferences extends ExtensionPreferences {
        fillPreferencesWindow(window) {
            window._settings = this.getSettings();
    
            const page = new Adw.PreferencesPage();
    
            const group = new Adw.PreferencesGroup({
                title: _('Group Title'),
            });
            page.add(group);
    
            window.add(page);
        }
    }

GNOME Shell [​](./gnome-shell-45.md)
---------------------------------------------------------------------------------------

### `misc.animationUtils` [​](./gnome-shell-45.md)

[misc.animationUtils](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/misc/animationUtils.js) is a new module in GNOME Shell 45 that offers some animation convenience tools.

Examples include:

*   `wiggle()` - can animate an actor (e.g., `St.Entry`) in X axis
*   `adjustAnimationTime()` - can change the animation time
*   [and more...](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/misc/animationUtils.js)

### `Math.clamp()` [​](./gnome-shell-45.md)

GNOME Shell 45 adds [Math.clamp()](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/8a8539ee6766058b39d0a5c0961a08f76799f4da/js/ui/environment.js#L357) function. You can clamp numbers between some min and max values. This is only available in `extension.js`, and not in `prefs.js`.

### Desktop [​](./gnome-shell-45.md)

#### `DND` [​](./gnome-shell-45.md)

`addClickAction()` is a new method for [draggable](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/a703e192ed4cd5df06f908e733ea4a28481bf95c/js/ui/dnd.js#L890). It allows you to add [click action](https://gjs-docs.gnome.org/clutter12~12/clutter.clickaction) to your draggable actor.

#### `MprisPlayer.app` [​](./gnome-shell-45.md)

There is a new `app` property in `MprisPlayer` that gives you [Shell.App](https://gjs-docs.gnome.org/shell12~12/shell.app) or `null`. It can be used to get the current player app.

#### `searchController` [​](./gnome-shell-45.md)

You can now get the `searchController` instance by `/ui/main.js/overview.searchController`.

#### `SearchController` Provider [​](./gnome-shell-45.md)

`SearchController` now offers `addProvider()` and `removeProvider()` so you can add and remove the search provider objects easier.

### Top Panel [​](./gnome-shell-45.md)

#### `Panel.toggleQuickSettings()` addition [​](./gnome-shell-45.md)

GNOME Shell 45 adds `toggleQuickSettings()` to the panel. You can toggle quick settings menu via `ui.main.panel.toggleQuickSettings()`.

#### `Panel.toggleAppMenu()` removal [​](./gnome-shell-45.md)

GNOME Shell 45 removs `Panel.toggleAppMenu()` since the keyboard shortcut for app menu has been removed.

#### `BackgroundAppMenuItem` [​](./gnome-shell-45.md)

`BackgroundAppMenuItem` uses spinner animation that can start spinning when quitting the app represented by the `BackgroundAppMenuItem` instance.

Type

Where

Created In

`/ui/status/backgroundApps.js/BackgroundAppMenuItem._init()`

Style Class

`.spinner`

#### `Backlight` [​](./gnome-shell-45.md)

[ui.status.backlight](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/status/backlight.js) is a new section in quick settings that allows you to control the keyboard backlight.

Type

Where

Direct Access

`/ui/main.js/panel.statusArea.quickSettings._backlight`

Created In

`/ui/panel.js/QuickSettings._init()`

Style Class

`.keyboard-brightness-item`

#### `Camera` [​](./gnome-shell-45.md)

[ui.status.camera](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/ui/status/camera.js) is a new indicator to show when user's camera device is in use.

Type

Where

Direct Access

`/ui/main.js/panel.statusArea.quickSettings._camera`

Created In

`/ui/panel.js/QuickSettings._init()`

Style Class

`.privacy-indicator`

#### `WorkspaceIndicators` [​](./gnome-shell-45.md)

`ActivitiesButton` no longer has a label. Instead, it uses `WorkspaceIndicators` as its child.

Type

Where

Implementation Path

`/ui/panel.js/WorkspaceIndicators`

Direct Access

`/ui/main.js/panel.statusArea.activities.get_first_child()`

Created In

`/ui/panel.js/ActivitiesButton._init()`

Style Class

`#panelActivities StBoxLayout`

The dots inside `WorkspaceIndicators` are instances of `WorkspaceDot`. `WorkspaceDot` uses `.scaleIn()` and `.scaleOutAndDestroy()` to animate the dots when workspaces are being added or removed:

Type

Where

Implementation Path

`/ui/panel.js/WorkspaceDot`

Style Class

`.workspace-dot` (`#panelActivities .workspace-dot`)

There is also `/ui/main.js/panel.INACTIVE_WORKSPACE_DOT_SCALE` for inactive workspace dots.

### Overview [​](./gnome-shell-45.md)

#### `MAX_THUMBNAIL_SCALE` [​](./gnome-shell-45.md)

`MAX_THUMBNAIL_SCALE` is a `const` and no longer can be changed. `ThumbnailsBox._maxThumbnailScale` is a new property that allows you to change the max thumbnail scale size.

Type

Where

Implementation Path

`/ui/workspaceThumbnail.js/ThumbnailsBox`

Direct Access

`/ui/main.js/overview._overview._controls._thumbnailsBox._maxThumbnailScale`

### Clutter and Mutter [​](./gnome-shell-45.md)

#### `Clutter.Event` [​](./gnome-shell-45.md)

When using the event objects in vfuncs and signals, use the `Clutter.Event`[getters](https://gjs-docs.gnome.org/clutter13/clutter.event) instead of the fields directly. See merge request [`mutter!3163`](https://gitlab.gnome.org/GNOME/mutter/-/merge_requests/3163), which introduces the relevant changes, and merge request [`gnome-shell!2872`](https://gitlab.gnome.org/GNOME/gnome-shell/-/merge_requests/2872), which adapts to the changes.

#### `Mtk.Rectangle` [​](./gnome-shell-45.md)

`Meta.Rectangle` should be replaced with `Mtk.Rectangle`. See merge request [`mutter!3128`](https://gitlab.gnome.org/GNOME/mutter/-/merge_requests/3128) for background information. For compatibility, `Meta.Rectangle` has temporarily been aliased to a function, which returns a `Mtk.Rectangle` (See commit [`gnome-shell@f1317f07`](https://gitlab.gnome.org/GNOME/gnome-shell/-/commit/f1317f07db8da49ad921473c5ccc9b31719b3aee)).

### Logging [​](./gnome-shell-45.md)

`log()` is just an alias for `console.log()` now and you no longer can filter `journald` by `GNOME_SHELL_EXTENSION_UUID` and `GNOME_SHELL_EXTENSION_NAME`.

`console.log()` isn't new in GNOME Shell 45 but if you are still using `log()` for different log levels, you should use `console.*` functions instead:

*   `console.debug()`
*   `console.error()`
*   `console.info()`
*   `console.log()`
*   `console.warn()`

GJS [​](./gnome-shell-45.md)
-----------------------------------------------------------------------

TIP

There were no relevant changes to GJS in GNOME 45.

---
Created with web2skill, from [Inled Group](https://inled.es)