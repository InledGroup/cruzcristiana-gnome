import zipfile
import os

uuid = "cruzcristiana@inled.es"
zip_name = f"{uuid}.shell-extension.zip"

files_to_include = [
    "extension.js",
    "prefs.js",
    "metadata.json",
    "stylesheet.css",
    "cruz-symbolic.svg",
    "LICENSE",
    "README.md",
]

dirs_to_include = [
    "schemas",
]

with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for file in files_to_include:
        if os.path.exists(file):
            zipf.write(file)
    
    for folder in dirs_to_include:
        if os.path.exists(folder):
            for root, dirs, files in os.walk(folder):
                for file in files:
                    zipf.write(os.path.join(root, file))

print(f"Created {zip_name}")
