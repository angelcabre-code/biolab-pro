import os

def get_size(start_path):
    total = 0
    try:
        for dirpath, dirnames, filenames in os.walk(start_path):
            for f in filenames:
                try:
                    fp = os.path.join(dirpath, f)
                    total += os.path.getsize(fp)
                except: continue
    except: pass
    return total

def find_node_modules(root_path):
    found = []
    try:
        # Limit depth for speed
        for dirpath, dirnames, filenames in os.walk(root_path):
            if 'node_modules' in dirnames:
                nm_path = os.path.join(dirpath, 'node_modules')
                size = get_size(nm_path)
                if size > 10 * 1024 * 1024: # > 10MB
                    found.append((nm_path, size))
                # Don't recurse into found node_modules
                dirnames.remove('node_modules')
            # Stop very deep nesting to keep it fast
            if dirpath.count(os.sep) - root_path.count(os.sep) > 4:
                del dirnames[:]
    except: pass
    return found

roots = [
    r'C:\Users\Alvaro\Documents',
    r'C:\Users\Alvaro\Desktop',
    r'C:\Users\Alvaro',
    'D:/'
]

print("Proyectos encontrados con node_modules > 10MB:")
total_global = 0
for r in roots:
    if os.path.exists(r):
        projects = find_node_modules(r)
        for p, s in projects:
            gb = s / (1024**3)
            print(f"{p}: {gb:.2f} GB")
            total_global += s

print(f"\nTOTAL ESTIMADO EN NODE_MODULES: {total_global / (1024**3):.2f} GB")
