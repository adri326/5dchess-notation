/**!
  Parses and writes 4xel (Axel's [R]AN).
  Target coordinates may not be omitted.
**/

const {Game, BOARDS, PIECES, index_to_letter, letter_to_index, parse_timeline, write_timeline} = require("./game.js");
const {PIECE_TO_NUM, NUM_TO_PIECE} = require("./pgn.js");

const TURN_PREFIX = /^(?:([bwBW])\s*)?(\d+)\s*(?:T\s*(\d+)\s*)?\./;
exports.TURN_PREFIX = TURN_PREFIX;
const TIMELINE_REGEX = /^L\s*([+-]?\d+)/;
exports.TIMELINE_REGEX = TIMELINE_REGEX;
const TIME_REGEX = /^T\s*([+-]?\d+)/;
exports.TIME_REGEX = TIME_REGEX;
const PIECES_REGEXP = /^[PKNRQDUB]/;
exports.PIECES_REGEXP = PIECES_REGEXP;
const BRANCHING = /^\(\+\s*L\s*([+-]?\d*)\s*(?:(p)\s*)?\)/;
exports.BRANCHING = BRANCHING;

const CHECK = /^(?:\+|\*|\*\+)/;
exports.CHECK = CHECK;
const CHECKMATE = /^#/;
exports.CHECKMATE = CHECKMATE;
const SOFTMATE = /^\+\+/;
exports.SOFTMATE = SOFTMATE;

function parse(raw, verbose = false, board = "Standard") {
  raw = raw.replace(/\.\./g, ";..");
  let white = false;
  let game;
  if (BOARDS[board.toUpperCase()]) {
    let [width, height] = BOARDS[board.toUpperCase()][2].split("x").map(x => +x);
    let initial_multiverses = BOARDS[board.toUpperCase()][1].split(" ").map(x => parse_timeline(x));
    game = new Game(width, height, initial_multiverses);
    game.tags = {
      mode: "5D",
      board: board,
      size: "8x8",
    };
    game.parse_legacy_fen(BOARDS[board.toUpperCase()][0]);
  } else {
    game = new Game(8, 8, [0]);
    game.tags = {
      mode: "5D",
      board: board,
      size: "8x8",
    };
    game.parse_legacy_fen(BOARDS.STANDARD[0]);
  }

  let turn = 0;
  let present = 0;
  let moves = [];

  while (raw.trimLeft().length) {
    let match;
    raw = raw.trimLeft();
    if (match = TURN_PREFIX.exec(raw)) {
      raw = raw.slice(match[0].length);

      if (match[1]) white = match[1].toLowerCase() === "w";
      else white = !white;
      game.active_player = white;

      if (match[2]) turn = +match[2] - 1;
      else if (white) turn++;

      if (match[3]) present = +match[3] - 1;
      else if (white) present++;
    } else if (match = /^\.\./.exec(raw)) {
      if (white === false) {
        throw new Error("Cannot switch player: already black");
      }
      white = false;
      game.active_player = white;
      raw = raw.slice(2);
    } else if (match = /^-\s*;/.exec(raw)) {
      raw = raw.slice(match[0].length);
    } else if (match = /[;\.]/.exec(raw)) {
      if (match[0].trim() === "") {
        raw = raw.slice(match.index + match[0].length);
        continue;
      }
      // Try parsing a move
      let parsed = parse_move(raw.slice(0, match.index), game, white, turn, present);
      try {
        if (parsed.type === "move") {
          game.play(
            parsed.src_piece,
            parsed.from.map(x => x === null ? -1 : x),
            parsed.to.map(x => x === null ? -1 : x),
            white,
            parsed.promotion,
            parsed,
          );
        } else if (parsed.type === "castle") {
          game.castle(
            parsed.src_piece,
            parsed.from.map(x => x === null ? -1 : x),
            parsed.long,
            white,
            parsed,
          );
        }
      } catch (err) {
        console.error(err.toString());
        game.error_info(parsed);
        if (verbose) console.error(err);
        process.exit(1);
      }
      raw = raw.slice(match.index + match[0].length);
    } else {
      throw new Error("Unrecognized token: " + raw.slice(0, 10) + "...");
    }
  }

  return game;
}
exports.parse = parse;

/**?
  Exports to 4xel RAN
**/
function write(game) {
  let was_white = false;
  let present = 0;
  let turn = 0;
  let res = "";

  for (let move of game.moves) {
    if (move.white != was_white) {
      was_white = move.white;
      if (move.white) {
        turn++;
        present++;
      }
      if (!move.white || turn > 1) {
        res += ".\n";
      }
      res += `${move.white ? "w" : "b"}${turn}T${present}. `;
    } else {
      res += "; ";
    }

    res += write_move(move);

    if (move.moves_present) {
      present = move.to[1] + 1; // unsure
    }
  }

  res += ".";

  return res;
}
exports.write = write;

function write_move(move) {
  let res = "";
  res += `L${write_timeline(move.from[0], true)}`;
  res += `T${move.from[1] + 1}`;
  if (move.type === "castle" || move.castle) {
    res += " O-O";
    if (move.long || move.castle_long) res += "-O";
  } else {
    res += " ";
    res += NUM_TO_PIECE[move.src_piece % PIECES.B_OFFSET];
    res += index_to_letter(move.from[2]);
    res += move.from[3] + 1;
    if (move.takes) res += " x ";
    else res += " ";
    res += `L${write_timeline(move.to[0], true)}`;
    res += `T${move.to[1] + 1}`;
    res += " ";
    res += index_to_letter(move.to[2]);
    res += move.to[3] + 1;
    if (move.check) res += "+";
    if (move.checkmate) res += "#";
    if (move.branches) {
      res += ` (+L${write_timeline(move.new_index, true)})`;
    }
  }
  return res;
}
exports.write_move = write_move;

function parse_move(raw, game, white, turn, present) {
  let res_raw = raw;
  raw = raw.trim();
  let l = white ? game.lowest_active_timeline(true) : game.highest_active_timeline(false);
  let from = [l, game.get_last_turn_in(l), -1, -1];
  let to = [l, game.get_last_turn_in(l), -1, -1];
  let match;
  let tokens = [];
  let check = false;
  let checkmate = false;
  let softmate = false;
  let takes = false;
  let annotations = "";
  let branches_to = null;
  let promotion = null;
  let piece = PIECES.W_PAWN + !white * PIECES.B_OFFSET;

  while (raw.length) {
    raw = raw.trimLeft();
    if (match = TIMELINE_REGEX.exec(raw)) {
      tokens.push({
        type: "timeline",
        value: parse_timeline(match[1]),
      });
      raw = raw.slice(match[0].length);
    } else if (match = TIME_REGEX.exec(raw)) {
      tokens.push({
        type: "time",
        value: +match[1] - 1
      });
      raw = raw.slice(match[0].length);
    } else if (match = PIECES_REGEXP.exec(raw)) {
      tokens.push({
        type: "piece",
        value: PIECE_TO_NUM[match[0]] + PIECES.B_OFFSET * !white,
      });
      raw = raw.slice(match[0].length);
    } else if (match = /^([a-w])(\d+)/.exec(raw)) {
      tokens.push({
        type: "position",
        value: [letter_to_index(match[1]), +match[2] - 1],
      });
      raw = raw.slice(match[0].length);
    } else if (match = /^[a-w]/.exec(raw)) {
      tokens.push({
        type: "position",
        value: [letter_to_index(match[0]), -1],
      });
      raw = raw.slice(match[0].length);
    } else if (match = /^\d+/.exec(raw)) {
      tokens.push({
        type: "position",
        value: [-1, +match[0] - 1],
      });
      raw = raw.slice(match[0].length);
    } else if (match = SOFTMATE.exec(raw)) {
      softmate = true;
      raw = raw.slice(match[0].length);
    } else if (match = CHECK.exec(raw)) {
      check = true;
      raw = raw.slice(match[0].length);
    } else if (match = CHECKMATE.exec(raw)) {
      checkmate = true;
      raw = raw.slice(match[0].length);
    } else if (match = /^x/.exec(raw)) {
      takes = true;
      raw = raw.slice(match[0].length);
    } else if (match = /^[!?]{1,2}/.exec(raw)) {
      annotations += match[0];
      raw = raw.slice(match[0].length);
    } else if (match = BRANCHING.exec(raw)) {
      branches_to = parse_timeline(match[1]);
      raw = raw.slice(match[0].length);
    } else if (match = /^[0O]-[0O](-[0O])?/.exec(raw)) {
      tokens.push({
        type: "castle",
        value: !!match[1],
      });
      raw = raw.slice(match[0].length);
    } else if (match = /^=([QNRDU])/.exec(raw)) {
      tokens.push({
        type: "promotion",
        value: PIECES_TO_NUM[match[1]] + PIECES.B_OFFSET * !white,
      });
      raw = raw.slice(match[0].length);
    } else {
      throw new Error("Unexpected token within move: " + raw.slice(0, 10) + "...");
    }
  }

  let castle;

  if (castle = tokens.filter(({type}) => type === "castle")[0]) {
    // castle
    tokens.forEach(({type, value}) => {
      if (type === "timeline") {
        from[0] = value;
        from[1] = game.get_last_turn_in(from[0]);
        to[0] = value;
        to[1] = game.get_last_turn_in(to[0]);
      } else if (type === "time") {
        from[1] = value;
        to[1] = value;
      }
    });

    return {
      type: "castle",
      raw: res_raw,
      from,
      long: castle.value,
      piece: PIECES.W_KING + PIECES.B_OFFSET * !white,
      check,
      checkmate,
      softmate,
      annotations,
    };
  }

  let positions = tokens.filter(({type}) => type === "position").map(({value}) => value);
  let last_position = positions[positions.length - 1];
  if (last_position[0] === -1 || last_position[1] === -1) {
    throw new Error("Invalid position: target (physical) coordinates must be fully specified");
  }

  to[2] = last_position[0];
  to[3] = last_position[1];

  if (positions.length === 2) {
    if (positions[0][0] !== -1) {
      from[2] = positions[0][0];
    }
    if (positions[0][1] !== -1) {
      from[3] = positions[0][1];
    }
  } else if (positions.length > 2) {
    throw new Error("Too many coordinates in a single move! Expected 1 or 2, got " + positions.length);
  }

  let src_piece = tokens.findIndex(({type}) => type === "piece");
  if (src_piece === -1) {
    // pawn move
    tokens.forEach(({type, value}) => {
      if (type === "timeline") {
        from[0] = value;
        from[1] = game.get_last_turn_in(from[0]);
        to[0] = value;
        to[1] = game.get_last_turn_in(to[0]);
      } else if (type === "time") {
        from[1] = value;
        to[1] = value;
      } else if (type === "promotion") {
        promotion = value;
      }
    });
  } else {
    // non-pawn move
    piece = tokens[src_piece].value;
    tokens.slice(0, src_piece).forEach(({type, value}) => {
      if (type === "timeline") {
        from[0] = value;
        from[1] = game.get_last_turn_in(from[0]);
        to[0] = value;
        to[1] = game.get_last_turn_in(to[0]);
      } else if (type === "time") {
        from[1] = value;
        to[1] = value;
      }
    });
    tokens.slice(src_piece).forEach(({type, value}) => {
      if (type === "timeline") {
        to[0] = value;
        to[1] = from[1];
      } else if (type === "time") {
        to[1] = value;
      }
    });
  }

  return {
    type: "move",
    raw: res_raw,
    from,
    to,
    src_piece: piece,
    check,
    checkmate,
    softmate,
    annotations,
    branches_to,
    promotion,
  };
}
exports.parse_move = parse_move;