# Skip documentation home page

This is the source for the [skip.dev](https://skip.dev) home page
for the Skip information, blog, and documentation. It is
implemented with Astro and Starlight.


## Contribution Guide

We appreciate contributions to the documentation in the form
of [PRs](https://github.com/skiptools/skip.dev/pulls). The
simplest way to make a contribution for a particular
page you see on the site is to scroll to the bottom of the
page and click the "Edit this page" link, which will
automatically bring you into this repository's editor
for that page. Larger edits that span multiple pages
might instead warrant forking this repository and
checking it out locally to make changes.

Some notes about contribution:

- Please do not add images to this repository, as they bloat the size and slow down the page build time. Image and video assets should be instead added to [https://github.com/skiptools/assets.skip.tools/](https://github.com/skiptools/assets.skip.tools/), which can be referenced with a redirect link to `https://assets.skip.dev`. For example, [https://assets.skip.tools/intro/skip_xcode.png](https://assets.skip.tools/intro/skip_xcode.png) redirects to [https://raw.githubusercontent.com/skiptools/assets.skip.tools/main/intro/skip_xcode.png](https://raw.githubusercontent.com/skiptools/assets.skip.tools/main/intro/skip_xcode.png).
- The individual modules ([https://skip.dev/docs/modules/](https://skip.dev/docs/modules/)) and sample app ([https://skip.dev/docs/samples](https://skip.dev/docs/samples)) documentation is derived from the individual README.md in the corresponding Skip repository. The "Edit this page" link should take you to the appropriate repository. For example, [https://skip.dev/docs/modules/skip-web/](https://skip.dev/docs/modules/skip-web/) is automatically derived from the [https://github.com/skiptools/skip-web/blob/main/README.md](https://github.com/skiptools/skip-web/blob/main/README.md) file.


## Project Structure

Inside this Astro + Starlight project, you'll see the following folders and files:

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   └── docs/
│   └── content.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Starlight documentation

Check out [Starlight’s docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build).

## License

Skip © 2026 by <a href="https://skip.dev">the Skip project</a> is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>


