# YDNAP - You don't need a package - CLI

## Overview

YDNAP is a simple command-line tool that allows you to run JavaScript code snippets directly from the command line.
It is designed to be lightweight and easy to use, easy to collaborate, without the need for any additional packages or dependencies.

Sick of installing packages just to archive a simple task? YDNAP is here to help!

In the end of the day, you maybe don't need ramda, lodash, date-fns, or any other package to do simple tasks.

## Installation

You can install YDNAP globally using npm:

```bash
npm install -g ydnap
```

Or you can use it without installing it by using npx:

```bash
npx ydnap
```

## Usage

You can use YDNAP and create files using our [templates](https://github.com/GuildaDev/ydnap-templates), or you can create your own templates (or share them with your friiiiends).

To use our template, you can run:

```bash
ydnap -t sum # or npx ydnap -t sum
```

by default, we will always find the javascript file.

you can also specify the typescript file:

```bash
ydnap -t sum -l ts # or npx ydnap -t sum -l ts
```

Using you repository (eg https://github.com/alexcastrodev/ydnap-example/tree/main/src/even)

```bash
ydnap -u alexcastrodev/ydnap-example -t even
```

> **Note**  
> It's mandatory that the `-t` (template) argument points to a folder, and the file inside the folder should be named `index.ts` or `index.js`.

## Drawbacks

YDNAP is designed to solve small tasks, like navigating through objects with JavaScript or TypeScript (without needing the full weight of libraries like Ramda or Lodash), or creating a useDebounceCallback for React without installing an entire hooks library.

However, unlike libraries such as Lodash—which build complex functions by reusing internal utilities—YDNAP templates are intentionally isolated. This means that if you rely heavily on YDNAP for large-scale data manipulation, you may encounter duplicated logic across different utilities, since each template is designed to stand alone. This isolation ensures you don't have to install a large library when you only need a few specific tools.

Similarly, for working with dates: if you need a simple isBetween utility inspired by date-fns, YDNAP is a great lightweight choice. But if your application has extensive date-related logic, using a full-featured library may be more appropriate to avoid redundancy and improve maintainability.

# References

- [Assert Errors - Node.js Documentation](https://nodejs.org/api/assert.html#assertthrowsfn-error-message): Detailed explanation of how to use `assert.throws()` in Node.js.
