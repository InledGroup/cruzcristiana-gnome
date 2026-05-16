#!/bin/bash

# Script para instalar la extensión localmente
# Autor: Jaime (vía Gemini CLI)

UUID="cruzcristiana@inled.es"
EXT_DIR="${HOME}/.local/share/gnome-shell/extensions/${UUID}"

# Asegurar que tenemos el paquete más reciente
./package.sh

echo "Instalando extensión en ${EXT_DIR}..."

# Borrar instalación anterior si existe
if [ -d "${EXT_DIR}" ]; then
    echo "Borrando versión anterior..."
    rm -rf "${EXT_DIR}"
fi

# Crear directorio y descomprimir
mkdir -p "${EXT_DIR}"
unzip "${UUID}.shell-extension.zip" -d "${EXT_DIR}"

# Compilar esquemas
echo "Compilando esquemas de configuración..."
glib-compile-schemas "${EXT_DIR}/schemas/"

echo "----------------------------------------------------"
echo "¡Instalación completada con éxito!"
echo "Para aplicar los cambios:"
echo "1. Si usas X11: Pulsa Alt+F2, escribe 'r' y pulsa Enter."
echo "2. Si usas Wayland: Cierra sesión e inicia sesión de nuevo."
echo "3. Asegúrate de habilitar la extensión en la app 'Extensiones'."
echo "----------------------------------------------------"
