import resolve from "./resolve";

export default async function applyTasks(tasks, basedir, pipeline, name) {
  let task = tasks;

  if (Array.isArray(tasks)) {
    tasks = tasks.slice(0);
    const pipe = name ? pipeline.pipeline(name) : pipeline;
    pipe.clear(); // array always overwrites existing tasks

    while (tasks.length) {
      await applyTasks(tasks.shift(), basedir, pipe);
    }

    return;
  } else if (typeof tasks === "object" && tasks != null) {
    const keys = Object.keys(tasks);
    const pipe = name ? pipeline.pipeline(name) : pipeline;

    while (keys.length) {
      const key = keys.shift();
      await applyTasks(tasks[key], basedir, pipe, key);
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
