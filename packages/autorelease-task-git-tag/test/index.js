import tape from "tape";
import tapePromise from "tape-promise";
import {Repository} from "autorelease-test-utils";
import gitTag from "../src/index.js";

const test = tapePromise(tape);
const testrepo = new Repository(__dirname + "/testrepo");

test("tags with next version", async (t) => {
  t.plan(2);

  await testrepo
    .create()
    .commit("fix: epic bugfix")
    .flush();

  const ctx = await testrepo.context();
  ctx.version = { next: "1.0.0-alpha.0" };
  t.equals(await gitTag(ctx), "v1.0.0-alpha.0", "returned new version");
  t.equals(await testrepo.exec("git tag"), "v1.0.0-alpha.0\n", "tagged with correct version");
});

test("tags with version in package.json", async (t) => {
  t.plan(2);

  await testrepo
    .create()
    .package({ version: "1.0.0-alpha.0" })
    .commit("fix: epic bugfix")
    .flush();

  const ctx = await testrepo.context();
  t.equals(await gitTag(ctx), "v1.0.0-alpha.0", "returned new version");
  t.equals(await testrepo.exec("git tag"), "v1.0.0-alpha.0\n", "tagged with correct version");
});

test("does not tag in dryrun mode", async (t) => {
  t.plan(2);

  await testrepo
    .create()
    .package({ version: "1.0.0-alpha.0" })
    .commit("fix: epic bugfix")
    .flush();

  const ctx = await testrepo.context({ dryrun: true });
  t.equals(await gitTag(ctx), "v1.0.0-alpha.0", "returned new version");
  t.equals(await testrepo.exec("git tag"), "", "git tag was empty");
});

test("cleans up", async (t) => {
  await testrepo.destroy().flush();
  t.end();
});
