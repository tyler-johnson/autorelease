import {resolve,join} from "path";
import pkgutils from "lerna/lib/PackageUtilities";
// import PkgDiffer from "lerna/lib/UpdatedPackagesCollector";
import createPipeline from "autorelease-pipeline";

// function getUpdatedPackages(basedir=".", publishConfig={}) {
//   const packages = pkgutils.getPackages(pkgutils.getPackagesPath(basedir));
//   const pkggraph = pkgutils.getPackageGraph(packages);
//   const differ = new PkgDiffer(packages, pkggraph, {}, publishConfig);
//
//   return differ.getUpdates()
//     .map((update) => update.package)
//     .filter((pkg) => !pkg.isPrivate());
// }

async function fetchPackages(ctx, next) {
  if (!ctx.packages) {
    const {basedir="."} = ctx;
    const fullbase = resolve(basedir);
    const lerna = require(join(fullbase, "lerna.json"));

    if (lerna.version === "independent") {
      // ctx.packages = getUpdatedPackages(fullbase, lerna.publishConfig);
      ctx.packages = pkgutils.getPackages(pkgutils.getPackagesPath(basedir));
    }
  }

  await next(ctx);
  return;
}

function addLernaTask(name, fn, contextKeys, forceLoop) {
  if (typeof name === "function") {
    [forceLoop,contextKeys,fn,name] = [contextKeys,fn,name,null];
  }

  return this.add(name, async function(ctx) {
    let {packages} = ctx;

    if (forceLoop !== true && !Array.isArray(packages)) {
      await fn(ctx);
      return;
    }

    packages = packages.slice(0);

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
