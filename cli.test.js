// Assertion
import { beforeEach, afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
// Built-in modules
import { readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { exec } from "node:child_process";
// Local modules
import { ERR_MISSING_TEMPLATE } from "./src/errors.js";

const execAsync = promisify(exec);
const CLI_PATH = resolve("./src/cli.js");

function clearOutputDir() {
  const outputDir = resolve("output");
  // Clean up the output directory before each test
  rm(outputDir, { recursive: true, force: true }).catch(() => {});
}

describe("YNDAP CLI", () => {
  beforeEach(clearOutputDir);
  afterEach(clearOutputDir);

  // ============
  // Successful test case
  // ============
  it("Create a file passing correct params, creating .js by default", async () => {
    const templateName = "sum";
    const outputDir = resolve("output/sum");
    const targetFile = resolve(outputDir, "sum.js");
    await execAsync(`node ${CLI_PATH} -t ${templateName} -o ${outputDir}`);
    const content = await readFile(targetFile, "utf8");

    assert.ok(content.includes("export default function sum"));
  });

  it("Create a file passing correct params, creating .ts by change extension", async () => {
    const templateName = "sum";
    const outputDir = resolve("output/sum");
    const targetFile = resolve(outputDir, "sum.ts");
    await execAsync(
      `node ${CLI_PATH} -t ${templateName} -o ${outputDir} -e ts`,
    );
    const content = await readFile(targetFile, "utf8");

    assert.ok(content.includes("export default function sum"));
  });

  it("Create a file passing an another github user", async () => {
    const targetFile = resolve("output", "is-even.js");
    await execAsync(
      `node ${CLI_PATH} -t even -o ${targetFile} -r alexcastrodev/ydnap-example`,
    );
    const content = await readFile(targetFile, "utf8");
    assert.ok(content.includes("export default function isEven"));
  });

  // ============
  // Fail test case
  // ============
  it("Exit if missing template name", async () => {
    const command = `node ${CLI_PATH}`;

    await assert.rejects(execAsync(command), {
      code: 1,
      stderr: new RegExp(ERR_MISSING_TEMPLATE),
    });
  });
});
