// extension.js - GNOME 45-50 Compatibility
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const ChristianCrossIndicator = GObject.registerClass(
class ChristianCrossIndicator extends St.Bin {
    _init(extensionPath) {
        super._init({
            style_class: 'panel-button christian-cross-indicator',
            reactive: true,
            can_focus: true,
            track_hover: true,
            accessible_name: 'Christian Cross',
            accessible_role: 'button'
        });

        // Use a St.Icon with an SVG file to avoid font issues (tofu)
        this._icon = new St.Icon({
            gicon: Gio.Icon.new_for_string(`${extensionPath}/cruz-symbolic.svg`),
            style_class: 'system-status-icon christian-cross-icon',
        });

        this.set_child(this._icon);
    }
});

export default class ChristianCrossExtension extends Extension {
    enable() {
        this._logger = typeof this.getLogger === 'function' ? this.getLogger() : console;
        this._logger.info(`Enabling ${this.metadata.name}`);

        this._settings = this.getSettings();
        
        // Pass the extension path to load the SVG
        this._indicator = new ChristianCrossIndicator(this.path);

        // Initialize visibility
        this._indicator.visible = this._settings.get_boolean('show-cross');

        // Add to panel
        this._updatePosition();

        // Subtle entrance animation
        this._indicator.set_scale(0.8, 0.8);
        this._indicator.set_opacity(0);
        this._indicator.ease({
            scale_x: 1,
            scale_y: 1,
            opacity: 255,
            duration: 300,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD
        });

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
                    this._removeFromPanel();
                    this._indicator.destroy();
                    this._indicator = null;
                }
            });
        }

        this._settings = null;
    }

    _updatePosition() {
        this._removeFromPanel();

        const position = this._settings.get_string('panel-position');
        const priority = this._settings.get_int('position-priority');

        let box;
        switch (position) {
            case 'left':
                box = Main.panel._leftBox;
                break;
            case 'center':
                box = Main.panel._centerBox;
                break;
            case 'right':
            default:
                box = Main.panel._rightBox;
                break;
        }

        // Insert at the desired position
        box.insert_child_at_index(this._indicator, priority);
    }

    _removeFromPanel() {
        if (!this._indicator) return;
        
        const parent = this._indicator.get_parent();
        if (parent) {
            parent.remove_child(this._indicator);
        }
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
        }
    }
}
