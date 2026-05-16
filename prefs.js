import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
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
