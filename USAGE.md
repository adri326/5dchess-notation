# 5dchess-notation's built-in converter

This repository includes a converter, written in node.js.

To run it, you will need a version of Node.js with an `esm` supporting the `"type": "module"` flag (v12.x and higher).
As the writing of this document, the latest version of Node.js is `14.8.0`; running with this version does not require the `--experimental-modules` flag, although previous versions did.

## Installation

Clone this repository and install its dependencies:

```sh
git clone https://github.com/adri326/5dchess-notation
cd 5dchess-notation
npm i
```

## Running

On Unix platforms, you can run the `index.js` file right away.

Alternatively, you can use `node .` (or `node --experimental-modules .` if your version does require the flag).

To get help, run the same command with `--help`.

## Notations

The supported notations are:

- `5dpgn`: the format described in [README.md](README.md)
- `json`: the internal format of the parsers, parts of it may be different depending on the language that is being parsed from. No verification is done on import, use at your own risk!
