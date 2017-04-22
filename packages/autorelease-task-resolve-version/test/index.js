import tape from "tape";
import tapePromise from "tape-promise";
import {Repository} from "autorelease-test-utils";
import fetchCommits from "autorelease-task-fetch-commits";
import resolveVersion from "../src/index.js";

const test = tapePromise(tape);
const testrepo = new Repository(__dirname + "/testrepo");

test("resolves patch version", async (t) => {
  t.plan(2);
  await testrepo
    .create()
    .package({ name: "test-package" })
    .commit("feat: initial commit")
    .flush();

  const ctx = await testrepo.context({ version: "2.0.0" });

  ctx.latest = {
    name: "test-package",
    version: "1.0.0",
    gitHead: (await testrepo.exec("git rev-parse HEAD")).trim()
  };

  await testrepo
    .commit("fix: a fix")
    .commit("fix: another fix")
    .flush();

  await fetchCommits(ctx);
  const version = await resolveVersion(ctx);

  const expected = {
    type: "patch",
    pre: null,
		previous: "1.0.0",
		next: "1.0.1"
  };

  t.deepEquals(version, expected, "returns version object");
  t.deepEquals(ctx.version, expected, "bumps version by patch");
});

test("resolves minor version", async (t) => {
  t.plan(2);
  await testrepo
    .create()
    .package({ name: "test-package" })
    .commit("fix: initial commit")
    .flush();

  const ctx = await testrepo.context({ version: "2.0.0" });

  ctx.latest = {
    name: "test-package",
    version: "1.0.0",
    gitHead: (await testrepo.exec("git rev-parse HEAD")).trim()
  };

  await testrepo
    .commit("feat: a feature")
    .commit("fix: some fix")
    .flush();

  await fetchCommits(ctx);
  const version = await resolveVersion(ctx);

  const expected = {
    type: "minor",
    pre: null,
		previous: "1.0.0",
		next: "1.1.0"
  };

  t.deepEquals(version, expected, "returns version object");
  t.deepEquals(ctx.version, expected, "bumps version by minor");
});

test("resolves major version", async (t) => {
  t.plan(2);
  await testrepo
    .create()
    .package({ name: "test-package" })
    .commit("fix: initial commit")
    .flush();

  const ctx = await testrepo.context({ version: "2.0.0" });

  ctx.latest = {
    name: "test-package",
    version: "1.0.0",
    gitHead: (await testrepo.exec("git rev-parse HEAD")).trim()
  };

  await testrepo
    .commit("fix: an incredible change\nBREAKING CHANGE: everything is broken")
    .commit("feat: a new feature")
    .commit("fix: another fix")
    .flush();

  await fetchCommits(ctx);
  const version = await resolveVersion(ctx);

  const expected = {
    type: "major",
    pre: null,
		previous: "1.0.0",
		next: "2.0.0"
  };

  t.deepEquals(version, expected, "returns version object");
  t.deepEquals(ctx.version, expected, "bumps version by major");
});

test("throws error if there no changes", async (t) => {
  t.plan(1);
  await testrepo
    .create()
    .package({ name: "test-package" })
    .commit("feat: initial commit")
    .flush();

  const ctx = await testrepo.context({ version: "2.0.0" });

  ctx.latest = {
    name: "test-package",
    version: "1.0.0",
    gitHead: (await testrepo.exec("git rev-parse HEAD")).trim()
  };

  await fetchCommits(ctx);

  try {
    await resolveVersion(ctx);
    t.fail("didn't throw error");
  } catch(e) {
    t.ok(e, "threw error");
  }
});

test("sets initial version to 1.0.0 without base version", async (t) => {
  t.plan(2);
  await testrepo
    .create()
    .package({ name: "test-package" })
    .commit("fix: initial commit")
    .flush();

  const ctx = await testrepo.context();

  await fetchCommits(ctx);
  const version = await resolveVersion(ctx);

  const expected = {
    type: "major",
    pre: null,
		previous: void 0,
		next: "1.0.0"
  };

  t.deepEquals(version, expected, "returns version object");
  t.deepEquals(ctx.version, expected, "bumps version to 1.0.0");
});

test("sets initial version to base version when there is no latest", async (t) => {
  t.plan(2);
  await testrepo
    .create()
    .package({ name: "test-package" })
    .commit("fix: initial commit")
    .flush();

  const ctx = await testrepo.context({ version: "1.0.0" });

  await fetchCommits(ctx);
  const version = await resolveVersion(ctx);

  const expected = {
    type: "patch",
    pre: null,
		previous: "1.0.0",
		next: "1.0.1"
  };

  t.deepEquals(version, expected, "returns version object");
  t.deepEquals(ctx.version, expected, "bumps version by patch");
});

test("resolves prerelease version", async (t) => {
  t.plan(2);
  await testrepo
    .create()
    .package({ name: "test-package" })
    .commit("fix: initial commit")
    .flush();

  const ctx = await testrepo.context({
    version: "2.0.0",
    prerelease: "alpha"
  });

  ctx.latest = {
    name: "test-package",
    version: "1.0.0",
    gitHead: (await testrepo.exec("git rev-parse HEAD")).trim()
  };

  await testrepo
    .commit("feat: a new feature")
    .commit("fix: another fix")
    .flush();

  await fetchCommits(ctx);
  const version = await resolveVersion(ctx);

  const expected = {
    type: "preminor",
    pre: "alpha",
		previous: "1.0.0",
		next: "1.1.0-alpha.0"
  };

  t.deepEquals(version, expected, "returns version object");
  t.deepEquals(ctx.version, expected, "bumps version by preminor");
});

test("bumps prerelease version", async (t) => {
  t.plan(2);
  await testrepo
    .create()
    .package({ name: "test-package" })
    .commit("fix: initial commit")
    .flush();

  const ctx = await testrepo.context({
    version: "2.0.0",
    prerelease: "alpha"
  });

  ctx.latest = {
    name: "test-package",
    version: "1.0.0-alpha.0",
    gitHead: (await testrepo.exec("git rev-parse HEAD")).trim()
  };

  await testrepo
    .commit("fix: some fix")
    .commit("fix: another fix")
    .flush();

  await fetchCommits(ctx);
  const version = await resolveVersion(ctx);

  const expected = {
    type: "prerelease",
    pre: "alpha",
		previous: "1.0.0-alpha.0",
		next: "1.0.0-alpha.1"
  };

  t.deepEquals(version, expected, "returns version object");
  t.deepEquals(ctx.version, expected, "bumps version by prerelease");
});

test("changes prerelease type", async (t) => {
  t.plan(2);
  await testrepo
    .create()
    .package({ name: "test-package" })
    .commit("fix: initial commit")
    .flush();

  const ctx = await testrepo.context({
    version: "2.0.0",
    prerelease: "beta"
  });

  ctx.latest = {
    name: "test-package",
    version: "1.0.0-alpha.2",
    gitHead: (await testrepo.exec("git rev-parse HEAD")).trim()
  };

  await testrepo
    .commit("fix: some fix")
    .commit("fix: another fix")
    .flush();

  await fetchCommits(ctx);
  const version = await resolveVersion(ctx);

  const expected = {
    type: "prerelease",
    pre: "beta",
		previous: "1.0.0-alpha.2",
		next: "1.0.0-beta.0"
  };

  t.deepEquals(version, expected, "returns version object");
  t.deepEquals(ctx.version, expected, "bumps version by prerelease");
});

test("exits prerelease without changes", async (t) => {
  t.plan(2);
  await testrepo
    .create()
    .package({ name: "test-package" })
    .commit("fix: initial commit")
    .flush();

  const ctx = await testrepo.context({ version: "2.0.0" });

  ctx.latest = {
    name: "test-package",
    version: "1.0.0-alpha.2",
    gitHead: (await testrepo.exec("git rev-parse HEAD")).trim()
  };

  await fetchCommits(ctx);
  const version = await resolveVersion(ctx);

  const expected = {
    type: "patch",
    pre: null,
		previous: "1.0.0-alpha.2",
		next: "1.0.0"
  };

  t.deepEquals(version, expected, "returns version object");
  t.deepEquals(ctx.version, expected, "bumps version to non-prerelease");
});

test("cleans up", async (t) => {
  await testrepo.destroy().flush();
  t.end();
});
