import tape from "tape";
import tapePromise from "tape-promise";
import {Repository} from "autorelease-test-utils";
import writeChangelog from "../src/index.js";

const test = tapePromise(tape);
const testrepo = new Repository(__dirname + "/testrepo");

test("prepends to default changelog file", async (t) => {
  t.plan(1);
  await testrepo
    .create()
    .file("changelog.md", "+++")
    .flush();

  const ctx = await testrepo.context();
  ctx.changelog = "---";
  await writeChangelog(ctx);

  const changelog = await testrepo.readFile("changelog.md");
  t.equals(changelog, "---\n+++", "correct contents");
});

test("prepends to custom changelog file", async (t) => {
  t.plan(2);
  await testrepo
    .create()
    .file("changelog.md", "+++")
    .file("custom.md", "%%%")
    .flush();

  const ctx = await testrepo.context({ changelogFile: "custom.md" });
  ctx.changelog = "---";
  await writeChangelog(ctx);

  const changelog = await testrepo.readFile("custom.md");
  t.equals(changelog, "---\n%%%", "correct contents");

  const old = await testrepo.readFile("changelog.md");
  t.equals(old, "+++", "default changelog file did not change");
});

test("creates changelog file if doesn't exist", async (t) => {
  t.plan(1);
  await testrepo
    .create()
    .flush();

  const ctx = await testrepo.context();
  ctx.changelog = "---";
  await writeChangelog(ctx);

  const changelog = await testrepo.readFile("changelog.md");
  t.equals(changelog, "---\n", "correct contents");
});

test("does nothing in dry run mode", async (t) => {
  t.plan(1);
  await testrepo
    .create()
    .flush();

  const ctx = await testrepo.context({ dryrun: true });
  ctx.changelog = "---";
  await writeChangelog(ctx);

  try {
    await testrepo.readFile("changelog.md");
    t.fail("changelog file exists");
  } catch(e) {
    t.equals(e.code, "ENOENT", "changelog file does not exist");
  }
});

test("cleans up", async (t) => {
  await testrepo.destroy().flush();
  t.end();
});
