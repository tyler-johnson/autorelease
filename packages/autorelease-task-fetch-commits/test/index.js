import tape from "tape";
import tapePromise from "tape-promise";
import {Repository} from "autorelease-test-utils";
import fetchCommits from "../src/index.js";

const test = tapePromise(tape);
const testrepo = new Repository(__dirname + "/testrepo");

test("throws error when there are no commits", async (t) => {
  t.plan(1);
  await testrepo.create().flush();

  const ctx = await testrepo.context();

  try {
    await fetchCommits(ctx);
    t.fail("did not throw error");
  } catch(e) {
    t.ok(e, "threw error");
  }
});

test("grabs all commits when the package hasn't been released", async (t) => {
  t.plan(2);
  await testrepo
    .create()
    .package({ name: "testrepo" })
    .commit("fix: initial commit")
    .flush();

  const ctx = await testrepo.context();
  const commits = await fetchCommits(ctx);

  t.equals(commits.length, 1, "has one commit");
  t.equals(commits[0].header, "fix: initial commit", "commit has correct message");
});

test("grabs all commits since the last time the package was released", async (t) => {
  t.plan(2);
  await testrepo
    .create()
    .package({ name: "testrepo" })
    .commit("fix: initial commit")
    .flush();

  const gitHead = (await testrepo.exec("git rev-parse HEAD")).trim();

  await testrepo
    .file("LICENSE", "no license")
    .commit("fix: add license")
    .flush();

  const ctx = await testrepo.context();
  ctx.latest = { gitHead };
  const commits = await fetchCommits(ctx);

  t.equals(commits.length, 1, "has one commit");
  t.equals(commits[0].header, "fix: add license", "commit has correct message");
});

test("cleans up", async (t) => {
  await testrepo.destroy().flush();
  t.end();
});
