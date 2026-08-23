# Contentful + Next.js — two apps, two languages

Two **independent** Next.js applications reading one Contentful space, in
English and Urdu, with draft preview.

| App | Port | Command | Serves |
| --- | --- | --- | --- |
| Meridian Engineering | 3000 | `npm run dev:meridian` | `site.key = meridian` |
| Fieldnotes | 3001 | `npm run dev:fieldnotes` | `site.key = fieldnotes` |

```
localhost:3000/en/articles        localhost:3001/en/articles
localhost:3000/ur/articles        localhost:3001/ur/articles
localhost:3000/en/articles/[slug]
```

Each app is a separate package with its own build, its own port, its own accent
colour, and its own `.next` output. They share a workspace package for
Contentful access and UI, and they share one Contentful space — but neither can
see the other's articles: every query is scoped by the `site` reference, and
requesting the other app's slug returns 404.

```
apps/meridian      SITE_KEY = 'meridian'    port 3000
apps/fieldnotes    SITE_KEY = 'fieldnotes'  port 3001
packages/contentful   client, queries, types, components
migrations/ scripts/  shared content tooling, run from the root
```

`SITE_KEY` is hardcoded in each app's `src/site.ts` rather than read from the
environment: it is the app's identity, not its configuration. Pointing Meridian
at Fieldnotes' content by changing an env var would be a bug, not a feature.

## Setup

**1. Node.** Needs Node 20+; the system default here is 16.

```bash
nvm use 22
```

**2. Contentful space.** Create a space at <https://app.contentful.com>, then
collect:

| Value | Where |
| --- | --- |
| Space ID | Settings → API keys |
| Content Delivery token | Settings → API keys → your key |
| Content Preview token | Settings → API keys → your key |
| Content Management token | Settings → API keys → *Content management tokens* |

A personal access token may also need an **organization access grant** before it
can touch a space — without one the API returns `OrganizationAccessGrantRequired`,
which the migration CLI reports misleadingly as "space does not exist".

**3. Environment.**

```bash
cp .env.example .env.local     # then fill it in
openssl rand -hex 32           # for CONTENTFUL_PREVIEW_SECRET
```

**4. Locales.** The Urdu locale is created through the API, not a migration —
`contentful-migration` covers content types, not locales:

```bash
curl -X POST -H "Authorization: Bearer $CMA_TOKEN" \
  -H "Content-Type: application/vnd.contentful.management.v1+json" \
  -d '{"name":"Urdu","code":"ur","fallbackCode":"en-US","optional":true}' \
  "https://api.contentful.com/spaces/$SPACE_ID/environments/master/locales"
```

**5. Content model and content.**

```bash
npm run migrate      # content types, in filename order
npm run seed         # assets, sites, articles, both locales
npm run preview:setup   # register the preview URL in Contentful
```

**6. Run.** Separate commands, separate ports:

```bash
npm run dev:meridian     # http://localhost:3000
npm run dev:fieldnotes   # http://localhost:3001
npm run dev              # both at once
```

Building and starting are per-app too: `build:meridian`, `start:fieldnotes`, and
so on. `npm run build` builds both.

## The content model

Defined in `migrations/` as code, so it is reviewable in a diff and reproducible
in a fresh space.

```
site                          article
  name        Symbol  ¹         site          → site        required
  key         Symbol  *         title         Symbol  ¹
  tagline     Symbol  ¹         slug          Symbol  *
  locales     Symbol[]          excerpt       Text    ¹  ≤300
  defaultLocale Symbol          body          RichText ¹
                                heroImage     → Asset (images only)
author                          author        → author
  name        Symbol            categories    → category[]  1–3
  slug        Symbol  *         publishedDate Date
  bio         RichText ¹        seo           → seo
  avatar      → Asset
                              category                seo
                                title    Symbol ¹       metaTitle       Symbol ¹
                                slug     Symbol *       metaDescription Text   ¹
                                description Text ¹      ogImage         → Asset
```

`*` unique, validated against `^[a-z0-9]+(?:-[a-z0-9]+)*$`  ·  `¹` localized

### Why it is shaped this way

**Two apps, one space.** `article.site` is a required reference, and each app
filters every query by its own site. Both share authors, categories and assets,
so a shared author is edited once.

The isolation is at the *query* layer, not the storage layer: an editor with
access to the space sees both sites' content, and an app that forgot to filter
would render the other's articles. That is why the filter lives in
`packages/contentful/src/queries.ts` — one place, not scattered through pages.
Separate spaces would give true isolation at the cost of duplicating the model,
every migration, and every credential.

**`seo` is a component type.** No route of its own, referenced by `article`.
Keeping it separate means a future `page` type reuses the same shape.

**Slugs are not localized.** Urdu pages use the English slug. Localized slugs
give prettier URLs at the cost of a per-locale lookup on every route and a
language switcher that cannot just swap the prefix. Revisit if the client asks
for native-script URLs.

**Content type ids are permanent.** Renaming `blogPost` to `article` meant
creating the new type (06–07), moving off the old one, and deleting it (09).
Choose ids carefully.

### Changing the model

Migrations are deliberately not idempotent — `createContentType` fails if the
type exists, which is what stops a re-run from overwriting a live model. Add a
new numbered file:

```js
module.exports = function (migration) {
  migration.editContentType('article').createField('readingTime').type('Integer');
};
```

Then `npm run migrate 10-` to run just that one. `editField` **merges** —
properties you don't restate are preserved.

Contentful refuses to delete a content type that still has entries:

```bash
npm run prune blogPost      # deletes every entry of a type. Destructive.
```

### Inspecting the live model

Use the **management** API, not the delivery API. The CDA strips field-level
`validations` from `content_types`, so a field looks unvalidated when it isn't.

## Localization

Contentful stores every field as a locale map internally, even with one locale:

```json
"title": { "en-US": "Model the Content First", "ur": "پہلے مواد کا خاکہ بنائیں" }
```

The Delivery API collapses that to one locale per query, which is why app code
reads `fields.title` rather than `fields.title['en-US']`, and why `types.ts` has
no locale dimension.

`ur` falls back to `en-US`, so an untranslated field renders English rather than
blank.

URLs use `en` / `ur`; Contentful uses `en-US` / `ur`.
`packages/contentful/src/i18n.ts` maps between them, so locale codes never
appear in URLs.

### Right-to-left

`dir="rtl"` and `lang="ur"` are set on `<html>`, which is why each app's root
layout lives at `src/app/[lang]/layout.tsx` — a layout at `src/app/layout.tsx`
cannot see route params. Requests to `/` are redirected by `src/proxy.ts` before
they reach a layout.

Styling uses logical properties (`ps-`, `border-s`, `text-start`) throughout, so
the layout mirrors without a second stylesheet.

> **Two known gaps, both real.**
>
> **No Urdu webfont is bundled.** Urdu is written in Nastaliq; without
> `Noto Nastaliq Urdu` the browser falls back to Naskh, which is legible but
> looks wrong to a native reader. Ship the font before this goes in front of
> anyone.
>
> **The Urdu translations are machine-written and unreviewed.** They are
> structurally faithful and read plausibly, but no native speaker has checked
> them. See the warning at the top of `scripts/lib/seed-data.mjs`.

## Preview

Draft content is invisible to the Delivery API. Preview swaps in a different
client, against a different host, with a different token.

```
/api/preview?secret=…&id={entry_id}&locale={locale}   ← what Contentful calls
/api/preview?secret=…&slug=…&lang=en                  ← convenient by hand
/api/preview/exit?redirect=/en/articles
```

`npm run preview:setup` registers **one preview environment per app**, pointing
at each app's own port. Contentful shows both buttons on every article; opening
an article in the wrong app returns a 404 that names the right one:

```
That article belongs to "meridian", not "fieldnotes".
Open it in the meridian app instead.
```

It keys off the entry id rather than the slug because preview URL tokens cannot
follow the `site` reference — each app resolves the article from its id and
then checks it actually owns it.

Three things keep it from becoming a content leak:

- the secret is compared in constant time
- the redirect target is rebuilt from validated content, never echoed from the
  query string
- draft mode is disabled again on every failure path

Pages rendered in draft mode return `Cache-Control: private, no-store`, so a
preview render cannot land in a shared cache.

`post-draft-demo` is seeded deliberately unpublished, so preview has something to
prove: it 404s publicly and renders under preview.

> Next sets the draft cookie `Secure; SameSite=none` — required for previewing
> inside Contentful's iframe. Browsers accept it on `localhost`; `curl` over
> plain HTTP will not store it, so test preview in a browser.

## The CLI

`contentful-cli` is a **local devDependency, not a global install** — typing
`contentful` in your shell gives `command not found`. That is expected. Reach it
one of three ways:

```bash
npm run cf -- space list          # recommended: credentials injected
npx contentful space list         # needs --management-token or `contentful login`
./node_modules/.bin/contentful    # the binary itself
```

The client asked for the CLI specifically, so both migration paths exist:

```bash
npm run migrate            # programmatic — one command, shared env loading
npm run migrate 10-        # just one migration
npm run migrate:cli        # the same migrations through `contentful space migration`
npm run migrate:cli 10-    # just one
npm run space:export       # whole space → contentful-export.json
npm run cf -- <args>       # any other CLI command
```

**Migrations are not idempotent, so `migrate:cli` with no filter only works
against a fresh environment.** Run it against a space that already has the model
and it fails on the first file:

```
Errors in migrations/01-author.cjs
Line 8: Content type with id "author" already exists.
```

That is the guardrail working, not a bug. Pass a filter to apply a single
migration to an existing space.

### How credentials reach the CLI

`contentful-cli` reads no auth environment variable. It wants either
`contentful login` (which writes `~/.contentfulrc.json`) or an explicit
`--management-token` on every subcommand.

`scripts/cli.mjs` sidesteps both: it writes a throwaway rc file to the OS temp
directory with owner-only permissions, points `CONTENTFUL_CONFIG_FILE` at it,
and deletes it on exit. One mechanism that works for every subcommand, and the
token never lands in the repo or your shell history.

`contentful-export.json` is committed on purpose: it puts the entire model and
content in one reviewable file, and rebuilds a fresh space via
`contentful space import`. Note `--include-drafts true` — the default silently
omits unpublished entries, which would drop the preview demo article.

## Images

Contentful is the image CDN. `packages/contentful/src/image-loader.ts` is a custom
`next/image` loader that hands resizing to Contentful rather than resizing twice
— Next still generates the srcset, reserves layout space and lazy loads.

It scales height with width when a crop is pinned; otherwise every srcset
candidate above the base width gets a progressively flatter crop.

## Layout

```
apps/meridian/                    port 3000, accent teal
apps/fieldnotes/                  port 3001, accent amber
  package.json                    its own dev/build/start scripts
  next.config.ts                  transpilePackages + custom image loader
  .env.local -> ../../.env.local  symlink; one set of credentials
  src/
    site.ts                       SITE_KEY — the app's identity
    proxy.ts                      / -> /en/articles
    image-loader.ts               re-exports the shared loader
    app/globals.css               --accent, Urdu font stack, @source
    app/[lang]/                   root layout (sets dir), list, detail
    app/api/preview/              enter and exit draft mode

packages/contentful/src/
  client.ts                       delivery + preview clients
  queries.ts                      every read; the one place site filtering lives
  types.ts                        hand-maintained skeletons
  i18n.ts                         lang <-> locale, direction, UI strings
  image.ts                        Images API URL builders
  image-loader.ts                 next/image custom loader
  components/                     RichText, ArticleCard, ContentfulImage, SiteChrome

migrations/                       content model as code, filename order
scripts/                          migrate, seed, prune, cli, preview-urls
contentful-export.json            whole space in one reviewable file
```

Shared code is a workspace package rather than duplicated per app. The apps are
independent to run, build and deploy; they are not independent in their
Contentful access layer, and duplicating that would mean fixing every bug twice.

`types.ts` is hand-maintained — add a field in a migration, add it there too.
