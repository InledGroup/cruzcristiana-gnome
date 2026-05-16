# Quick Settings | GNOME JavaScript

WARNING

This documentation is for GNOME 45 and later. Please see the [Legacy Documentation](./legacy-documentation.md) for previous versions.

Quick settings is a user-interface pattern for the GNOME Shell [System Menu](https://help.gnome.org/users/gnome-help/stable/shell-introduction.html#systemmenu). It provides a simple, but flexible method for extensions to add indicators, toggles and entry points for preferences to the System Menu.

Imports [​](./quick-settings.md)
----------------------------------------------------------------------------

The following imports should be all most developers need for Quick Settings:

js

    import * as Main from 'resource:///org/gnome/shell/ui/main.js';
    import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
    import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
    import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';

Example Usage [​](./quick-settings.md)
----------------------------------------------------------------------------------------

This page will demonstrate a few simple examples of how quick settings can be used in extensions. There are many complete examples of this UI pattern in GNOME Shell, which can be referenced in the [`js/ui/status/`](https://gitlab.gnome.org/GNOME/gnome-shell/tree/main/js/ui/status) directory.

### System Indicator [​](./quick-settings.md)

TIP

All extensions with quick settings should have an instance of this class, even if they choose not to add an icon.

The `QuickSettings.SystemIndicator` class is used to manage quick settings items, and may also be used to display an icon. You can also add any quick settings items to the `quickSettingsItems` array:

js

    const ExampleIndicator = GObject.registerClass(
    class ExampleIndicator extends QuickSettings.SystemIndicator {
        constructor(extensionObject) {
            super();
    
            // Create an icon for the indicator
            this._indicator = this._addIndicator();
            this._indicator.icon_name = 'selection-mode-symbolic';
    
            // Showing an indicator when the feature is enabled
            this._settings = extensionObject.getSettings();
            this._settings.bind('feature-enabled',
                this._indicator, 'visible',
                Gio.SettingsBindFlags.DEFAULT);
    
            // Add a toggle to the quick settings items
            this.quickSettingsItems.push(new ExampleToggle(extensionObject));
        }
    
        destroy() {
            this.quickSettingsItems.forEach(item => item.destroy());
            super.destroy();
        }
    });

Then call `Panel.addExternalIndicator()` to have your indicator and items added to an appropriate place:

js

    export default class ExampleExtension extends Extension {
        enable() {
            this._indicator = new ExampleIndicator(this);
    
            Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
        }
    
        disable() {
            this._indicator.destroy();
            this._indicator = null;
        }
    }

### Basic Toggle [​](./quick-settings.md)

The most basic quick settings item is a simple toggle button. Examples in GNOME Shell include _Dark Style_, _Night Light_ and _Airplane Mode_.

js

    const ExampleToggle = GObject.registerClass(
    class ExampleToggle extends QuickSettings.QuickToggle {
        constructor(extensionObject) {
            super({
                title: _('Example Title'),
                subtitle: _('Example Subtitle'),
                iconName: 'selection-mode-symbolic',
                toggleMode: true,
            });
    
            // Binding the toggle to a GSettings key
            this._settings = extensionObject.getSettings();
            this._settings.bind('feature-enabled',
                this, 'checked',
                Gio.SettingsBindFlags.DEFAULT);
        }
    });

### Toggle Menu [​](./quick-settings.md)

For features with a few more settings or options, you may want to add a submenu to the toggle. The `QuickSettings.QuickMenuToggle` includes a built-in [Popup Menu](./popup-menu.md), that supports the standard menu functions:

js

    const ExampleMenuToggle = GObject.registerClass(
    class ExampleMenuToggle extends QuickSettings.QuickMenuToggle {
        constructor(extensionObject) {
            super({
                title: _('Example Title'),
                subtitle: _('Example Subtitle'),
                iconName: 'selection-mode-symbolic',
                toggleMode: true,
            });
    
            // Add a header with an icon, title and optional subtitle. This is
            // recommended for consistency with other quick settings menus.
            this.menu.setHeader('selection-mode-symbolic', _('Example Title'),
                _('Optional Subtitle'));
    
            // Add suffix to the header, to the right of the title.
            const headerSuffix = new St.Icon({
                iconName: 'dialog-warning-symbolic',
            });
            this.menu.addHeaderSuffix(headerSuffix);
    
            // Add a section of items to the menu
            this._itemsSection = new PopupMenu.PopupMenuSection();
            this._itemsSection.addAction(_('Menu Item 1'),
                () => console.debug('Menu Item 1 activated!'));
            this._itemsSection.addAction(_('Menu Item 2'),
                () => console.debug('Menu Item 2 activated!'));
            this.menu.addMenuItem(this._itemsSection);
    
            // Add an entry-point for more settings
            this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
            const settingsItem = this.menu.addAction('More Settings',
                () => extensionObject.openPreferences());
    
            // Ensure the settings are unavailable when the screen is locked
            settingsItem.visible = Main.sessionMode.allowSettings;
            this.menu._settingsActions[extensionObject.uuid] = settingsItem;
        }
    });

### Slider [​](./quick-settings.md)

The quick settings API also comes with a new class for sliders, for settings like brightness or volume. The `QuickSettings.QuickSlider` class has a number of features available, demonstrated below:

js

    const ExampleSlider = GObject.registerClass(
    class ExampleSlider extends QuickSettings.QuickSlider {
        constructor(extensionObject) {
            super({
                iconName: 'selection-mode-symbolic',
                iconLabel: _('Icon Accessible Name'),
            });
    
            // Watch for changes and set an accessible name for the slider
            this._sliderChangedId = this.slider.connect('notify::value',
                this._onSliderChanged.bind(this));
            this.slider.accessible_name = _('Example Slider');
    
            // Make the icon clickable (e.g. volume mute/unmute)
            this.iconReactive = true;
            this._iconClickedId = this.connect('icon-clicked',
                () => console.debug('Slider icon clicked!'));
    
            // Binding the slider to a GSettings key
            this._settings = extensionObject.getSettings();
            this._settings.connect('changed::slider-value',
                this._onSettingsChanged.bind(this));
            this._onSettingsChanged();
        }
    
        _onSettingsChanged() {
            // Prevent the slider from emitting a change signal while being updated
            this.slider.block_signal_handler(this._sliderChangedId);
            this.slider.value = this._settings.get_uint('slider-value') / 100.0;
            this.slider.unblock_signal_handler(this._sliderChangedId);
        }
    
        _onSliderChanged() {
            // Assuming our GSettings holds values between 0..100, adjust for the
            // slider taking values between 0..1
            const percent = Math.floor(this.slider.value * 100);
            this._settings.set_uint('slider-value', percent);
        }
    });

When adding the slider to the menu, you will usually want it to span two columns, like the default volume slider:

js

    const myIndicator = new QuickSettings.SystemIndicator();
    myIndicator.quickSettingsItems.push(new ExampleSlider());
    
    Main.panel.statusArea.quickSettings.addExternalIndicator(myIndicator, 2);

### Action Button [​](./quick-settings.md)

WARNING

The action button area is a prominent location in the UI with limited space, so consider carefully before adding more items.

It's also possible to add action buttons to the top of the quick settings, such as the _Lock Screen_ or _Settings_ button.

js

    const ExampleButton = GObject.registerClass(
    class ExampleButton extends QuickSettings.QuickSettingsItem {
        constructor() {
            super({
                style_class: 'icon-button',
                can_focus: true,
                icon_name: 'selection-mode-symbolic',
                accessible_name: _('Example Action'),
            });
    
            this.connect('clicked', () => console.log('activated'));
        }
    });

Unlike other quick settings items, action buttons must be added manually:

js

    const QuickSettingsMenu = Main.panel.statusArea.quickSettings;
    const QuickSettingsActions = QuickSettingsMenu._system._indicator.child;
    
    QuickSettingsActions.add_child(new ExampleButton());

---
Created with web2skill, from [Inled Group](https://inled.es)