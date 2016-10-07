import resolve from "./resolve";

export default async function(pipeline, plugins=[], basedir) {
  plugins = await resolve("autorelease-plugin-", plugins, basedir);
  plugins.forEach(plugin => {
    if (typeof plugin === "function") plugin(pipeline);
    else if (typeof plugin.default === "function") plugin.default(pipeline);
  });
}
