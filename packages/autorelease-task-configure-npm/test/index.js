import tape from "tape";
import tapePromise from "tape-promise";
import {Repository} from "autorelease-test-utils";
import configureNpm from "../src/index.js";

const test = tapePromise(tape);
const testrepo = new Repository(__dirname + "/testrepo");

test("creates .npmrc file with auth token and registry", async (t) => {
  t.plan(1);

  await testrepo
    .create()
    .package({
      name: "testrepo",
      publishConfig: {
        registry: "http://customnpmregistry.com"
      }
    })
    .flush();

  const ctx = await testrepo.context({ npmToken: "12345" });
  await configureNpm(ctx);

  const npmrc = await testrepo.readFile(".npmrc");
  t.equals(npmrc, "//customnpmregistry.com/:_authToken=12345\n", "had npmrc file with auth token");
});

test("accepts npm token from environment", async (t) => {
  t.plan(1);

  await testrepo
    .create()
    .package({
      name: "testrepo",
      publishConfig: {
        registry: "http://customnpmregistry.com"
      }
    })
    .flush();

  process.env.NPM_TOKEN = "12345";
  const ctx = await testrepo.context();
  await configureNpm(ctx);

  const npmrc = await testrepo.readFile(".npmrc");
  t.equals(npmrc, "//customnpmregistry.com/:_authToken=12345\n", "had npmrc file with auth token");
});

test("doesn't do anything when no npm token is provided", async (t) => {
  t.plan(1);

  await testrepo
    .create()
    .package({ name: "testrepo" })
    .flush();

  delete process.env.NPM_TOKEN;
  const ctx = await testrepo.context();
  await configureNpm(ctx);

  try {
    await testrepo.readFile(".npmrc");
    t.fail(".npmrc file exists");
  } catch(e) {
    t.equals(e.code, "ENOENT", ".npmrc doesn't exist");
  }
});

test("doesn't do anything in dryrun mode", async (t) => {
  t.plan(1);

  await testrepo
    .create()
    .package({ name: "testrepo" })
    .flush();

  const ctx = await testrepo.context({ dryrun: true, npmToken: "12345" });
  await configureNpm(ctx);

  try {
    await testrepo.readFile(".npmrc");
    t.fail(".npmrc file exists");
  } catch(e) {
    t.equals(e.code, "ENOENT", ".npmrc doesn't exist");
  }
});

test("cleans up", async (t) => {
  await testrepo.destroy().flush();
  t.end();
});
