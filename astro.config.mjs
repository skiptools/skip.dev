// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator'
import starlightBlog from 'starlight-blog'
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import { remarkHeadingId } from "remark-custom-heading-id";
// shared definitions of the modules and samples
import { coreFrameworks, integrationFrameworks, sampleApps } from './skip-repositories.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://skip.dev',
  //trailingSlash: 'always', // aspirational
  markdown: {
    remarkPlugins: [remarkHeadingId],
    rehypePlugins: [[rehypeExternalLinks, {
			target: "_blank",
			content: {
				type: "text",
				value: " ↗"
			}
		}]
    ],
  },
	integrations: [
		starlight({
			title: 'Skip',
      favicon: '/favicon.svg',
      logo: {
        src: './src/assets/skipicon.svg',
      },
      defaultLocale: 'root',
      locales: {
        'root': {
          label: 'English',
          lang: 'en',
        },
        'fr': {
          lang: 'fr',
          label: 'Français',
        },
        'es': {
          label: 'Español',
          lang: 'es',
        },
        'de': {
          label: 'Deutsch',
          lang: 'de',
        },
        'pt': {
          label: 'Português',
          lang: 'pt-BR',
        },
        'ja': {
          label: '日本語',
          lang: 'ja',
        },
        'ko': {
          label: '한국어',
          lang: 'ko',
        },
        'zh': {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      components: {
        // Override the default Header component
        Header: './src/components/CustomHeader.astro',
      },
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
        }),
        starlightBlog({
          prefix: 'blog',
          navigation: 'header-start',
          recentPostCount: 200,
          metrics: {
            readingTime: true,
            words: 'total',
          },
        }),

      ],
      // not needed now that we generate correct editUrl for modules and samples
      //routeMiddleware: './src/routeData.ts',
      customCss: [
        // Relative path to your custom CSS file
        './src/styles/custom.css',
      ],
			social: [
        { icon: 'discourse', label: 'Forums', href: 'https://forums.skip.dev' },
        { icon: 'slack', label: 'Slack', href: '/slack/' },
        { icon: 'mastodon', label: 'Mastodon', href: 'https://mas.to/@skiptools' },
        { icon: 'github', label: 'GitHub', href: 'https://github.com/orgs/skiptools' },
      ],
      editLink: {
        baseUrl: 'https://github.com/skiptools/skipdev/edit/main/'
      },
      sidebar: [
        {
          label: 'Documentation',
          items: [
            'docs', // index
            'docs/gettingstarted',
            'docs/help',
            //'docs/status',
            'docs/modes',
            'docs/app-development',
            'docs/development-topics',
            'docs/platformcustomization',
            'docs/debugging',
            'docs/testing',
            'docs/dependencies',
            'docs/deployment',
            'docs/project-types',
            'docs/bridging',
            'docs/swiftsupport',
            'docs/gradle',
            'docs/porting',
            'docs/contributing',
            'docs/skip-cli',
            'docs/c-development',
            'docs/update-guide',
            'docs/faq',
            'docs/glossary',
          ],
        },
        {
          label: 'Core Frameworks',
          collapsed: true,
          items: coreFrameworks.map(item => `docs/modules/${item.repo}`),
        },
        {
          label: 'Integration Frameworks',
          collapsed: true,
          items: integrationFrameworks.map(item => `docs/modules/${item.repo}`),
        },
        {
          label: 'Example Apps',
          collapsed: true,
          items: sampleApps.map(item => `docs/samples/${item.repo}`),
        },
        {
          label: 'Component Gallery',
          collapsed: true,
          autogenerate: { directory: 'docs/components' },
          // Alternatively, manual mapping if autogenerate isn't desired:
          /*
          items: [
            'components/accessibility',
            'components/alert',
            // ... (remaining 60+ components)
          ]
          */
        },
      ],
		}),
	],
});
