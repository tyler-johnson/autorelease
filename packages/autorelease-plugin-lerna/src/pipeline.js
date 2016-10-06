import {resolve,join} from "path";
import pkgutils from "lerna/lib/PackageUtilities";
import PkgDiffer from "lerna/lib/UpdatedPackagesCollector";
import createPipeline from "autorelease-pipeline";
import {difference,pick} from "lodash";

function getUpdatedPackages(basedir=".", publishConfig={}) {
  const packages = pkgutils.getPackages(pkgutils.getPackagesPath(basedir));
  const pkggraph = pkgutils.getPackageGraph(packages);
  const differ = new PkgDiffer(packages, pkggraph, {}, publishConfig);

  return differ.getUpdates()
    .map((update) => update.package)
    .filter((pkg) => !pkg.isPrivate());
}

export default function() {
  const pipeline = createPipeline(async function(ctx, next) {
    const {basedir="."} = ctx;
    const fullbase = resolve(basedir);
    const lerna = require(join(fullbase, "lerna.json"));

    if (lerna.version === "independent") {
      const packages = getUpdatedPackages(fullbase, lerna.publishConfig);
      ctx.packages = packages.slice(1);
    }

    await next(ctx);
    return;
  });

  pipeline.addLernaTask = function(name, fn, forceLoop) {
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

        const beforeKeys = Object.keys(newctx);
        await fn(newctx);

        const afterKeys = Object.keys(newctx);
        const changedCtx = pick(newctx, difference(afterKeys, beforeKeys));

        if (pkg.autorelease_ctx != null) {
          pkg.autorelease_ctx = Object.assign(pkg.autorelease_ctx, changedCtx);
        } else {
          pkg.autorelease_ctx = changedCtx;
        }
      }
    });
  };

  return pipeline;
}
