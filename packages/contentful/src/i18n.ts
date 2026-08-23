/**
 * Maps between URL language segments and Contentful locale codes.
 *
 * The URL says `/meridian/ur/articles`; Contentful wants `locale=ur`. Keeping
 * the two vocabularies separate means a locale code like `en-US` never has to
 * appear in a URL, and a URL segment can be renamed without touching content.
 */

export const LANGS = ['en', 'ur'] as const;
export type Lang = (typeof LANGS)[number];

const LOCALE_BY_LANG: Record<Lang, string> = {
  en: 'en-US',
  ur: 'ur',
};

export const isLang = (value: string): value is Lang => (LANGS as readonly string[]).includes(value);

export const localeOf = (lang: Lang) => LOCALE_BY_LANG[lang];

/**
 * Contentful's preview URLs interpolate a locale code such as `en-US`, so the
 * preview route has to map back the other way.
 */
export function langOfLocale(locale: string | null | undefined): Lang {
  if (!locale) return 'en';
  const entry = (Object.entries(LOCALE_BY_LANG) as [Lang, string][]).find(
    ([, code]) => code.toLowerCase() === locale.toLowerCase(),
  );
  return entry?.[0] ?? (locale.toLowerCase().startsWith('ur') ? 'ur' : 'en');
}

/** Urdu is written right to left; this drives `dir` on the html element. */
export const dirOf = (lang: Lang): 'ltr' | 'rtl' => (lang === 'ur' ? 'rtl' : 'ltr');

export const htmlLangOf = (lang: Lang) => (lang === 'ur' ? 'ur' : 'en');

type Dictionary = {
  articles: string;
  readArticle: string;
  by: string;
  backToArticles: string;
  otherLanguage: string;
  otherSites: string;
  notFound: string;
  notFoundBody: string;
  previewBanner: string;
  exitPreview: string;
  publishedOn: string;
};

const DICTIONARIES: Record<Lang, Dictionary> = {
  en: {
    articles: 'Articles',
    readArticle: 'Read article',
    by: 'By',
    backToArticles: 'Back to articles',
    otherLanguage: 'اردو',
    otherSites: 'Other sites',
    notFound: 'Not found',
    notFoundBody: 'No article matches this address on this site.',
    previewBanner: 'Preview mode — you are seeing unpublished content.',
    exitPreview: 'Exit preview',
    publishedOn: 'Published',
  },
  ur: {
    articles: 'مضامین',
    readArticle: 'مضمون پڑھیں',
    by: 'از',
    backToArticles: 'مضامین کی طرف واپس',
    otherLanguage: 'English',
    otherSites: 'دیگر سائٹس',
    notFound: 'نہیں ملا',
    notFoundBody: 'اس سائٹ پر اس پتے سے کوئی مضمون مطابقت نہیں رکھتا۔',
    previewBanner: 'پیش منظر — آپ غیر شائع شدہ مواد دیکھ رہے ہیں۔',
    exitPreview: 'پیش منظر بند کریں',
    publishedOn: 'شائع شدہ',
  },
};

export const dict = (lang: Lang) => DICTIONARIES[lang];

/** The other language, for the switcher. Trivial with two; a list if more are added. */
export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'ur' : 'en');

export function formatDate(iso: string, lang: Lang) {
  // ur-PK rather than ur so the Gregorian calendar and Urdu month names line up.
  const locale = lang === 'ur' ? 'ur-PK' : 'en-GB';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}
