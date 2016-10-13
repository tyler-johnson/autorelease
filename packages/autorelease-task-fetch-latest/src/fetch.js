import getRegistryUrl from "autorelease-task-npm-registry";
import getAuthToken from "registry-auth-token";
import {parse} from "url";
import {request} from "http";

export default async function(basedir=".", pkg={}, tags="latest") {
  if (!pkg.name) {
		throw "Missing a package name.";
	}

  const registry = await getRegistryUrl({ basedir, package: pkg });
  if (!registry) {
    throw new Error("Couldn't locate NPM registry url");
  }

  const auth = getAuthToken(registry);
  const {hostname,port,protocol,pathname} = parse(registry, false, true);
  const reqopts = {hostname,port,protocol};

  reqopts.method = "GET";
  reqopts.path = "/" + pathname
    .split("/")
    .filter(Boolean)
    .concat(pkg.name)
    .join("/");

  if (auth) reqopts.headers = {
    Authorization: [auth.type, auth.token].join(" ")
  };

  const pkgdata = await new Promise((resolve, reject) => {
    const req = request(reqopts);

    req.on("response", (resp) => {
      resp.on("error", reject);
      if (resp.statusCode === 404) {
        resp.resume();
        return resolve(null);
      }

      if (resp.statusCode >= 400) {
        resp.resume();
        return reject(new Error(`Registry responded with ${resp.statusCode} status`));
      }

      let data = "";
      resp.setEncoding("utf-8");
      resp.on("data", (d) => data += d);
      resp.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    });

    req.on("error", reject);
    req.end();
  });

  if (pkgdata == null || !pkgdata.versions) return null;

  tags = [].concat(tags);
  for (let i = 0; i < tags.length; i++) {
    if (pkgdata["dist-tags"]) {
      const disttag = pkgdata["dist-tags"][tags[i]];
      if (disttag) return pkgdata.versions[disttag];
    }

    const version = pkgdata.versions[tags[i]];
    if (version) return version;
  }

  return null;
}
