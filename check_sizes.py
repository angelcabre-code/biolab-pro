import os
import sys

def get_size(start_path):
    total_size = 0
    try:
        for dirpath, dirnames, filenames in os.walk(start_path):
            for f in filenames:
                try:
                    fp = os.path.join(dirpath, f)
                    if not os.path.islink(fp):
                        total_size += os.path.getsize(fp)
                except (OSError, PermissionError):
                    continue
    except (OSError, PermissionError):
        pass
    return total_size

paths = [
    r'C:\Users\Alvaro\sinergia-frontend\node_modules',
    r'C:\Users\Alvaro\sinergia-backend\functions\node_modules',
    r'C:\Users\Alvaro\node_modules',
    r'D:\biolab\node_modules',
    r'D:\sinergiavue\sinergia-v2\node_modules',
    r'D:\cronos\cronos-desktop\node_modules'
]

print("--- ESTIMACIÓN DE ESPACIO EN NODE_MODULES ---")
for p in paths:
    if os.path.exists(p):
        size_gb = get_size(p) / (1024**3)
        print(f"{p}: {size_gb:.2f} GB")
    else:
        # Check if parent exists but node_modules doesn't (might have been deleted)
        parent = os.path.dirname(p)
        if os.path.exists(parent):
             print(f"{parent}: No tiene node_modules activo.")
