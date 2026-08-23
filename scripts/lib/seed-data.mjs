import { i18n } from './i18n.mjs';
import { doc, embed, h2, h3, hr, link, ol, p, quote, text, ul } from './rich-text.mjs';

/**
 * Every record carries an explicit id so the seed is re-runnable: a second run
 * updates the same entries instead of creating duplicates.
 *
 * Fields wrapped in `i18n({...})` differ per locale. Everything else is written
 * once and stored against the default locale.
 *
 * ⚠ The Urdu throughout this file was written by Claude, not by a native
 * speaker. It is structurally faithful to the English and reads plausibly, but
 * it has NOT been reviewed and should not go in front of the client until it
 * has been.
 */

export const assets = [
  { id: 'hero-modeling', title: 'Blueprint on a desk', description: 'Architectural drawings and a pencil on a wooden desk.', source: 'https://picsum.photos/id/1015/1600/900.jpg' },
  { id: 'hero-rich-text', title: 'Open book, close up', description: 'An open book photographed from above.', source: 'https://picsum.photos/id/1025/1600/900.jpg' },
  { id: 'hero-lcp', title: 'Long exposure of a road at night', description: 'Car light trails streaking along a highway.', source: 'https://picsum.photos/id/1043/1600/900.jpg' },
  { id: 'hero-types', title: 'Terminal on a laptop screen', description: 'A laptop displaying a code editor.', source: 'https://picsum.photos/id/1050/1600/900.jpg' },
  { id: 'hero-alt-text', title: 'Hands reading braille', description: 'Close-up of hands resting on a page.', source: 'https://picsum.photos/id/1062/1600/900.jpg' },
  { id: 'hero-preview', title: 'Fog over a mountain ridge', description: 'A ridge line half-hidden by low cloud.', source: 'https://picsum.photos/id/1074/1600/900.jpg' },
  { id: 'inline-reference-graph', title: 'Tangled cables', description: 'A bundle of network cables, loosely coiled.', source: 'https://picsum.photos/id/180/1200/675.jpg' },
  { id: 'avatar-ada', title: 'Ada Okafor', description: 'Portrait of Ada Okafor.', source: 'https://picsum.photos/id/1027/500/500.jpg' },
  { id: 'avatar-ravi', title: 'Ravi Menon', description: 'Portrait of Ravi Menon.', source: 'https://picsum.photos/id/1005/500/500.jpg' },
  { id: 'avatar-lena', title: 'Lena Fischer', description: 'Portrait of Lena Fischer.', source: 'https://picsum.photos/id/1011/500/500.jpg' },
];

/**
 * The two sites. `key` becomes the first URL segment, so /meridian/en/articles
 * and /fieldnotes/ur/articles are the same app reading the same space.
 */
export const sites = [
  {
    id: 'site-meridian',
    key: 'meridian',
    name: i18n({ 'en-US': 'Meridian Engineering', ur: 'میریڈیئن انجینئرنگ' }),
    tagline: i18n({
      'en-US': 'How we build things, and what it cost us to learn.',
      ur: 'ہم چیزیں کیسے بناتے ہیں، اور یہ سیکھنے میں ہمیں کیا قیمت چکانی پڑی۔',
    }),
    locales: ['en-US', 'ur'],
    defaultLocale: 'en-US',
  },
  {
    id: 'site-fieldnotes',
    key: 'fieldnotes',
    name: i18n({ 'en-US': 'Fieldnotes', ur: 'فیلڈ نوٹس' }),
    tagline: i18n({
      'en-US': 'Short notes on the craft, written while it is still fresh.',
      ur: 'فن پر مختصر نوٹس، جو تجربہ تازہ ہوتے ہی لکھے گئے۔',
    }),
    locales: ['en-US', 'ur'],
    defaultLocale: 'en-US',
  },
];

export const categories = [
  {
    id: 'cat-content-modeling',
    slug: 'content-modeling',
    title: i18n({ 'en-US': 'Content Modeling', ur: 'مواد کی ساخت' }),
    description: i18n({
      'en-US': 'Designing content types that editors can actually use and developers can actually query.',
      ur: 'ایسے مواد کے اقسام بنانا جنہیں مدیر واقعی استعمال کر سکیں اور ڈویلپر واقعی تلاش کر سکیں۔',
    }),
  },
  {
    id: 'cat-web-performance',
    slug: 'web-performance',
    title: i18n({ 'en-US': 'Web Performance', ur: 'ویب کارکردگی' }),
    description: i18n({
      'en-US': 'Making pages arrive fast, and stay fast after the first paint.',
      ur: 'صفحات کو تیزی سے پہنچانا، اور پہلی نمائش کے بعد بھی تیز رکھنا۔',
    }),
  },
  {
    id: 'cat-typescript',
    slug: 'typescript',
    title: i18n({ 'en-US': 'TypeScript', ur: 'ٹائپ اسکرپٹ' }),
    description: i18n({
      'en-US': 'Types that describe what the API actually returns, not what you hoped it would.',
      ur: 'ایسی ٹائپس جو بتائیں کہ اے پی آئی حقیقت میں کیا لوٹاتا ہے، وہ نہیں جس کی آپ نے امید کی تھی۔',
    }),
  },
  {
    id: 'cat-accessibility',
    slug: 'accessibility',
    title: i18n({ 'en-US': 'Accessibility', ur: 'قابلِ رسائی' }),
    description: i18n({
      'en-US': 'Building for people who do not browse the way you do.',
      ur: 'ان لوگوں کے لیے بنانا جو آپ کی طرح براؤز نہیں کرتے۔',
    }),
  },
];

export const authors = [
  {
    id: 'author-ada',
    name: 'Ada Okafor',
    slug: 'ada-okafor',
    avatar: 'avatar-ada',
    bio: i18n({
      'en-US': doc(
        p(
          'Ada builds content platforms and has strong opinions about ',
          text('reference depth', ['italic']),
          '. Previously an editor, which is why she keeps asking who has to type this in.',
        ),
        p(link('https://example.com/ada', 'Personal site')),
      ),
      ur: doc(
        p(
          'ایڈا مواد کے پلیٹ فارم بناتی ہیں اور ',
          text('حوالہ جاتی گہرائی', ['italic']),
          ' کے بارے میں سخت رائے رکھتی ہیں۔ پہلے مدیر رہ چکی ہیں، اسی لیے وہ بار بار پوچھتی ہیں کہ یہ سب ٹائپ کس کو کرنا پڑے گا۔',
        ),
        p(link('https://example.com/ada', 'ذاتی ویب سائٹ')),
      ),
    }),
  },
  {
    id: 'author-ravi',
    name: 'Ravi Menon',
    slug: 'ravi-menon',
    avatar: 'avatar-ravi',
    bio: i18n({
      'en-US': doc(
        p('Ravi works on rendering performance. He is mostly interested in the gap between a good Lighthouse score and a page that feels fast.'),
        ul('Core Web Vitals', 'Edge rendering', 'Image pipelines'),
      ),
      ur: doc(
        p('روی رینڈرنگ کی کارکردگی پر کام کرتے ہیں۔ انہیں سب سے زیادہ دلچسپی اس فرق میں ہے جو اچھے لائٹ ہاؤس اسکور اور واقعی تیز محسوس ہونے والے صفحے کے درمیان ہوتا ہے۔'),
        ul('کور ویب وائٹلز', 'ایج رینڈرنگ', 'تصویری پائپ لائن'),
      ),
    }),
  },
  {
    id: 'author-lena',
    name: 'Lena Fischer',
    slug: 'lena-fischer',
    avatar: 'avatar-lena',
    bio: i18n({
      'en-US': doc(
        p(
          'Lena is an accessibility engineer. She audits design systems and writes about the parts of ',
          text('WCAG', ['code']),
          ' that teams reliably skip.',
        ),
      ),
      ur: doc(
        p(
          'لینا قابلِ رسائی کی انجینئر ہیں۔ وہ ڈیزائن سسٹمز کا جائزہ لیتی ہیں اور ',
          text('WCAG', ['code']),
          ' کے ان حصوں پر لکھتی ہیں جنہیں ٹیمیں تواتر سے نظرانداز کر دیتی ہیں۔',
        ),
      ),
    }),
  },
];

/**
 * Never published by the seed. Its whole job is to be invisible to the Delivery
 * API and visible through /api/preview, so draft mode can be demonstrated
 * rather than asserted.
 */
export const drafts = [
  {
    id: 'post-draft-demo',
    site: 'site-meridian',
    slug: 'an-unpublished-draft',
    author: 'author-ada',
    categories: ['cat-content-modeling'],
    publishedDate: '2026-08-19',
    heroImage: 'hero-modeling',
    title: i18n({ 'en-US': 'An Unpublished Draft', ur: 'ایک غیر شائع شدہ مسودہ' }),
    excerpt: i18n({
      'en-US': 'This entry has never been published. It should be reachable only through preview mode.',
      ur: 'یہ انٹری کبھی شائع نہیں ہوئی۔ یہ صرف پیش منظر کے ذریعے قابلِ رسائی ہونی چاہیے۔',
    }),
    body: i18n({
      'en-US': doc(
        p('If you can read this on the public site, preview is leaking drafts and something is wrong.'),
        p('Reached properly, this page carries a preview banner and a no-store cache header.'),
      ),
      ur: doc(
        p('اگر آپ یہ عوامی سائٹ پر پڑھ سکتے ہیں تو پیش منظر مسودے افشا کر رہا ہے اور کچھ خراب ہے۔'),
        p('درست طریقے سے پہنچنے پر اس صفحے پر پیش منظر کی پٹی اور no-store کیش ہیڈر ہوتا ہے۔'),
      ),
    }),
  },
];

export const articles = [
  {
    id: 'post-model-first',
    site: 'site-meridian',
    slug: 'model-the-content-first',
    author: 'author-ada',
    categories: ['cat-content-modeling'],
    publishedDate: '2026-02-11',
    heroImage: 'hero-modeling',
    title: i18n({
      'en-US': 'Model the Content First, Then Write the Components',
      ur: 'پہلے مواد کا خاکہ بنائیں، پھر کمپوننٹس لکھیں',
    }),
    excerpt: i18n({
      'en-US': 'The instinct is to build the page and back-fill a content type to feed it. That gets you a CMS shaped like one design, which survives exactly until the next design.',
      ur: 'فطری رجحان یہ ہے کہ پہلے صفحہ بنایا جائے اور پھر اسے بھرنے کے لیے مواد کی قسم گھڑ لی جائے۔ اس سے ایسا سی ایم ایس بنتا ہے جو ایک ہی ڈیزائن کے سانچے میں ڈھلا ہو، اور وہ بس اگلے ڈیزائن تک چلتا ہے۔',
    }),
    seo: {
      ogImage: 'hero-modeling',
      metaTitle: i18n({
        'en-US': 'Model the Content First, Then Write the Components',
        ur: 'پہلے مواد کا خاکہ بنائیں، پھر کمپوننٹس لکھیں',
      }),
      metaDescription: i18n({
        'en-US': 'Why content types should describe the content, not the layout that happens to render it today.',
        ur: 'مواد کی اقسام کو مواد بیان کرنا چاہیے، نہ کہ وہ ترتیب جو آج اسے دکھا رہی ہے۔',
      }),
    },
    body: i18n({
      'en-US': doc(
        p('The instinct, coming from a component-first background, is to build the page and then back-fill a content type that feeds it. You end up with fields called ', text('leftColumnHeading', ['code']), ' and ', text('showBlueVariant', ['code']), '. That is a CMS shaped like one specific design, and it survives exactly until the next design.'),
        h2('Fields describe content, not layout'),
        p('A useful test: read a field name out loud to someone who has never seen the site. If they cannot tell you what goes in it, the name describes a rendering decision rather than a piece of content.'),
        ul(
          ['Good: ', text('publishedDate', ['code']), ', ', text('excerpt', ['code']), ', ', text('author', ['code'])],
          ['Bad: ', text('sidebarText', ['code']), ', ', text('heroVariant', ['code']), ', ', text('mobileTitle', ['code'])],
        ),
        quote('If the field only makes sense while looking at the mockup, it belongs in the component, not the content type.'),
        h2('References are the interesting part'),
        p('Flattening an author into ', text('authorName', ['code']), ' and ', text('authorBio', ['code']), ' works right up to the second post. A reference to an ', text('author', ['code']), ' entry means one edit updates every post, and the author becomes something you can route to.'),
        embed('inline-reference-graph'),
        p('The cost is query depth. Every level of reference is another level the Delivery API has to resolve, and it will only follow links so far in a single request. Model deliberately and you rarely reach the ceiling.'),
        hr(),
        h3('A rule that has held up'),
        ol(
          'Write the content type as if there were no website.',
          'Add references where the same thing appears in two places.',
          'Only then decide how it renders.',
        ),
        p('This is slower on day one and considerably faster on day ninety.'),
      ),
      ur: doc(
        p('کمپوننٹ سے شروع کرنے والے پس منظر سے آنے پر فطری رجحان یہ ہوتا ہے کہ پہلے صفحہ بنایا جائے اور پھر اسے بھرنے کے لیے مواد کی قسم گھڑ لی جائے۔ نتیجتاً آپ کے پاس ', text('leftColumnHeading', ['code']), ' اور ', text('showBlueVariant', ['code']), ' جیسے فیلڈز رہ جاتے ہیں۔ یہ ایک مخصوص ڈیزائن کے سانچے میں ڈھلا ہوا سی ایم ایس ہے، جو بس اگلے ڈیزائن تک چلتا ہے۔'),
        h2('فیلڈز مواد بیان کرتے ہیں، ترتیب نہیں'),
        p('ایک کارآمد آزمائش: کسی ایسے شخص کے سامنے فیلڈ کا نام پڑھیں جس نے ویب سائٹ کبھی نہ دیکھی ہو۔ اگر وہ نہ بتا سکے کہ اس میں کیا آئے گا، تو وہ نام مواد نہیں بلکہ نمائش کا فیصلہ بیان کر رہا ہے۔'),
        ul(
          ['بہتر: ', text('publishedDate', ['code']), '، ', text('excerpt', ['code']), '، ', text('author', ['code'])],
          ['ناقص: ', text('sidebarText', ['code']), '، ', text('heroVariant', ['code']), '، ', text('mobileTitle', ['code'])],
        ),
        quote('اگر فیلڈ صرف ڈیزائن کے نمونے کو دیکھتے ہوئے سمجھ آتا ہے، تو اس کی جگہ کمپوننٹ میں ہے، مواد کی قسم میں نہیں۔'),
        h2('اصل دلچسپ چیز حوالے ہیں'),
        p('مصنف کو ', text('authorName', ['code']), ' اور ', text('authorBio', ['code']), ' میں سمیٹنا دوسری تحریر تک ہی کام دیتا ہے۔ ', text('author', ['code']), ' انٹری کا حوالہ دینے کا مطلب ہے کہ ایک ترمیم ہر تحریر کو بدل دیتی ہے، اور مصنف خود ایک ایسی چیز بن جاتا ہے جس کا اپنا صفحہ ہو سکتا ہے۔'),
        embed('inline-reference-graph'),
        p('اس کی قیمت استفسار کی گہرائی ہے۔ حوالے کی ہر سطح ڈیلیوری اے پی آئی کے لیے ایک اضافی سطح ہے، اور وہ ایک درخواست میں ایک حد تک ہی حوالوں کا تعاقب کرتا ہے۔ سوچ سمجھ کر خاکہ بنائیں تو یہ حد کم ہی آتی ہے۔'),
        hr(),
        h3('ایک اصول جو ہمیشہ کام آیا'),
        ol(
          'مواد کی قسم یوں لکھیں جیسے کوئی ویب سائٹ موجود ہی نہ ہو۔',
          'جہاں ایک ہی چیز دو جگہ آتی ہو، وہاں حوالہ شامل کریں۔',
          'اس کے بعد ہی طے کریں کہ یہ دکھے گا کیسے۔',
        ),
        p('پہلے دن یہ سست لگتا ہے اور نوے ویں دن کہیں زیادہ تیز ثابت ہوتا ہے۔'),
      ),
    }),
  },
  {
    id: 'post-rich-text-tree',
    site: 'site-meridian',
    slug: 'rich-text-is-a-document-tree',
    author: 'author-ada',
    categories: ['cat-content-modeling', 'cat-typescript'],
    publishedDate: '2026-03-04',
    heroImage: 'hero-rich-text',
    title: i18n({
      'en-US': 'Rich Text Is a Document Tree, Not HTML',
      ur: 'رِچ ٹیکسٹ ایک دستاویزی شجرہ ہے، ایچ ٹی ایم ایل نہیں',
    }),
    excerpt: i18n({
      'en-US': 'Contentful stores rich text as structured JSON. That feels like an obstacle until the first time you need the same content somewhere that is not a browser.',
      ur: 'کنٹینٹفل رِچ ٹیکسٹ کو ساختی جے سون کے طور پر محفوظ کرتا ہے۔ یہ رکاوٹ لگتی ہے، اُس دن تک جب پہلی بار وہی مواد کسی ایسی جگہ درکار ہو جو براؤزر نہیں۔',
    }),
    seo: {
      ogImage: 'hero-rich-text',
      metaTitle: i18n({
        'en-US': 'Rich Text Is a Document Tree, Not HTML',
        ur: 'رِچ ٹیکسٹ ایک دستاویزی شجرہ ہے، ایچ ٹی ایم ایل نہیں',
      }),
      metaDescription: i18n({
        'en-US': 'Why Contentful stores rich text as JSON, and what that buys you over a blob of markup.',
        ur: 'کنٹینٹفل رِچ ٹیکسٹ کو جے سون میں کیوں رکھتا ہے، اور مارک اپ کے ڈھیر کے مقابلے میں اس کا فائدہ کیا ہے۔',
      }),
    },
    body: i18n({
      'en-US': doc(
        p('Most CMSs hand you a string of HTML. Contentful hands you a tree of typed nodes, and the difference matters more than it first appears.'),
        h2('Why not just store HTML?'),
        p('Because HTML is a rendering target, and the moment you have two of them the blob stops working. A stored ', text('<img>', ['code']), ' tag is a dead end; an ', text('embedded-asset-block', ['code']), ' node is a live reference you can resolve into a responsive image, a caption, or nothing at all.'),
        ul(
          'The same document renders to React, to plain-text email, or to an app.',
          'Embedded entries stay references, so they update when the entry updates.',
          'You can validate which node types are allowed, per field.',
        ),
        h2('Constraining node types is the underused part'),
        p('A rich text field accepts an ', text('enabledNodeTypes', ['code']), ' validation. Reserving heading level one for the post title, and disallowing it in the body, prevents a whole category of accessibility bug without asking editors to remember anything.'),
        quote('Every validation you add is a rule an editor does not have to hold in their head.'),
        h3('One sharp edge'),
        p('Lists are a single node type. Passing ', text('list-item', ['code']), ' in ', text('enabledNodeTypes', ['code']), ' is rejected outright — enable ', text('unordered-list', ['code']), ' and the items come with it. The error message does tell you, eventually.'),
        p('For rendering, ', link('https://www.npmjs.com/package/@contentful/rich-text-react-renderer', 'the official React renderer'), ' takes a node-type-to-component map. That map is where the design system plugs in.'),
      ),
      ur: doc(
        p('زیادہ تر سی ایم ایس آپ کو ایچ ٹی ایم ایل کی ایک لڑی تھما دیتے ہیں۔ کنٹینٹفل آپ کو ٹائپ شدہ نوڈز کا شجرہ دیتا ہے، اور یہ فرق پہلی نظر سے کہیں زیادہ اہم ہے۔'),
        h2('صرف ایچ ٹی ایم ایل کیوں نہ رکھی جائے؟'),
        p('کیونکہ ایچ ٹی ایم ایل خود ایک نمائشی ہدف ہے، اور جس لمحے آپ کے پاس دو اہداف ہوں، وہ ڈھیر کام کرنا چھوڑ دیتا ہے۔ محفوظ شدہ ', text('<img>', ['code']), ' ٹیگ ایک بند گلی ہے؛ جبکہ ', text('embedded-asset-block', ['code']), ' نوڈ ایک زندہ حوالہ ہے جسے آپ ذمہ دار تصویر، کیپشن، یا کچھ بھی نہ بنانے میں بدل سکتے ہیں۔'),
        ul(
          'ایک ہی دستاویز ری ایکٹ میں، سادہ متن کی ای میل میں، یا کسی ایپ میں دکھائی جا سکتی ہے۔',
          'شامل کی گئی انٹریز حوالے ہی رہتی ہیں، اس لیے انٹری بدلنے پر وہ خود بخود بدل جاتی ہیں۔',
          'آپ ہر فیلڈ کے لیے طے کر سکتے ہیں کہ کون سے نوڈ کی اجازت ہے۔',
        ),
        h2('نوڈ کی اقسام محدود کرنا سب سے کم استعمال ہونے والی سہولت ہے'),
        p('رِچ ٹیکسٹ فیلڈ ', text('enabledNodeTypes', ['code']), ' توثیق قبول کرتا ہے۔ سرخی کی پہلی سطح کو تحریر کے عنوان کے لیے مخصوص رکھنا، اور متن میں اس کی ممانعت کرنا، رسائی کے مسائل کی ایک پوری قسم روک دیتا ہے، وہ بھی مدیروں سے کچھ یاد رکھوائے بغیر۔'),
        quote('آپ جو بھی توثیق شامل کرتے ہیں، وہ ایک ایسا اصول ہے جو مدیر کو ذہن میں نہیں رکھنا پڑتا۔'),
        h3('ایک تیز دھار کنارہ'),
        p('فہرستیں ایک ہی نوڈ کی قسم ہیں۔ ', text('enabledNodeTypes', ['code']), ' میں ', text('list-item', ['code']), ' دینا سرے سے مسترد ہو جاتا ہے — ', text('unordered-list', ['code']), ' کی اجازت دیجیے، اشیاء خود ساتھ آ جائیں گی۔ غلطی کا پیغام بالآخر یہ بتا ہی دیتا ہے۔'),
        p('نمائش کے لیے ', link('https://www.npmjs.com/package/@contentful/rich-text-react-renderer', 'سرکاری ری ایکٹ رینڈرر'), ' نوڈ کی قسم سے کمپوننٹ کا نقشہ لیتا ہے۔ یہی وہ جگہ ہے جہاں ڈیزائن سسٹم جُڑتا ہے۔'),
      ),
    }),
  },
  {
    id: 'post-typing-entries',
    site: 'site-meridian',
    slug: 'typing-contentful-entries-without-codegen',
    author: 'author-ada',
    categories: ['cat-typescript', 'cat-content-modeling'],
    publishedDate: '2026-05-19',
    heroImage: 'hero-types',
    title: i18n({
      'en-US': 'Typing Contentful Entries Without Codegen',
      ur: 'کوڈ جنریشن کے بغیر کنٹینٹفل انٹریز کی ٹائپنگ',
    }),
    excerpt: i18n({
      'en-US': 'The SDK ships generic types good enough to describe your model by hand. Whether that beats generating them depends on how often the model changes.',
      ur: 'ایس ڈی کے ایسی عمومی ٹائپس دیتا ہے جو آپ کے خاکے کو ہاتھ سے بیان کرنے کے لیے کافی ہیں۔ یہ طریقہ خودکار تخلیق سے بہتر ہے یا نہیں، اس کا انحصار اس پر ہے کہ خاکہ کتنی بار بدلتا ہے۔',
    }),
    seo: {
      ogImage: 'hero-types',
      metaTitle: i18n({
        'en-US': 'Typing Contentful Entries Without Codegen',
        ur: 'کوڈ جنریشن کے بغیر کنٹینٹفل انٹریز کی ٹائپنگ',
      }),
      metaDescription: i18n({
        'en-US': 'Using EntrySkeletonType to describe a content model by hand, and when to reach for codegen instead.',
        ur: 'EntrySkeletonType سے مواد کے خاکے کو ہاتھ سے بیان کرنا، اور کب اس کے بجائے خودکار تخلیق کا سہارا لینا چاہیے۔',
      }),
    },
    body: i18n({
      'en-US': doc(
        p('The Contentful JavaScript SDK is generic over a "skeleton": the shape of an entry\'s fields plus its content type id. Describe the skeleton and every query is typed end to end.'),
        h2('The part that catches people out'),
        p('A reference field is not simply the linked entry. Depending on the chain modifier you use, it might be the resolved entry, an unresolved link stub, or undefined — and the type changes to match.'),
        ul(
          ['Default: resolved entry, or a link stub if it could not be resolved.'],
          [text('withoutUnresolvableLinks', ['code']), ': resolved entry or ', text('undefined', ['code']), '.'],
          [text('withoutLinkResolution', ['code']), ': always a link stub.'],
        ),
        p('The second is usually what you want on a public site. An unpublished author should render as a missing byline, not crash the page — and encoding that in the type means the compiler makes you handle it.'),
        quote('The type system can only protect you from unresolved links if you tell it they are possible.'),
        h2('Hand-written or generated?'),
        p('Hand-written skeletons are readable and reviewable in the same diff as the migration that changed the model. They are also one more thing to forget. Codegen never forgets and produces types nobody enjoys reading.'),
        p('Rough rule: hand-write while the model is small and changing, generate once it is large and stable.'),
      ),
      ur: doc(
        p('کنٹینٹفل کا جاوا اسکرپٹ ایس ڈی کے ایک "اسکیلیٹن" پر عمومی ہے: انٹری کے فیلڈز کی ساخت اور اس کی مواد قسم کی شناخت۔ اسکیلیٹن بیان کر دیں تو ہر استفسار سرے سے سرے تک ٹائپ شدہ ہو جاتا ہے۔'),
        h2('وہ حصہ جہاں لوگ پھنستے ہیں'),
        p('حوالہ فیلڈ محض جُڑی ہوئی انٹری نہیں ہوتا۔ آپ جو زنجیری ترمیم کنندہ استعمال کرتے ہیں، اس کے مطابق وہ حل شدہ انٹری بھی ہو سکتا ہے، غیر حل شدہ حوالہ بھی، یا سرے سے غیر متعین — اور ٹائپ بھی اسی حساب سے بدلتی ہے۔'),
        ul(
          ['طے شدہ: حل شدہ انٹری، یا حل نہ ہو سکے تو حوالے کا ٹھنڈ۔'],
          [text('withoutUnresolvableLinks', ['code']), ': حل شدہ انٹری یا ', text('undefined', ['code']), '۔'],
          [text('withoutLinkResolution', ['code']), ': ہمیشہ حوالے کا ٹھنڈ۔'],
        ),
        p('عوامی ویب سائٹ پر عموماً دوسرا ہی درکار ہوتا ہے۔ غیر شائع شدہ مصنف کو غائب سطرِ نام کے طور پر دکھنا چاہیے، صفحہ گرانا نہیں چاہیے — اور اسے ٹائپ میں درج کرنے کا مطلب ہے کہ کمپائلر آپ سے اس کا انتظام کروا کر ہی چھوڑے گا۔'),
        quote('ٹائپ سسٹم آپ کو غیر حل شدہ حوالوں سے تبھی بچا سکتا ہے جب آپ اسے بتائیں کہ ایسا ممکن ہے۔'),
        h2('ہاتھ سے لکھی ہوئی یا خودکار؟'),
        p('ہاتھ سے لکھے اسکیلیٹن پڑھنے میں آسان ہوتے ہیں اور اسی تبدیلی میں نظرثانی کے قابل ہوتے ہیں جس میں خاکہ بدلا ہو۔ ساتھ ہی یہ ایک اور چیز ہے جسے بھولا جا سکتا ہے۔ خودکار تخلیق کبھی نہیں بھولتی، مگر ایسی ٹائپس بناتی ہے جنہیں پڑھنا کسی کو پسند نہیں۔'),
        p('موٹا اصول: جب تک خاکہ چھوٹا اور بدلتا رہے، ہاتھ سے لکھیں؛ جب بڑا اور مستحکم ہو جائے تو خودکار بنائیں۔'),
      ),
    }),
  },
  {
    id: 'post-lcp',
    site: 'site-fieldnotes',
    slug: 'cutting-largest-contentful-paint-in-half',
    author: 'author-ravi',
    categories: ['cat-web-performance'],
    publishedDate: '2026-04-22',
    heroImage: 'hero-lcp',
    title: i18n({
      'en-US': 'Cutting Largest Contentful Paint in Half',
      ur: 'لارجسٹ کنٹینٹفل پینٹ کو آدھا کرنا',
    }),
    excerpt: i18n({
      'en-US': 'The hero image is almost always the LCP element. Four changes to how it is requested moved our p75 from 4.1s to 1.9s, and none of them touched the CMS.',
      ur: 'نمایاں تصویر تقریباً ہمیشہ ایل سی پی عنصر ہوتی ہے۔ اسے طلب کرنے کے طریقے میں چار تبدیلیوں نے ہمارا p75 معیار 4.1 سیکنڈ سے 1.9 سیکنڈ پر پہنچا دیا، اور ان میں سے کسی نے بھی سی ایم ایس کو نہیں چھوا۔',
    }),
    seo: {
      ogImage: 'hero-lcp',
      metaTitle: i18n({
        'en-US': 'Cutting Largest Contentful Paint in Half',
        ur: 'لارجسٹ کنٹینٹفل پینٹ کو آدھا کرنا',
      }),
      metaDescription: i18n({
        'en-US': 'Four changes to hero image delivery that moved p75 LCP from 4.1s to 1.9s.',
        ur: 'نمایاں تصویر کی ترسیل میں چار تبدیلیاں جنہوں نے p75 ایل سی پی کو 4.1 سے 1.9 سیکنڈ کیا۔',
      }),
    },
    body: i18n({
      'en-US': doc(
        p('On a content site the LCP element is the hero image roughly always. Which is good news: it means the problem is bounded, and mostly about how the image is requested rather than how the page is built.'),
        h2('What actually moved the number'),
        ol(
          'Serving the right size. The Images API takes width and format parameters; sending a 2400px JPEG to a phone is the single most common mistake.',
          'Asking for modern formats. AVIF where supported, WebP as the fallback, with the original as a last resort.',
          'Preloading the hero, and only the hero. Preload everything and you have preloaded nothing.',
          'Dropping lazy loading on above-the-fold images, which is a surprisingly popular own goal.',
        ),
        p('Contentful serves images through its own CDN with query-parameter transforms, so all four are a matter of building the right URL — no build step, no asset pipeline.'),
        quote('p75 LCP went from 4.1s to 1.9s. Nothing in the content model changed.'),
        h2('What did not help'),
        p('Switching rendering strategies. We tried static generation, then streaming SSR, and the LCP delta was inside the noise. The bytes on the critical path were the whole story.'),
        hr(),
        p('Worth measuring on real devices before and after. Lab numbers on a developer laptop will tell you everything is fine.'),
      ),
      ur: doc(
        p('مواد پر مبنی ویب سائٹ پر ایل سی پی عنصر تقریباً ہمیشہ نمایاں تصویر ہی ہوتی ہے۔ یہ اچھی خبر ہے: اس کا مطلب ہے کہ مسئلہ محدود ہے، اور زیادہ تر اس بارے میں ہے کہ تصویر کیسے طلب کی جاتی ہے، نہ کہ صفحہ کیسے بنایا گیا ہے۔'),
        h2('اصل میں کس چیز نے فرق ڈالا'),
        ol(
          'درست پیمائش بھیجنا۔ امیجز اے پی آئی چوڑائی اور فارمیٹ کے پیرامیٹر لیتا ہے؛ فون کو 2400 پکسل کی جے پیگ بھیجنا سب سے عام غلطی ہے۔',
          'جدید فارمیٹ مانگنا۔ جہاں ممکن ہو AVIF، متبادل کے طور پر WebP، اور آخری چارہ اصل فائل۔',
          'صرف نمایاں تصویر کو پیشگی لوڈ کرنا۔ سب کچھ پیشگی لوڈ کریں تو کچھ بھی پیشگی لوڈ نہیں ہوتا۔',
          'اوپر نظر آنے والی تصاویر سے سست لوڈنگ ہٹانا، جو حیرت انگیز طور پر عام خودکشی ہے۔',
        ),
        p('کنٹینٹفل تصاویر اپنے سی ڈی این سے پیش کرتا ہے اور تبدیلیاں استفسار کے پیرامیٹر سے ہوتی ہیں، اس لیے چاروں کام محض درست یو آر ایل بنانے کے ہیں — نہ کوئی بلڈ مرحلہ، نہ اثاثوں کی پائپ لائن۔'),
        quote('p75 ایل سی پی 4.1 سیکنڈ سے 1.9 سیکنڈ ہو گیا۔ مواد کے خاکے میں کچھ نہیں بدلا۔'),
        h2('کس چیز سے مدد نہیں ملی'),
        p('نمائش کی حکمتِ عملی بدلنے سے۔ ہم نے جامد تخلیق آزمائی، پھر اسٹریمنگ ایس ایس آر، اور ایل سی پی کا فرق شور میں دب گیا۔ اصل کہانی نازک راستے پر موجود بائٹس کی تھی۔'),
        hr(),
        p('پہلے اور بعد میں اصل آلات پر ناپنا ضروری ہے۔ ڈویلپر کے لیپ ٹاپ پر تجربہ گاہی اعداد آپ کو یہی بتائیں گے کہ سب ٹھیک ہے۔'),
      ),
    }),
  },
  {
    id: 'post-alt-text',
    site: 'site-fieldnotes',
    slug: 'alt-text-is-content-not-metadata',
    author: 'author-lena',
    categories: ['cat-accessibility', 'cat-content-modeling'],
    publishedDate: '2026-06-30',
    heroImage: 'hero-alt-text',
    title: i18n({
      'en-US': 'Alt Text Is Content, Not Metadata',
      ur: 'الٹ ٹیکسٹ مواد ہے، میٹا ڈیٹا نہیں',
    }),
    excerpt: i18n({
      'en-US': 'Storing alt text on the asset means one description for every context an image appears in. Sometimes that is right. Often it quietly is not.',
      ur: 'الٹ ٹیکسٹ کو اثاثے پر رکھنے کا مطلب ہے کہ تصویر جس بھی سیاق میں آئے، تفصیل ایک ہی رہے گی۔ کبھی یہ درست ہوتا ہے۔ اکثر خاموشی سے غلط ہوتا ہے۔',
    }),
    seo: {
      ogImage: 'hero-alt-text',
      metaTitle: i18n({
        'en-US': 'Alt Text Is Content, Not Metadata',
        ur: 'الٹ ٹیکسٹ مواد ہے، میٹا ڈیٹا نہیں',
      }),
      metaDescription: i18n({
        'en-US': 'Why the asset description field is the wrong home for alt text, and what to do instead.',
        ur: 'اثاثے کا تفصیل فیلڈ الٹ ٹیکسٹ کے لیے غلط جگہ کیوں ہے، اور اس کے بجائے کیا کیا جائے۔',
      }),
    },
    body: i18n({
      'en-US': doc(
        p('Nearly every Contentful project maps the asset ', text('description', ['code']), ' field to the ', text('alt', ['code']), ' attribute. It is the obvious move and it is right often enough that the problem stays hidden.'),
        h2('One image, several meanings'),
        p('The same photograph used as a hero, a thumbnail in a list, and an inline figure is doing three different jobs. As a hero it is decorative and should probably have an empty alt attribute. Inline, it may be carrying the argument of the paragraph around it.'),
        quote('Alt text describes the role the image plays here, not the pixels it contains.'),
        h2('A model that handles it'),
        p('Wrap the asset in a small component type — an ', text('image', ['code']), ' entry with a reference to the asset plus its own ', text('alt', ['code']), ' and ', text('caption', ['code']), ' fields. The asset description becomes the default; the wrapper overrides it per usage.'),
        ul(
          'Decorative usages set alt to an empty string, deliberately.',
          'Informative usages get a description written for that context.',
          'Captions stop being smuggled into the alt attribute.',
        ),
        h3('The cost'),
        p('It is another entry for editors to create, and editors will route around friction. Worth it for editorial images; overkill for an icon library.'),
        hr(),
        p('Whatever you choose, make the field required. An optional alt field is an alt field that is empty on the pages nobody reviewed.'),
      ),
      ur: doc(
        p('تقریباً ہر کنٹینٹفل منصوبہ اثاثے کے ', text('description', ['code']), ' فیلڈ کو ', text('alt', ['code']), ' خصوصیت پر منطبق کر دیتا ہے۔ یہ ظاہری قدم ہے اور اتنی بار درست ہوتا ہے کہ مسئلہ چھپا رہتا ہے۔'),
        h2('ایک تصویر، کئی معنی'),
        p('ایک ہی تصویر جب نمایاں تصویر، فہرست میں چھوٹی جھلک، اور متن کے بیچ شکل کے طور پر استعمال ہو، تو وہ تین مختلف کام کر رہی ہوتی ہے۔ نمایاں تصویر کے طور پر وہ زیبائشی ہے اور اس کی الٹ خصوصیت غالباً خالی ہونی چاہیے۔ متن کے بیچ وہ ارد گرد کے پیراگراف کی دلیل اٹھا رہی ہو سکتی ہے۔'),
        quote('الٹ ٹیکسٹ یہ بیان کرتا ہے کہ تصویر یہاں کیا کردار ادا کر رہی ہے، نہ کہ اس میں کون سے پکسل ہیں۔'),
        h2('ایک خاکہ جو یہ سنبھال لیتا ہے'),
        p('اثاثے کو ایک چھوٹی جزوی قسم میں لپیٹ دیں — ایک ', text('image', ['code']), ' انٹری جس میں اثاثے کا حوالہ ہو اور ساتھ اپنے ', text('alt', ['code']), ' اور ', text('caption', ['code']), ' فیلڈز ہوں۔ اثاثے کی تفصیل طے شدہ قدر بن جاتی ہے؛ لپیٹ ہر استعمال کے لیے اسے بدل دیتی ہے۔'),
        ul(
          'زیبائشی استعمال میں الٹ کو جان بوجھ کر خالی رکھا جاتا ہے۔',
          'معلوماتی استعمال کے لیے اسی سیاق کی تفصیل لکھی جاتی ہے۔',
          'کیپشن کو الٹ خصوصیت میں چھپا کر ڈالنا بند ہو جاتا ہے۔',
        ),
        h3('قیمت'),
        p('یہ مدیروں کے لیے ایک اور انٹری ہے، اور مدیر رکاوٹ سے بچ نکلنے کا راستہ ڈھونڈ لیتے ہیں۔ ادارتی تصاویر کے لیے یہ قیمت مناسب ہے؛ آئیکن کی لائبریری کے لیے حد سے زیادہ۔'),
        hr(),
        p('آپ جو بھی چنیں، فیلڈ کو لازمی بنائیں۔ اختیاری الٹ فیلڈ وہی فیلڈ ہے جو ان صفحات پر خالی ہوتا ہے جن کا کسی نے جائزہ نہیں لیا۔'),
      ),
    }),
  },
  {
    id: 'post-preview',
    site: 'site-fieldnotes',
    slug: 'draft-previews-without-leaking-drafts',
    author: 'author-ravi',
    categories: ['cat-web-performance', 'cat-content-modeling'],
    publishedDate: '2026-07-28',
    heroImage: 'hero-preview',
    title: i18n({
      'en-US': 'Draft Previews Without Leaking Drafts',
      ur: 'مسودے لیک کیے بغیر مسودوں کا پیش منظر',
    }),
    excerpt: i18n({
      'en-US': 'Preview mode means running two APIs against one codebase. The failure mode is not that preview breaks — it is that production quietly starts serving drafts.',
      ur: 'پیش منظر کا مطلب ہے ایک ہی کوڈ کے ساتھ دو اے پی آئی چلانا۔ خرابی یہ نہیں کہ پیش منظر ٹوٹ جائے — خرابی یہ ہے کہ پیداواری سائٹ خاموشی سے مسودے پیش کرنے لگے۔',
    }),
    seo: {
      ogImage: 'hero-preview',
      metaTitle: i18n({
        'en-US': 'Draft Previews Without Leaking Drafts',
        ur: 'مسودے لیک کیے بغیر مسودوں کا پیش منظر',
      }),
      metaDescription: i18n({
        'en-US': 'Wiring the Contentful Preview API into Next.js without letting unpublished content reach production.',
        ur: 'کنٹینٹفل پیش منظر اے پی آئی کو نیکسٹ میں جوڑنا، بغیر اس کے کہ غیر شائع شدہ مواد پیداواری سائٹ تک پہنچے۔',
      }),
    },
    body: i18n({
      'en-US': doc(
        p('Contentful splits published and draft content across two hosts with two tokens. Preview is therefore not a flag on a request; it is a different client entirely, and the interesting question is who is allowed to construct one.'),
        h2('The failure mode worth designing against'),
        p('It is not preview breaking — you notice that immediately. It is a cached page built with the preview client being served to the public, so unpublished content leaks and nobody finds out for a week.'),
        ol(
          'Gate preview behind a signed token in the URL, never a bare query parameter.',
          'Mark preview responses as uncacheable, at the CDN as well as the framework.',
          'Make the preview client impossible to construct without the draft mode flag already set.',
        ),
        quote('If a preview render can end up in a shared cache, you do not have preview mode. You have a slow content leak.'),
        h2('Editors do not care about any of this'),
        p('They care that the preview button works from inside the entry editor and lands on the right URL. Contentful supports per-content-type preview URLs with the entry slug interpolated, which is a five-minute setup that saves a lot of complaining.'),
        p('Set it up on day one. The alternative is teaching people to copy slugs into a URL by hand, and they will do it wrong.'),
      ),
      ur: doc(
        p('کنٹینٹفل شائع شدہ اور مسودہ مواد کو دو میزبانوں اور دو ٹوکنوں میں بانٹتا ہے۔ اس لیے پیش منظر درخواست پر لگا کوئی جھنڈا نہیں؛ یہ سرے سے الگ کلائنٹ ہے، اور اصل سوال یہ ہے کہ اسے بنانے کی اجازت کس کو ہے۔'),
        h2('وہ خرابی جس سے بچنے کا ڈیزائن ہونا چاہیے'),
        p('پیش منظر کا ٹوٹنا مسئلہ نہیں — وہ فوراً پکڑا جاتا ہے۔ مسئلہ یہ ہے کہ پیش منظر کلائنٹ سے بنا ہوا محفوظ شدہ صفحہ عام لوگوں کو پیش ہونے لگے، غیر شائع شدہ مواد باہر نکل جائے، اور ہفتہ بھر کسی کو خبر نہ ہو۔'),
        ol(
          'پیش منظر کو یو آر ایل میں دستخط شدہ ٹوکن کے پیچھے رکھیں، کبھی سادہ استفساری پیرامیٹر کے پیچھے نہیں۔',
          'پیش منظر کے جوابات کو ناقابلِ ذخیرہ قرار دیں، فریم ورک میں بھی اور سی ڈی این پر بھی۔',
          'پیش منظر کلائنٹ کو ایسا بنائیں کہ مسودہ موڈ کے جھنڈے کے بغیر وہ بن ہی نہ سکے۔',
        ),
        quote('اگر پیش منظر کی نمائش کسی مشترکہ ذخیرے میں پہنچ سکتی ہے، تو آپ کے پاس پیش منظر نہیں ہے۔ آپ کے پاس ایک سست رفتار رساؤ ہے۔'),
        h2('مدیروں کو اس سب سے کوئی غرض نہیں'),
        p('انہیں بس یہ چاہیے کہ انٹری ایڈیٹر کے اندر سے پیش منظر کا بٹن کام کرے اور درست یو آر ایل پر لے جائے۔ کنٹینٹفل ہر مواد قسم کے لیے الگ پیش منظر یو آر ایل کی سہولت دیتا ہے جس میں انٹری کا سلگ شامل ہو جاتا ہے — پانچ منٹ کی ترتیب جو بہت سی شکایتیں بچا لیتی ہے۔'),
        p('اسے پہلے ہی دن ترتیب دیں۔ متبادل یہ ہے کہ لوگوں کو سلگ ہاتھ سے یو آر ایل میں نقل کرنا سکھایا جائے، اور وہ یہ غلط ہی کریں گے۔'),
      ),
    }),
  },
];
