import _resolve from "resolve";
import {resolve as pathResolve} from "path";
import {startsWith} from "lodash";

function nodeResolve(name, opts) {
  return new Promise((resolv, reject) => {
    _resolve(name, opts, (err, r) => {
      err ? reject(err) : resolv(r);
    });
  });
}

const pathex = /^\.{0,2}\/|^\.{1,2}$/;
const missing = /cannot find module/i;

export default async function resolve(prefix, name, basedir) {
  if (Array.isArray(name)) {
    return Promise.all(name
      .filter(v => typeof v === "string")
      .map(v => v.trim())
      .filter(Boolean)
      .map((n) => resolve(prefix, n, basedir)));
  }

  let filepath;

  if (pathex.test(name)) {
    filepath = pathResolve(basedir, name);
  } else {
    try {
      filepath = await nodeResolve(name, { basedir });
    } catch(e) {
      if (missing.test(e.toString()) && !startsWith(name, prefix)) {
        filepath = await nodeResolve(prefix + name, { basedir });
      } else {
        throw e;
      }
    }
  }

  return require(filepath);
}
