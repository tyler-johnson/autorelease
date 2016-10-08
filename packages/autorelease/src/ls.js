import chalk from "chalk";
import {cli,treeify} from "autorelease-utils";

const ignoreRoot = [ "ls", "help", "version" ];

export default function(ctx) {
  cli.reset(1);

  cli.newline();
  cli.print(`These are autorelease pipelines and tasks as configured by plugins and your .autoreleaserc. The order they appear in is the order they will be run in. Tasks labeled ${chalk.dim("anonymous")} were added without a name.`);
  cli.newline();

  const tree = toTree(ctx.root).filter(k => ignoreRoot.indexOf(k.key) < 0);

  if (!tree.length) {
    cli.print(chalk.red.bold("No tasks configured!"));
    cli.newline();
  } else {
    tree.forEach(t => {
      cli.print(chalk.green.bold(t.key));
      cli.print(t.key ? treeify(t.children) : "");
      cli.newline();
    });
  }
}

function toTree(pipe) {
  if (!pipe.__pipeline || !pipe._tasks.length) return null;

  return pipe._tasks.reduce((m, task) => {
    const name = pipe.getName(task) || chalk.dim("anonymous");

    m.push({
      key: name,
      children: toTree(task)
    });

    return m;
  }, []);
}
