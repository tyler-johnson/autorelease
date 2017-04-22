import yaml from "yaml-parser";
import ini from "ini";

const parsers = [
  (str) => JSON.parse(str),
  (str) => yaml.safeLoad(str),
  (str) => ini.parse(str)
];

export default function(str) {
  const p = parsers.slice(0);

  while (p.length) {
    try {
      return p.shift()(str);
    } catch(e) {
      continue;
    }
  }

  throw new Error("Could not parse this config.");
}
