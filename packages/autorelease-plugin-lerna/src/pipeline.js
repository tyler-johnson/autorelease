import {resolve,join} from "path";
import pkgutils from "lerna/lib/PackageUtilities";
import PkgDiffer from "lerna/lib/UpdatedPackagesCollector";
import createPipeline from "autorelease-pipeline";

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
    ctx.independent = ctx.lerna.version === "independent";
    ctx.packages = pkgutils.getPackages(pkgutils.getPackagesPath(basedir));
    ctx.updated = getUpdatedPackages(ctx.packages, ctx.lerna.publishConfig);
  }

  await next(ctx);
  return;
}

function addLernaTask(name, fn, opts={}) {
  if (typeof name === "function") {
    [opts,fn,name] = [fn,name,null];
  }

  const {contextKeys,forceLoop,updatedOnly} = opts;

  return this.add(name, async function(ctx) {
    let {packages:all,updated} = ctx;

    // don't loop when non-independent
    if (forceLoop !== true && !ctx.independent) {
      await fn(ctx);
      return;
    }

    const packages = (updatedOnly ? updated : all).slice(0);

    while (packages.length) {
      const pkg = packages.shift();

      const newctx = {
        ...ctx,
        ...pkg.autorelease_ctx,
        parentContext: ctx,
        basedir: pkg.location,
        package: pkg._package,
        packageFile: join(pkg.location, "package.json")
      };

      await fn(newctx);

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
  });
}

export default function() {
  const pipeline = createPipeline(fetchPackages);
  pipeline.addLernaTask = addLernaTask;
  return pipeline;
}
