
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 730, hash: '9321c8007d0c1b8ee57288c586163ef60d084093facb4ade9b067ef3d8c54cdb', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1008, hash: 'b7d0f5b5c51c1ab406aec33f42c8f3cd0c19d381c25e05809763dd7ac27accb4', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 1682, hash: '95da9559baaee9db4a970b28c62046b32bbc0f4e82cfb0b2ac37d9f6b7b03b62', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-PL3ZO7JF.css': {size: 774, hash: 'q9wItYLDj7A', text: () => import('./assets-chunks/styles-PL3ZO7JF_css.mjs').then(m => m.default)}
  },
};
