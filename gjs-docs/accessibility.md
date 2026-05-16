# Accessibility | GNOME JavaScript

Accessibility is a topic that usually focuses on assistive technologies like screen readers, keyboard navigation and high-contrast themes. However, working accessibility is a hard requirement of a proper user interface, not a feature.

Clutter and St have built-in support for accessibility, which means two things:

1.  It works by default
    
    You probably don't need to do anything to support accessibility, except basic testing before a release. Standard widgets like buttons and menus already use the correct attributes, and the focus order is usually as logical as the layout.
    
2.  If it doesn't work, there is a bug in your code
    
    Broken accessibility either means you have a design flaw, or a widget with incorrect roles, relationships or states. Usually you just need to set some properties, or make a few function calls.
    

This document will teach you the basics of implementing accessibility, with examples of the type of widgets that have built-in support.

### Further Reading [​](./accessibility.md)

*   [Accessibility](https://developer.gnome.org/hig/guidelines/accessibility.html) in the [GNOME HIG](https://developer.gnome.org/hig)
*   [Accessibility](https://developer.gnome.org/documentation/guidelines/accessibility.html) in the [GNOME Developer Documentation](https://developer.gnome.org/documentation)

Basic Concepts [​](./accessibility.md)
----------------------------------------------------------------------------------------------

The library used to set accessible attributes in GNOME Shell is [`Atk`](https://gjs-docs.gnome.org/atk10/), and [`St.Widget`](https://gjs-docs.gnome.org/st12/st.widget) includes convenience methods and properties, with access to the [`Atk.Object`](https://gjs-docs.gnome.org/atk10/atk.object) for everything else.

Roles, relationships and states define the semantics of an element in the user interface. Roles like [`Atk.Role.RADIO_BUTTON`](https://gjs-docs.gnome.org/atk10/atk.role#default-radio_button) affect presentation, behavior and keyboard focus, but they also have a range of states dependent on their relationship with other elements. The semantics are the shared language of design, code, translations and user experience.

### Roles [​](./accessibility.md)

The [`Atk.Role`](https://gjs-docs.gnome.org/atk10/atk.role) is usually static, and represents the primary purpose of an element in the user interface. You can use the [`St.Widget:accessible-role`](https://gjs-docs.gnome.org/st12/st.widget#property-accessible_role) property to check and set the proper role.

In addition to accessible relationships, the role may depend on another widget. For example, a menu item should have the role `Atk.Role.CHECK_MENU_ITEM` if it has a child with the role `Atk.Role.CHECK_BUTTON`.

### Relationships [​](./accessibility.md)

The [`Atk.RelationType`](https://gjs-docs.gnome.org/atk10/atk.relationtype) set an element has establishes meaningful links to other elements, like a label and the widget it describes. This is the most common relationship and handled automatically by the [`St.Widget:label-actor`](https://gjs-docs.gnome.org/st12/st.widget#property-label_actor) property, which should usually be set to a widget with the role [`Atk.Role.LABEL`](https://gjs-docs.gnome.org/atk10/atk.role#default-label) like [`St.Label`](https://gjs-docs.gnome.org/st12/st.label).

For other relationships, you can call the inherited method [`Clutter.Actor.get_accessible()`](https://gjs-docs.gnome.org/clutter12/clutter.actor#method-get_accessible) to get the [`Atk.Object`](https://gjs-docs.gnome.org/atk10/atk.object), then call [`Atk.Object.add_relationship()`](https://gjs-docs.gnome.org/atk10/atk.object#method-add_relationship) and [`Atk.Object.removed_relationship()`](https://gjs-docs.gnome.org/atk10/atk.object#method-remove_relationship) as needed.

### States [​](./accessibility.md)

The [`Atk.StateType`](https://gjs-docs.gnome.org/atk10/atk.statetype) determines the current state of an element, many of which are already handled by `St`. States can be added with [`St.Widget.add_accessible_state()`](https://gjs-docs.gnome.org/st12/st.widget#method-addaccessiblestate) and [`St.Widget.remove_accessible_state()`](https://gjs-docs.gnome.org/st12/st.widget#method-removeaccessiblestate) respectively.

Common states like `Atk.StateType.SENSITIVE` and `Atk.StateType.VISIBLE` are handled by Clutter based on properties like `Clutter.Actor:reactive` and `Clutter.Actor:visible`. `St.Widget:can-focus` sets `Atk.StateType.FOCUSABLE`, while watching for the CSS pseudo-classes `checked` and `selected` to apply the `Atk.StateType.CHECKED` and `Atk.StateType.SELECTED` states.

Other more purposeful widgets also set the state, such as `St.Button`. It uses the [`St.Button:toggle-mode`](https://gjs-docs.gnome.org/st12/st.button#property-toggle_mode) property to change its role and updates the state by adding or removing the CSS pseudo-class `checked` when the [`St.Button:checked`](https://gjs-docs.gnome.org/st12/st.button#property-checked) property changes.

Implementing Accessibility [​](./accessibility.md)
----------------------------------------------------------------------------------------------------------------------

The [`PopupMenu.PopupSwitchMenuItem`](./popup-menu.md) class from GNOME Shell has examples of almost everything you'll need to do. It subclasses a generic widget to implement the role and state of a switch. It then subclasses the base menu item and ensures the role, relationships and state are updated to match the switch.

### Basic Example [​](./accessibility.md)

The accessible role of the switch is set to `Atk.Role.CHECK_BUTTON`, while the `PopupMenu.Switch:state` property updates the accessible state by adding and removing the `checked` pseudo-class (just like `St.Button`).

js

    const Switch = GObject.registerClass({
        Properties: {
            'state': GObject.ParamSpec.boolean(
                'state', 'state', 'state',
                GObject.ParamFlags.READWRITE,
                false),
        },
    }, class Switch extends St.Bin {
        constructor(state) {
            super({
                style_class: 'toggle-switch',
                accessible_role: Atk.Role.CHECK_BOX,
                state,
            });
    
            this._state = false;
        }
    
        get state() {
            return this._state;
        }
    
        set state(state) {
            if (this._state === state)
                return;
    
            if (state)
                this.add_style_pseudo_class('checked');
            else
                this.remove_style_pseudo_class('checked');
    
            this._state = state;
            this.notify('state');
        }
    
        toggle() {
            this.state = !this.state;
        }
    });

The `PopupMenu.PopupSwitchMenuItem` is given the role `Atk.Role.CHECK_MENU_ITEM` by default, while the state is kept in sync with the `PopupMenu.Switch`. Also notice that `St.Widget:label-actor` is set on the menu item, so that the item's label is understood to describe it.

The menu item also handles the case where the switch is disabled. If `PopupMenu.PopupSwitchMenuItem.setStatus()` is called with a non-`null` value, the item will change roles to `Atk.Role.MENU_ITEM`, the `Atk.StateType.CHECKED` state is removed and the switch is replaced with a status label.

js

    const PopupSwitchMenuItem = GObject.registerClass({
        Signals: {'toggled': {param_types: [GObject.TYPE_BOOLEAN]}},
    }, class PopupSwitchMenuItem extends PopupBaseMenuItem {
        constructor(text, active, params) {
            super(params);
    
            this.label = new St.Label({
                text,
                y_expand: true,
                y_align: Clutter.ActorAlign.CENTER,
            });
            this._switch = new Switch(active);
    
            this.accessible_role = Atk.Role.CHECK_MENU_ITEM;
            this.checkAccessibleState();
            this.label_actor = this.label;
    
            this.add_child(this.label);
    
            this._statusBin = new St.Bin({
                x_align: Clutter.ActorAlign.END,
                x_expand: true,
            });
            this.add_child(this._statusBin);
    
            this._statusLabel = new St.Label({
                text: '',
                style_class: 'popup-status-menu-item',
                y_expand: true,
                y_align: Clutter.ActorAlign.CENTER,
            });
            this._statusBin.child = this._switch;
        }
    
        setStatus(text) {
            if (text != null) {
                this._statusLabel.text = text;
                this._statusBin.child = this._statusLabel;
                this.reactive = false;
                this.accessible_role = Atk.Role.MENU_ITEM;
            } else {
                this._statusBin.child = this._switch;
                this.reactive = true;
                this.accessible_role = Atk.Role.CHECK_MENU_ITEM;
            }
            this.checkAccessibleState();
        }
    
        activate(event) {
            if (this._switch.mapped)
                this.toggle();
    
            // we allow pressing space to toggle the switch
            // without closing the menu
            if (event.type() === Clutter.EventType.KEY_PRESS &&
                event.get_key_symbol() === Clutter.KEY_space)
                return;
    
            super.activate(event);
        }
    
        toggle() {
            this._switch.toggle();
            this.emit('toggled', this._switch.state);
            this.checkAccessibleState();
        }
    
        get state() {
            return this._switch.state;
        }
    
        setToggleState(state) {
            this._switch.state = state;
            this.checkAccessibleState();
        }
    
        checkAccessibleState() {
            switch (this.accessible_role) {
            case Atk.Role.CHECK_MENU_ITEM:
                if (this._switch.state)
                    this.add_accessible_state(Atk.StateType.CHECKED);
                else
                    this.remove_accessible_state(Atk.StateType.CHECKED);
                break;
            default:
                this.remove_accessible_state(Atk.StateType.CHECKED);
            }
        }
    });

---
Created with web2skill, from [Inled Group](https://inled.es)