import {resolve,join} from "path";
import PkgDiffer from "lerna/lib/UpdatedPackagesCollector";
import UpdatedCommand from "lerna/lib/commands/UpdatedCommand";
import createPipeline from "autorelease-pipeline";
import {find,clone} from "lodash";
import ProgressBar from "progress";

const DEFAULT_PACKAGE_GLOB = ["packages/*"];

async function fetchPackages(ctx, next) {
  if (!ctx.lerna) {
    const {basedir="."} = ctx;
    const fullbase = resolve(basedir);
    const lerna = ctx.lerna = {};

    lerna.config = require(join(fullbase, "lerna.json"));
    if (lerna.config.lerna) console.log("Using Lerna v%s", lerna.config.lerna);

    lerna.independent = lerna.config.version === "independent";

    const update = new UpdatedCommand([], {}, fullbase);
    update.logger.setLogLevel("warn");
    update.runValidations();
    update.runPreparations();
    const pkgdiff = new PkgDiffer(update);

    lerna.packages = update.packages;
    lerna.updated = pkgdiff.getUpdates().map(p => p.package);
    console.log("Releasing %s packages of %s total", lerna.updated.length, lerna.packages.length);

    // always add the "main" package to the list that needs releasing
    if (ctx.package.name && !lerna.updated.some(pkg => pkg.name === ctx.package.name)) {
      const pkg = find(lerna.packages, (p) => p.name === ctx.package.name);
      if (pkg) lerna.updated.push(pkg);
    }
  }

  await next(ctx);
  return;
}

function addLernaTask(name, fn, opts={}) {
  if (typeof name === "function") {
    [opts,fn,name] = [fn,name,null];
  }

  const {contextKeys,forceLoop,updatedOnly,id,progress=true,log=""} = opts;

  return this.add(name, async function(ctx) {
    const {lerna={}} = ctx;
    const {packages:all,updated} = lerna;

    // don't re-run if this task was run previously
    if (id) {
      if (!lerna.tasks) lerna.tasks = [];
      if (lerna.tasks.indexOf(id) > -1) return;
      lerna.tasks.push(id);
    }

    // don't loop when non-independent
    if (forceLoop !== true && !lerna.independent) {
      if (log) console.log(log);
      await fn(ctx);
      return;
    }

    const packages = (updatedOnly ? updated : all).slice(0);
    let pb;

    if (progress && process.stdout.isTTY && process.stdout.clearLine) {
      pb = new ProgressBar(`${log ? log + " " : ""}╢:bar╟ `, {
        total: packages.length,
        complete: "█",
        incomplete: "░",
        clear: true,
        stream: process.stdout,

        // terminal columns - package name length - additional characters length
        width: (process.stdout.columns || 100) - log.length - 3
      });
    } else if (log) {
      console.log(log);
    }

    while (packages.length) {
      const pkg = packages.shift();

      const newctx = {
        ...ctx,
        ...pkg.autorelease_ctx,
        parentContext: ctx,
        basedir: pkg.location,
        package: clone(pkg._package),
        packageFile: join(pkg.location, "package.json")
      };

      newctx.package = {
        ...newctx.package,
        publishConfig: {
          ...newctx.package.publishConfig,
          ...ctx.package.publishConfig
        }
      };

      await fn(newctx);
      pb && pb.tick();

      if (Array.isArray(contextKeys)) {
        // create an object of modified context keys
        // done this way so all values, including undefined, are set
        const changedCtx = contextKeys.reduce((o, k) => {
          o[k] = newctx[k];
          return o;
        }, {});

        pkg.autorelease_ctx = Object.assign(pkg.autorelease_ctx || {}, changedCtx);
      }
    }

    if (pb && log) {
      pb.terminate();
      console.log(log);
    }
  });
}

export default function() {
  const pipeline = createPipeline(fetchPackages);
  pipeline.addLernaTask = addLernaTask;
  return pipeline;
}
