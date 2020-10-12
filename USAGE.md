# 5dchess-notation's built-in converter

This repository includes a converter and previewer, written in node.js.

To run it, you will need a version of Node.js with `esm` supporting the `"type": "module"` flag (v12.x and higher).
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
- `axel`: [Axel's RAN](https://docs.google.com/document/d/1G456NzkPc_ZsAj3HBpdTZuTP3tP-g1k98GdoRE38E5A/view). Supports reading from Axel's AN too.

### Axel's notation

Axel's notation does not support (as of writing this) a way of specifying boards.
Therefore, if the board that the source file plays on isn't the standard board, is should be specified so using the `--board` parameter:

```sh
node . convert axel 5dpgn test/game-2.4xel --board "Standard"
```

## Preview

You can preview the games you transcribed with this parser.
To do so, you'll have to install the optional dependencies:

```sh
npm i blessed
```

Then, you can preview your games with the `preview` sub-command:

```sh
node . preview axel test/game-2.4xel
```

Be sure to check out the available options that the previewer supports by running:

```sh
node . preview --help
```

## Implementing your own notation

> First of all, please pardon the poor code quality, I am currently working on making this thing prettier.

Each implemented notation resides in the `parsers/` directory (might be moved later to `notation/`). The scripts in this repo are using ES6 modules.
You will need to create your notation's parser's file in that directory. This file should export a `parse` and a `write` function.
Next up:

- Hook both the `parse` and `write` functions in the `index.js` file (might make this step optional)
- Write the parser in the `parse` function; it should create a `Game` structure, do the stuff on it and return that structure
- Make the parser parse moves; parsed moves should result in a call to `Game::play(...)` and parsed castlings should result in a call to `Game::castle(...)`
- Write the stringifier in the `write` function; it should return a string. The necessary pieces of information can be found in `Game` and `Move`
