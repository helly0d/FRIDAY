import url from "url";
import path from "path";


const HMR_PORT = 13370;
const HMR_URL = "http://localhost";


export function computeHMR(hmrUrl) {
  const {hostname, port, protocol} = url.parse(hmrUrl || HMR_URL);
  const hmrPor = port || HMR_PORT;
  const HMR = url.format({protocol, hostname, port: hmrPor});

  return {
    path: `webpack-hot-middleware/client?path=${HMR}/__webpack_hmr`,
    port: hmrPor
  };
}


export function computeEntries(bundles, {watch, hotReload, base, hmrPath}) {
  const entries = {};
  bundles.forEach((bundle) => {
    entries[bundle] = [];
    if (watch && hotReload) {
      entries[bundle].push(hmrPath);
    }
    entries[bundle].push(path.resolve(base, bundle));
  });

  return entries;
}
