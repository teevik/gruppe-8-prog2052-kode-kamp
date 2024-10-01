const { core } = Deno;
const { ops } = core;

function argsToMessage(...args) {
  return args.join(" ");
}

const console = {
  log: (...args) => {
    core.ops.print(`${argsToMessage(...args)}`);
  },
  error: (...args) => {
    core.ops.print(`${argsToMessage(...args)}`);
  },
};

function readline() {
  return core.ops.readline();
}

globalThis.console = console;
globalThis.readline = readline;

// delete Deno.core;
