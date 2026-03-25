---
description: build and package the biolab application
---

// turbo-all
1. Ensure no instances are running
```powershell
Taskkill /IM "Biolab Pro 0.0.0.exe" /F
```

2. Run the build script
```powershell
npm run app:build
```

3. If build fails due to 7zip/Cache issues
```powershell
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\electron-builder\Cache"
npm run app:build
```
