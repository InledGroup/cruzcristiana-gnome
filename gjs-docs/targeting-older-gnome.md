# Targeting Older GNOME Versions | GNOME JavaScript

GNOME's code evolves between each release, and extensions using this code need to be updated accordingly. While easier to support only one GNOME version in an extension, it is possible to also support older GNOME versions within the same code base.

Declaring Support [​](./targeting-older-gnome.md)
------------------------------------------------------------------------------------------------------------

In your `metadata.json` file, add all the GNOME Shell versions you support in the `shell-version` field. Learn more in the [Anatomy of an Extension `shell-version` section](./anatomy.md).

json

    {
        "shell-version": [ "3.36", "3.38", "40", "41", "42" ]
    }

Adapting to Different Code [​](./targeting-older-gnome.md)
------------------------------------------------------------------------------------------------------------------------------

### Feature Detection [​](./targeting-older-gnome.md)

You can test if a method exists before using it:

js

    if (method)
        method();
    else
        // Use another method, write a replacement, or do nothing

Or using `try...catch`:

js

    try {
        method();
    } catch (e) {
        // Use another method, write a replacement, or do nothing
    }

### Version Number Detection [​](./targeting-older-gnome.md)

If you know when a feature was introduced or a part of the code updated, you can adapt to these changes by targeting specific version numbers. It is possible to browse older code on the [Shell's GitLab page](https://gitlab.gnome.org/GNOME/gnome-shell) by changing the tag.

Prior to version 40, GNOME Shell used 3.xx version numbers, even minor number denoting a stable release.

js

    const Config = imports.misc.config;
    const [major, minor] = Config.PACKAGE_VERSION.split('.').map(s => Number(s));
    
    if (major === 3 && minor <= 36)
        console.log('Shell 3.36 or lower');
    else if (major === 3 && minor === 38)
        console.log('Shell 3.38');
    else if (major >= 40)
        console.log('Shell 40 or higher');

Preferences [​](./targeting-older-gnome.md)
------------------------------------------------------------------------------------------------

### GTK Version [​](./targeting-older-gnome.md)

Starting from GNOME 40, the preferences dialog uses GTK4, while older versions use GTK3. There has been some changes between the two versions, please refer to the [GTK4 migration guide](https://docs.gtk.org/gtk4/migrating-3to4.html) for an overview.

If you need different code, it is possible to check the current GTK version:

js

    const {Gtk} = imports.gi;
    const version = Gtk.get_major_version();
    
    log(`GTK version is ${version}`);

### `buildPrefsWidget()` [​](./targeting-older-gnome.md)

Prior to version 42, the `prefs.js` needed a `buildPrefsWidget` function, returning a `GtkWidget` to be inserted in the preferences dialog.

js

    function buildPrefsWidget() {
        return new Gtk.Label({ title: 'My extension preferences' });
    }

It is still possible to use this function in the current version of GNOME. The `fillPreferencesWindow` function will have priority, so you can have different widgets for versions older than 42. Useful if you want to use Libadwaita widgets on current versions, and only GTK widgets on older versions.

---
Created with web2skill, from [Inled Group](https://inled.es)