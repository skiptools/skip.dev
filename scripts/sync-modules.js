#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// shared definitions of the modules and samples
import { coreFrameworks, platformFrameworks, integrationFrameworks, sampleApps } from '../skip-repositories.js';

const replacements = [
    //{ search: '# Skip Lib', replace: '# Introduction to Skip Lib' },
    //{ search: '](docs/', replace: '](https://github.com/skiptools/skip-ui/blob/main/docs/' },
    { search: 'https://github.com/skiptools', replace: 'https://source.skip.dev' },
    { search: '](https://skip.dev/', replace: '](/' },
    { search: '](https://skip.tools/', replace: '](/' },
    { search: 'href="https://skip.dev/docs/', replace: 'href="/docs/' },
    { search: '[Skip](https://skip.dev)', replace: 'Skip' }, // strip out bare links to the skip.dev root page
    { search: '[Skip Lite](https://skip.dev)', replace: 'Skip Lite' },
    { search: '[Skip Fuse](https://skip.dev)', replace: 'Skip Fuse' },
];

const owner = 'skiptools';
const branch = 'main';

const allModules = coreFrameworks
  .concat(platformFrameworks)
  .concat(integrationFrameworks)
  .concat(sampleApps);

async function processRepositories() {
  for (const mod of allModules) {
    const isApp = mod.repo.startsWith("skipapp-") ? true : false;
    const modType = isApp ? 'sample app' : 'framework';
    const outputDir = './src/content/docs/docs/' + (isApp ? 'samples' : 'modules');

    const rawBaseUrl = `https://raw.githubusercontent.com/${owner}/${mod.repo}/${branch}`;
    const url = rawBaseUrl + '/README.md';

    console.log(`Fetching ${mod.name} from ${url}`);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${mod.repo}`);

      let content = await response.text();

      // Remove the first top-level heading (# Title)
      // This prevents double titles if Starlight uses the frontmatter title
      content = content.replace(/^#\s+.+$/m, '');

      // Post-processing replacements
      replacements.forEach(({ search, replace }) => {
        content = content.replaceAll(search, replace);
      });

      // fix local image refs
      content = content.replaceAll('src="Android/fastlane', `src="${rawBaseUrl}/Android/fastlane`);
      content = content.replaceAll('src="Darwin/fastlane', `src="${rawBaseUrl}/Darwin/fastlane`);

      // replace external links to module and sample roots with the local doc
      content = content.replace(/\]\(https:\/\/source\.skip\.dev\/(skip-[^\/]+)[\/]?\)/g, "](/docs/modules/$1)");
      content = content.replace(/\]\(https:\/\/source\.skip\.dev\/(skip-[^\/]+)\/#([^\/]+)\)/g, "](/docs/modules/$1/#$2)");

      content = content.replace(/\]\(https:\/\/source\.skip\.dev\/(skipapp-[^\/]+)[\/]?\)/g, "](/docs/samples/$1)");

      // skipapp-showcase-fuse has been consolidated into skipapp-showcase; redirect site paths to the canonical one
      content = content.replaceAll('/docs/samples/skipapp-showcase-fuse', '/docs/samples/skipapp-showcase');

      // trim everything after the repo license
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

:::note[Source Repository <a href='https://github.com/${owner}/${mod.repo}/releases' alt='Releases for ${mod.repo}'><img decoding='async' loading='lazy' alt='Releases for ${mod.repo}' src='https://img.shields.io/github/v/release/${owner}/${mod.repo}.svg?style=flat' /></a>]{icon="github"}
This ${modType} is available at [github.com/${owner}/${mod.repo}](https://github.com/${owner}/${mod.repo}) and can be checked out and improved locally as described in the [Contribution Guide](/docs/contributing/#local-libraries).
:::
`;
      const finalContent = frontmatter + content;

      // Save file
      const folderPath = path.join(outputDir, mod.repo);
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

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

  // Generate the modules index page
  const modulesIndexDir = './src/content/docs/docs/modules';
  if (!fs.existsSync(modulesIndexDir)) fs.mkdirSync(modulesIndexDir, { recursive: true });

  const modTable = (mods) => {
    return `| Module | Version | Source Code |\n| :--- | :--- | ---: |\n` +
      mods.map(m => `| [${m.name}](/docs/modules/${m.repo}/) | <a href='https://github.com/${owner}/${m.repo}/releases'><img alt='Release' src='https://img.shields.io/github/v/release/${owner}/${m.repo}.svg?style=flat' /></a> | <a href='https://github.com/${owner}/${m.repo}/'><img alt='CI' src='https://github.com/${owner}/${m.repo}/actions/workflows/ci.yml/badge.svg' /></a> |`).join('\n');
  }

  const modulesIndexContent = `---
title: Skip Modules
description: Documentation for Skip core, platform, and integration modules.
editUrl: false
---

Skip provides a wide range of modules that bring Swift and SwiftUI APIs to Android, as well as integration frameworks for popular third-party services.

## Core Frameworks

These frameworks provide the foundation for Skip apps, including the Swift standard library, Foundation, and SwiftUI support.

${modTable(coreFrameworks)}

## Platform Frameworks

These frameworks provide access to Android platform features using familiar Swift-like APIs.

${modTable(platformFrameworks)}

## Integration Frameworks

These frameworks provide unified APIs for popular third-party services on both iOS and Android.

${modTable(integrationFrameworks)}

<!-- This list is automatically generated from the [skip-repositories.js](https://github.com/skiptools/skip.dev/blob/main/skip-repositories.js) configuration. -->
`;

  fs.writeFileSync(path.join(modulesIndexDir, 'index.md'), modulesIndexContent);
  console.log(`✅ Generated modules index at ${path.join(modulesIndexDir, 'index.md')}`);

  // Generate the samples index page
  const samplesIndexDir = './src/content/docs/docs/samples';
  if (!fs.existsSync(samplesIndexDir)) fs.mkdirSync(samplesIndexDir, { recursive: true });

  const sampleTable = (apps) => {
    return `| Sample | Version | Source Code |\n| :--- | :--- | ---: |\n` +
      apps.map(a => `| [${a.name}](/docs/samples/${a.repo}/) | <a href='https://github.com/${owner}/${a.repo}/releases'><img alt='Release' src='https://img.shields.io/github/v/release/${owner}/${a.repo}.svg?style=flat' /></a> | <a href='https://github.com/${owner}/${a.repo}/'><img alt='CI' src='https://github.com/${owner}/${a.repo}/actions/workflows/skipapp.yml/badge.svg' /></a> |`).join('\n');
  }

  const samplesIndexContent = `---
title: Skip Sample Apps
description: A catalog of open-source sample apps demonstrating Skip features and patterns.
editUrl: false
---

Skip ships a catalog of open-source sample apps. They illustrate the framework features, demonstrate cross-platform UI patterns, and serve as starting points for your own apps. Each sample builds for both iOS and Android from a single Swift codebase.

${sampleTable(sampleApps)}

<!-- This list is automatically generated from the [skip-repositories.js](https://github.com/skiptools/skip.dev/blob/main/skip-repositories.js) configuration. -->
`;

  fs.writeFileSync(path.join(samplesIndexDir, 'index.md'), samplesIndexContent);
  console.log(`✅ Generated samples index at ${path.join(samplesIndexDir, 'index.md')}`);
}

processRepositories();
