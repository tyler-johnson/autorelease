import resolve from "./resolve";

export default async function applyTasks(pipeline, tasks, basedir, name) {
  let task = tasks;

  if (Array.isArray(tasks)) {
    tasks = tasks.slice(0);
    const pipe = name ? pipeline.pipeline(name) : pipeline;
    pipe.clear(); // array always overwrites existing tasks

    while (tasks.length) {
      await applyTasks(pipe, tasks.shift(), basedir);
    }

    return;
  } else if (typeof tasks === "object" && tasks != null) {
    const keys = Object.keys(tasks);
    const pipe = name ? pipeline.pipeline(name) : pipeline;

    while (keys.length) {
      const key = keys.shift();
      await applyTasks(pipe, tasks[key], basedir, key);
    }

    return;
  } else if (typeof tasks === "string") {
    task = await resolve("autorelease-task-", tasks, basedir);
  }

  if (typeof task !== "function") {
    return;
  }

  if (name) pipeline.add(name, task);
  else pipeline.add(task);
}
