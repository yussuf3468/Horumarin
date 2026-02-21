# App Icon Required Sizes

Generate the following PNG icons from your master SVG/vector logo
and place them in `public/icons/`.

## Android (Adaptive Icon — safe zone 66% centered)
| File                  | Size       | Use                       |
|-----------------------|------------|---------------------------|
| icon-48x48.png        | 48×48      | MDPI launcher             |
| icon-72x72.png        | 72×72      | HDPI launcher             |
| icon-96x96.png        | 96×96      | XHDPI / notification      |
| icon-128x128.png      | 128×128    | XXHDPI                    |
| icon-144x144.png      | 144×144    | XXXHDPI / PWA             |
| icon-192x192.png      | 192×192    | PWA maskable (any)        |
| icon-512x512.png      | 512×512    | Play Store high-res       |
| icon-foreground.png   | 108×108dp  | Adaptive icon foreground  |
| icon-background.png   | 108×108dp  | Adaptive icon background  |

## iOS
| File                  | Size       | Use                       |
|-----------------------|------------|---------------------------|
| icon-20x20.png        | 20×20      | Notification (1×)         |
| icon-40x40.png        | 40×40      | Notification (2×)         |
| icon-60x60.png        | 60×60      | iPhone App (1×)           |
| icon-120x120.png      | 120×120    | iPhone App (2×/3×)        |
| icon-180x180.png      | 180×180    | iPhone App (3×)           |
| icon-76x76.png        | 76×76      | iPad App (1×)             |
| icon-152x152.png      | 152×152    | iPad App (2×)             |
| icon-167x167.png      | 167×167    | iPad Pro (2×)             |
| icon-1024x1024.png    | 1024×1024  | App Store                 |

## Web / PWA
| File                  | Size       | Use                       |
|-----------------------|------------|---------------------------|
| favicon-16x16.png     | 16×16      | Browser tab               |
| favicon-32x32.png     | 32×32      | Browser tab retina        |
| apple-touch-icon.png  | 180×180    | iOS add-to-homescreen     |
| icon-384x384.png      | 384×384    | PWA splash                |

## Splash Screens (iOS — pixel-exact)
| Device                | Portrait         | Landscape        |
|-----------------------|------------------|------------------|
| iPhone SE             | 640×1136         | 1136×640         |
| iPhone 8              | 750×1334         | 1334×750         |
| iPhone 14             | 1170×2532        | 2532×1170        |
| iPhone 14 Pro Max     | 1290×2796        | 2796×1290        |
| iPad Mini             | 1536×2048        | 2048×1536        |
| iPad Pro 12.9"        | 2048×2732        | 2732×2048        |

## Design Guidelines
- Use `#0d9488` (teal-600) as primary brand color
- Background: `#0f1117` dark or teal gradient
- Safe zone for maskable icons: center 80% of canvas
- No transparency on iOS icons (use solid background)
- Keep logo centered with 10–15% padding from edges
