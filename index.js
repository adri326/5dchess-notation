#! /bin/node

import * as pgn from "./parsers/pgn.js";
import * as game from "./parsers/game.js";
// import * as axel from "./parsers/axel.js";
import * as fs from "fs";
import * as yargs from "yargs";

yargs.default.command("convert <from> <to> <file>", "Convert from <from> to <to>", (y) => {
  y.positional("from", {
    describe: "the notation to convert from (5dpgn)"
  }).positional("to", {
    describe: "the notation to convert into (5dpgn)"
  }).positional("file", {
    describe: "the file to read from"
  }).option("v", {
    alias: "v",
    default: false,
    type: "boolean",
    describe: "more verbose parsing/writing"
  })
}, (argv) => {
  let g;
  let raw = fs.readFileSync(argv.file, "utf8");

  let from = argv.from.toLowerCase();
  let to = argv.to.toLowerCase();

  if (from === "5dpgn") {
    g = pgn.parse(raw, argv.verbose || false);
  } else if (from === "json") {
    let deserialized = JSON.parse(raw);
    g = new game.Game(1, 1, [0]);
    for (let key in deserialized) {
      if (key === "timelines") {
        g.timelines = deserialized.timelines.map(tl => {
          let timeline = new game.Timeline(1, 1, 0);
          for (let key in tl) {
            timeline[key] = tl[key];
          }
          return timeline;
        });
      } else {
        g[key] = deserialized[key];
      }
    }
  // } else if (argv.from.toLowerCase() === "4xel" || argv.from.toLowerCase() === "axel") {
  //   game = axel.parse(raw);
  }

  if (to === "5dpgn") {
    console.log(pgn.write(g));
  } else if (to === "json") {
    console.log(JSON.stringify(g));
  }
}).argv;
