#!/usr/bin/env node

const pgn = require("./parsers/pgn.js");
const game = require("./parsers/game.js");
const axel = require("./parsers/axel.js");
const json = require("./parsers/json.js");
const alexbay = require("./parsers/alexbay.js");
const preview = require("./preview.js");
const fs = require("fs");
const yargs = require("yargs");

yargs.scriptName("5dchess-notation").command("convert <from> <to> <file>", "Convert from <from> to <to>", (y) => {
  y.positional("from", {
    describe: "the notation to convert from (shad, json, axel)"
  }).positional("to", {
    describe: "the notation to convert into (shad, json, axel)"
  }).positional("file", {
    describe: "the file to read from"
  }).option("v", {
    alias: "v",
    default: false,
    type: "boolean",
    describe: "more verbose parsing/writing"
  }).option("board", {
    default: "Standard",
    describe: "The board that is played on (used for 4xel)",
  }).option("princess-to-queen", {
    alias: "q",
    default: false,
    type: "boolean",
    describe: "Turn princesses into queens (used for alexbay; tries to convert back when parsing alexbay's notation, but cannot revert the information loss)"
  })
}, (argv) => {
  let g;
  let raw = fs.readFileSync(argv.file, "utf8");

  let from = argv.from.toLowerCase();
  let to = argv.to.toLowerCase();

  if (from === "shad") {
    g = pgn.parse(raw, argv.verbose || false);
  } else if (from === "json") {
    g = json.parse(raw);
  } else if (from === "4xel" || from === "axel") {
    g = axel.parse(raw, argv.verbose, argv.board);
  } else if (from === "alexbay") {
    g = alexbay.parse(raw, argv.verbose, argv.princessToQueen);
  } else {
    throw new Error("No notation named " + from + " found!");
  }

  if (to === "shad") {
    console.log(pgn.write(g));
  } else if (to === "json") {
    console.log(JSON.stringify(g));
  } else if (to === "4xel" || from === "axel") {
    console.log(axel.write(g));
  } else if (to === "alexbay") {
    console.log(alexbay.write(g, argv.verbose, argv.princessToQueen));
  }
}).command("preview <format> <file>", "Previews the given game", (y) => {
  y.positional("format", {
    describe: "The format that <file> is in (shad, json, axel)",
  }).positional("file", {
    describe: "The file to read from"
  }).option("board", {
    default: "Standard",
    describe: "The board that is played on (used for axel's notation)",
  }).option("unicode", {
    default: false,
    type: "boolean",
    describe: "Use unicode values for chess pieces (U+2654 through U+265F, Unicorns and Dragons will still be displayed with latin letters)"
  }).option("multi", {
    default: false,
    type: "boolean",
    describe: "Enable multi-board preview"
  }).option("black-bg", {
    default: false,
    type: "boolean",
    describe: "Puts a black background behind each board (multi)"
  }).option("princess-to-queen", {
    alias: "q",
    default: false,
    type: "boolean",
    describe: "Turn princesses into queens (used for alexbay; tries to convert back when parsing alexbay's notation, but cannot revert the information loss)"
  })
}, (argv) => {
  let g;
  let raw = fs.readFileSync(argv.file, "utf8");

  let format = argv.format.toLowerCase();

  if (format === "shad") {
    g = pgn.parse(raw, argv.verbose || false);
  } else if (format === "json") {
    g = json.parse(raw);
  } else if (format === "4xel" || format === "axel") {
    g = axel.parse(raw, argv.verbose, argv.board);
  } else if (format === "alexbay") {
    g = alexbay.parse(raw, argv.verbose, argv.princessToQueen);
  } else {
    throw new Error("No notation named " + format + " found!");
  }

  preview.preview(g, argv.unicode, argv.multi, argv["black-bg"]);
}).demandCommand().argv;
