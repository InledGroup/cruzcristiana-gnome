#!/bin/bash

# Script para empaquetar la extensión para GNOME Shell
# Autor: Jaime (vía Gemini CLI)

UUID="cruzcristiana@inled.es"
ZIP_NAME="${UUID}.shell-extension.zip"

echo "Empaquetando extensión ${UUID}..."

# Limpiar zip anterior si existe
rm -f "${ZIP_NAME}"

# Crear el paquete zip incluyendo solo los archivos necesarios
if command -v zip >/dev/null 2>&1; then
    zip -r "${ZIP_NAME}" \
        extension.js \
        prefs.js \
        metadata.json \
        stylesheet.css \
        cruz-symbolic.svg \
        schemas/ \

        LICENSE \
        README.md \
        -x "*.git*" "gjs-docs/*" "*.sh" "package.py"
else
    echo "Comando 'zip' no encontrado, usando python3..."
    python3 package.py
fi

echo "¡Hecho! Archivo creado: ${ZIP_NAME}"
