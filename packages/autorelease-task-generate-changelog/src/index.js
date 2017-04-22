import fetchCommits from "autorelease-task-fetch-commits";
import toStream from "stream-array";
import ccwriter from "conventional-changelog-writer";
import mergeConfig from "conventional-changelog-core/lib/merge-config";
import through from "through2";

export default async function(ctx) {
  const {options={},packageFile} = ctx;
  const {changelog=true,preset} = options;
  if (!changelog) return;

  let config;
  if (preset) {
    try {
      config = require('conventional-changelog-' + preset.toLowerCase());
    } catch (err) {
      console.warn('Changelog Preset: "' + preset + '" does not exist');
    }
  }

  const conf = await mergeConfig({
    pkg: { path: packageFile },
    config
  });

  const commits = Array.isArray(ctx.commits) ? ctx.commits :
    await fetchCommits(ctx, conf.gitRawCommitsOpts, conf.parserOpts);

  const clog = toStream(commits)
    .pipe(through.obj(function(chunk, enc, cb) {
      try {
        conf.options.transform.call(this, chunk, cb);
      } catch (err) {
        cb(err);
      }
    }))
    .pipe(ccwriter(conf.context, conf.writerOpts));

  let data = "";
  clog.setEncoding("utf-8");
  clog.on("data", (c) => data += c);

  await new Promise((resolve, reject) => {
    clog.on("end", resolve);
    clog.on("error", reject);
  });

  ctx.changelog = data;
  return data;
}
