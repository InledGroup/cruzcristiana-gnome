// extension.js - GNOME 45-50 Compatibility
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const ChristianCrossIndicator = GObject.registerClass(
class ChristianCrossIndicator extends PanelMenu.Button {
    _init(extensionPath) {
        super._init(0, 'Christian Cross', false);

        this.add_style_class_name('christian-cross-indicator');

        // Use a St.Icon with an SVG file to avoid font issues (tofu)
        this._icon = new St.Icon({
            gicon: Gio.Icon.new_for_string(`${extensionPath}/cruz-symbolic.svg`),
            style_class: 'system-status-icon christian-cross-icon',
        });

        this.add_child(this._icon);
    }
});

export default class ChristianCrossExtension extends Extension {
    enable() {
        this._logger = typeof this.getLogger === 'function' ? this.getLogger() : console;
        this._logger.info(`Enabling ${this.metadata.name}`);

        this._settings = this.getSettings();
        
        // Add to panel (this will create the indicator)
        this._updatePosition();

        // Subtle entrance animation
        if (this._indicator) {
            this._indicator.set_scale(0.8, 0.8);
            this._indicator.set_opacity(0);
            this._indicator.ease({
                scale_x: 1,
                scale_y: 1,
                opacity: 255,
                duration: 300,
                mode: Clutter.AnimationMode.EASE_OUT_QUAD
            });
        }

        // Connect settings changes
        this._settingsId = this._settings.connect('changed', (settings, key) => {
            this._onSettingsChanged(key);
        });
    }

    disable() {
        this._logger.info(`Disabling ${this.metadata.name}`);

        if (this._settingsId) {
            this._settings.disconnect(this._settingsId);
            this._settingsId = null;
        }

        if (this._indicator) {
            this._indicator.ease({
                scale_x: 0.8,
                scale_y: 0.8,
                opacity: 0,
                duration: 200,
                mode: Clutter.AnimationMode.EASE_IN_QUAD,
                onComplete: () => {
                    this._indicator.destroy();
                    this._indicator = null;
                }
            });
        }

        this._settings = null;
    }

    _applyStyles() {
        if (!this._indicator || !this._indicator._icon) return;

        const crossColor = this._settings.get_string('cross-color');
        const bgColor = this._settings.get_string('bg-color');

        this._indicator.set_style(`background-color: ${bgColor};`);
        this._indicator._icon.set_style(`color: ${crossColor};`);
    }

    _updatePosition() {
        // Destroy existing indicator to avoid "Extension point conflict"
        // and ensure it's removed from Main.panel._statusArea
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }

        const position = this._settings.get_string('panel-position');
        const priority = this._settings.get_int('position-priority');

        // Recreate the indicator
        this._indicator = new ChristianCrossIndicator(this.path);
        this._indicator.visible = this._settings.get_boolean('show-cross');
        this._applyStyles();

        // Use addToStatusArea for better stability
        Main.panel.addToStatusArea(this.uuid, this._indicator, priority, position);
    }

    _onSettingsChanged(key) {
        switch (key) {
            case 'show-cross':
                this._indicator.visible = this._settings.get_boolean(key);
                break;
            case 'panel-position':
            case 'position-priority':
                this._updatePosition();
                break;
            case 'cross-color':
            case 'bg-color':
                this._applyStyles();
                break;
        }
    }
}
