# Architecture | GNOME JavaScript

This page is an overview of GNOME Shell's architecture, from the perspective of GNOME Shell extensions. It is intended to help clarify how extensions fit into the larger picture.

Overview [​](./architecture.md)
------------------------------------------------------------------------------

![](chrome-extension://njgifgckccfaljabdgieodmacanpkeig/assets/img/gnome-shell-library-architecture.png)

Clutter and St [​](./architecture.md)
------------------------------------------------------------------------------------------

Unlike most GNOME applications, Mutter and GNOME Shell are both built on the Clutter toolkit which is more abstract than GTK.

[Clutter](https://gjs-docs.gnome.org/#q=clutter) widgets are called [Actors](https://gjs-docs.gnome.org/#q=clutter.actor) and have all the basic properties and signals you would expect from a base widget. Actors can contain other actors using several layout managers and have built-in support for animations and other effects.

[St](https://gjs-docs.gnome.org/#q=st) builds on Clutter to provide more complex widgets like buttons, icons, text entries and scrollable areas. It also adds support for CSS so the style of widgets can be changed programmatically or from a stylesheet.

Mutter [​](./architecture.md)
--------------------------------------------------------------------------

In Wayland sessions [Mutter](https://gitlab.gnome.org/GNOME/mutter) implements the compositor side of the Wayland protocol, while in X11 sessions it serves as the window manager and compositing manager.

For GNOME Shell extensions, the [`Meta`](https://gjs-docs.gnome.org/#q=meta) import gives access to displays, workspaces, windows, clipboard selections and more.

Shell [​](./architecture.md)
------------------------------------------------------------------------

[Shell](https://gjs-docs.gnome.org/#q=shell) provides a number of utilities and classes, including the [`global`](https://gjs-docs.gnome.org/#q=Shell.Global) object. Just as `Meta` is the library API for Mutter, `Shell` is effectively the library of GNOME Shell itself.

JavaScript [​](./architecture.md)
----------------------------------------------------------------------------------

Like most of the GNOME API, the libraries described above are all written in C. They are made available to GJS by [GObject-Introspection](https://gi.readthedocs.io/en/latest/index.html), which provides metadata for language bindings and is also used to generate the [GNOME API documentation](https://gjs-docs.gnome.org/).

GNOME Shell's [JavaScript codebase](https://gitlab.gnome.org/GNOME/gnome-shell/tree/main/js) uses these libraries to create the user interface you interact with every day, organized into modules. A number of these modules are re-used throughout GNOME Shell and are commonly used in extensions:

*   [PopupMenu](https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/popupMenu.js)
    
    Used to build the popup menus, menu items and submenus found throughout GNOME Shell.
    
*   [Dialog](https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/dialog.js) & [ModalDialog](https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/modalDialog.js)
    
    Used for various dialogs such as the Run Dialog, Authentication Dialog and more.
    
*   [PanelMenu](https://gitlab.gnome.org/GNOME/gnome-shell/blob/main/js/ui/panelMenu.js)
    
    Used for panel indicators and user menu entries like Wi-Fi, Bluetooth, Power and more.
    

Extensions [​](./architecture.md)
----------------------------------------------------------------------------------

GNOME Shell extensions can use or modify anything described above, much like GNOME Shell's JavaScript itself. Once an extension is loaded and enabled, it effectively becomes a part of GNOME Shell.

This means extensions can:

*   Use Mutter to control displays, workspaces and windows
*   Use Clutter & St to create new UI elements
*   Use JavaScript modules to create new UI elements
*   Use any other library supporting GObject-Introspection
*   Access and modify any internal GNOME Shell code

---
Created with web2skill, from [Inled Group](https://inled.es)