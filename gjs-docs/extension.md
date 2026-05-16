# Extension (ESModule) | GNOME JavaScript

TIP

This documentation is for GNOME 45. See [`ExtensionUtils`](./extension-utils.md) for the utilities available for previous versions.

Types [​](./extension.md)
-------------------------------------------------------------------

### `ExtensionMetadata` [​](./extension.md)

Each extension and extension preferences class is passed an instance metadata object to its `constructor()`. This object can be retrieved from the instance using the `metadata` property.

#### Properties [​](./extension.md)

*   `uuid` (`String`) — The extension UUID (JavaScript: read-only)
*   `name` (`String`) — The extension name (JavaScript: read-only)
*   `description` (`String`) — The extension description (JavaScript: read-only)
*   `shell-version` (`Array(String)`) — The list of supported GNOME Shell versions (JavaScript: read-only)
*   `dir` ([`Gio.File`](https://gjs-docs.gnome.org/gio20/gio.file)) — The extension directory as a `Gio.File` (JavaScript: read-only)
*   `path` (`String`) — The extension directory as a path (JavaScript: read-only)

Methods [​](./extension.md)
-----------------------------------------------------------------------

### Gettext [​](./extension.md)

For convenience, the `extension.js` and `prefs.js` modules both export aliases for Gettext functions that return translations for the current extension.

*   `gettext(str)` — Translate `str` using the extension's gettext domain extension's directory
    *   `str` (`String`) — The string to translate
    *   Returns (`String`) — The translated string
*   `ngettext(str, strPlural, n)` — Translate `str` and choose the plural form
    *   `str` (`String`) — The string to translate
    *   `strPlural` (`String`) — The plural form of the string
    *   `n` (`Number`) — The quantity for which translation is needed
    *   Returns (`String`) — The translated string
*   `pgettext(context, str)` — Translate `str` in the context of `context`
    *   `context` (`String`) — The context to disambiguate `str`
    *   `str` (`String`) — The string to translate
    *   Returns (`String`) — The translated string

Classes [​](./extension.md)
-----------------------------------------------------------------------

### `ExtensionBase` [​](./extension.md)

> Parent Class: `Object` ([Source](https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/extensions/sharedInternals.js))

The `ExtensionBase` class is the base class for the [`Extension`](./extension.md) and [`ExtensionPreferences`](./extension.md) classes.

This class should never be subclassed directly, and when overriding the `constructor()` for `Extension` or `ExtensionPreferences`, the `metadata` argument must be passed to the parent class.

#### Static Methods [​](./extension.md)

*   `lookupByUUID(uuid)` — Lookup an extension by UUID (e.g. `example@gjs.guide`)
    *   `uuid` (`String`) — An extension's UUID value
    *   Returns ([`ExtensionBase`](./extension.md)|`null`) — The extension object instance
*   `lookupByURL(url)` — Lookup an extension by URL (i.e. `import.meta.url`)
    *   `url` (`String`) — A `file://` URL
    *   Returns ([`ExtensionBase`](./extension.md)|`null`) — The extension object instance

#### Methods [​](./extension.md)

*   `new ExtensionBase(metadata)` — Constructor
    *   metadata ([`ExtensionMetadata`](./extension.md)) — The instance metadata object
*   `getSettings(schema)` — Get a GSettings object for `schema`, using schemas from the extension's directory
    *   `schema` (`String`) — A schema ID, or `metadata['settings-schema']` if omitted
    *   Returns (`Gio.Settings`) — A new settings object
*   `initTranslations(domain)` — Initialize Gettext to load translations from the extension's directory
    *   `domain` (`String`) — A gettext domain, or `metadata['gettext-domain']` if omitted
*   `gettext(str)` — Translate `str` using the extension's gettext domain extension's directory
    *   `str` (`String`) — The string to translate
    *   Returns (`String`) — The translated string
*   `ngettext(str, strPlural, n)` — Translate `str` and choose the plural form
    *   `str` (`String`) — The string to translate
    *   `strPlural` (`String`) — The plural form of the string
    *   `n` (`Number`) — The quantity for which translation is needed
    *   Returns (`String`) — The translated string
*   `pgettext(context, str)` — Translate `str` in the context of `context`
    *   `context` (`String`) — The context to disambiguate `str`
    *   `str` (`String`) — The string to translate
    *   Returns (`String`) — The translated string

#### Properties [​](./extension.md)

*   `dir` ([`Gio.File`](https://gjs-docs.gnome.org/gio20/gio.file)) — Gets the extension's directory (JavaScript: read-only)
*   `metadata` ([`ExtensionMetadata`](./extension.md)) — The instance metadata object (JavaScript: read-only)
*   `path` (`String`) — Gets the path to the extension's directory (JavaScript: read-only)
*   `uuid` (`String`) — Gets the extension's UUID value (JavaScript: read-only)

#### Example [​](./extension.md)

Using `Extension` static methods:

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

Using `ExtensionPreferences` static methods:

js

    import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
    
    
    let extensionObject, extensionSettings;
    
    // Getting the extension object by UUID
    extensionObject = ExtensionPreferences.lookupByUUID('example@gjs.guide');
    extensionSettings = extensionObject.getSettings();
    console.log(extensionObject.metadata);
    
    // Getting the extension object by URL
    extensionObject = ExtensionPreferences.lookupByURL(import.meta.url);
    extensionSettings = extensionObject.getSettings();
    console.log(extensionObject.metadata);

### `Extension` [​](./extension.md)

> Parent Class: [`ExtensionBase`](./extension.md) ([Source](https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/extensions/extension.js))

The `Extension` class is a base class for extensions to inherit from.

#### Methods [​](./extension.md)

*   `new Extension(metadata)` — Constructor
    *   metadata ([`ExtensionMetadata`](./extension.md)) — The instance metadata object
*   `enable()` — Called to enable an extension
*   `disable()` — Called to disable an extension
*   `openPreferences()` — Open the extension's preferences window

#### Properties [​](./extension.md)

See the properties inherited from [`ExtensionBase`](./extension.md).

#### Example [​](./extension.md)

js

    import St from 'gi://St';
    
    import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
    import * as Main from 'resource:///org/gnome/shell/ui/main.js';
    import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
    
    
    export default class ExampleExtension extends Extension {
        enable() {
            // Create a panel button
            this._indicator = new PanelMenu.Button(0.0, this.metadata.name, false);
    
            // Add an icon
            const icon = new St.Icon({
                icon_name: 'face-laugh-symbolic',
                style_class: 'system-status-icon',
            });
            this._indicator.add_child(icon);
    
            // Add the indicator to the panel
            Main.panel.addToStatusArea(this.uuid, this._indicator);
        }
    
        disable() {
            this._indicator?.destroy();
            this._indicator = null;
        }
    }

### `ExtensionPreferences` [​](./extension.md)

> Parent Class: [`ExtensionBase`](./extension.md) ([Source](https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/extensions/prefs.js))

The `ExtensionPreferences` class is a base for extension preferences classes to inherit from. There are two ways to implement preferences using this class:

*   implementing the `fillPreferencesWindow(window)` method;
*   implementing the `getPreferencesWidget()` method.

It is recommended to override the `fillPreferencesWindow()`, and if so, `getPreferencesWidget()` will not be called. If `getPreferencesWidget()` is implemented instead, the default implementation of `fillPreferencesWindow()` will place the widget it returns in an appropriate parent widget like [`Adw.PreferencesPage`](https://gjs-docs.gnome.org/adw1/adw.preferencespage) or [`Adw.PreferencesGroup`](https://gjs-docs.gnome.org/adw1/adw.preferencesgroup).

#### Methods [​](./extension.md)

*   `new ExtensionPreferences(metadata)` — Constructor
    *   metadata ([`ExtensionMetadata`](./extension.md)) — The instance metadata object
*   `getPreferencesWidget()` — Called to create a
    *   Returns (`Gtk.Widget`) A preferences widget
*   `fillPreferencesWindow(window)` — Called to setup the preferences window
    *   `window` (`Adw.PreferencesWindow`) — The preferences window that will be presented to the user.

#### Properties [​](./extension.md)

See the properties inherited from [`ExtensionBase`](./extension.md).

#### Example [​](./extension.md)

js

    import Gio from 'gi://Gio';
    import Adw from 'gi://Adw';
    
    import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
    
    
    export default class ExamplePreferences extends ExtensionPreferences {
        fillPreferencesWindow(window) {
            // Create a preferences page, with a single group
            const page = new Adw.PreferencesPage({
                title: _('General'),
                icon_name: 'dialog-information-symbolic',
            });
            window.add(page);
    
            const group = new Adw.PreferencesGroup({
                title: _('Appearance'),
                description: _('Configure the appearance of the extension'),
            });
            page.add(group);
    
            // Create a new preferences row
            const row = new Adw.SwitchRow({
                title: _('Show Indicator'),
                subtitle: _('Whether to show the panel indicator'),
            });
            group.add(row);
    
            // Create a settings object and bind the row to the `show-indicator` key
            window._settings = this.getSettings();
            window._settings.bind('show-indicator', row, 'active',
                Gio.SettingsBindFlags.DEFAULT);
        }
    }

### `InjectionManager` [​](./extension.md)

> Parent Class: `Object` ([Source](https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/extensions/extension.js))

GNOME Shell extensions are often created for the purpose of modifying some default Shell behavior. The `InjectionManager` class is a convenience for patching class methods in GNOME Shell. Methods are usually overridden in the `enable()` method of an [`Extension`](./extension.md), and restored to their original form in the `disable()` method.

#### `CreateOverrideFunc` [​](./extension.md)

This is the callback passed to `overrideMethod()`. It receives the original method as its only argument, and should return a new method to replace it with.

*   `CreateOverrideFunc(originalMethod)`
    *   `originalMethod` (`Function`|`undefined`) — The original method (if it exists)
    *   Returns (`Function`) — A function to be used as override

#### Methods [​](./extension.md)

*   `new InjectionManager()` — Constructor
*   `overrideMethod(prototype, methodName, createOverrideFunc)` — Modify, replace, or inject a method
    *   `prototype` (`Object`) — The object (or prototype) that is being modified
    *   `methodName` (`String`) — The name of the overwritten method
    *   `createOverrideFunc` ([`CreateOverrideFunc`](./extension.md)) — A function to call to create the override
*   `restoreMethod(prototype, methodName)` — Restore the original method
    *   `prototype` (`Object`) — The object (or prototype) that is being modified
    *   `methodName` (`String`) — The name of the overwritten method
*   `clear()` — Restore all original methods and clear overrides

#### Example [​](./extension.md)

js

    export default class ExampleExtension extends Extension {
        enable() {
            this._injectionManager = new InjectionManager();
    
            // Overriding a method with an *arrow function*
            this._injectionManager.overrideMethod(Panel.prototype, 'toggleCalendar',
                originalMethod => {
                    return args => {
                        console.debug(`${this.metadata.name}: toggling calendar`);
                        originalMethod.call(Main.panel, ...args);
                    };
                });
    
            // Overriding a method with a *function expression*
            this._injectionManager.overrideMethod(Panel.prototype, 'toggleQuickSettings',
                originalMethod => {
                    const metadata = this.metadata;
    
                    return function (...args) {
                        console.debug(`${metadata.name}: toggling quick settings`);
                        originalMethod.call(this, ...args);
                    };
                });
        }
    
        disable() {
            this._injectionManager.clear();
            this._injectionManager = null;
        }
    }

---
Created with web2skill, from [Inled Group](https://inled.es)