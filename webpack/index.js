import path from "path";
import express from "express";
import webpackHotMiddleware from "webpack-hot-middleware";

import logStats from "./log_stats";
import {computeHMR, computeEntries} from "./utils";
import {Compiler, computeBasicPlugins, computeHMRPlugins} from "./helpers";


const JS_BUNDLES = ["friday"];

const ROOT = path.resolve(__dirname, "../");
const {NODE_ENV = "", HOT_LOAD, WARNINGS} = process.env;
const {path: HOT_PATH, port: HOT_PORT} = computeHMR(HOT_LOAD);

const OPTS = {
  base: path.resolve(ROOT, "src"),
  output: path.resolve(ROOT, "lib"),
  watch: NODE_ENV !== "production",
  minify: NODE_ENV === "production",
  sourcemaps: NODE_ENV !== "production",
  debug: NODE_ENV !== "production",
  hotReload: NODE_ENV !== "production" && HOT_LOAD !== "false",
  hmrPath: HOT_PATH,
  warnings: WARNINGS === "true"
};


const fridayCompiler = new Compiler({
  config: {
    name: "friday",
    bail: !OPTS.watch,
    devtool: OPTS.sourcemaps ? "source-map" : false,
    debug: true,
    entry: computeEntries(JS_BUNDLES, OPTS, HOT_PATH),
    resolve: {
      extensions: ["", ".js", ".jsx"],
      modulesDirectories: ["node_modules", "src"]
    },
    output: {
      path: OPTS.output,
      publicPath: "/lib/",
      chunkFilename: "[name].js",
      jsonpFunction: "fridayJsonp",
      filename: "[name]/index.js"
    },
    module: {
      loaders: [{
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        include: [OPTS.base],
        exclude: [path.resolve(ROOT, "node_modules")]
      }]
    },
    plugins: computeBasicPlugins(OPTS, {NODE_ENV}).concat(computeHMRPlugins(OPTS)),
    node: {
      console: false,
      global: true,
      process: true,
      Buffer: true,
      __filename: "mock",
      __dirname: "mock",
      setImmediate: true,
      fs: "empty"
    }
  },
  watch: OPTS.watch,
  logger: logStats
});


let app = null;
fridayCompiler.run(() => {
  if (app || !OPTS.watch || !OPTS.hotReload) {
    return;
  }

  app = express();
  app.use(webpackHotMiddleware(fridayCompiler.builder, {log() {}}));
  app.listen(HOT_PORT);
});
