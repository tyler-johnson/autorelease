import tape from "tape";
import tapePromise from "tape-promise";
import {Repository} from "autorelease-test-utils";
import npmRegistry from "../src/index.js";
import loadNpmConf from "../src/npmconf.js";

const test = tapePromise(tape);
const testrepo = new Repository(__dirname + "/testrepo");

test("gets registry from publishConfig", async (t) => {
  t.plan(2);
  const registry = "http://localhost:3676";

  await testrepo
    .create()
    .package({ publishConfig: { registry } })
    .flush();

  const ctx = await testrepo.context();
  t.equals(await npmRegistry(ctx), "//localhost:3676/", "returns nerf dart registry url");
  t.equals(ctx.registry, "//localhost:3676/", "sets registry url on context");
});

test("gets registry from .npmrc", async (t) => {
  t.plan(2);
  const registry = "http://localhost:3676";

  await testrepo
    .create()
    .package({ name: "test-package" })
    .flush();

  const conf = await loadNpmConf({ prefix: testrepo.dirname });
  conf.set("registry", registry, "project");
  await new Promise((resolv, reject) => {
    conf.save("project", (err) => err ? reject(err) : resolv());
  });

  const ctx = await testrepo.context();
  t.equals(await npmRegistry(ctx), "//localhost:3676/", "returns nerf dart registry url");
  t.equals(ctx.registry, "//localhost:3676/", "sets registry url on context");
});

test("cleans up", async (t) => {
  await testrepo.destroy().flush();
  t.end();
});
