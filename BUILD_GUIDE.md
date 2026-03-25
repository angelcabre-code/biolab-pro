---
description: How to build the Biolab Pro executable for Windows
---

# Build Strategy for Biolab Pro (Electron + Vite 8)

This guide documents the specific configurations and steps required to successfully generate the Windows executable, avoiding CommonJS/ESM conflicts and routing issues.

## 🚀 Standard Build Command

To generate the installer and the portable version:

```powershell
npm run app:build
```

This command executes `vue-tsc -b && vite build && electron-builder`.

## 🛠️ Critical Configurations

### 1. Electron & Vite 8 (CommonJS Compatibility)
Vite 8 (Rolldown) defaults to ESM. Since Electron's main process and preload scripts require CommonJS in `.cjs` files:
- **vite.config.ts**: Must use `build.lib` with `formats: ['cjs']` for the `electron` plugin entries.
- **File Extensions**: Use `[name].cjs` for entry file names to ensure Node.js treats them as CommonJS.

### 2. Vue Router (Hash Mode)
In Electron production (using `file://` protocol), the router MUST use hash mode to prevent blank screens:
- **src/router/index.ts**: Use `createWebHashHistory()` instead of `createWebHistory()`.

## 🔍 Troubleshooting

### 7-zip Extraction Error
If the build fails with an "ERROR: Cannot create folder" during the `winCodeSign` extraction:
1. This is usually caused by macOS symlinks in the builder cache that Windows cannot handle.
2. **Fix**: Run the following command to clear the cache and retry:
   ```powershell
   Remove-Item -Recurse -Force "$env:LOCALAPPDATA\electron-builder\Cache"
   ```

### Executable Locked
If the build fails because an "output file is locked":
1. Ensure no previous version of `Biolab Pro 0.0.0.exe` is running.
2. **Fix**: Kill the process via Task Manager or terminal:
   ```powershell
   Taskkill /IM "Biolab Pro 0.0.0.exe" /F
   ```
