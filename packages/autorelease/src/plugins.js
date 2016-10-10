import resolve from "./resolve";

export default async function(pipeline, plugins=[], basedir) {
  plugins = plugins.slice(0);

  while (plugins.length) {
    let plugin = plugins.shift();
    let opts;
    if (Array.isArray(plugin)) [plugin,opts] = plugin;
    let fn = await resolve("autorelease-plugin-", plugin, basedir);
    if (typeof fn.default === "function") fn = fn.default;
    if (typeof fn === "function") fn(pipeline, opts);
  }
}
