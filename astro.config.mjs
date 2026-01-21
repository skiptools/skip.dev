// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator'
import starlightBlog from 'starlight-blog'
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import { remarkHeadingId } from "remark-custom-heading-id";

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
      /*
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
      */
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
      routeMiddleware: './src/routeData.ts',
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
          items: [
            'docs/modules/skip-unit',
            'docs/modules/skip-lib',
            'docs/modules/skip-foundation',
            'docs/modules/skip-model',
            'docs/modules/skip-ui',
            'docs/modules/skip-fuse',
            'docs/modules/skip-fuse-ui',
            'docs/modules/skip-bridge',
          ],
        },
        {
          label: 'Integration Frameworks',
          collapsed: true,
          items: [
            'docs/modules',
            'docs/modules/skip-authentication-services',
            'docs/modules/skip-auth0',
            'docs/modules/skip-av',
            'docs/modules/skip-bluetooth',
            'docs/modules/skip-kit',
            'docs/modules/skip-device',
            'docs/modules/skip-ffi',
            'docs/modules/skip-firebase',
            'docs/modules/skip-script',
            'docs/modules/skip-keychain',
            'docs/modules/skip-marketplace',
            'docs/modules/skip-motion',
            'docs/modules/skip-nfc',
            'docs/modules/skip-posthog',
            'docs/modules/skip-qrcode',
            'docs/modules/skip-revenue',
            'docs/modules/skip-sentry',
            'docs/modules/skip-socketio',
            'docs/modules/skip-sql',
            'docs/modules/skip-supabase',
            'docs/modules/skip-web',
            'docs/modules/skip-xml',
            'docs/modules/skip-zip',
          ],
        },
        {
          label: 'Example Apps',
          collapsed: true,
          items: [
            { label: 'Showcase (Fuse)', link: 'docs/samples/skipapp-showcase-fuse' },
            { label: 'Showcase (Lite)', link: 'docs/samples/skipapp-showcase' },
            { label: 'Hello Skip (Lite)', link: 'docs/samples/skipapp-hello' },
            { label: 'Howdy Skip (Fuse)', link: 'docs/samples/skipapp-howdy' },
            { label: 'Hiya Skip (Mixed)', link: 'docs/samples/skipapp-hiya' },
            { label: 'Travel Bookings (Fuse)', link: 'docs/samples/skipapp-bookings-fuse' },
            { label: 'Travel Bookings (Lite)', link: 'docs/samples/skipapp-bookings' },
            { label: 'Travel Posters (Split)', link: 'docs/samples/skipapp-travelposters-native' },
            { label: 'Fireside (Fuse)', link: 'docs/samples/skipapp-fireside-fuse' },
            { label: 'Fireside (Lite)', link: 'docs/samples/skipapp-fireside' },
            { label: 'Notes (Lite)', link: 'docs/samples/skipapp-notes' },
            { label: 'Data Bake (Lite)', link: 'docs/samples/skipapp-databake' },
            { label: 'Weather (Lite)', link: 'docs/samples/skipapp-weather' },
            { label: 'Lottie (Lite)', link: 'docs/samples/skipapp-lottiedemo' },
            { label: 'Scrumskipper (Lite)', link: 'docs/samples/skipapp-scrumskipper' },
          ],
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
