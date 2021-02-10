# 5dchess-notation's built-in converter

This package includes a converter and previewer, written in node.js.

## Installation

Clone this repository and install its dependencies:

```sh
git clone https://github.com/adri326/5dchess-notation
cd 5dchess-notation
npm i -g
```
If desired, you can install this package only to the local context by using `npm i` instead of `npm i -g`.

## Running

If you installed this package globally (i.e. using `npm i -g`), you can use `5dchess-notation`.

On Unix platforms, you can run the `index.js` file right away.

Alternatively, you can use `node .`.

## Notations

The supported notations are:

- `5dpgn`: the format described in [README.md](README.md)
- `json`: the internal format of the parsers, parts of it may be different depending on the language that is being parsed from. No verification is done on import, use at your own risk!
- `axel`: [Axel's RAN](https://docs.google.com/document/d/1G456NzkPc_ZsAj3HBpdTZuTP3tP-g1k98GdoRE38E5A/view). Supports reading from Axel's AN too.

### Axel's notation

Axel's notation does not support (as of writing this) a way of specifying boards.
Therefore, if the board that the source file plays on isn't the standard board, is should be specified so using the `--board` parameter:

```sh
5dchess-notation convert axel 5dpgn test/game-2.4xel --board "Standard"
```

## Preview

You can preview the games you transcribed with this parser.

Then, you can preview your games with the `preview` sub-command:

```sh
5dchess-notation preview axel test/game-2.4xel
```

Be sure to check out the available options that the previewer supports by running:

```sh
5dchess-notation preview --help
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
