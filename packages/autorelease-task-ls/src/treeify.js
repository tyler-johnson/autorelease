// taken mostly from https://github.com/notatestuser/treeify
// Copyright (c) 2016 Luke Plaster <notatestuser@gmail.com>

function makePrefix(key, last) {
  var str = (last ? '└' : '├');
  if (key) {
    str += '─ ';
  } else {
    str += '──┐';
  }
  return str;
}

function filteredKeys(arr) {
  return arr.map(b => {
    if (typeof b === "object" && b != null) return b;
    if (typeof b === "string") return { key: b };
    return null;
  }).filter(Boolean);
}

function growBranch(key, root, last, lastStates, callback) {
  var line = '', index = 0, lastKey, circular, lastStatesCopy = lastStates.slice(0);

  if (lastStatesCopy.push([ root, last ]) && lastStates.length > 0) {
    // based on the "was last element" states of whatever we're nested within,
    // we need to append either blankness or a branch to our line
    lastStates.forEach(function(lastState, idx) {
      if (idx > 0) {
        line += (lastState[1] ? ' ' : '│') + '  ';
      }
      if ( ! circular && lastState[0] === root) {
        circular = true;
      }
    });

    // the prefix varies based on whether the key contains something to show and
    // whether we're dealing with the last element in this collection
    line += makePrefix(key, last) + key;

    // circular reference indicator
    circular && (line += ' (circular ref.)');

    callback(line);
  }

  // can we descend into the next item?
  if ( ! circular && Array.isArray(root)) {
    const keys = filteredKeys(root);
    keys.forEach(function(branch){
      // the last key is always printed with a different prefix, so we'll need to know if we have it
      lastKey = ++index === keys.length;

      // hold your breath for recursive action
      growBranch(branch.key, branch.children, lastKey, lastStatesCopy, callback);
    });
  }
}

export default function(arr) {
  var tree = '';
  growBranch('.', arr, false, [], function(line) {
    tree += line + '\n';
  });
  return tree;
}
