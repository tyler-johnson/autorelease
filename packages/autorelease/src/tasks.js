import createPipeline from "autorelease-pipeline";
import resolve from "./resolve";

export default async function applyTasks(tasks, basedir, pipeline, name) {
  if (Array.isArray(tasks)) {
    tasks = tasks.slice(0);
    const task = name ? pipeline.pipeline(name) : pipeline;

    while (tasks.length) {
      await applyTasks(tasks.shift(), basedir, task);
    }
  } else if (typeof tasks === "object" && tasks != null) {
    const keys = Object.keys(tasks);
    const task = name ? createPipeline() : pipeline;

    while (keys.length) {
      const key = keys.shift();
      await applyTasks(tasks[key], basedir, task, key);
    }

    if (name) pipeline.add(name, task);
  } else if (typeof tasks === "string") {
    const task = await resolve(tasks, basedir);
    if (name) pipeline.add(name, task);
    else pipeline.add(task);
  }
}
