# KasA Sovereign - Native Android APK Build Guide

## Prerequisites

1. **Android Studio** (Latest version)
   - Download: https://developer.android.com/studio
   
2. **Java 17+**
   - Verify: `java -version`
   
3. **Android SDK**
   - Target SDK: 34
   - Min SDK: 24
   - Installed via Android Studio SDK Manager

## Quick Build Steps

### Option 1: Using Android Studio (Recommended)

1. **Clone/Open Project**
   ```bash
   git clone https://github.com/OniRyuk/KasA-secured.git
   cd KasA-secured
   ```

2. **Open in Android Studio**
   - File → Open → Select project root
   - Android Studio will auto-detect and sync Gradle

3. **Run the Web Server (in another terminal)**
   ```bash
   npm install
   npm run dev
   ```
   - Server runs on `http://localhost:3000`

4. **Build & Run**
   - Click **Build → Build Bundle(s) / APK(s) → Build APK(s)**
   - Wait for build to complete
   - Connect Android device or start emulator
   - Click **Run** (green play button)

5. **Deploy**
   - APK generated at: `app/build/outputs/apk/debug/app-debug.apk`
   - Release APK: `app/build/outputs/apk/release/app-release.apk`

### Option 2: Using Gradle CLI

```bash
# Build debug APK
./gradlew assembleDebug

# Build release APK (requires signing)
./gradlew assembleRelease

# Install to connected device
./gradlew installDebug

# Run connected tests
./gradlew connectedAndroidTest
```

### Option 3: Direct APK Installation via ADB

```bash
# Connect device over USB (enable USB Debugging)
adb devices

# Install APK
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Launch app
adb shell am start -n com.kasai.sovereign/.MainActivity
```

## Architecture Overview

### Android Components

- **MainActivity** (`MainActivity.kt`)
  - Main WebView Activity
  - Loads PWA from local Node.js server
  - Auto-detects Wi-Fi IP address
  - Fallback to localhost if server not found

- **OfflineWebActivity** (`OfflineWebActivity.kt`)
  - Fallback for offline mode
  - Loads cached PWA assets

### Configuration Files

- **AndroidManifest.xml**
  - App permissions (Wi-Fi, Network, etc.)
  - Activity declarations
  - Intent filters for web links

- **build.gradle** (Module level)
  - Kotlin 17 compilation
  - AndroidX dependencies
  - ProGuard obfuscation (release builds)

- **themes.xml**
  - Dark theme with KasA color scheme
  - Obsidian (#050507) background
  - Crimson Red (#ef4444) accents

## Network Configuration

The app tries these URLs in order:

1. `http://192.168.1.145:3000` - Default LAN
2. `http://192.168.4.1:3000` - AP mode
3. `http://127.0.0.1:3000` - Localhost (emulator)
4. `http://10.0.0.1:3000` - Alternative gateway

**To use a custom server:** Edit `MainActivity.kt` line 35 and rebuild.

## Signing & Release

### Generate Release Signing Key

```bash
keytool -genkey -v -keystore kasa-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias kasa-app-key
```

### Configure Signing in build.gradle

```gradle
signingConfigs {
    release {
        storeFile file("path/to/kasa-release.keystore")
        storePassword "your-store-password"
        keyAlias "kasa-app-key"
        keyPassword "your-key-password"
    }
}
```

### Build Signed Release APK

```bash
./gradlew assembleRelease
```

## Troubleshooting

### WebView won't load

- Verify Node.js server is running: `npm run dev`
- Check firewall allows port 3000
- Enable **USB Debugging** on device
- Use ADB: `adb logcat | grep KasA`

### Gradle sync fails

```bash
# Clear Gradle cache
./gradlew clean

# Rebuild
./gradlew build
```

### Permission denied on device

```bash
# Grant permissions via ADB
adb shell pm grant com.kasai.sovereign android.permission.INTERNET
adb shell pm grant com.kasai.sovereign android.permission.ACCESS_WIFI_STATE
```

## Publishing to Google Play

1. Create Google Play Developer account ($25 one-time fee)
2. Generate signed APK (see Signing & Release section)
3. Upload to Google Play Console
4. Fill out store listing, screenshots, description
5. Submit for review

**Store Listing Requirements:**
- App icon (512x512)
- 2-4 screenshots
- Short description (<80 characters)
- Full description (<4000 characters)
- Privacy policy URL

## Performance Tips

- Use **Release build** for production (smaller, faster)
- Enable **ProGuard** obfuscation
- Test on actual device, not just emulator
- Monitor WebView memory with Android Studio Profiler

## Security Hardening

### Current Implementation

- ✅ Cleartext traffic allowed (localhost development)
- ✅ JavaScript enabled (required for PWA)
- ✅ DOM storage enabled (local data persistence)

### For Production

1. **Use HTTPS**
   - Replace HTTP with HTTPS in MainActivity.kt
   - Certificate pinning for server verification

2. **Restrict File Access**
   ```kotlin
   webView.settings.allowFileAccess = false
   webView.settings.allowContentAccess = false
   ```

3. **Enable WebView Security**
   ```kotlin
   webView.settings.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
   ```

## Support & Debugging

- **Android Studio Logcat**: View real-time app logs
- **Chrome DevTools**: `chrome://inspect` (for WebView debugging)
- **Network Monitor**: Android Studio → Profiler → Network
- **Memory Profiler**: Track memory leaks

---

**Built by Scott Gushea | KasA Sovereign v1.0**
