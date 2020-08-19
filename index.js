#! /bin/node

import * as pgn from "./parsers/pgn.js";
import * as fs from "fs";
import * as yargs from "yargs";

yargs.default.command("convert <from> <to> <file>", "Convert from <from> to <to>", (y) => {
  y.positional("from", {
    describe: "the notation to convert from (5dpgn)"
  }).positional("to", {
    describe: "the notation to convert into (5dpgn)"
  }).positional("file", {
    describe: "the file to read from"
  })
}, (argv) => {
  let game;

  if (argv.from.toLowerCase() === "5dpgn") {
    game = pgn.parse(fs.readFileSync(argv.file, "utf8"));
  }

  if (argv.to.toLowerCase() === "5dpgn") {
    console.log(pgn.write(game));
  }
}).argv;
