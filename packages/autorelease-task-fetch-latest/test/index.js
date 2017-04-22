import tape from "tape";
import tapePromise from "tape-promise";
import {Repository} from "autorelease-test-utils";
import fetchLatest from "../src/index.js";

const test = tapePromise(tape);
const testrepo = new Repository(__dirname + "/testrepo");

test("grabs the latest version of package", async (t) => {
  t.plan(3);

  await testrepo
    .create()
    .package({ name: "test-npm-update" })
    .flush();

  const ctx = await testrepo.context();
  await fetchLatest(ctx);

  t.ok(ctx.latest, "has latest package");
  t.equals(ctx.latest.name, "test-npm-update", "has correct package name");
  t.equals(ctx.latest.version, "1.0.1", "package has correct version");
});

test("throws error if package is missing a name", async (t) => {
  t.plan(1);

  await testrepo
    .create()
    .package({})
    .flush();

  const ctx = await testrepo.context();

  try {
    await fetchLatest(ctx);
    t.fail("did not throw an error");
  } catch(e) {
    t.ok(e, "threw an error");
  }
});

test("fetches package by dist tag", async (t) => {
  t.plan(3);

  await testrepo
    .create()
    .package({ name: "test-npm-update" })
    .flush();

  const ctx = await testrepo.context({ tag: "canary" });
  await fetchLatest(ctx);

  t.ok(ctx.latest, "has latest package");
  t.equals(ctx.latest.name, "test-npm-update", "has correct package name");
  t.equals(ctx.latest.version, "1.0.2", "package has correct version");
});

test("fetches package by specific version", async (t) => {
  t.plan(3);

  await testrepo
    .create()
    .package({ name: "test-npm-update" })
    .flush();

  const ctx = await testrepo.context({ version: "1.0.0" });
  await fetchLatest(ctx);

  t.ok(ctx.latest, "has latest package");
  t.equals(ctx.latest.name, "test-npm-update", "has correct package name");
  t.equals(ctx.latest.version, "1.0.0", "package has correct version");
});

test("cleans up", async (t) => {
  await testrepo.destroy().flush();
  t.end();
});
