import resolve from "./resolve";

export default async function applyTasks(tasks, basedir, name) {
  let task = tasks;

  if (Array.isArray(tasks)) {
    tasks = tasks.slice(0);
    const pipe = name ? this.pipeline(name) : this;
    pipe.clear(); // array always overwrites existing tasks

    while (tasks.length) {
      await applyTasks.call(pipe, tasks.shift(), basedir);
    }

    return;
  } else if (typeof tasks === "object" && tasks != null) {
    const keys = Object.keys(tasks);
    const pipe = name ? this.pipeline(name) : this;

    while (keys.length) {
      const key = keys.shift();
      await applyTasks.call(pipe, tasks[key], basedir, key);
    }

    return;
  } else if (typeof tasks === "string") {
    task = await resolve("autorelease-task-", tasks, basedir);
  }

  if (typeof task !== "function") {
    return;
  }

  if (name) this.add(name, task);
  else this.add(task);
}
