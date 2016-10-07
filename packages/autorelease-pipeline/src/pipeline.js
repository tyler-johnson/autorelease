import createPipeline from "./index.js";
import {toPath} from "lodash";

export function init() {
  this.__pipeline = true;
  this.clear();
}

export function clear() {
  this._tasks = [];
  this._byName = {};
  return this;
}

export function add(name, task, before) {
  if (typeof name === "function") {
    [before,task,name] = [task,name,null];
  }

  if (typeof task !== "function") {
    throw new Error("Expecting function for task.");
  }

  const parts = toPath(name);
  name = parts[parts.length - 1];
  const parent = parts.length <= 1 ? this :
    this.pipeline(parts.slice(0, parts.length - 1));

  // remove existing task before inserting
  parent.remove(name);

  // get the index to insert at
  let index = -1;
  if (typeof before === "string") before = parent.get(before);
  if (before != null) index = parent._tasks.indexOf(before);
  if (index < 0) index = parent._tasks.length;

  // insert it
  parent._tasks.splice(index, 0, task);
  if (name) parent._byName[name] = task;

  return this;
}

export function remove(task) {
  let parent = this;

  if (typeof task === "string") {
    const parts = toPath(task);
    parent = parts.length <= 1 ? this : this.pipeline(parts.slice(0, parts.length - 1));
    task = parent.get(parts[parts.length - 1]);
  }

  if (typeof task !== "function") return this;

  const index = parent._tasks.indexOf(task);
  if (index > -1) parent._tasks.splice(index, 1);

  Object.keys(parent._byName).some(k => {
    if (parent._byName[k] === task) {
      delete parent._byName[k];
      return true;
    }
  });

  return this;
}

export function get(name) {
  const parts = toPath(name);
  let pipe = this;

  while (pipe && parts.length) {
    pipe = pipe.__pipeline ? pipe._byName[parts.shift()] : void 0;
  }

  return pipe;
}

export function pipeline(name) {
  const existing = this.get(name);
  if (existing && existing.__pipeline) return existing;

  const pipe = createPipeline();
  this.add(name, pipe);
  if (existing) pipe.add(existing);
  return pipe;
}
