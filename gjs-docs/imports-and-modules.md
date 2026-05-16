# Imports and Modules | GNOME JavaScript

WARNING

GNOME Shell and Extensions use ESModules as of GNOME 45. Please see the [Legacy Documentation](./legacy-documentation.md) for previous versions.

There are effectively two types of modules that can imported in GJS, the most common being libraries in the GNOME platform, and the other being JavaScript files.

Exporting Modules [​](./imports-and-modules.md)
-------------------------------------------------------------------------------------------------------

Larger extensions or extensions with discrete components often separate code into modules. You can use the [`export`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export) declaration to mark classes, functions and variables for export.

js

    import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
    
    
    /**
     * Create a new indicator.
     *
     * @param {string} [name] - A name for the indicator
     * @returns {PanelMenu.Button} A new indicator
     */
    export function createIndicator(name = 'Unknown') {
        return new PanelMenu.Button(0.0, name, true);
    }

Importing Modules [​](./imports-and-modules.md)
-------------------------------------------------------------------------------------------------------

Imports in your extension's directory can be imported using a relative path. For example, if the module above were placed in `example@gjs.guide/utils.js` the script above would be available at `./utils.js`.

GNOME Shell modules are bundled in a GResource and the [`import`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) statement must use a `resource://` URI. Note that extension code (i.e. `extension.js`) uses the base path `resource:///org/gnome/shell/js/`, while preferences (i.e. `prefs.js`) uses the base path `resource:///org/gnome/Shell/Extensions/js/`.

js

    /* GNOME Shell modules are imported with a GResource path */
    import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
    import * as Main from 'resource:///org/gnome/shell/ui/main.js';
    
    /* Your extension's modules are imported with a relative path */
    import * as Utils from './utils.js';
    
    
    /* The default export for `extension.js` and `prefs.js` must be the class */
    export default class ExampleExtension extends Extension {
        enable() {
            this._indicator = Utils.createIndicator(this.metadata.name);
            Main.panel.addToStatusArea(this.uuid, this._indicator);
        }
    
        disable() {
            this._indicator?.destroy();
            this._indicator = null;
        }
    }

Many of the elements in GNOME Shell like panel buttons, popup menus and notifications are built from reusable classes and functions, found in modules like these:

*   [`js/ui/modalDialog.js`](https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/modalDialog.js)
*   [`js/ui/popupMenu.js`](https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/popupMenu.js)
*   [`js/ui/quickSettings.js`](https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/quickSettings.js)

You can browse around in the `js/ui/` folder or any other JavaScript file under `js/` for more code to be reused. Notice the path structure in the links above and how they compare to the imports below:

js

    import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';
    import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
    import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';

Importing Libraries [​](./imports-and-modules.md)
-----------------------------------------------------------------------------------------------------------

Extensions can import libraries from the GNOME platform, or any other library supporting [GObject Introspection](https://gi.readthedocs.io/en/latest/index.html). There are also a few built-in libraries such as [`Cairo`](https://gjs-docs.gnome.org/gjs/cairo.md) and [`System`](https://gjs-docs.gnome.org/gjs/system.md) that are imported differently.

js

    /* GJS's Built-in modules have custom specifiers */
    import Cairo from 'cairo';
    import System from 'system';
    
    
    /* Common imports found in `extension.js` */
    import Clutter from 'gi://Clutter';
    import Meta from 'gi://Meta';
    import St from 'gi://St';
    import Shell from 'gi://Shell';
    
    
    /* Common imports found in `prefs.js` */
    import Gdk from 'gi://Gdk?version=4.0';
    import Gtk from 'gi://Gtk?version=4.0';
    import Adw from 'gi://Adw';

---
Created with web2skill, from [Inled Group](https://inled.es)