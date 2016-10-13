import tape from "tape";
import tapePromise from "tape-promise";
import {Repository} from "autorelease-test-utils";
import {Registry} from "registry-mock";
import superagent from "superagent";
import configureNpm from "autorelease-task-configure-npm";
import npmPublish from "../src/index.js";

const test = tapePromise(tape);
const testrepo = new Repository(__dirname + "/testrepo");
const registry = new Registry({ http: 0 });
registry.listen();
const registryUrl = "http://localhost:" + registry.server.address().port;

test("publishes npm package", async (t) => {
  t.plan(7);
  const version = "23.9.456-beta.5";

  await testrepo
    .create()
    .package({
      name: "test-package",
      version: version,
      publishConfig: { registry: registryUrl }
    })
    .flush();

  registry.server.once("request", function (req) {
    t.equals(req.method, "PUT", "made PUT request");
    t.equals(req.url, "/test-package", "sent request to correct endpoint");

    superagent.get(registryUrl + req.url)
      .set({
        "x-fetch-cache": true,
        "x-clear-cache": true
      })
      .then((r) => {
        t.equals(r.body.name, "test-package", "uploaded package has correct name");
        t.deepEquals(r.body["dist-tags"], { latest: version }, "has dist tags");
        t.ok(r.body.versions[version], "has uploaded version");
        t.equals(r.body.versions[version].name, "test-package", "version has correct name");
        t.equals(r.body.versions[version].version, version, "version has correct version");
      })
      .catch(t.error);
  });

  const ctx = await testrepo.context({ npmToken: "12345" });
  await configureNpm(ctx);
  await npmPublish(ctx);
});

test("does nothing in dry run", async (t) => {
  t.plan(1);
  const version = "23.9.456-beta.5";

  await testrepo
    .create()
    .package({
      name: "test-package",
      version: version,
      publishConfig: { registry: registryUrl }
    })
    .flush();

  registry.server.once("request", function() {
    t.fail("published!");
  });

  const ctx = await testrepo.context({ npmToken: "12345" });
  await configureNpm(ctx);
  ctx.dryrun = true;
  await npmPublish(ctx);
  t.pass("didn't publish");
});

test("cleans up", async (t) => {
  registry.close();
  await testrepo.destroy().flush();
  t.end();
});
