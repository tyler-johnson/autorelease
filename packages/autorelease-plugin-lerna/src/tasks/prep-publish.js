import createPipeline from "../pipeline";
import prepPublish from "autorelease-task-prep-publish";
import {get} from "lodash";

const pipeline = createPipeline();
export default pipeline;

// write version to outer package.json for post step
pipeline.add("prepLernaGlobal", async (ctx) => {
  // get all versions
  ctx.package_versions = ctx.packages.reduce((v, p) => {
    let ver = get(p, "autorelease_ctx.version.next");
    if (!ver) ver = get(p, "autorelease_ctx.latest.version");
    if (ver) v[p.name] = ver;
    return v;
  }, {});

  // non-independent mode, bump outer version normally
  if (!ctx.independent) {
    await prepPublish(ctx);
    return;
  }

  // find version for "main" package
  let version;
  ctx.updated.some(pkg => {
    if (pkg.name === ctx.package.name) {
      if (pkg.autorelease_ctx) version = pkg.autorelease_ctx.version;
      return true;
    }
  });

  // write new version to outer package.json
  await prepPublish({ ...ctx, version });
});

// write new versions to all updated packages
pipeline.addLernaTask("prepPackages", async (ctx) => {
  const {package:pkg,package_versions:versions} = ctx;
  const deps = pkg.dependencies || {};

  pkg.dependencies = Object.keys(deps).reduce((d, key) => {
    d[key] = versions[key] ? "^" + versions[key] : deps[key];
    return d;
  }, {});

  await prepPublish(ctx);
}, {
  updatedOnly: true,
  forceLoop: true
});
