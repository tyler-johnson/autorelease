import _mkdirp from "mkdirp";
import promisify from "es6-promisify";
import {readFile as _readFile,writeFile as _writeFile} from "fs";
import {join,resolve} from "path";
import _debug from "debug";
import createContext from "autorelease-context";
import _rimraf from "rimraf";
import {exec as _exec} from "child_process";

const debug = _debug("autorelease-test-utils");
const debugexec = _debug("autorelease-test-utils:exec");
const debugstdout = _debug("autorelease-test-utils:stdout");
const readFile = promisify(_readFile);
const writeFile = promisify(_writeFile);
const mkdirp = promisify(_mkdirp);
const rimraf = promisify(_rimraf);
const exec = promisify(_exec);

export class Repository {
	constructor(dirname) {
		this._dirname = resolve(dirname);
	}

	_operations = [];

	get dirname() {
		return this._dirname;
	}

	static operations = {
		create: async function(repo) {
			await Repository.operations.destroy(repo);
			await mkdirp(repo.dirname);
			await repo.exec("git init");
		},
		destroy: async function(repo) {
			await rimraf(repo.dirname, { disableGlob: true });
		},
		command: async function(repo, op) {
			await repo.exec(op.command, op.options);
		},
		file: async function(repo, op) {
			await writeFile(join(repo.dirname, op.name), op.contents);
		}
	};

	create() {
		this._operations.push({
			type: "create"
		});

		return this;
	}

	destroy() {
		this._operations.push({
			type: "destroy"
		});

		return this;
	}

	// add a file
	file(name, contents) {
		this._operations.push({
			type: "file",
			name: name,
			contents: contents
		});

		return this;
	}

	json(name, data) {
		return this.file(name, JSON.stringify(data, null, 2) + "\n");
	}

	// set the repo package.json
	package(pkg) {
		return this.json("package.json", pkg);
	}

	// set autorelease configuration
	rc(conf) {
		return this.json(".autoreleaserc", conf);
	}

	// execute shell command
	command(cmd, options) {
		this._operations.push({
			type: "command",
			command: cmd,
			options: options
		});

		return this;
	}

	// set the repo branch
	branch(name) {
		return this.command(`git checkout -b ${JSON.stringify(name)}`);
	}

	// commit whatever changes there were
	commit(message) {
		return this
			.command(`git add --all`)
			.command(`git commit -m ${JSON.stringify(message)} --allow-empty`);
	}

	// persist the operations
	async flush() {
		const ops = this._operations.splice(0, this._operations.length);

		while (ops.length) {
			const op = ops.shift();
			if (!op.type || !Repository.operations[op.type]) {
				continue;
			}

			debug("run op: %s", op.type);
			await Repository.operations[op.type](this, op);
		}
	}

	async readFile(file) {
		return await readFile(join(this.dirname, file), "utf8");
	}

	async exec(cmd, options) {
		debugexec(cmd);
		const r = await exec(cmd, {
			cwd: this.dirname,
			...options
		});

		if (r.trim()) debugstdout(r.trim());
		return r;
	}

	async context(opts) {
		return await createContext({
			basedir: this.dirname,
			...opts
		});
	}
}
