import tape from "tape";
import tapePromise from "tape-promise";
import {Repository} from "../";
import fs from "fs";
import promisify from "es6-promisify";

const testdir = __dirname + "/testrepo";
const test = tapePromise(tape);
const stat = promisify(fs.stat);

test("creates and destroys repository", async (t) => {
  t.plan(7);

  const repo = new Repository(testdir);
  await repo.create().flush();

  const dirstat = await stat(testdir);
  t.ok(dirstat.isDirectory(), "created directory");

  const gitstat = await stat(testdir + "/.git");
  t.ok(gitstat.isDirectory(), "initiated git repo");

  const pkgstat = await stat(testdir + "/package.json");
  t.ok(pkgstat.isFile(), "created package.json file");

  const rcstat = await stat(testdir + "/.autoreleaserc");
  t.ok(rcstat.isFile(), "created .autoreleaserc file");

  await repo.json("test.json", { foo: "bar" }).flush();
  const teststat = await stat(testdir + "/test.json");
  t.ok(teststat.isFile(), "added test.json file");

  await repo.create().flush();
  try {
    await stat(testdir + "/test.json");
    t.fail("didn't delete original repo on recreate");
  } catch(e) {
    if (e.code !== "ENOENT") throw e;
    t.pass("creating again deleted original repo");
  }

  await repo.destroy().flush();
  try {
    await stat(testdir);
    t.fail("didn't delete repo on destroy");
  } catch(e) {
    if (e.code !== "ENOENT") throw e;
    t.pass("deleted repo on destroy");
  }
});

test("adds generic files to repo", async (t) => {
  t.plan(4);

  const repo = new Repository(testdir);
  await repo.create().flush();

  await repo.file("foo.md", "# markdown file").flush();
  const mdstat = await stat(testdir + "/foo.md");
  t.ok(mdstat.isFile(), "added foo.md file");
  const mddata = await repo.readFile("foo.md");
  t.equals(mddata, "# markdown file", "foo.md had correct contents");

  await repo.json("test.json", { foo: "bar" }).flush();
  const jsonstat = await stat(testdir + "/test.json");
  t.ok(jsonstat.isFile(), "added test.json file");
  const jsondata = await repo.readFile("test.json");
  t.equals(jsondata, JSON.stringify({ foo: "bar" }, null, 2) + "\n", "test.json had correct contents");
});
