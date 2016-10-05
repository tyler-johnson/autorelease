import tape from "tape";
import tapePromise from "tape-promise";

const test = tapePromise(tape);
const {createPipeline} = require("./");

test("creates and runs empty pipeline", async (t) => {
  t.plan(2);

  const pipes = createPipeline();
  t.equals(typeof pipes, "function", "created pipeline");

  const ctx = {};
  t.equals(await pipes(ctx), ctx, "running pipeline returns context");
});

test("adds tasks to pipeline", async (t) => {
  t.plan(2);

  const pipes = createPipeline();
  pipes.add(function(c) { c[0]++; });
  pipes.add(function(c) { c[1]++; });

  const counts = [0,0];
  await pipes(counts);

  t.equals(counts[0], 1, "ran first task once");
  t.equals(counts[1], 1, "ran second task once");
});

test("creates child pipeline", async (t) => {
  t.plan(2);

  const pipes = createPipeline();
  const child = pipes.pipeline("child");
  t.equals(typeof child, "function", "child is pipeline");

  child.add(function() { t.pass("ran child task"); });
  await pipes({});

  t.end();
});

test("creates deep child pipeline using path syntax", async (t) => {
  t.plan(2);

  const pipes = createPipeline();
  const child = pipes.pipeline("deep.child");
  t.equals(typeof child, "function", "deep child is pipeline");

  child.add(function() { t.pass("ran deep child task"); });
  await pipes({});

  t.end();
});
