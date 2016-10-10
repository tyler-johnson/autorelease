import chalk from "chalk";
import {treeify} from "autorelease-utils";

const ignoreRoot = [ "ls", "help", "version" ];

export default function({ cli, root }) {
  cli.reset(0);

  cli.newline();
  cli.print(`These are autorelease pipelines and tasks as configured by plugins and your .autoreleaserc.
The order they appear in is the order they will be run.
Tasks labeled ${chalk.dim("anonymous")} were added without a name.
Tasks labeled ${chalk.red("*")} are pipelines and can have zero or more children tasks.`);
  cli.newline();

  const tree = toTree(root).filter(k => ignoreRoot.indexOf(k.key) < 0);

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

function toTree(pipe, depth=0) {
  if (!pipe.__pipeline || !pipe._tasks.length) return null;

  return pipe._tasks.reduce((m, task) => {
    const key = pipe.getName(task) || chalk.dim("anonymous");
    const node = { key };

    if (task.__pipeline) {
      if (depth) node.key += " " + chalk.red("*");
      node.children = toTree(task, depth + 1);
    }

    m.push(node);
    return m;
  }, []);
}
