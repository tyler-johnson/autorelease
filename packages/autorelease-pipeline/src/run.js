
export default async function run(ctx) {
  const tasks = this._tasks.slice(0);

  while (tasks.length) {
    await tasks.shift().call(this, ctx);
  }

  return ctx;
}
