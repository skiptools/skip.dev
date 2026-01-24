#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Configuration: Add your repos and replacements here
// NOTE: these need to be manually sync'd with the list in astro.config.mjs
const MODULES = [
  { repo: 'skip-unit', name: 'SkipUnit' },
  { repo: 'skip-lib', name: 'SkipLib' },
  { repo: 'skip-foundation', name: 'SkipFoundation' },
  { repo: 'skip-model', name: 'SkipModel' },
  { repo: 'skip-ui', name: 'SkipUI' },
  { repo: 'skip-fuse', name: 'SkipFuse' },
  { repo: 'skip-fuse-ui', name: 'SkipFuseUI' },
  { repo: 'skip-bridge', name: 'SkipBridge' },

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

const owner = 'skiptools';
const branch = 'main';

const replacements = [
    //{ search: '# Skip Lib', replace: '# Introduction to Skip Lib' },
    //{ search: '](docs/', replace: '](https://github.com/skiptools/skip-ui/blob/main/docs/' },
    { search: 'https://github.com/skiptools', replace: 'https://source.skip.dev' },
    { search: '](https://skip.dev/', replace: '](/' },
    { search: '](https://skip.tools/', replace: '](/' },
    { search: 'href="https://skip.dev/docs/', replace: 'href="/docs/' },
];

const OUTPUT_DIR = './src/content/docs/docs/modules';

async function sync() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const mod of MODULES) {
    const url = `https://raw.githubusercontent.com/${owner}/${mod.repo}/refs/heads/${branch}/README.md`;
    
    console.log(`Fetching ${mod.name}...`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${mod.repo}`);
      
      let content = await response.text();

      // Post-processing replacements
      replacements.forEach(({ search, replace }) => {
        content = content.replaceAll(search, replace);
      });

      content = content.replace(/## License[\s\S]*/i, '');

      // Convert GitHub Alerts (> [!NOTE]) to Starlight Admonitions (:::note)
      // Supported types: NOTE, TIP, IMPORTANT, WARNING, CAUTION
      const alertRegex = /^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n([\s\S]*?)(?=\n\n|\n$|$)/gm;

      content = content.replace(alertRegex, (match, type, body) => {
        const starlightType = type.toLowerCase() === 'important' ? 'note' : type.toLowerCase();
        // Clean up the blockquote '>' markers from the body
        const cleanBody = body.replace(/^>\s?/gm, '').trim();
        return `:::${starlightType}\n${cleanBody}\n:::`;
      });

      // Inject Starlight Frontmatter
      const frontmatter = `---
title: ${mod.name}
description: Documentation for ${mod.name} fetched from GitHub.
note: This documentation section is derived from the GitHub README.md source using the scripts/sync-modules.mjs script. Do not make edits to the file here, change it there.
editUrl: https://github.com/${owner}/${mod.repo}/edit/${branch}/README.md
---

:::note[Source Repository]{icon="github"}
This framework is available at [github.com/${owner}/${mod.repo}](https://github.com/${owner}/${mod.repo}) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::
`;
      const finalContent = frontmatter + content;
      
      // Save file
      const folderPath = path.join(OUTPUT_DIR, mod.repo);
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

      const filePath = path.join(folderPath, 'index.md');
      // If file exists, make it writable so we can overwrite it
      if (fs.existsSync(filePath)) fs.chmodSync(filePath, 0o644);
      
      fs.writeFileSync(filePath, finalContent);
      
      // Set file to read-only (owner/group/others can only read)
      fs.chmodSync(filePath, 0o444);

      console.log(`✅ Successfully synced ${mod.name}`);
      
    } catch (err) {
      console.error(`❌ Error syncing ${mod.name}:`, err.message);
    }
  }
}

sync();
