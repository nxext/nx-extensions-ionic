import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'en-US',
  title: 'Nxext',
  description: 'Nxext brings different tools to Nx',
  outDir: '../dist/docs',
  base: '/nx-extensions-ionic/',

  themeConfig: {
    siteTitle: 'Nxext',
    logo: '/logo.svg',
    nav: nav(),

    sidebar: {
      '/guide/': sideNavGuide(),
      '/docs/': sideNavDocs(),
    },

    footer: {
      message:
        'MIT Licensed | Copyright © 2020-present Nxext Developers & Contributors',
      copyright:
        '<a href="https://www.netlify.com"> <img src="https://www.netlify.com/v3/img/components/netlify-color-bg.svg" alt="Deploys by Netlify" /> </a>',
    },
  },
});

function nav() {
  return [
    { text: 'Guide', link: '/guide/' },
    { text: 'Docs', link: '/docs/nxext/overview' },
    {
      text: 'Links',
      items: [
        {
          text: 'Twitter',
          link: 'https://twitter.com/nxext_dev',
        },
        {
          text: 'Nx Discord Chat',
          link: 'https://discord.gg/SWyp4xfGjn',
        },
        {
          text: 'Github',
          link: 'https://github.com/nxext/nx-extensions',
        },
      ],
    },
  ];
}

function sideNavGuide() {
  return [
    {
      text: 'Guide',
      items: [
        {
          text: 'Getting Started',
          link: '/guide/',
        },
        {
          text: 'Articles',
          link: '/guide/articles',
        },
      ],
    },
    {
      text: 'Vite',
      items: [
        {
          text: 'Environment variables',
          link: '/guide/vite/environment-variables',
        },
      ],
    },
  ];
}

function sideNavDocs() {
  return [
    {
      text: 'Nxext',
      collapsible: true,
      items: [
        {
          text: 'Overview',
          link: '/docs/nxext/overview',
        },
        {
          text: 'Community',
          link: '/docs/nxext/community',
        },
        {
          text: 'Contributing',
          link: '/docs/nxext/contributing',
        },
      ],
    },
    {
      text: 'Ionic projects',
      collapsible: true,
      collapsed: true,
      items: [
        {
          text: 'Capacitor',
          items: [
            {
              text: 'Overview',
              link: '/docs/capacitor/overview',
            },
            {
              text: 'Migrating from Nxtend',
              link: '/docs/capacitor/migrating-from-nxtend',
            },
            {
              text: 'Getting started',
              link: '/docs/capacitor/getting-started',
            },
            {
              text: 'Generators',
              link: '/docs/capacitor/generators',
            },
            {
              text: 'Executors',
              link: '/docs/capacitor/executors',
            },
          ],
        },
        {
          text: 'Ionic Angular',
          items: [
            {
              text: 'Overview',
              link: '/docs/ionic-angular/overview',
            },
            {
              text: 'Migrating from Nxtend',
              link: '/docs/ionic-angular/migrating-from-nxtend',
            },
            {
              text: 'Getting started',
              link: '/docs/ionic-angular/getting-started',
            },
            {
              text: 'Capacitor',
              link: '/docs/ionic-angular/capacitor',
            },
            {
              text: 'Generators',
              link: '/docs/ionic-angular/generators',
            },
          ],
        },
        {
          text: 'Ionic React',
          items: [
            {
              text: 'Overview',
              link: '/docs/ionic-react/overview',
            },
            {
              text: 'Migrating from Nxtend',
              link: '/docs/ionic-react/migrating-from-nxtend',
            },
            {
              text: 'Getting started',
              link: '/docs/ionic-react/getting-started',
            },
            {
              text: 'Capacitor',
              link: '/docs/ionic-react/capacitor',
            },
            {
              text: 'Generators',
              link: '/docs/ionic-react/generators',
            },
          ],
        },
      ],
    }
  ];
}
