import webpack from "webpack";


const noop = () => {};


export class Compiler {
  constructor({config, watch, logger}) {
    this.builder = webpack(config);
    this.watcher = null;
    this.watch = watch;
    this.logger = logger;
  }

  run(cb = noop) {
    if (this.watcher) {
      this.watcher.close(() => {
        this.watcher = null;
        this.run();
      });
      return;
    }

    const callback = (...args) => {
      this.logger(...args);
      cb();
    };

    if (this.watch) {
      this.watcher = this.builder.watch({}, callback);
    } else {
      this.builder.run(callback);
    }
  }
}


export function compileSequence(compilers) {
  const sequence = compilers.map((compiler, index) => {
    if (index === compilers.length - 1) {
      return () => compiler.run();
    }
    return () => compiler.run(sequence[index + 1]);
  });

  if (sequence.length) {
    sequence[0]();
  }
}


export function computeHMRPlugins({watch, hotReload}) {
  if (!watch || !hotReload) {
    return [];
  }

  return [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ];
}


export function computeBasicPlugins(options, {NODE_ENV}) {
  const plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      async: "commons",
      children: true
    }),

    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: `"${NODE_ENV}"`
      }
    })
  ];

  return plugins;
}
