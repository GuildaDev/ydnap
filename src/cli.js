#!/usr/bin/env node
import { parseArgs } from "node:util";
import { ERR_MISSING_TEMPLATE, ERR_FETCH_TEMPLATE } from "./errors.js";
import { resolve, extname, dirname } from "node:path";
import { mkdirSync } from "node:fs";
import { writeFile } from "fs/promises";
import { Writable } from "node:stream";

// ===========
// Initialization
// ===========

const options = {
  verbose: {
    type: "boolean",
    short: "v",
    default: false,
  },
  extension: {
    type: "string",
    short: "e",
    choices: ["js", "ts"],
    default: "js",
  },
  template: {
    type: "string",
    short: "t",
  },
  repo: {
    type: "string",
    short: "r",
  },
  output: {
    type: "string",
    short: "o",
  },
  help: {
    type: "boolean",
    short: "h",
  },
};

const { values } = parseArgs({ options, tokens: true });

// ===========
// Helpers
// ===========

const logStream = new Writable({
  write(chunk, encoding, callback) {
    process.stdout.write(chunk, encoding, callback);
  },
});

function log(...args) {
  if (values.verbose) {
    logStream.write(`YNDAP: ${args.join(" ")}\n`);
  }
}

// ===========
// Help
// ===========

if (values.help) {
  console.log(`
Usage: ydnap [options]

Options:
  -t, --template <template>   Specify the template to use (required)
  -e, --extension <js|ts>     Specify the file extension (default: js)
  -o, --output <output>       Specify the output file or directory
  -r, --repo <user/repo>      Specify a custom repository for templates
  -v, --verbose               Enable verbose logging
  -h, --help                  Display this help message

Examples:
  ydnap -t sum -e ts
  ydnap -t sum -o ./output-dir
  ydnap -t sum -r customuser/customrepo
`);

  process.exit(0);
}

/* @function buildTemplate
 * @description Build the template URL based on the provided options.
 * Official ydnap templates are hosted on GitHub
 * https://raw.githubusercontent.com/:user/:repo/:branch/:type/index.js
 * 3th party templates
 * https://raw.githubusercontent.com/:user/:repo/:branch/:path
 */
function buildTemplate() {
  const branch = "main";
  const type = values.extension;
  const template = values.template;
  let repo = values.repo || "guildadev/ydnap-templates";
  let path = `src/${type}/${template}/index.${type}`;

  if (values.repo) {
    path = `src/${template}/index.${type}`;
    log(`Building template URL: ${path}`);
  }

  const url = `https://raw.githubusercontent.com/${repo}/refs/heads/${branch}/${path}`;
  log(`Template URL: ${url}`);
  return {
    url,
  };
}

async function resolveOutput() {
  const { output, template, extension } = values;

  if (output) {
    const outputPath = resolve(process.cwd(), output);
    const outputExt = extname(output);
    log("Output", outputPath);

    if (outputExt) {
      // When output is a file
      // Ensure its parent directory exists
      const parentDir = dirname(outputPath);
      mkdirSync(parentDir, { recursive: true });
      log("Output is a file, parentDir:", parentDir);
      return outputPath;
    } else {
      // When output is a directory
      mkdirSync(outputPath, { recursive: true });
      return resolve(outputPath, `${template}.${extension}`);
    }
  }

  // No output provided → use template name in cwd
  return resolve(process.cwd(), `${template}.${extension}`);
}

// ===========
// Validation
// ===========

if (!values.template) {
  log(
    "Usage: ydnap -t <js|ts> <template> [-u githubuser | --user githubuser | -r user/repo | --repo user/repo]",
  );
  throw new TypeError(ERR_MISSING_TEMPLATE);
}

// ===========
// Main
// ===========
const { url } = buildTemplate();
log("Template URL", url);
const filepath = await resolveOutput();
log("Filepath", filepath);

const response = await fetch(url);
const responseText = await response.text();

if (!response.ok) {
  log("Response", responseText);
  throw new TypeError(ERR_FETCH_TEMPLATE);
}

await writeFile(filepath, responseText, { encoding: "utf-8" });
log(`Template written to ${filepath}`);
