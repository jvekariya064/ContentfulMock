/**
 * Builders for Contentful rich text.
 *
 * Rich text is stored as a document *tree*, not as HTML or Markdown — which is
 * the whole point: the same document renders to React on the web, to plain text
 * in an email, or to something else entirely, and embedded entries stay real
 * references rather than baked-in markup.
 *
 * Only the node types enabled in `migrations/` are valid here. Notably there is
 * no `list-item` builder to call directly: Contentful derives list items from
 * the list node, and passing `list-item` in `enabledNodeTypes` is rejected.
 */

const asNode = (n) => (typeof n === 'string' ? text(n) : n);

export const text = (value, marks = []) => ({
  nodeType: 'text',
  value,
  marks: marks.map((type) => ({ type })),
  data: {},
});

/** Inline link. Must live inside a paragraph or heading, never at document level. */
export const link = (uri, value) => ({
  nodeType: 'hyperlink',
  data: { uri },
  content: [asNode(value)],
});

export const p = (...content) => ({
  nodeType: 'paragraph',
  data: {},
  content: content.map(asNode),
});

export const h2 = (value) => ({ nodeType: 'heading-2', data: {}, content: [asNode(value)] });
export const h3 = (value) => ({ nodeType: 'heading-3', data: {}, content: [asNode(value)] });

const list = (nodeType, items) => ({
  nodeType,
  data: {},
  content: items.map((item) => ({
    nodeType: 'list-item',
    data: {},
    content: [Array.isArray(item) ? p(...item) : p(item)],
  })),
});

export const ul = (...items) => list('unordered-list', items);
export const ol = (...items) => list('ordered-list', items);

export const quote = (...content) => ({
  nodeType: 'blockquote',
  data: {},
  content: [p(...content)],
});

export const hr = () => ({ nodeType: 'hr', data: {}, content: [] });

/** Embeds an asset as a block. `assetId` must be a published asset. */
export const embed = (assetId) => ({
  nodeType: 'embedded-asset-block',
  data: { target: { sys: { type: 'Link', linkType: 'Asset', id: assetId } } },
  content: [],
});

export const doc = (...content) => ({ nodeType: 'document', data: {}, content });
