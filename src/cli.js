#!/usr/bin/env node
import { parseArgs } from "node:util";
import { ERR_MISSING_TEMPLATE } from "./errors.js";

const options = {
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
};

const { values } = parseArgs({ options, tokens: true });

if (!values.template) {
  console.error(
    "Usage: ydnap -t <js|ts> <template> [-u githubuser | --user githubuser | -r user/repo | --repo user/repo]",
  );
  throw new TypeError(ERR_MISSING_TEMPLATE);
}

if (!values.filename) {
  console.error("Error: Filename is required.");
  throw new TypeError(ERR_MISSING_FILENAME);
}
