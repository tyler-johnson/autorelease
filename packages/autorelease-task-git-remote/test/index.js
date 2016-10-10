import tape from "tape";
import tapePromise from "tape-promise";
import {Repository} from "autorelease-test-utils";
import gitRemote from "../src/index.js";

const test = tapePromise(tape);
const testrepo = new Repository(__dirname + "/testrepo");

test("gets repo url from package.json respository field", async (t) => {
  t.plan(2);

  await testrepo
    .create()
    .package({ repository: { url: "https://notarealhost/package.git" } })
    .flush();

  const ctx = await testrepo.context();
  const remote = await gitRemote(ctx);

  t.equals(remote, ctx.gitUrl, "set git url on context");
  t.equals(remote.href, "https://notarealhost/package.git", "correct href");
});

test("gets repo url from git remote", async (t) => {
  t.plan(2);

  await testrepo
    .create()
    .command("git remote add origin https://notarealhost/package.git")
    .flush();

  const ctx = await testrepo.context();
  const remote = await gitRemote(ctx);

  t.equals(remote, ctx.gitUrl, "set git url on context");
  t.equals(remote.href, "https://notarealhost/package.git", "correct href");
});

test("does nothing when there is no git remote", async (t) => {
  t.plan(2);

  await testrepo
    .create()
    .flush();

  const ctx = await testrepo.context();
  const remote = await gitRemote(ctx);

  t.ok(remote == null, "didn't return a git url");
  t.ok(ctx.remote == null, "didn't set git url on context");
});

test("cleans up", async (t) => {
  await testrepo.destroy().flush();
  t.end();
});
