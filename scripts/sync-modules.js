#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

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

// Atom feed parser/builder.
// `isArray` ensures repeated elements (<entry>, <link>) are always arrays, even
// when a feed happens to contain only one — saves us from branching on shape.
// `processEntities` decodes &lt;/&amp; in <content type="html"> so we get real
// HTML out of the parser, and re-escapes them on serialization.
const atomParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: true,
  processEntities: true,
  isArray: (name) => name === 'entry' || name === 'link',
});

const atomBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  processEntities: true,
  format: true,
  indentBy: '  ',
  suppressEmptyNode: true,
});

// Parse a GitHub releases.atom feed. Returns { entries: [...] }.
// Each entry exposes { raw, updated, title, link, contentHtml }.
//   raw         — a self-contained <entry>…</entry> XML fragment, suitable
//                 for splicing into the merged feed.
//   updated     — ISO-8601 timestamp of the release.
//   title       — release title (typically the version tag, e.g. "1.9.2").
//   link        — URL of the GitHub release page.
//   contentHtml — release notes as inline HTML (entities already decoded).
function parseAtomFeed(xml) {
  const parsed = atomParser.parse(xml);
  const feed = parsed.feed;
  if (!feed || !Array.isArray(feed.entry)) return { entries: [] };

  const entries = feed.entry.map(en => {
    const title = en.title ?? '';
    const updated = en.updated ?? '';
    const links = en.link || [];
    const altLink = links.find(l => l['@_rel'] === 'alternate') || links[0];
    const link = altLink ? altLink['@_href'] : '';
    const content = en.content;
    const contentHtml = typeof content === 'string' ? content : (content?.['#text'] ?? '');
    const raw = atomBuilder.build({ entry: en });
    return { raw, updated, title, link, contentHtml };
  });
  return { entries };
}

// Fetch and parse a repo's releases.atom feed. Returns [] on any failure
// (network error, non-200 response, or malformed XML).
async function fetchReleases(repo) {
  const url = `https://github.com/${owner}/${repo}/releases.atom`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const { entries } = parseAtomFeed(xml);
    return entries.map(e => ({ ...e, repo }));
  } catch (err) {
    console.warn(`⚠️  Could not fetch releases for ${repo}: ${err.message}`);
    return [];
  }
}

// Format the trailing per-page "Releases" section. Newest first; shows up to 12
// recent releases as a compact bulleted list and links to the full release page.
function renderReleasesSection(repo, entries) {
  if (!entries.length) return '';
  const recent = entries.slice(0, 12);
  const items = recent.map(e => {
    const date = (e.updated || '').slice(0, 10);
    return `- [${e.title}](${e.link})${date ? ` — *${date}*` : ''}`;
  }).join('\n');
  return `\n\n## Releases\n\nThe ${recent.length} most recent releases of [${owner}/${repo}](https://github.com/${owner}/${repo}/releases):\n\n${items}\n\nFull history: [github.com/${owner}/${repo}/releases](https://github.com/${owner}/${repo}/releases) — [.atom feed](https://github.com/${owner}/${repo}/releases.atom)\n`;
}

// Collected during processRepositories() and consumed by the omnibus generator.
const omnibusReleases = [];

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

      // Fetch the repo's releases.atom feed, append a Releases section to the
      // page, and (for frameworks) hand the entries off to the omnibus builder.
      const releases = await fetchReleases(mod.repo);
      content += renderReleasesSection(mod.repo, releases);
      if (!isApp) {
        for (const e of releases) omnibusReleases.push(e);
      }

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

  // ──────────────────────────────────────────────────────────────────────
  // Omnibus release notes page + merged Atom feed
  //
  // The page at /releases/ interleaves every framework release with the
  // tooling releases from `skip` and `skipstone` (chronological, newest
  // first). The .atom feed at /releases/index.atom is the same set of
  // entries wrapped in a single <feed> envelope so it can be subscribed to.
  // ──────────────────────────────────────────────────────────────────────

  // Per-framework entries were collected in the loop above; add the
  // tooling repos that are not in skip-repositories.js.
  for (const repo of ['skip', 'skipstone']) {
    const entries = await fetchReleases(repo);
    for (const e of entries) omnibusReleases.push(e);
  }

  // Newest first.
  omnibusReleases.sort((a, b) => (b.updated || '').localeCompare(a.updated || ''));

  // ── Markdown omnibus page ──
  const releasesDir = './src/content/docs/releases';
  if (!fs.existsSync(releasesDir)) fs.mkdirSync(releasesDir, { recursive: true });

  // Framework repos have a generated /docs/modules/<repo>/ page; the tooling
  // repos (skip, skipstone) don't, so their summary links fall back to GitHub.
  const frameworkRepos = new Set(
    coreFrameworks.concat(platformFrameworks).concat(integrationFrameworks).map(m => m.repo)
  );

  const omnibusBody = omnibusReleases.map(e => {
    const date = (e.updated || '').slice(0, 10);
    const repoHref = frameworkRepos.has(e.repo)
      ? `/docs/modules/${e.repo}/`
      : `https://github.com/${owner}/${e.repo}`;
    return `<details>
<summary><strong><a href="${repoHref}">${e.repo}</a></strong> <a href="${e.link}">${e.title}</a> — <em>${date}</em></summary>

${e.contentHtml || '<p><em>No release notes.</em></p>'}

</details>`;
  }).join('\n\n');

  const releasesPageContent = `---
title: Release Notes
description: Merged release notes from all Skip frameworks and tooling.
editUrl: false
tableOfContents: false
---

A unified feed of the latest releases across the Skip frameworks (core, platform, integration) and the tooling repos ([skip](https://github.com/${owner}/skip), [skipstone](https://github.com/${owner}/skipstone)).

<p class="not-content">Subscribe to the merged <a href="/releases/index.atom"><img alt="Atom feed" src="https://img.shields.io/badge/Atom-Skip_Releases-FF6600?logo=rss&logoColor=white" style="vertical-align: middle;" /></a> to track all releases in an RSS feed reader.</p>

${omnibusBody}

<!-- This page is automatically generated by scripts/sync-modules.js -->
`;

  fs.writeFileSync(path.join(releasesDir, 'index.md'), releasesPageContent);
  console.log(`✅ Generated omnibus release notes at ${path.join(releasesDir, 'index.md')} (${omnibusReleases.length} entries)`);

  // ── Merged Atom feed ──
  // The feed is the raw interleaved entries wrapped in a single <feed> envelope.
  // Each entry's original <id>/<link> identifies its source repo unambiguously.
  const feedUpdated = omnibusReleases[0]?.updated || new Date().toISOString();
  const mergedAtomContent = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xml:lang="en-US">
  <id>tag:skip.dev,2024:releases/merged</id>
  <link type="text/html" rel="alternate" href="https://skip.dev/releases/"/>
  <link type="application/atom+xml" rel="self" href="https://skip.dev/releases/index.atom"/>
  <title>Skip — Merged Release Notes</title>
  <subtitle>Releases interleaved across all Skip framework and tooling repositories.</subtitle>
  <updated>${feedUpdated}</updated>
  ${omnibusReleases.map(e => '  ' + e.raw.replace(/\n/g, '\n  ')).join('\n')}
</feed>
`;

  const publicReleasesDir = './public/releases';
  if (!fs.existsSync(publicReleasesDir)) fs.mkdirSync(publicReleasesDir, { recursive: true });
  fs.writeFileSync(path.join(publicReleasesDir, 'index.atom'), mergedAtomContent);
  console.log(`✅ Generated merged atom feed at ${path.join(publicReleasesDir, 'index.atom')} (${omnibusReleases.length} entries)`);
}

processRepositories();
