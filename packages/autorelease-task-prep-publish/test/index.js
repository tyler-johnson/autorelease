import tape from "tape";
import tapePromise from "tape-promise";
import {Repository} from "autorelease-test-utils";
import prepPublish from "../src/index.js";

const test = tapePromise(tape);
const testrepo = new Repository(__dirname + "/testrepo");

test("sets new version in package.json", async (t) => {
  t.plan(2);

  await testrepo
    .create()
    .package({ name: "test-package", version: "1.0.0" })
    .flush();

  const ctx = await testrepo.context();
  ctx.version = { next: "2.0.0" };
  const pkg = await prepPublish(ctx);
  t.equals(pkg.version, "2.0.0", "returned package has correct version");

  const ppkg = JSON.parse(await testrepo.readFile("package.json"));
  t.equals(ppkg.version, "2.0.0", "package.json has correct version");
});

test("sets tag in package.json", async (t) => {
  t.plan(2);

  await testrepo
    .create()
    .package({ name: "test-package", version: "1.0.0" })
    .flush();

  const ctx = await testrepo.context({ tag: "next" });
  ctx.version = { next: "2.0.0" };
  const pkg = await prepPublish(ctx);
  t.equals(pkg.publishConfig.tag, "next", "returned package has correct tag");

  const ppkg = JSON.parse(await testrepo.readFile("package.json"));
  t.equals(ppkg.publishConfig.tag, "next", "package.json has correct tag");
});

test("does nothing in dry run", async (t) => {
  t.plan(2);

  await testrepo
    .create()
    .package({ name: "test-package", version: "1.0.0" })
    .flush();

  const ctx = await testrepo.context({ dryrun: true });
  ctx.version = { next: "2.0.0" };
  const pkg = await prepPublish(ctx);
  t.equals(pkg.version, "2.0.0", "returned package has correct version");

  const ppkg = JSON.parse(await testrepo.readFile("package.json"));
  t.equals(ppkg.version, "1.0.0", "package.json has old version");
});

test("removes version when not provided", async (t) => {
  t.plan(2);

  await testrepo
    .create()
    .package({ name: "test-package", version: "1.0.0" })
    .flush();

  const ctx = await testrepo.context({ dryrun: true });
  const pkg = await prepPublish(ctx);
  t.notOk(pkg.version, "returned package has no version");

  const ppkg = JSON.parse(await testrepo.readFile("package.json"));
  t.equals(ppkg.version, "1.0.0", "package.json has old version");
});

test("cleans up", async (t) => {
  await testrepo.destroy().flush();
  t.end();
});
