import fs from "fs";


export class FailPlugin {
  constructor() {
    this.isWatch = true;
  }

  apply(compiler) {
    compiler.plugin("run", (compilation, callback) => {
      this.isWatch = false;
      callback.call(compilation);
    });

    compiler.plugin("done", (stats) => {
      const errors = stats.compilation.errors;
      if (errors && errors.length && !this.isWatch) {
        process.on("beforeExit", function() {
          process.exit(1);
        });
      }
    });
  }
}


export class ManifestPlugin {
  constructor(options) {
    this.file = options.file;
    this.output = JSON.stringify(options.output);
  }

  apply(compiler) {
    if (!this.file || !this.output) {
      return;
    }

    compiler.plugin("after-emit", (compilation, callback) => {
      fs.writeFile(this.file, this.output, (err) => {
        if (err) {
          console.error("Could not write manifest");
        }

        callback();
      });
    });
  }
}
