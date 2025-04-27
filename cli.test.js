import test from "node:test";
import assert from "node:assert";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { resolve } from "path";
import { ERR_MISSING_TEMPLATE } from "./src/errors.js";

const execAsync = promisify(exec);

const CLI_PATH = resolve("./src/cli.js");

test("Exit if missing template name", async () => {
  const command = `node ${CLI_PATH}`;

  await assert.rejects(execAsync(command), {
    code: 1,
    stderr: new RegExp(ERR_MISSING_TEMPLATE),
  });
});
