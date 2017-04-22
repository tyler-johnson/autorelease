// taken mostly from https://github.com/conventional-changelog/git-raw-commits/blob/master/index.js
// (c) Steve Mao

import dargs from "dargs";
import {execFile} from "child_process";
import split from "split2";
import stream from "stream";
import {template} from "lodash";
import through from "through2";

export default function gitRawCommits(options) {
  var readable = new stream.Readable();
  readable._read = function() {};

  options = options || {};
  options.format = options.format || '%B';
  options.from = options.from || '';
  options.to = options.to || 'HEAD';

  const gitFormat = template('--format=<%= format %>%n' +
    '------------------------ >8 ------------------------'
  )(options);
  const gitFromTo = template('<%- from ? [from, to].join("..") : to %>')(options);

  let args = dargs(options, {
    excludes: ['from', 'to', 'format', 'cwd']
  });

  args = [
    'log',
    gitFormat,
    gitFromTo
  ].concat(args);

  if (options.debug) {
    options.debug('Your git-log command is:\ngit ' + args.join(' '));
  }

  let isError = false;
  const child = execFile('git', args, {
    maxBuffer: Infinity,
    cwd: options.cwd
  });

  child.stdout
    .pipe(split('------------------------ >8 ------------------------\n'))
    .pipe(through(function(chunk, enc, cb) {
      readable.push(chunk);
      isError = false;

      cb();
    }, function(cb) {
      setImmediate(function() {
        if (!isError) {
          readable.push(null);
          readable.emit('close');
        }

        cb();
      });
    }));

  child.stderr
    .pipe(through.obj(function(chunk) {
      isError = true;
      readable.emit('error', new Error(chunk));
      readable.emit('close');
    }));

  return readable;
}
