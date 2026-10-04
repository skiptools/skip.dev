---
title: Skip Agent Skill
permalink: /docs/skip-agent-skill/
---

A [Cursor Agent Skill](https://github.com/asserusama/skip-tool-skill) is available to help with Skip development inside AI-powered editors (e.g. Cursor, Claude Code). The skill uses only local reference files—no web or external URLs—and is designed so the agent loads only the material needed for each request.

## What the skill provides

The skill guides the full range of common Skip workflows:

- **Getting started** — New vs existing project, checking that Skip is installed (`skip version`, `brew install skiptools/skip/skip`), running `skip checkup` to validate the environment, and prerequisites (Xcode, Android Studio, macOS 15+).
- **Mode selection** — Establishing whether you are using [Skip Fuse](/docs/modes/#fuse) or [Skip Lite](/docs/modes/#lite), including inferring from `Skip/skip.yml` when present, so advice matches your setup.
- **Project creation and CLI** — Commands such as `skip create`, `skip init`, `skip verify`, `skip export`, `skip devices`, `skip android`, and when to use them.
- **Writing dual-platform code** — Compiler directives (`#if os(Android)`, `#if !os(Android)`, `#if SKIP`), and when to use [SkipUI](/docs/modules/skip-ui/) and which SwiftUI/Compose behavior is supported.
- **Building and running** — Build/run flows, `SKIP_ACTION`, emulators and devices, and framework considerations.
- **Troubleshooting** — Interpreting `skip checkup`, cleaning builds, common errors, and where to get help.
- **Porting and dependencies** — Porting packages to Skip, conditional imports, and the [Swift Package Index](https://swiftpackageindex.com) for Android-compatible packages.
- **Modules and components** — Overview of Skip modules (e.g. SkipUI, SkipFoundation, integration frameworks) and per-component reference (buttons, lists, stacks, etc.) so the agent can answer API and usage questions.

All of this content lives inside the skill as small, topic-specific reference files. The agent is instructed not to rely on the web; it uses only these local references.

## How the skill only loads what it needs

The skill is structured so the agent reads only the reference file(s) relevant to the current question:

- **Single entry point** — The skill’s main file describes the workflow and a short decision tree (e.g. “getting started” → one file, “build/run issues” → building + troubleshooting, “question about a component” → components index or a specific component file). The agent uses that tree to choose which references to open.
- **Small, focused references** — Instead of one large document, the content is split into many small files (e.g. `getting-started.md`, `cli.md`, `modes.md`, `directives.md`, `building.md`, `troubleshooting.md`, `porting.md`, `skip-ui.md`, `skip-foundation.md`, `components-index.md`, `component-button.md`, `component-list.md`). So a narrow question (e.g. “how do I use the list component?”) leads to loading only the list component reference, not the whole skill.
- **No web dependency** — Everything the agent needs is in the skill directory. It does not need to fetch skip.dev or other sites to answer; it only reads the listed reference(s) for the request.

That way, context stays minimal and answers stay accurate without pulling in unrelated docs.

## Install and use

Install the skill with any of these options:

- **[skills.sh](https://skills.sh)** (recommended): `npx skills add https://github.com/asserusama/skip-tool-skill --skill skip-tool`
- **Claude Code plugin:** Add marketplace `asserusama/skip-tool-skill`, then `plugin install skip-tool@skip-tool-skill`
- **Cursor (git clone):** `git clone https://github.com/asserusama/skip-tool-skill.git ~/.cursor/skills/skip-tool`

Then use it in your AI agent by asking Skip-related questions (e.g. “Use the Skip tool skill and help me set up a new project” or “Use the Skip tool skill and fix this build error”). See the [skip-tool-skill repository](https://github.com/asserusama/skip-tool-skill) for more detail and usage examples.
