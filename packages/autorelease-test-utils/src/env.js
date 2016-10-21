
const temp = {};

function set(key, value) {
  if (value == null) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

export function push(key, value) {
  if (temp[key] == null) temp[key] = [];
  temp[key].push(process.env[key]);
  set(key, value);
}

export function pop(key) {
  if (temp[key] == null || !temp[key].length) return;
  const prev = process.env[key];
  set(key, temp[key].pop());
  return prev;
}

export function length(key) {
  if (temp[key] == null) return 0;
  return temp[key].length;
}
