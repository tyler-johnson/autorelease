import tape from "tape";
import tapePromise from "tape-promise";
import {Repository,env} from "autorelease-test-utils";
import travisPlugin from "../src/index.js";
import {createPipeline} from "autorelease";

const test = tapePromise(tape);
const testrepo = new Repository(__dirname + "/testrepo");

test("throws when not in travis environment", async (t) => {
  t.plan(1);

  await testrepo
    .create()
    .flush();

  const ctx = await testrepo.context();
  const autorelease = await createPipeline(ctx);
  travisPlugin(autorelease);

  env.push("TRAVIS", void 0);

  try {
    await autorelease.pipeline("verify")(ctx);
    t.fail("did not throw error");
  } catch(e) {
    t.ok(e.match(/not running on Travis CI/i), "threw error");
  } finally {
    env.pop("TRAVIS");
  }
});

test("throws error in travis pull request scenario", async (t) => {
  t.plan(1);

  await testrepo
    .create()
    .flush();

  const ctx = await testrepo.context();
  const autorelease = await createPipeline(ctx);
  travisPlugin(autorelease);

  env.push("TRAVIS", "true");
  env.push("TRAVIS_PULL_REQUEST", "true");

  try {
    await autorelease.pipeline("verify")(ctx);
    t.fail("did not throw error");
  } catch(e) {
    t.ok(e.match(/triggered by a pull request/i), "threw error");
  } finally {
    env.pop("TRAVIS");
    env.pop("TRAVIS_PULL_REQUEST");
  }
});

test("throws error in travis git tag scenario", async (t) => {
  t.plan(1);

  await testrepo
    .create()
    .flush();

  const ctx = await testrepo.context();
  const autorelease = await createPipeline(ctx);
  travisPlugin(autorelease);

  env.push("TRAVIS", "true");
  env.push("TRAVIS_PULL_REQUEST", "false");
  env.push("TRAVIS_TAG", "true");

  try {
    await autorelease.pipeline("verify")(ctx);
    t.fail("did not throw error");
  } catch(e) {
    t.ok(e.match(/triggered by a git tag/i), "threw error");
  } finally {
    env.pop("TRAVIS");
    env.pop("TRAVIS_PULL_REQUEST");
    env.pop("TRAVIS_TAG");
  }
});

test("throws error on incorrect travis branch", async (t) => {
  t.plan(1);

  await testrepo
    .create()
    .flush();

  const ctx = await testrepo.context({ branch: ["master"] });
  const autorelease = await createPipeline(ctx);
  travisPlugin(autorelease);

  env.push("TRAVIS", "true");
  env.push("TRAVIS_PULL_REQUEST", "false");
  env.push("TRAVIS_BRANCH", "dev");

  try {
    await autorelease.pipeline("verify")(ctx);
    t.fail("did not throw error");
  } catch(e) {
    t.ok(e.match(/triggered on branch/i), "threw error");
  } finally {
    env.pop("TRAVIS");
    env.pop("TRAVIS_PULL_REQUEST");
    env.pop("TRAVIS_BRANCH");
  }
});

test("doesn't throw error when environment checks out", async (t) => {
  t.plan(1);

  await testrepo
    .create()
    .flush();

  const ctx = await testrepo.context({
    branch: ["master"],
    travis: { waitForJobs: false }
  });

  const autorelease = await createPipeline(ctx);
  travisPlugin(autorelease);

  env.push("TRAVIS", "true");
  env.push("TRAVIS_PULL_REQUEST", "false");
  env.push("TRAVIS_BRANCH", "master");

  try {
    await autorelease.pipeline("verify")(ctx);
    t.pass("did not throw error");
  } finally {
    env.pop("TRAVIS");
    env.pop("TRAVIS_PULL_REQUEST");
    env.pop("TRAVIS_BRANCH");
  }
});

test("cleans up", async (t) => {
  await testrepo.destroy().flush();
  t.end();
});
