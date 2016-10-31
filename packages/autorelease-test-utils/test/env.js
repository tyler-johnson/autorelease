import tape from "tape";
import tapePromise from "tape-promise";
import {env} from "../";

const test = tapePromise(tape);

test("pushes new environment var", (t) => {
  t.plan(1);
  env.push("AR_TEST_ENV", "hello");
  t.equals(process.env.AR_TEST_ENV, "hello", "env var was set");
});

test("reset clears out variables", (t) => {
  t.plan(2);
  env.push("AR_TEST_ENV", "hello");
  t.equals(process.env.AR_TEST_ENV, "hello", "env var was set");
  env.reset();
  t.notOk(process.env.AR_TEST_ENV, "env var was unset");
});

test("pops env var and deletes when not previously set", (t) => {
  t.plan(3);
  env.reset();
  delete process.env.AR_TEST_ENV;
  env.push("AR_TEST_ENV", "hello");
  t.equals(process.env.AR_TEST_ENV, "hello", "env var was set");
  const last = env.pop("AR_TEST_ENV");
  t.notOk(process.env.AR_TEST_ENV, "env var was unset");
  t.equals(last, "hello", "return last value");
});

test("pops env var and sets to previous value", (t) => {
  t.plan(3);
  env.reset();
  process.env.AR_TEST_ENV = "previous value";
  env.push("AR_TEST_ENV", "hello");
  t.equals(process.env.AR_TEST_ENV, "hello", "env var was set");
  const last = env.pop("AR_TEST_ENV");
  t.equals(process.env.AR_TEST_ENV, "previous value", "env var was set to previous");
  t.equals(last, "hello", "return last value");
});

test("pushes and pops several values", (t) => {
  t.plan(7);
  env.reset();
  delete process.env.AR_TEST_ENV;
  env.push("AR_TEST_ENV", "one");
  env.push("AR_TEST_ENV", "two");
  env.push("AR_TEST_ENV", "three");
  t.equals(process.env.AR_TEST_ENV, "three", "env var had correct value");
  t.equals(env.pop("AR_TEST_ENV"), "three", "return last valued");
  t.equals(process.env.AR_TEST_ENV, "two", "env var had correct value");
  t.equals(env.pop("AR_TEST_ENV"), "two", "return last valued");
  t.equals(process.env.AR_TEST_ENV, "one", "env var had correct value");
  t.equals(env.pop("AR_TEST_ENV"), "one", "return last valued");
  t.notOk(process.env.AR_TEST_ENV, "env var is unset");
});
