import tape from "tape";
import tapePromise from "tape-promise";
import {Repository} from "autorelease-test-utils";

const verifyBranch = require("./");
const test = tapePromise(tape);
const testrepo = new Repository(__dirname + "/testrepo");

test("throws error on incorrect branch", async (t) => {
  t.plan(1);

  await testrepo
    .create()
    .branch("dev")
    .flush();

  try {
    await verifyBranch({
      basedir: testrepo.dirname,
      options: { branch: "master" }
    });

    t.fail("didn't throw an error");
  } catch(e) {
    t.equals(typeof e, "string", "threw an error");
  }
});

test("does nothing on correct branch", async (t) => {
  t.plan(1);

  await testrepo
    .create()
    .branch("master")
    .flush();

  await verifyBranch({
    basedir: testrepo.dirname,
    options: { branch: "master" }
  });

  t.pass("didn't throw an error");
});

test("works when multiple branches are specified", async (t) => {
  t.plan(1);

  await testrepo
    .create()
    .branch("master")
    .flush();

  await verifyBranch({
    basedir: testrepo.dirname,
    options: { branch: ["master","dev"] }
  });

  t.pass("didn't throw an error");
});


test("cleans up", async (t) => {
  await testrepo.destroy().flush();
  t.end();
});
