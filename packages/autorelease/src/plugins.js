import resolve from "./resolve";

export default async function(pipeline, plugins=[], basedir) {
  plugins = [].concat(plugins);

  while (plugins.length) {
    let plugin = plugins.shift();
    let opts, fn;

    if (Array.isArray(plugin)) [plugin,opts] = plugin;
    switch (typeof plugin) {
      case "string":
        fn = await resolve("autorelease-plugin-", plugin, basedir);
        break;
      case "function":
        fn = plugin;
        break;
      default:
        throw new Error(`Unexpected ${typeof plugin} from plugin`);
    }

    if (typeof fn.default === "function") fn = fn.default;
    if (typeof fn === "function") fn(pipeline, opts);
  }
}
