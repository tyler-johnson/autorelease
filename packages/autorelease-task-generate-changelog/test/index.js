import tape from "tape";
import tapePromise from "tape-promise";
import {Repository} from "autorelease-test-utils";
import generateChangelog from "../src/index.js";

const test = tapePromise(tape);
const testrepo = new Repository(__dirname + "/testrepo");

test("generates changelog from commits", async (t) => {
  t.plan(4);

  await testrepo
    .create()
    .package({ version: "1.0.0-alpha.0" })
    .commit("fix: first commit")
    .commit("fix: second commit")
    .flush();

  const ctx = await testrepo.context();
  const changelog = await generateChangelog(ctx);

  t.equals(changelog, ctx.changelog, "set the changelog on context");
  t.ok(changelog.indexOf("1.0.0-alpha.0") > -1, "changelog contains version");
  t.ok(changelog.indexOf("first commit") > -1, "changelog contains first commit");
  t.ok(changelog.indexOf("second commit") > -1, "changelog contains second commit");
});

test("does nothing when changelogs are disabled", async (t) => {
  t.plan(2);

  await testrepo
    .create()
    .package({ version: "1.0.0-alpha.0" })
    .commit("fix: first commit")
    .commit("fix: second commit")
    .flush();

  const ctx = await testrepo.context({ changelog: false });
  const changelog = await generateChangelog(ctx);

  t.ok(changelog == null, "didn't return a changelog");
  t.ok(ctx.changelog == null, "didn't set changelog on context");
});

test("cleans up", async (t) => {
  await testrepo.destroy().flush();
  t.end();
});
