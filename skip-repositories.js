// The list of Skip frameworks and samples to display on the site.
// Sourced by both astro.config.mjs and scripts/sync-modules.js

export const coreFrameworks = [
  { repo: 'skip-unit', name: 'SkipUnit' },
  { repo: 'skip-lib', name: 'SkipLib' },
  { repo: 'skip-foundation', name: 'SkipFoundation' },
  { repo: 'skip-model', name: 'SkipModel' }, 
  { repo: 'skip-ui', name: 'SkipUI' },
  { repo: 'skip-fuse', name: 'SkipFuse' },
  { repo: 'skip-fuse-ui', name: 'SkipFuseUI' },
  { repo: 'skip-bridge', name: 'SkipBridge' },
];

export const integrationFrameworks = [
  { repo: 'skip-authentication-services', name: 'AuthenticationServices' },
  { repo: 'skip-auth0', name: 'Auth0' },
  { repo: 'skip-av', name: 'AVKit' },
  { repo: 'skip-bluetooth', name: 'Bluetooth' },
  { repo: 'skip-kit', name: 'Camera & Media' },
  { repo: 'skip-device', name: 'Device Hardware' },
  { repo: 'skip-ffi', name: 'FFI' },
  { repo: 'skip-firebase', name: 'Firebase' },
  { repo: 'skip-script', name: 'JavaScriptCore' },
  { repo: 'skip-keychain', name: 'Keychain' },
  { repo: 'skip-marketplace', name: 'Marketplace' },
  { repo: 'skip-motion', name: 'Lottie' },
  { repo: 'skip-nfc', name: 'NFC' },
  { repo: 'skip-posthog', name: 'PostHog' },
  { repo: 'skip-qrcode', name: 'QR Codes' },
  { repo: 'skip-revenue', name: 'RevenueCat' },
  { repo: 'skip-sentry', name: 'Sentry' },
  { repo: 'skip-socketio', name: 'Socket.IO' },
  { repo: 'skip-sql', name: 'SQLite' },
  { repo: 'skip-supabase', name: 'Supabase' },
  { repo: 'skip-web', name: 'WebView' },
  { repo: 'skip-xml', name: 'XML' },
  { repo: 'skip-zip', name: 'Zip' },
];

export const sampleApps = [
  { repo: 'skipapp-showcase-fuse', name: 'Showcase (Fuse)' },
  { repo: 'skipapp-showcase', name: 'Showcase (Lite)' },
  { repo: 'skipapp-hello', name: 'Hello Skip (Lite)' },
  { repo: 'skipapp-howdy', name: 'Howdy Skip (Fuse)' },
  { repo: 'skipapp-hiya', name: 'Hiya Skip (Mixed)' },
  { repo: 'skipapp-bookings-fuse', name: 'Travel Bookings (Fuse)' },
  { repo: 'skipapp-bookings', name: 'Travel Bookings (Lite)' },
  { repo: 'skipapp-travelposters-native', name: 'Travel Posters (Split)' },
  { repo: 'skipapp-fireside-fuse', name: 'Fireside (Fuse)' },
  { repo: 'skipapp-fireside', name: 'Fireside (Lite)' },
  { repo: 'skipapp-notes', name: 'Notes (Lite)' },
  { repo: 'skipapp-databake', name: 'Data Bake (Lite)' },
  { repo: 'skipapp-weather', name: 'Weather (Lite)' },
  { repo: 'skipapp-lottiedemo', name: 'Lottie (Lite)' },
  { repo: 'skipapp-scrumskipper', name: 'Scrumskipper (Lite)' },
];

