import {resolve,join} from "path";
import pkgutils from "lerna/lib/PackageUtilities";
import PkgDiffer from "lerna/lib/UpdatedPackagesCollector";
import createPipeline from "autorelease-pipeline";
import {find,clone} from "lodash";
import ProgressBar from "progress";

function getUpdatedPackages(packages, publishConfig={}) {
  const pkggraph = pkgutils.getPackageGraph(packages);
  const differ = new PkgDiffer(packages, pkggraph, {}, publishConfig);

  return differ.getUpdates()
    .map((update) => update.package)
    .filter((pkg) => !pkg.isPrivate());
}

async function fetchPackages(ctx, next) {
  if (!ctx.packages) {
    const {basedir="."} = ctx;
    const fullbase = resolve(basedir);
    ctx.lerna = require(join(fullbase, "lerna.json"));
    if (ctx.lerna.lerna) console.log("Using Lerna v%s", ctx.lerna.lerna);

    ctx.independent = ctx.lerna.version === "independent";
    ctx.packages = pkgutils.getPackages(pkgutils.getPackagesPath(basedir));
    ctx.updated = getUpdatedPackages(ctx.packages, ctx.lerna.publishConfig);
    console.log("Releasing %s packages of %s total", ctx.updated.length, ctx.packages.length);

    // always add the "main" package to the list that needs releasing
    if (ctx.package.name && !ctx.updated.some(pkg => pkg.name === ctx.package.name)) {
      const pkg = find(ctx.packages, (p) => p.name === ctx.package.name);
      if (pkg) ctx.updated.push(pkg);
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
    let {packages:all,updated} = ctx;

    // don't re-run if this task was run previously
    if (id) {
      if (!ctx.lerna_tasks) ctx.lerna_tasks = [];
      if (ctx.lerna_tasks.indexOf(id) > -1) return;
      ctx.lerna_tasks.push(id);
    }

    // don't loop when non-independent
    if (forceLoop !== true && !ctx.independent) {
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
