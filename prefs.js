import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ChristianCrossPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage();
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: _('Appearance & Position'),
            description: _('Configure where and how the cross is displayed on the top panel.'),
        });
        page.add(group);

        // 1. Show cross
        const showCrossRow = new Adw.SwitchRow({
            title: _('Show cross'),
            subtitle: _('Show or hide the cross icon in the panel.'),
        });
        group.add(showCrossRow);
        settings.bind('show-cross', showCrossRow, 'active', Gio.SettingsBindFlags.DEFAULT);

        // Colors Group
        const colorGroup = new Adw.PreferencesGroup({
            title: _('Colors'),
            description: _('Customize the cross and background colors.'),
        });
        page.add(colorGroup);

        // Cross Color
        const crossColorRow = new Adw.ActionRow({
            title: _('Cross color'),
            subtitle: _('The color of the cross figure.'),
        });
        const crossColorButton = new Gtk.ColorDialogButton({
            valign: Gtk.Align.CENTER,
            dialog: new Gtk.ColorDialog(),
        });
        
        const crossRgba = new Gdk.RGBA();
        crossRgba.parse(settings.get_string('cross-color'));
        crossColorButton.rgba = crossRgba;
        
        crossColorButton.connect('notify::rgba', () => {
            settings.set_string('cross-color', crossColorButton.rgba.to_string());
        });
        
        crossColorRow.add_suffix(crossColorButton);
        crossColorRow.activatable_widget = crossColorButton;
        colorGroup.add(crossColorRow);

        // Background Color
        const bgColorRow = new Adw.ActionRow({
            title: _('Background color'),
            subtitle: _('The background color of the icon container.'),
        });
        const bgColorButton = new Gtk.ColorDialogButton({
            valign: Gtk.Align.CENTER,
            dialog: new Gtk.ColorDialog(),
        });
        
        const bgRgba = new Gdk.RGBA();
        bgRgba.parse(settings.get_string('bg-color'));
        bgColorButton.rgba = bgRgba;
        
        bgColorButton.connect('notify::rgba', () => {
            settings.set_string('bg-color', bgColorButton.rgba.to_string());
        });
        
        bgColorRow.add_suffix(bgColorButton);
        bgColorRow.activatable_widget = bgColorButton;
        colorGroup.add(bgColorRow);

        // 2. Panel position
        const positionValues = ['left', 'center', 'right'];
        const positionRow = new Adw.ComboRow({
            title: _('Panel position'),
            subtitle: _('Section of the top bar where the icon will appear.'),
            model: Gtk.StringList.new([
                _('Left'),
                _('Center'),
                _('Right')
            ]),
        });
        
        positionRow.selected = positionValues.indexOf(settings.get_string('panel-position'));
        positionRow.connect('notify::selected', () => {
            settings.set_string('panel-position', positionValues[positionRow.selected]);
        });
        group.add(positionRow);

        // 3. Position priority
        const priorityRow = new Adw.SpinRow({
            title: _('Position priority'),
            subtitle: _('Position index (0 is closest to the center in the right box).'),
        });
        
        const adj = priorityRow.adjustment;
        if (adj) {
            adj.lower = -1;
            adj.upper = 100;
            adj.step_increment = 1;
        }
        
        group.add(priorityRow);
        settings.bind('position-priority', priorityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    }
}
