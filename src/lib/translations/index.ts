import i18n from 'sveltekit-i18n'

/** @type {import('sveltekit-i18n').Config} */
const config = {
  loaders: [
    {
      locale: 'en',
      key: 'modals',
      loader: async () => (await import('./en/modals.json')).default
    },
    {
      locale: 'en',
      key: 'modes',
      loader: async () => (await import('./en/modes.json')).default
    },
    {
      locale: 'en',
      key: 'controls',
      loader: async () => (await import('./en/controls.json')).default
    },
    {
      locale: 'ja',
      key: 'modals',
      loader: async () => (await import('./ja/modals.json')).default
    },
    {
      locale: 'ja',
      key: 'modes',
      loader: async () => (await import('./ja/modes.json')).default
    },
    {
      locale: 'ja',
      key: 'controls',
      loader: async () => (await import('./ja/controls.json')).default
    },
    {
      locale: 'zh',
      key: 'modals',
      loader: async () => (await import('./zh/modals.json')).default
    },
    {
      locale: 'zh',
      key: 'modes',
      loader: async () => (await import('./zh/modes.json')).default
    },
    {
      locale: 'zh',
      key: 'controls',
      loader: async () => (await import('./zh/controls.json')).default
    }
  ],
  fallbackLocale: 'en'
}

export const { t, locale, locales, loading, loadTranslations } = new i18n(config)

loading.subscribe(($loading) => $loading && console.log('Loading translations...'))
