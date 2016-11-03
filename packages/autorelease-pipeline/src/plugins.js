import resolve from "./resolve";

export default async function(plugin, basedir) {
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

  if (typeof fn === "function") fn(this, opts);
}
