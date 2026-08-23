/**
 * Which site in the shared Contentful space this application serves.
 *
 * Hardcoded rather than read from the environment on purpose: it is the app's
 * identity, not its configuration. Pointing Meridian at Fieldnotes' content by
 * changing an env var would be a bug, not a feature.
 */
export const SITE_KEY = 'meridian';

/** Where this app runs, used to build absolute preview URLs. */
export const DEFAULT_PORT = 3000;
