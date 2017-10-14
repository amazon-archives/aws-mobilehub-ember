importScripts('workbox-sw.prod.v2.1.0.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "assets/ember-mobilehub-tester.css",
    "revision": "47a3fd33921d1288617e50cb61de7e9c"
  },
  {
    "url": "assets/ember-mobilehub-tester.js",
    "revision": "cfd80bdb910df0afe13718ac9adea77b"
  },
  {
    "url": "assets/ember-mobilehub-tester.map",
    "revision": "e3e25b42b7f19e8fe549351a9867b76b"
  },
  {
    "url": "assets/failed.png",
    "revision": "836936cf32381ff14d191d7b10be9a89"
  },
  {
    "url": "assets/passed.png",
    "revision": "b8506cbc195c8b9db541745aee267c48"
  },
  {
    "url": "assets/test-support.css",
    "revision": "d88fd53b772126e36016a3ae76cd2489"
  },
  {
    "url": "assets/test-support.js",
    "revision": "a42779e9fec57a8aea26f14f66f3460e"
  },
  {
    "url": "assets/test-support.map",
    "revision": "f093b3e3f390dd1c7cbc8642b389082d"
  },
  {
    "url": "assets/tests.js",
    "revision": "d89b6e06333a500bbb7da4ab53c8e194"
  },
  {
    "url": "assets/tests.map",
    "revision": "4337476b571e0dc866c78120a53cb5d7"
  },
  {
    "url": "assets/vendor.css",
    "revision": "e81a762210de7bd2a111e7ff465a4236"
  },
  {
    "url": "crossdomain.xml",
    "revision": "9dd26dbc8f3f9a8a342d067335315a63"
  },
  {
    "url": "images/cube.png",
    "revision": "fccbf7a3239b02be07b441b2651253ba"
  },
  {
    "url": "images/preloader.gif",
    "revision": "875fa007e9db9bda821f76da099c9bae"
  },
  {
    "url": "index.html",
    "revision": "1f4c3b51aa7d3109adbd9bc30b0b5638"
  },
  {
    "url": "robots.txt",
    "revision": "61cfff627b79058277e604686197bbbd"
  },
  {
    "url": "sw.js",
    "revision": "b6c6ab9dac0bfb7c025bc01c7cc3a0c4"
  },
  {
    "url": "testem.js",
    "revision": "3a56d763fd72f76fb9e8f93792c43c27"
  },
  {
    "url": "tests/index.html",
    "revision": "5bd14445eb08e12e46eaf6a8a18888b7"
  },
  {
    "url": "workbox-sw.prod.v2.1.0.js",
    "revision": "e5f207838d7fd9c81835d5705a73cfa2"
  },
  {
    "url": "workbox-sw.prod.v2.1.0.js.map",
    "revision": "6fc68cbf40e4e2f38d2889fdaf5bc58a"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
