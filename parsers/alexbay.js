"use strict";

import {Game, BOARDS, PIECES, index_to_letter, letter_to_index, Move} from "./game.js";
import {PIECE_TO_NUM, PIECES_REGEXP, parse_tag} from "./pgn.js";

export const TURN_PREFIX = /^(\d+)([bwBW])\s*\./;
export const FIRST_PART = /^(\d+)\s*([+\-]\d+)?$/;
export const SECOND_PART_DEST = /^(\d+)\s*([+\-]\d+)?/;
export const COORDS = /^([a-w])(\d+)/;
export const BRANCH = /^<\s*([+\-]\d+)?\s*>/;

export const KNOWN_BOARDS = {
  "STANDARD": "standard",
  "STANDARD - PRINCESS": "princess",
  "STANDARD - DEFENDED PAWN": "defended_pawn",
  "STANDARD - HALF REFLECTED": "half_reflected",
  "STANDARD - TURN ZERO": "turn_zero",
};

export const NUM_TO_PIECE = {
  [PIECES.W_KING]: "K",
  [PIECES.W_QUEEN]: "Q",
  [PIECES.W_ROOK]: "R",
  [PIECES.W_BISHOP]: "B",
  [PIECES.W_KNIGHT]: "N",
  [PIECES.W_PRINCESS]: "P",
}

export function parse(raw, verbose = false, princess_to_queen = false) {
  let white = true;
  let turn = 1;

  // Fetch the tags
  let tags = {};
  for (let line of raw.split("\n")) {
    line = line.trimLeft();
    if (!line) continue;
    if (line.startsWith("[")) {
      let [token] = parse_tag(line);
      tags[token.name] = token.value;
    }
  }

  let board = find_board(tags["Variant"] || "standard") || "STANDARD";
  tags["Board"] = board;
  tags["Mode"] = "5D";
  let [width, height] = BOARDS[board][2].split("x").map(x => +x);
  let initial_multiverses = BOARDS[board][1].split(" ").map(x => parse_timeline(x));

  let game = new Game(width, height, initial_multiverses);
  game.tags = tags;
  game.parse_fen(BOARDS[board][0]);

  for (let line of raw.split("\n")) {
    line = line.trimLeft();
    if (line && !line.startsWith("[")) {
      let move = parse_move(game, line);
      if (princess_to_queen && tags["Variant"] === "princess") {
        if (move.src_piece % PIECES.B_OFFSET === PIECES.W_QUEEN) {
          move.src_piece = PIECES.W_PRINCESS + PIECES.B_OFFSET * !move.white;
        }
        if (move.promotion % PIECES.B_OFFSET === PIECES.W_QUEEN) {
          move.promotion = PIECES.W_PRINCESS + PIECES.B_OFFSET * !move.white;
        }
      }
      try {
        move = game.play_move(move);
      } catch (err) {
        console.error(err.toString());
        game.error_info({...move, raw: line}, move.white);
        if (verbose) console.error(err);
        process.exit(1);
      }
    }
  }

  return game;
}

export function write(game, verbose, princess_to_queen) {
  game.tags = game.tags || DEFAULT_TAGS;
  if (!game.tags["Variant"]) {
    game.tags["Variant"] = KNOWN_BOARDS[game.tags["Board"].toUpperCase()];
  }
  let res = "";
  for (let tag in game.tags) {
    res += `[${tag} "${game.tags[tag]}"]\n`;
  }

  for (let move of game.moves) {
    res += `\n${move.turn + 1}${move.white ? "w" : "b"}. `;
    res += write_move(move, game, princess_to_queen);
  }

  return res;
}

export function write_move(move, game, princess_to_queen) {
  let res = `${move.from[1] + 1}${move.from[0] ? write_timeline(move.from[0], true) : ""}:`;

  if (move.castle) {
    res += move.castle_long ? "0-0-0" : "0-0";
  } else {
    if (move.src_piece % PIECES.B_OFFSET !== PIECES.W_PAWN) {
      if (move.src_piece % PIECES.B_OFFSET === PIECES.W_PRINCESS && princess_to_queen) {
        res += "Q";
      } else {
        res += NUM_TO_PIECE[move.src_piece % PIECES.B_OFFSET];
      }

    }
    res += index_to_letter(move.from[2]);
    res += move.from[3] + 1;
    if (move.branches) res += `<${write_timeline(move.new_index, true) || ""}>`;
    if (move.to[0] !== move.from[0] || move.to[1] !== move.from[1]) {
      if (!move.branches) res += "<>";
      res += `${move.to[1] !== move.from[1] ? move.to[1] + 1 : ""}${move.to[0] !== move.from[0] ? write_timeline(move.to[0], true) : ""}`;
    }
    res += ":";
    if (move.takes) res += "x";
    if (move.promotion) res += NUM_TO_PIECE[move.promotion % PIECES.B_OFFSET];
    res += index_to_letter(move.to[2]);
    res += move.to[3] + 1;
    if (move.en_passant) res += "e.p.";
    if (move.check || move.softmate) res += "+";
    else if (move.checkmate) res += "#";
    else if (move.stalemate) res += "=";
  }

  return res;
}

export function find_board(name) {
  let res = Reflect.ownKeys(KNOWN_BOARDS).map((key) =>
    [Reflect.get(KNOWN_BOARDS, key), key]
  ).find(([value, key]) => name.toLowerCase() === value);
  if (!res) return null;
  else return res[1];
}

export function parse_move(game, raw) {
  let turn_prefix = TURN_PREFIX.exec(raw);
  if (!turn_prefix) throw new Error("Couldn't parse turn prefix! " + raw);

  let turn = +turn_prefix[1];
  let white = turn_prefix[2].toLowerCase() === "w";

  raw = raw.slice(turn_prefix[0].length).trimLeft();

  let parts = raw.split(":");
  if (parts.length === 3) {
    // Normal moves
    let first_part = FIRST_PART.exec(parts[0]);
    if (!first_part) throw new Error("Syntax error: " + parts[0]);
    let t_from = +first_part[1];
    let l_from = +(first_part[2] || "0");

    let piece = PIECES_REGEXP.exec(parts[1]);
    if (piece) {
      parts[1] = parts[1].slice(piece[0].length).trimLeft();
      piece = PIECE_TO_NUM[piece[0]] + PIECES.B_OFFSET * !white;
    }

    let coords_from = COORDS.exec(parts[1]);
    if (!coords_from) throw new Error("Syntax error: " + parts[1]);
    let from = [l_from, t_from - 1, letter_to_index(coords_from[1]), +coords_from[2] - 1];
    parts[1] = parts[1].slice(coords_from[0].length).trimLeft();

    let branch = BRANCH.exec(parts[1]);
    if (branch) parts[1] = parts[1].slice(branch[0].length).trimLeft();

    let second_part_dest = SECOND_PART_DEST.exec(parts[1]);
    let t_to = t_from;
    let l_to = l_from;
    if (second_part_dest) {
      t_to = +(second_part_dest[1] || t_from);
      l_to = parse_timeline(second_part_dest[2] || "0");
    }

    let capture = parts[2].startsWith("x");
    if (capture) parts[2] = parts[2].slice(1).trimLeft();

    let promotion = PIECES_REGEXP.exec(parts[2]);
    if (promotion) {
      parts[2] = parts[2].slice(promotion[0].length).trimLeft();
      promotion = PIECE_TO_NUM[piece[1]] + PIECES.B_OFFSET * !white;
    }

    let coords_to = COORDS.exec(parts[2]);
    if (!coords_to) throw new Error("Syntax error: " + parts[2]);

    let to = [l_to, t_to - 1, letter_to_index(coords_to[1]), +coords_to[2] - 1];
    parts[2] = parts[2].slice(coords_to[0].length).trimLeft();

    let en_passant = /^e\.p\./.exec(parts[2]);
    if (en_passant) parts[2] = parts[2].slice(en_passant[0].length).trimLeft();

    let check = !!/^\+/.exec(parts[2]);
    let checkmate = !!/^#/.exec(parts[2]);
    let stalemate = !!/^=/.exec(parts[2]);

    return new Move(
      from,
      to,
      piece || game.get_as(...from, white),
      game.get_as(...to, white),
      turn,
      white,
      {
        promotion,
        check,
        checkmate,
        stalemate,
        new_index: branch === null ? null : +branch[1],
      }
    );
  } else if (parts.length === 2) {
    // Castling

    let first_part = FIRST_PART.exec(parts[0]);
    if (!first_part) throw new Error("Syntax error: " + parts[0]);
    let t_from = +first_part[1];
    let l_from = +(first_part[2] || "0");

    let castle = parts[1] === "0-0-0" || parts[1] === "0-0";
    let castle_long = parts[1] === "0-0-0";

    return new Move(
      [l_from, t_from - 1, -1, -1],
      [l_from, t_from - 1, -1, -1],
      PIECES.W_KING + PIECES.B_OFFSET * !white,
      PIECES.BLANK,
      turn,
      white,
      {
        castle,
        castle_long,
      }
    );
  } else {
    throw new Error("Syntax error: " + raw);
  }
}

export function parse_timeline(raw) {
  return +raw;
}

export function write_timeline(num) {
  if (num >= 0) return `+${num}`;
  else return num.toString();
}
