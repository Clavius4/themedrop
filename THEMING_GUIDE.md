# ThemeDrop — Complete Theme Pack Creation Guide
**From wallpaper selection to live download on the site — every step, every OS.**

---

## Table of Contents

1. [Prerequisites & Tools](#1-prerequisites--tools)
2. [Planning Your Theme](#2-planning-your-theme)
3. [Step 1 — Find & Download Wallpapers](#3-step-1--find--download-wallpapers)
4. [Step 2 — Windows Theme Pack (.deskthemepack)](#4-step-2--windows-theme-pack-deskthemepack)
5. [Step 3 — macOS Theme Pack](#5-step-3--macos-theme-pack)
6. [Step 4 — Ubuntu / GNOME Theme Pack](#6-step-4--ubuntu--gnome-theme-pack)
7. [Step 5 — Kali / KDE Plasma Theme Pack](#7-step-5--kali--kde-plasma-theme-pack)
8. [Step 6 — Package Each OS as a ZIP](#8-step-6--package-each-os-as-a-zip)
9. [Step 7 — Upload to ThemeDrop Admin](#9-step-7--upload-to-themedrop-admin)
10. [Testing Your Theme](#10-testing-your-theme)
11. [Quick Reference Cheat Sheet](#11-quick-reference-cheat-sheet)

---

## 1. Prerequisites & Tools

### Windows (build machine)
| Tool | Purpose | How to get |
|------|---------|-----------|
| Windows 10/11 | Build `.deskthemepack` files | Your PC |
| `makecab.exe` | Package `.cab` archives | Built in — `C:\Windows\System32\makecab.exe` |
| PowerShell 5+ | Scripting | Built in |
| Git Bash / WSL | Unix-style commands | git-scm.com |
| A hex editor (optional) | Validate JPEG bytes | HxD (free) |

### macOS (or just describe it — you build from Windows)
No special tools needed. The macOS pack is just a ZIP containing wallpapers and a shell script. You build it on Windows and the Mac user runs `install.sh`.

### Linux (same as macOS)
All Linux packs are shell scripts + theme files zipped up. Built on Windows, extracted and run on the target machine.

### For all OS packs
- **Image editor** (optional) — Photoshop, GIMP, or Canva for making preview screenshots
- **7-Zip** or Windows built-in ZIP — to create `.zip` files
- **Text editor** — VS Code (recommended)

---

## 2. Planning Your Theme

Before you download a single image, define these four things. Write them down.

```
Theme name:        Breaking Bad
Slug:              breaking-bad          ← URL-safe, lowercase, hyphens only
Accent color:      #4A90D4               ← dominant hex color from the wallpapers
Category:          tv-shows              ← tv-shows | gaming | anime | nature | minimal | cyberpunk | movies | sports
Short desc:        Desert heat, chemical blue, and the cold grey of Albuquerque.
Tags:              desert, blue, yellow, drama, AMC, crime
Featured?:         Yes / No
```

Pick **10 wallpapers** — they should:
- All be **1920×1080** (Full HD) minimum. 2560×1440 (2K) is better.
- Share a consistent colour palette (your theme feels cohesive)
- Mix wide establishing shots with close detail shots
- All be JPEG format (`.jpg`) — smaller files, universal support

---

## 3. Step 1 — Find & Download Wallpapers

### Where to look

| Source | Quality | Notes |
|--------|---------|-------|
| wallpapercave.com | High | Best source. Filter by resolution. Direct JPG links. |
| wallhaven.cc | Very high | Needs account for some. Has 4K. |
| alphacoders.com | High | Large catalogue, good resolution filter. |
| Reddit r/wallpapers | Varies | Good for unique finds. Check resolution in post. |
| Official show/game press kits | Highest | Google `[Name] press kit wallpaper download`. |

### How to download from wallpapercave.com (PowerShell)

1. Find the images you want on wallpapercave.com
2. Right-click each → **Copy image address** — it will look like:
   `https://wallpapercave.com/wp/wp1234567.jpg`
3. Download them in bulk with PowerShell:

```powershell
# Create your working folder
$theme   = "breaking-bad"
$outDir  = "C:\Users\User\Downloads\${theme}-wallpapers"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

# Paste your image URLs here
$urls = @(
    "https://wallpapercave.com/wp/wp1234567.jpg",
    "https://wallpapercave.com/wp/wp1234568.jpg",
    "https://wallpapercave.com/wp/wp1234569.jpg",
    # ... add up to 10
)

$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    "Referer"    = "https://wallpapercave.com/"
}

for ($i = 0; $i -lt $urls.Count; $i++) {
    $n = $i + 1
    $dest = Join-Path $outDir "$n.jpg"
    Write-Host "Downloading $n/$($urls.Count)..."
    Invoke-WebRequest -Uri $urls[$i] -Headers $headers -OutFile $dest
}
Write-Host "Done. Files saved to $outDir"
```

### Validate the downloads (check they're real JPEGs, not thumbnails)

```powershell
Get-ChildItem $outDir -Filter "*.jpg" | ForEach-Object {
    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    $sizeKB = [math]::Round($_.Length / 1KB, 1)
    $valid = ($bytes[0] -eq 0xFF -and $bytes[1] -eq 0xD8)
    $flag  = if ($sizeKB -lt 100) { "⚠ SMALL — may be a thumbnail" } else { "✓" }
    Write-Host "$($_.Name)  ${sizeKB}KB  $(if($valid){'JPEG'}else{'NOT JPEG'})  $flag"
}
```

Any file under ~100 KB is probably a thumbnail — re-download those from a different source or pick a different image.

---

## 4. Step 2 — Windows Theme Pack (.deskthemepack)

A `.deskthemepack` is a **Microsoft Cabinet (.cab) file** renamed with a different extension. When you double-click it on Windows, the OS extracts it and applies the theme automatically.

### What's inside a .deskthemepack

```
MyTheme.deskthemepack  (actually a .cab file)
├── MyTheme.theme      ← INI control file
└── DesktopBackground/
    ├── 1.jpg
    ├── 2.jpg
    └── ...10.jpg
```

### Step-by-step: Build the Windows pack

#### 1. Set up your folder structure

```powershell
$slug = "breaking-bad"
$workDir = "C:\Users\User\Downloads\${slug}-windows"

# Create folder layout
New-Item -ItemType Directory -Force "${workDir}\DesktopBackground" | Out-Null

# Copy your 10 wallpapers in
$wallpapers = "C:\Users\User\Downloads\${slug}-wallpapers"
1..10 | ForEach-Object {
    Copy-Item "${wallpapers}\$_.jpg" "${workDir}\DesktopBackground\$_.jpg"
}
```

#### 2. Create the .theme INI file

Create `C:\Users\User\Downloads\breaking-bad-windows\breaking-bad.theme` with this content:

```ini
[Theme]
DisplayName=Breaking Bad
ThemeId={A7B3C2D1-E4F5-6789-ABCD-EF0123456789}

[Control Panel\Desktop]
Wallpaper=

[Slideshow]
Interval=1800000
Shuffle=1
ImagesRootPath=%SystemRoot%\Resources\Themes\breaking-bad\DesktopBackground
Item0Path=DesktopBackground\1.jpg
Item1Path=DesktopBackground\2.jpg
Item2Path=DesktopBackground\3.jpg
Item3Path=DesktopBackground\4.jpg
Item4Path=DesktopBackground\5.jpg
Item5Path=DesktopBackground\6.jpg
Item6Path=DesktopBackground\7.jpg
Item7Path=DesktopBackground\8.jpg
Item8Path=DesktopBackground\9.jpg
Item9Path=DesktopBackground\10.jpg

[VisualStyles]
Path=%SystemRoot%\resources\themes\Aero\Aero.msstyles
ColorStyle=NormalColor
Size=NormalSize
ColorizationColor=0XC44A90D4
SystemMode=Dark
AppMode=Dark

[MasterThemeSelector]
MTSB=Unused

[Sounds]
; No custom sounds

[Control Panel\Cursors]
; Default cursors
```

**Key fields to customise:**

| Field | What it does | Example |
|-------|-------------|---------|
| `DisplayName` | Shown in Windows Settings | `Breaking Bad` |
| `Interval` | Wallpaper rotation in ms | `1800000` = 30 min |
| `Shuffle` | Random order | `1` = yes, `0` = no |
| `ColorizationColor` | Window border accent colour | `0XC44A90D4` = blue |
| `SystemMode` | Dark/Light mode | `Dark` or `Light` |
| `AppMode` | App colour mode | `Dark` or `Light` |

**Calculating `ColorizationColor`:**  
Format: `0XC4RRGGBB` where `C4` is the alpha (fixed), and `RRGGBB` is your hex colour.  
For `#4A90D4` → `0XC44A90D4`  
For `#C8A030` → `0XC4C8A030`

#### 3. Create the Cabinet Directive File (.ddf)

Create `C:\Users\User\Downloads\breaking-bad-windows\build.ddf`:

```
.OPTION EXPLICIT
.Set CabinetNameTemplate=breaking-bad.cab
.Set DiskDirectoryTemplate=.
.Set CompressionType=MSZIP
.Set Cabinet=on
.Set Compress=1

; Theme file
breaking-bad.theme

; Wallpapers — NOTE: NO SPACES allowed in any paths here
DesktopBackground\1.jpg DesktopBackground\1.jpg
DesktopBackground\2.jpg DesktopBackground\2.jpg
DesktopBackground\3.jpg DesktopBackground\3.jpg
DesktopBackground\4.jpg DesktopBackground\4.jpg
DesktopBackground\5.jpg DesktopBackground\5.jpg
DesktopBackground\6.jpg DesktopBackground\6.jpg
DesktopBackground\7.jpg DesktopBackground\7.jpg
DesktopBackground\8.jpg DesktopBackground\8.jpg
DesktopBackground\9.jpg DesktopBackground\9.jpg
DesktopBackground\10.jpg DesktopBackground\10.jpg
```

> **Critical:** `makecab.exe` does NOT support spaces in file names or paths inside the `.ddf` file. Always use slug names (no spaces). Rename the final output separately.

#### 4. Run makecab and rename to .deskthemepack

```powershell
Set-Location "C:\Users\User\Downloads\${slug}-windows"

# Build the .cab file
& "C:\Windows\System32\makecab.exe" /F build.ddf

# Rename output to .deskthemepack (with friendly display name)
Rename-Item "breaking-bad.cab" "Breaking Bad.deskthemepack"

Write-Host "Done: Breaking Bad.deskthemepack"
```

#### 5. Test it

Double-click `Breaking Bad.deskthemepack` on your Windows PC. Windows should:
1. Extract it to `%AppData%\Microsoft\Windows\Themes\`
2. Immediately apply Dark Mode
3. Start rotating through the 10 wallpapers

---

## 5. Step 3 — macOS Theme Pack

macOS does not have a native theme format. Instead, we ship a shell script (`install.sh`) that programmatically applies all the settings, plus an AppleScript-based Terminal colour profile.

### What's in the macOS pack

```
breaking-bad-macos/
├── install.sh                  ← main installer (run this)
├── wallpapers/
│   ├── 1.jpg
│   └── ...10.jpg
└── extras/
    └── BreakingBad.terminal    ← Terminal.app colour profile
```

#### 1. Create `install.sh`

Create `C:\Users\User\Downloads\breaking-bad-macos\install.sh`:

```bash
#!/usr/bin/env bash
set -e

THEME="Breaking Bad"
THEME_DIR="$HOME/Library/Desktop Pictures/${THEME}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Installing ${THEME} Theme"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. Copy wallpapers ──────────────────────────────────────────
echo "→ Copying wallpapers..."
mkdir -p "$THEME_DIR"
cp "$SCRIPT_DIR/wallpapers/"*.jpg "$THEME_DIR/"
echo "  ✓ Wallpapers installed to $THEME_DIR"

# ── 2. Set wallpaper on all desktops ────────────────────────────
echo "→ Setting wallpaper..."
osascript <<EOF
tell application "System Events"
    tell every desktop
        set picture to POSIX file ("$THEME_DIR/1.jpg")
    end tell
end tell
EOF
echo "  ✓ Wallpaper set"

# ── 3. Enable Dark Mode ─────────────────────────────────────────
echo "→ Enabling Dark Mode..."
osascript -e 'tell application "System Events" to tell appearance preferences to set dark mode to true'
echo "  ✓ Dark Mode enabled"

# ── 4. Set accent colour (1 = Blue, 0 = Red, 2 = Yellow, 6 = Orange) ──
echo "→ Setting accent colour..."
defaults write NSGlobalDomain AppleAccentColor -int 1
defaults write NSGlobalDomain AppleHighlightColor "0.698039 0.843137 1.000000 Blue"
echo "  ✓ Accent colour set"

# ── 5. Install Terminal profile ──────────────────────────────────
TERMINAL_PROFILE="$SCRIPT_DIR/extras/BreakingBad.terminal"
if [ -f "$TERMINAL_PROFILE" ]; then
    echo "→ Installing Terminal profile..."
    open "$TERMINAL_PROFILE"
    echo "  ✓ Terminal profile opened — click Default in Terminal > Preferences to activate"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓ ${THEME} theme installed!"
echo "  Log out and back in for all changes to take effect."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

#### 2. Create `extras/BreakingBad.terminal`

This is an XML plist that defines the Terminal.app colour scheme. Create `C:\Users\User\Downloads\breaking-bad-macos\extras\BreakingBad.terminal`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>name</key>
    <string>Breaking Bad</string>
    <key>type</key>
    <string>Window Settings</string>
    <key>ProfileCurrentVersion</key>
    <real>2.07</real>

    <!-- Background: dark grey-green -->
    <key>BackgroundColor</key>
    <data>YnBsaXN0MDDUAQIDBAUGFRZYJHZlcnNpb25YJG9iamplY3RzWSRhcmNoaXZlclQkdG9wEgABhqBfEA9OU0tleWVkQXJjaGl2ZXKiERJVJG51bGxUcmdiAAAAAAAAAAAAAPA/AAAAAAAAIEAAAAAAAAAgQEAAAAAAAAAIQA==</data>
    <!-- Foreground: pale yellow -->
    <key>TextColor</key>
    <data>YnBsaXN0MDDUAQIDBAUGFRZYJHZlcnNpb25YJG9iamplY3RzWSRhcmNoaXZlclQkdG9wEgABhqBfEA9OU0tleWVkQXJjaGl2ZXKiERJVJG51bGxUcmdiAAAAAAAAyD8AAACAP3IzMz4=</data>

    <key>columnCount</key>
    <integer>220</integer>
    <key>rowCount</key>
    <integer>50</integer>
    <key>FontAntialias</key>
    <true/>
    <key>Font</key>
    <data>YnBsaXN0MDDUAQIDBAUGGBlYJHZlcnNpb25YJG9iamplY3RzWSRhcmNoaXZlclQkdG9w...</data>

    <!-- ANSI colours -->
    <key>ANSIBlackColor</key>
    <data>YnBsaXN0MDDUAQIDBAUGFRZYJHZlcnNpb25YJG9iamplY3RzWSRhcmNoaXZlclQkdG9wEgABhqBfEA9OU0tleWVkQXJjaGl2ZXKiERJVJG51bGxUcmdiAAAAAAAAAAAAAAAAAAAQQA==</data>
    <key>ANSIBlueColor</key>
    <data>YnBsaXN0MDDUAQIDBAUGFRZYJHZlcnNpb25YJG9iamplY3RzWSRhcmNoaXZlclQkdG9wEgABhqBfEA9OU0tleWVkQXJjaGl2ZXKiERJVJG51bGxUcmdiAAAAAAAAyD8AAACAP3IzMz4=</data>
    <key>ANSIYellowColor</key>
    <data>YnBsaXN0MDDUAQIDBAUGFRZYJHZlcnNpb25YJG9iamplY3RzWSRhcmNoaXZlclQkdG9wEgABhqBfEA9OU0tleWVkQXJjaGl2ZXKiERJVJG51bGxUcmdiAAAAAAAA8D8AAACAP3IzMz4=</data>
    <key>CursorColor</key>
    <data>YnBsaXN0MDDUAQIDBAUGFRZYJHZlcnNpb25YJG9iamplY3RzWSRhcmNoaXZlclQkdG9wEgABhqBfEA9OU0tleWVkQXJjaGl2ZXKiERJVJG51bGxUcmdiAAAAAAAA8D8AAACAP3IzMz4=</data>
</dict>
</plist>
```

> **Tip:** The `<data>` blobs above are base64-encoded NSColor objects. For accurate colour encoding, open Terminal.app on a Mac, set the colours you want manually under **Preferences → Profiles**, then export via `File → Export Settings`. Replace the data blobs with those from the exported file.

#### 3. Copy wallpapers into the pack

```powershell
$slug   = "breaking-bad"
$srcDir = "C:\Users\User\Downloads\${slug}-wallpapers"
$dstDir = "C:\Users\User\Downloads\${slug}-macos\wallpapers"
New-Item -ItemType Directory -Force $dstDir | Out-Null
1..10 | ForEach-Object { Copy-Item "${srcDir}\$_.jpg" "${dstDir}\$_.jpg" }
```

---

## 6. Step 4 — Ubuntu / GNOME Theme Pack

GNOME uses **GTK themes** (CSS files) + a shell extension for the colour scheme. Our pack installs a GTK3/4 colour scheme and sets the wallpaper via `gsettings`.

### What's in the GNOME pack

```
breaking-bad-ubuntu/
├── install.sh
├── wallpapers/
│   └── 1.jpg ... 10.jpg
└── theme/
    └── BreakingBad-GTK/
        ├── index.theme
        ├── gtk-3.0/
        │   └── gtk.css
        └── gtk-4.0/
            └── gtk.css
```

#### 1. Create `theme/BreakingBad-GTK/index.theme`

```ini
[Desktop Entry]
Type=X-GNOME-Metatheme
Name=Breaking Bad
Comment=Desert heat and chemical blue for your desktop
Encoding=UTF-8

[X-GNOME-Metatheme]
GtkTheme=BreakingBad-GTK
MetacityTheme=Adwaita
IconTheme=Adwaita
CursorTheme=Adwaita
ButtonLayout=close,minimize,maximize:
```

#### 2. Create `theme/BreakingBad-GTK/gtk-3.0/gtk.css`

This is the core CSS file that colours every GTK3 application:

```css
/* Breaking Bad — GTK3 Theme */
/* Based on Adwaita-dark with custom palette */

@define-color bg_color         #1C1A14;   /* dark sand — main background */
@define-color fg_color         #E8D87A;   /* chemical yellow — main text */
@define-color base_color       #141210;   /* deepest dark */
@define-color text_color       #E8D87A;
@define-color selected_bg_color #4A90D4;  /* chemical blue — selection/accent */
@define-color selected_fg_color #FFFFFF;
@define-color tooltip_bg_color  #2A2518;
@define-color tooltip_fg_color  #E8D87A;
@define-color error_color       #CC3333;
@define-color success_color     #5CB85C;
@define-color warning_color     #F0A500;

/* ── Window backgrounds ───────────────────────────────────── */
window, .window-frame {
  background-color: @bg_color;
  color: @fg_color;
}

.titlebar, headerbar {
  background: linear-gradient(to bottom, #2A2518, #1C1A14);
  color: @fg_color;
  border-bottom: 1px solid #3A3020;
  box-shadow: 0 1px 4px rgba(0,0,0,0.6);
}

/* ── Buttons ──────────────────────────────────────────────── */
button {
  background: linear-gradient(to bottom, #2A2518, #1C1A14);
  color: @fg_color;
  border: 1px solid #3A3020;
  border-radius: 4px;
  padding: 5px 12px;
  transition: all 150ms ease;
}

button:hover {
  background: linear-gradient(to bottom, #3A3020, #2A2518);
  border-color: @selected_bg_color;
  color: @selected_bg_color;
}

button:active, button:checked {
  background: @selected_bg_color;
  color: @selected_fg_color;
  border-color: @selected_bg_color;
}

/* ── Text inputs ──────────────────────────────────────────── */
entry {
  background-color: @base_color;
  color: @fg_color;
  border: 1px solid #3A3020;
  border-radius: 4px;
  padding: 6px 8px;
  caret-color: @selected_bg_color;
}

entry:focus {
  border-color: @selected_bg_color;
  box-shadow: 0 0 0 2px rgba(74,144,212,0.3);
}

/* ── Lists and selections ─────────────────────────────────── */
treeview, listbox row, .list-row {
  background-color: @bg_color;
  color: @fg_color;
  padding: 4px 8px;
}

treeview:selected, listbox row:selected, .list-row:selected {
  background-color: @selected_bg_color;
  color: @selected_fg_color;
}

treeview:hover, listbox row:hover {
  background-color: rgba(74,144,212,0.15);
}

/* ── Sidebar / panels ─────────────────────────────────────── */
.sidebar, placessidebar {
  background-color: #141210;
  border-right: 1px solid #3A3020;
}

/* ── Scrollbars ───────────────────────────────────────────── */
scrollbar slider {
  background-color: #4A90D4;
  border-radius: 4px;
  min-width: 6px;
  min-height: 6px;
}

scrollbar trough { background-color: #1C1A14; }

/* ── Menus ────────────────────────────────────────────────── */
menu, .menu, popover {
  background-color: #1C1A14;
  color: @fg_color;
  border: 1px solid #3A3020;
  box-shadow: 0 4px 12px rgba(0,0,0,0.8);
  border-radius: 6px;
}

menuitem:hover { background-color: @selected_bg_color; color: @selected_fg_color; }

/* ── Notebook tabs ────────────────────────────────────────── */
notebook header { background-color: @base_color; border-bottom: 1px solid #3A3020; }
notebook tab { padding: 8px 16px; color: @fg_color; border: none; }
notebook tab:checked { border-bottom: 2px solid @selected_bg_color; color: @selected_bg_color; }

/* ── Progress / spinners ──────────────────────────────────── */
progressbar progress { background-color: @selected_bg_color; }
progressbar trough { background-color: #3A3020; }
spinner { color: @selected_bg_color; }

/* ── Checkboxes and radio buttons ─────────────────────────── */
checkbutton check, radiobutton radio {
  background-color: @base_color;
  border: 1px solid #4A90D4;
  border-radius: 3px;
}

checkbutton check:checked, radiobutton radio:checked {
  background-color: @selected_bg_color;
  color: @selected_fg_color;
}
```

#### 3. Create `theme/BreakingBad-GTK/gtk-4.0/gtk.css`

GTK4 uses the same variable names. Create the file with the same content as gtk-3.0/gtk.css — GTK4 apps will pick it up automatically.

```css
/* Just symlink or copy gtk-3.0/gtk.css content here */
/* GTK4 uses the same CSS custom property syntax */
```

#### 4. Create `install.sh`

```bash
#!/usr/bin/env bash
set -e

THEME="BreakingBad-GTK"
WALLPAPER_DIR="$HOME/.local/share/breaking-bad-wallpapers"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Installing Breaking Bad — GNOME Theme"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. Install GTK theme ────────────────────────────────────────
echo "→ Installing GTK theme..."
mkdir -p "$HOME/.themes"
cp -r "$SCRIPT_DIR/theme/${THEME}" "$HOME/.themes/"
echo "  ✓ Theme installed to ~/.themes/${THEME}"

# ── 2. Install wallpapers ────────────────────────────────────────
echo "→ Installing wallpapers..."
mkdir -p "$WALLPAPER_DIR"
cp "$SCRIPT_DIR/wallpapers/"*.jpg "$WALLPAPER_DIR/"
echo "  ✓ Wallpapers installed to $WALLPAPER_DIR"

# ── 3. Apply GTK theme ───────────────────────────────────────────
echo "→ Applying GTK theme..."
gsettings set org.gnome.desktop.interface gtk-theme         "${THEME}"
gsettings set org.gnome.desktop.interface color-scheme      "prefer-dark"
gsettings set org.gnome.desktop.interface icon-theme        "Adwaita"
gsettings set org.gnome.desktop.interface cursor-theme      "Adwaita"
echo "  ✓ GTK theme applied (dark mode enabled)"

# ── 4. Set wallpaper ────────────────────────────────────────────
echo "→ Setting wallpaper..."
gsettings set org.gnome.desktop.background picture-uri       "file://${WALLPAPER_DIR}/1.jpg"
gsettings set org.gnome.desktop.background picture-uri-dark  "file://${WALLPAPER_DIR}/1.jpg"
gsettings set org.gnome.desktop.background picture-options   "zoom"
echo "  ✓ Wallpaper set to 1.jpg"

# ── 5. Set accent colour (GNOME 47+) ─────────────────────────────
if gsettings get org.gnome.desktop.interface accent-color &>/dev/null; then
    gsettings set org.gnome.desktop.interface accent-color "blue"
    echo "  ✓ Accent colour set to blue"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓ Breaking Bad theme installed!"
echo "  You can change wallpaper in Settings → Background"
echo "  All wallpapers are in: $WALLPAPER_DIR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

---

## 7. Step 5 — Kali / KDE Plasma Theme Pack

KDE Plasma uses **Look and Feel** packages. These control the wallpaper, colour scheme, window decorations, and more from one place.

### What's in the KDE pack

```
breaking-bad-kde/
├── install.sh
├── wallpapers/
│   └── 1.jpg ... 10.jpg
└── look-and-feel/
    └── com.breakingbad.theme/
        ├── metadata.json
        └── contents/
            ├── defaults
            └── layouts/    (optional — for custom panel layouts)
colors/
    └── BreakingBad.colors
```

#### 1. Create `look-and-feel/com.breakingbad.theme/metadata.json`

```json
{
    "KPlugin": {
        "Id":          "com.breakingbad.theme",
        "Name":        "Breaking Bad",
        "Description": "Desert heat and chemical blue. Say my name.",
        "Author":      "ThemeDrop",
        "Email":       "",
        "License":     "CC-BY-SA 4.0",
        "Version":     "1.0",
        "Website":     "https://themedrop-henna.vercel.app",
        "Category":    "Look and Feel",
        "Tags":        ["dark", "desert", "blue", "drama"]
    },
    "X-Plasma-API": "5.0"
}
```

#### 2. Create `look-and-feel/com.breakingbad.theme/contents/defaults`

This file sets which colour scheme and other defaults the theme applies:

```ini
[kdeglobals]
ColorScheme=BreakingBad

[plasmarc]
Theme=breeze-dark

[kwinrc]
[org.kde.kdecoration2]
library=org.kde.breeze
theme=Breeze
```

#### 3. Create `colors/BreakingBad.colors`

This is the KDE colour scheme file. It controls every UI colour:

```ini
[ColorEffects:Disabled]
Color=56,56,56
ColorAmount=0
ColorEffect=0
ContrastAmount=0.65
ContrastEffect=1
IntensityAmount=0.1
IntensityEffect=2

[ColorEffects:Inactive]
ChangeSelectionColor=true
Color=112,111,110
ColorAmount=0.025
ColorEffect=2
ContrastAmount=0.1
ContrastEffect=2
Enable=false
IntensityAmount=0
IntensityEffect=0

[Colors:Button]
BackgroundAlternate=44,40,28
BackgroundNormal=38,34,22
DecorationFocus=74,144,212
DecorationHover=74,144,212
ForegroundActive=74,144,212
ForegroundInactive=128,120,90
ForegroundLink=74,144,212
ForegroundNegative=204,51,51
ForegroundNeutral=240,165,0
ForegroundNormal=232,216,122
ForegroundPositive=92,184,92
ForegroundVisited=130,100,200

[Colors:Selection]
BackgroundAlternate=32,64,100
BackgroundNormal=74,144,212
DecorationFocus=74,144,212
DecorationHover=74,144,212
ForegroundActive=255,255,255
ForegroundInactive=200,200,200
ForegroundLink=255,230,100
ForegroundNegative=255,80,80
ForegroundNeutral=240,165,0
ForegroundNormal=255,255,255
ForegroundPositive=150,220,150
ForegroundVisited=180,150,220

[Colors:Tooltip]
BackgroundAlternate=42,37,24
BackgroundNormal=42,37,24
DecorationFocus=74,144,212
DecorationHover=74,144,212
ForegroundActive=74,144,212
ForegroundInactive=120,115,85
ForegroundLink=74,144,212
ForegroundNegative=204,51,51
ForegroundNeutral=240,165,0
ForegroundNormal=232,216,122
ForegroundPositive=92,184,92
ForegroundVisited=130,100,200

[Colors:View]
BackgroundAlternate=22,20,14
BackgroundNormal=18,16,10
DecorationFocus=74,144,212
DecorationHover=74,144,212
ForegroundActive=74,144,212
ForegroundInactive=128,120,90
ForegroundLink=74,144,212
ForegroundNegative=204,51,51
ForegroundNeutral=240,165,0
ForegroundNormal=232,216,122
ForegroundPositive=92,184,92
ForegroundVisited=130,100,200

[Colors:Window]
BackgroundAlternate=34,30,20
BackgroundNormal=28,26,18
DecorationFocus=74,144,212
DecorationHover=74,144,212
ForegroundActive=74,144,212
ForegroundInactive=128,120,90
ForegroundLink=74,144,212
ForegroundNegative=204,51,51
ForegroundNeutral=240,165,0
ForegroundNormal=232,216,122
ForegroundPositive=92,184,92
ForegroundVisited=130,100,200

[General]
ColorScheme=BreakingBad
Name=Breaking Bad
shadeSortColumn=true

[KDE]
contrast=4

[WM]
activeBackground=18,16,10
activeForeground=232,216,122
activeBlend=18,16,10
inactiveBackground=22,20,14
inactiveForeground=128,120,90
inactiveBlend=22,20,14
activeTitleBtnBg=28,26,18
inactiveTitleBtnBg=22,20,14
```

#### 4. Create `install.sh`

```bash
#!/usr/bin/env bash
set -e

THEME_ID="com.breakingbad.theme"
WALLPAPER_DIR="$HOME/.local/share/wallpapers/BreakingBad"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Installing Breaking Bad — KDE Theme"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. Install Look and Feel package ─────────────────────────────
echo "→ Installing Look and Feel package..."
LNF_DIR="$HOME/.local/share/plasma/look-and-feel"
mkdir -p "$LNF_DIR"
cp -r "$SCRIPT_DIR/look-and-feel/${THEME_ID}" "$LNF_DIR/"
echo "  ✓ Installed to $LNF_DIR/${THEME_ID}"

# ── 2. Install colour scheme ──────────────────────────────────────
echo "→ Installing colour scheme..."
mkdir -p "$HOME/.local/share/color-schemes"
cp "$SCRIPT_DIR/colors/BreakingBad.colors" "$HOME/.local/share/color-schemes/"
echo "  ✓ Colour scheme installed"

# ── 3. Install wallpapers ─────────────────────────────────────────
echo "→ Installing wallpapers..."
mkdir -p "$WALLPAPER_DIR"
cp "$SCRIPT_DIR/wallpapers/"*.jpg "$WALLPAPER_DIR/"
echo "  ✓ Wallpapers installed to $WALLPAPER_DIR"

# ── 4. Apply Look and Feel ────────────────────────────────────────
echo "→ Applying KDE Look and Feel..."
if command -v lookandfeeltool &>/dev/null; then
    lookandfeeltool --apply "$THEME_ID"
    echo "  ✓ Look and Feel applied"
else
    echo "  ⚠ lookandfeeltool not found. Apply manually:"
    echo "    System Settings → Appearance → Global Theme → ${THEME_ID}"
fi

# ── 5. Set wallpaper via plasma-apply-wallpaperimage ──────────────
echo "→ Setting wallpaper..."
if command -v plasma-apply-wallpaperimage &>/dev/null; then
    plasma-apply-wallpaperimage "$WALLPAPER_DIR/1.jpg"
    echo "  ✓ Wallpaper set"
else
    # Fallback: set via ksetwallpaper script
    DBUS_TARGET="org.kde.plasmashell"
    qdbus $DBUS_TARGET /PlasmaShell org.kde.PlasmaShell.evaluateScript "
        var allDesktops = desktops();
        for (var i = 0; i < allDesktops.length; i++) {
            var d = allDesktops[i];
            d.wallpaperPlugin = 'org.kde.image';
            d.currentConfigGroup = ['Wallpaper','org.kde.image','General'];
            d.writeConfig('Image', 'file://${WALLPAPER_DIR}/1.jpg');
        }
    " 2>/dev/null && echo "  ✓ Wallpaper set via qdbus" || echo "  ⚠ Set wallpaper manually via right-click Desktop"
fi

# ── 6. Apply colour scheme ────────────────────────────────────────
echo "→ Applying colour scheme..."
plasma-apply-colorscheme BreakingBad 2>/dev/null || \
    kwriteconfig5 --file kdeglobals --group General --key ColorScheme "BreakingBad"
echo "  ✓ Colour scheme applied"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓ Breaking Bad KDE theme installed!"
echo "  All wallpapers: $WALLPAPER_DIR"
echo "  Fine-tune: System Settings → Appearance"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

---

## 8. Step 6 — Package Each OS as a ZIP

Once all four OS packs are built, zip each one:

```powershell
$slug    = "breaking-bad"
$outBase = "C:\Users\User\Downloads"

# Windows pack
# (no zipping needed — the .deskthemepack IS the installer, just put it in a zip for the site)
Compress-Archive -Path "${outBase}\${slug}-windows\*" `
                 -DestinationPath "${outBase}\${slug}-windows.zip" -Force

# macOS pack
Compress-Archive -Path "${outBase}\${slug}-macos\*" `
                 -DestinationPath "${outBase}\${slug}-macos.zip" -Force

# Ubuntu/GNOME pack
Compress-Archive -Path "${outBase}\${slug}-ubuntu\*" `
                 -DestinationPath "${outBase}\${slug}-ubuntu.zip" -Force

# KDE pack
Compress-Archive -Path "${outBase}\${slug}-kde\*" `
                 -DestinationPath "${outBase}\${slug}-kde.zip" -Force

Write-Host "All ZIPs created:"
Get-ChildItem "${outBase}\${slug}-*.zip" | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 1)
    Write-Host "  $($_.Name)  ($sizeMB MB)"
}
```

### Make the install.sh executable inside the ZIP (important for Linux/macOS)

When you ZIP on Windows, file permissions are stripped. Users on Linux/macOS need to run `chmod +x install.sh` before they can execute the script. We mention this in the site's `installCmd` field:

```
installCmd: "chmod +x install.sh && ./install.sh"
```

This is already the default in ThemeDrop for all non-Windows platforms.

---

## 9. Step 7 — Upload to ThemeDrop Admin

The admin portal at `https://themedrop-henna.vercel.app/admin` lets you publish a new theme without touching any code.

### Step-by-step upload

1. **Go to** `https://themedrop-henna.vercel.app/admin`
2. **Log in** with the admin password
3. Click **Upload Theme** in the top navigation

#### Fill in the form

**Section 1 — Theme Info:**

| Field | What to enter | Example |
|-------|--------------|---------|
| Theme Name | Display name | `Breaking Bad` |
| Slug | Auto-generated — leave as-is | `breaking-bad` |
| Short Description | 1 line, max 120 chars | `Desert heat, chemical blue, and the cold grey of Albuquerque.` |
| Long Description | 3–5 sentences for the detail page | Full paragraph |
| Category | Pick from dropdown | `TV Shows` |
| Tags | Comma-separated | `desert, blue, yellow, drama, AMC` |
| Accent Color | Click the colour picker → pick your main colour | `#4A90D4` |
| Wallpaper Count | How many wallpapers | `10` |
| Featured | Toggle on for homepage | On/Off |

**Section 2 — Preview Images:**

Upload 3 of your best wallpapers as previews. These are shown:
- As the card thumbnail on the themes grid
- As the large preview on the theme detail page

Click each preview box, select your JPEG. It uploads automatically and shows a progress bar.

**Section 3 — Download Files:**

Upload your 4 ZIP files:
- **Windows 10/11** → `breaking-bad-windows.zip`
- **macOS 12–15** → `breaking-bad-macos.zip`
- **Ubuntu/GNOME** → `breaking-bad-ubuntu.zip`
- **Kali/KDE Plasma** → `breaking-bad-kde.zip`

Each file shows a progress bar while uploading. File size is auto-detected.

4. Click **Publish Theme**
5. Your theme appears instantly at `https://themedrop-henna.vercel.app/theme/breaking-bad`

---

## 10. Testing Your Theme

### Windows
1. Double-click `Breaking Bad.deskthemepack`
2. Windows should switch to dark mode immediately and show the first wallpaper
3. Wait 30 minutes (or set Interval=60000 for 1-min testing) to confirm wallpaper rotation
4. Check Settings → Personalisation → Colours to see the accent colour was applied

### macOS
1. Extract the ZIP → right-click `install.sh` → Open With → Terminal
2. Or in Terminal: `cd /path/to/extracted && chmod +x install.sh && ./install.sh`
3. Verify: wallpaper changed, dark mode is on, Terminal profile imported

### Ubuntu/GNOME
```bash
cd /path/to/extracted
chmod +x install.sh
./install.sh
# Check
gsettings get org.gnome.desktop.interface gtk-theme
# Should output: 'BreakingBad-GTK'
```

### Kali/KDE Plasma
```bash
cd /path/to/extracted
chmod +x install.sh
./install.sh
# Then: System Settings → Appearance → Global Theme
# Your theme should appear in the list
```

---

## 11. Quick Reference Cheat Sheet

```
ONE THEME PACK — COMPLETE CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ 10 wallpapers at 1920×1080+ in JPEG format
□ All wallpapers validated (>100KB, magic bytes FF D8)

WINDOWS .deskthemepack
□ Folder: slug-windows/DesktopBackground/1.jpg ... 10.jpg
□ File: slug-windows/slug.theme  (INI config)
□ File: slug-windows/build.ddf   (cabinet directive)
□ Run: makecab /F build.ddf
□ Rename: slug.cab → "Display Name.deskthemepack"
□ Test: double-click it on Windows

macOS ZIP
□ Folder: slug-macos/wallpapers/1.jpg ... 10.jpg
□ File: slug-macos/install.sh  (sets wallpaper + dark mode + accent)
□ File: slug-macos/extras/ThemeName.terminal  (colour profile)
□ Test: chmod +x install.sh && ./install.sh on a Mac

Ubuntu/GNOME ZIP
□ Folder: slug-ubuntu/wallpapers/1.jpg ... 10.jpg
□ Folder: slug-ubuntu/theme/ThemeName-GTK/gtk-3.0/gtk.css
□ Folder: slug-ubuntu/theme/ThemeName-GTK/gtk-4.0/gtk.css
□ File: slug-ubuntu/theme/ThemeName-GTK/index.theme
□ File: slug-ubuntu/install.sh  (installs GTK + gsettings)
□ Test: chmod +x install.sh && ./install.sh on Ubuntu

KDE Plasma ZIP
□ Folder: slug-kde/wallpapers/1.jpg ... 10.jpg
□ Folder: slug-kde/look-and-feel/com.slug.theme/metadata.json
□ File: slug-kde/look-and-feel/com.slug.theme/contents/defaults
□ File: slug-kde/colors/ThemeName.colors
□ File: slug-kde/install.sh  (lookandfeeltool + qdbus wallpaper)
□ Test: chmod +x install.sh && ./install.sh on KDE

PACKAGING
□ Compress-Archive to create 4 ZIPs: windows, macos, ubuntu, kde
□ Note ZIP sizes for the admin upload form

UPLOAD TO THEMEDROP
□ Log in at /admin  (password: ThemeDrop)
□ Upload Theme → fill all fields → upload 3 preview JPEGs
□ Upload 4 ZIP files → Publish
□ Visit /theme/slug to confirm it's live
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COLOUR CHEAT SHEET
─────────────────────────────────────────
Accent hex #RRGGBB → Windows ColorizationColor
  Formula: 0XC4 + RRGGBB (uppercase)
  Example: #4A90D4 → 0XC44A90D4
  Example: #C8A030 → 0XC4C8A030

KDE .colors R,G,B format
  #4A90D4 → 74,144,212
  #C8A030 → 200,160,48
  #1C1A14 → 28,26,20
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Folder Structure Reference

```
Downloads/
├── breaking-bad-wallpapers/      ← source images (keep these)
│   ├── 1.jpg ... 10.jpg
│
├── breaking-bad-windows/         ← Windows pack
│   ├── build.ddf
│   ├── breaking-bad.theme
│   ├── Breaking Bad.deskthemepack   ← final output
│   └── DesktopBackground/
│       └── 1.jpg ... 10.jpg
│
├── breaking-bad-macos/           ← macOS pack
│   ├── install.sh
│   ├── wallpapers/
│   └── extras/
│       └── BreakingBad.terminal
│
├── breaking-bad-ubuntu/          ← Ubuntu/GNOME pack
│   ├── install.sh
│   ├── wallpapers/
│   └── theme/
│       └── BreakingBad-GTK/
│           ├── index.theme
│           ├── gtk-3.0/gtk.css
│           └── gtk-4.0/gtk.css
│
├── breaking-bad-kde/             ← KDE pack
│   ├── install.sh
│   ├── wallpapers/
│   ├── colors/
│   │   └── BreakingBad.colors
│   └── look-and-feel/
│       └── com.breakingbad.theme/
│           ├── metadata.json
│           └── contents/defaults
│
├── breaking-bad-windows.zip      ← upload to admin
├── breaking-bad-macos.zip
├── breaking-bad-ubuntu.zip
└── breaking-bad-kde.zip
```
