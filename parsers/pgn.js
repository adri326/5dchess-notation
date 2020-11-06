/**!
  Parses and writes 5dpgn (Shad's notation).
**/

import {Game, BOARDS, PIECES, letter_to_index, index_to_letter, parse_timeline, write_timeline} from "./game.js";

export const SUPERPHYSICAL_REGEXP = /^\(\s*L?\s*([+-]?\d+)\s*T\s*(\d+)\s*\)/;
export const ANNOTATIONS_REGEXP = /^(?:\?+|!+|\?!|!\?)/;
export const PIECES_REGEXP = /^(?:BR|CK|RQ|PR|[PKNRQDUBS])/;
export const PRESENT_REGEXP = /^\(~T(\d+)\)/;
export const TIMELINE_REGEXP = /^\(>L([+\-]?\d+)\)/;
export const PIECE_TO_NUM = {
  P: PIECES.W_PAWN,
  N: PIECES.W_KNIGHT,
  B: PIECES.W_BISHOP,
  R: PIECES.W_ROOK,
  Q: PIECES.W_QUEEN,
  K: PIECES.W_KING,
  U: PIECES.W_UNICORN,
  D: PIECES.W_DRAGON,
  S: PIECES.W_PRINCESS,
  PR: PIECES.W_PRINCESS,
  BR: PIECES.W_BRAWN,
  CK: PIECES.W_CKING,
  RQ: PIECES.W_RQUEEN,
};
export const NUM_TO_PIECE = {
  [PIECES.W_PAWN]: "P",
  [PIECES.W_KNIGHT]: "N",
  [PIECES.W_BISHOP]: "B",
  [PIECES.W_ROOK]: "R",
  [PIECES.W_QUEEN]: "Q",
  [PIECES.W_KING]: "K",
  [PIECES.W_UNICORN]: "U",
  [PIECES.W_DRAGON]: "D",
  [PIECES.W_PRINCESS]: "S",
  [PIECES.W_BRAWN]: "BR",
  [PIECES.W_CKING]: "CK",
  [PIECES.W_RQUEEN]: "RQ",
}
export const DEFAULT_TAGS = {
  Mode: "5D",
  Site: "5D Chess",
  Board: "Standard",
  Size: "8x8",
};

/**?
  Parses 5D PGN (Shad's notation); returns a Game structure.
**/
export function parse(raw, verbose = false) {
  let tokens = [];
  raw = raw.trimLeft();

  while (raw.trim().length) {
    let token;
    if (raw.startsWith("[")) { // tag token
      [token, raw] = parse_tag(raw);
    } else if (raw.match(/^\d+\s*\./)) { // turn index token
      [token, raw] = parse_turn_index(raw);
    } else if (raw.startsWith("/")) { // player separator token
      tokens.push({type: "player_separator"});
      raw = raw.slice(1).trimLeft();
      continue;
    } else if (ANNOTATIONS_REGEXP.exec(raw)) {
      let match = ANNOTATIONS_REGEXP.exec(raw);
      raw = raw.slice(match[0].length).trimLeft();
      tokens.push({type: "annotation", value: match[0]});
      continue;
    } else if (raw.startsWith("{")) {
      [token, raw] = parse_comment(raw);
    } else if (/^(?:0-1|1-0|1\/2-1\/2)/.exec(raw)) {
      let value = /^(?:0-1|1-0|1\/2-1\/2)/.exec(raw)[0];
      raw = raw.slice(value.length).trimLeft();
      tokens.push({
        type: "result",
        value
      });
      continue;
    } else if (TIMELINE_REGEXP.exec(raw)) {
      let value = TIMELINE_REGEXP.exec(raw);
      raw = raw.slice(value[0].length).trimLeft();
      token = {
        type: "timeline",
        value: parse_timeline(value[1]),
        raw: value[0],
      };
    } else if (PRESENT_REGEXP.exec(raw)) {
      let value = PRESENT_REGEXP.exec(raw);
      raw = raw.slice(value[0].length).trimLeft();
      token = {
        type: "present",
        value: +value[1],
        raw: value[0],
      };
    } else { // move token
      try {
        [token, raw] = parse_move(raw);
      } catch (err) {
        console.error(err.toString());
        console.log("Raw string: " + raw.slice(0, 10) + "...");
        process.exit(1);
      }
    }
    tokens.push(token);
  }

  let tags = {};
  tokens.filter(t => t.type == "tag").forEach(t => tags[t.name] = t.value);

  let [width, height] = (tags["Size"] || (tags["Size"] = "8x8")).split("x").map(x => +x);
  let board_indices = (tags["InitialMultiverses"] || "0").split(" ").map(n => parse_timeline(n));
  let game = new Game(width, height, board_indices);

  let board_name = tags["Board"] || "Standard";
  if (BOARDS[board_name.toUpperCase()]) {
    board_indices = BOARDS[board_name.toUpperCase()][1].split(" ").map(x => parse_timeline(x));
    game = new Game(width, height, board_indices);
    game.parse_fen(BOARDS[board_name.toUpperCase()][0]);
  }

  let white = true;
  let turn = 0;

  let last_move = null;

  tokens = tokens.map((token, i) => {
    if (token.type == "move") {
      if (token.from[1] == -1) {
        if (game.timelines.length > 1) {
          throw new Error("Expected super-physical coordinates!");
        } else {
          token.to[0] = token.from[0] = game.timelines[0].index;
          token.to[1] = token.from[1] = ~~((game.timelines[0].states.length + game.timelines[0].begins_at - 1) / 2);
        }
      }
      try {
        let res = game.play(
          PIECE_TO_NUM[token.src_piece_raw] + (white ? 0 : PIECES.B_OFFSET),
          token.from,
          token.to,
          white,
          PIECE_TO_NUM[token.promotion || "."] + (white ? 0 : PIECES.B_OFFSET),
          token,
        );

        if (token.moves_present) res.moves_present = true;

        // Debug informations
        if (tokens[i + 1] && tokens[i + 1].type === "comment" && tokens[i + 1].value === "@") {
          console.log(res);
          game.print(game.get_board_as(res.from[0], res.from[1], white), game.get_board_as(res.from[0], res.from[1] + (res.white ? 0 : 1), !white));
          console.log("");
          if (res.branches) {
            game.print(game.get_board_as(res.to[0], res.to[1], white), game.get_board_as(res.new_index, res.to[1] + (res.white ? 0 : 1), !white));
          } else {
            game.print(game.get_board_as(res.to[0], res.to[1], white), game.get_board_as(res.to[0], res.to[1] + (res.white ? 0 : 1), !white));
          }
          console.log("");
          console.log("");
        }

        last_move = res;
        game.active_player = white;
        return res;
      } catch (err) {
        console.error(err.toString());
        game.error_info(token, white);
        if (verbose) console.error(err);
        process.exit(1);
      }
    } else if (token.type == "castle") {
      if (token.from[1] == -1) {
        if (game.timelines.length > 1) {
          throw new Error("Expected super-physical coordinates!");
        } else {
          token.to[0] = token.from[0] = game.timelines[0].index;
          token.to[1] = token.from[1] = ~~((game.timelines[0].states.length + game.timelines[0].begins_at - 1) / 2);
        }
      }
      try {
        let res = game.castle(
          PIECES.W_KING + (white ? 0 : PIECES.B_OFFSET),
          token.from,
          token.long,
          white,
        );

        // Debug informations
        if (tokens[i + 1] && tokens[i + 1].type === "comment" && tokens[i + 1].value === "@") {
          console.log(res);
          game.print(game.get_board_as(res.from[0], res.from[1], white), game.get_board_as(res.from[0], res.from[1] + 1, !white));
          console.log("");
          console.log("");
        }

        last_move = res;
        return res;
      } catch (err) {
        console.error(err.toString());
        game.error_info(token, white);
        if (verbose) console.error(err);
        process.exit(1);
      }
    } else if (token.type == "player_separator") {
      game.active_player = white = false;
    } else if (token.type == "turn_index") {
      game.active_player = white = true;
      turn = token.value;
    } else if (token.type == "timeline") {
      // noop; TODO: verification
    } else if (token.type == "present") {
      // noop; TODO: verification
    } else if (token.type == "comment") {
      if (last_move) {
        last_move.comments.push(token.value);
      }
    } else if (token.type == "result") {
      if (last_move) {
        last_move.comments.push(token.value);
      }
    }
    return token;
  });

  game.tags = tags;

  return game;
}

export function write(game) {
  let res = "";
  for (let tag in (game.tags || DEFAULT_TAGS)) {
    res += `[${tag} "${game.tags[tag]}"]\n`;
  }

  let white = true;
  let turn = -1;
  for (let move of game.moves) {
    if (move.turn > turn) {
      turn = move.turn;
      res += `\n${turn + 1}.`;
      white = true;
    } else if (!move.white && white) {
      res += ` /`;
      white = false;
    }
    res += ` ${write_move(move, game)}`;
    if (Array.isArray(move.comments) && move.comments.length) {
      for (let comment of move.comments) {
        if (/^(?:0-1|1-0|1\/2-1\/2)/.exec(comment)) {
          res += " " + comment;
        } else {
          res += ` {${comment.replace(/}/g, "\}")}}`;
        }
      }
    }
  }

  return res;
}

function parse_tag(raw) {
  let token_raw = raw[0];
  let ptr = 1;

  let name = /^\s*([\w\d]+)\s/.exec(raw.slice(ptr));
  if (!name) throw new Error("Invalid tag!");
  ptr += name[0].length;
  token_raw += name[0];
  name = name[1];

  let value = /^\s*"(.+?)(?<=[^\\])"/.exec(raw.slice(ptr));
  if (!value) throw new Error("Invalid tag!");
  ptr += value[0].length;
  token_raw += value[0];
  value = value[1];

  ptr += raw.slice(ptr).split("").findIndex(e => e == "]") + 1;

  return [{
    type: "tag",
    name,
    raw: token_raw,
    value,
  }, raw.slice(ptr).trimLeft()]
}

function parse_turn_index(raw) {
  let match = /^(\d+)\s*\./.exec(raw);
  if (!match) throw new Error("Invalid turn index!");
  return [{
    type: "turn_index",
    value: +match[1],
    raw: match[0],
  }, raw.slice(match[0].length).trimLeft()];
}

/**?
  Parses a single move, be it a jump, a time travel, a castle or a regular, physical move.
  Does not fill in the missing details.
**/
function parse_move(raw) {
  let ptr = 0;

  let sp1 = SUPERPHYSICAL_REGEXP.exec(raw);
  if (!sp1) {
    sp1 = ["", "0", "0"];
  }
  ptr += sp1[0].length;
  let sp2 = sp1 = [parse_timeline(sp1[1]), +sp1[2] - 1];

  let piece;
  let p1 = [];
  let p2 = [];
  let takes = false;
  let jumps = false;
  let branches = false;
  let moves_present = false;
  let check = false;
  let checkmate = false;
  let softmate = false;
  let promotion = null;

  let match;

  if (match = PIECES_REGEXP.exec(raw.slice(ptr))) { // Normal move
    piece = raw.slice(ptr, ptr += match[0].length);
    if (match = /^([a-w])(\d+)(>>?)(x)?/.exec(raw.slice(ptr))) {
      // Jump/time travel
      ptr += match[0].length;
      jumps = true;
      branches = match[3].length == 2;
      takes = !!match[4];
      p1 = [letter_to_index(match[1]), +match[2]];

      sp2 = SUPERPHYSICAL_REGEXP.exec(raw.slice(ptr));
      if (!sp2) throw new Error("Invalid move: expected super-physical coordinates after the jump operator");
      ptr += sp2[0].length;
      sp2 = [parse_timeline(sp2[1]), +sp2[2] - 1];

      if (!(match = /^([a-w])(\d+)/.exec(raw.slice(ptr)))) throw new Error("Invalid move: expected target coordinates in a piece jump");
      ptr += match[0].length;
      p2 = [letter_to_index(match[1]), +match[2]];

      if (raw.slice(ptr).startsWith("+")) {
        ptr++;
        check = true;
      } else if (raw.slice(ptr).startsWith("#")) {
        ptr++;
        checkmate = true;
      } else if (raw.slice(ptr).startsWith("*")) {
        ptr++;
        softmate = true;
      }
      if (raw.slice(ptr).startsWith("~")) {
        ptr++;
        moves_present = true;
      }
    } else if (match = /^([a-w])?(\d+)?(x)?([a-w])(\d)/.exec(raw.slice(ptr))) {
      // Physical move/capture
      ptr += match[0].length;
      p1 = [letter_to_index(match[1])];
      if (match[2]) p1.push(+match[2]);
      p2 = [letter_to_index(match[4]), +match[5]];
      takes = !!match[3];

      if (raw.slice(ptr).startsWith("+")) {
        ptr++;
        check = true;
      } else if (raw.slice(ptr).startsWith("#")) {
        ptr++;
        checkmate = true;
      } else if (raw.slice(ptr).startsWith("*")) {
        ptr++;
        softmate = true;
      }
    } else throw new Error("Invalid move: unrecognized move");
  } else if (match = /^[O0]-[O0](-[O0])?/.exec(raw.slice(ptr))) {
    // Castling
    ptr += match[0].length;

    if (raw.slice(ptr).startsWith("+")) {
      ptr++;
      check = true;
    } else if (raw.slice(ptr).startsWith("#")) {
      ptr++;
      checkmate = true;
    } else if (raw.slice(ptr).startsWith("*")) {
      ptr++;
      softmate = true;
    }

    return [{
      type: "castle",
      check,
      checkmate,
      softmate,
      raw: raw.slice(0, ptr),
      from: sp1,
      long: !!match[1],
    }, raw.slice(ptr).trimLeft()];
  } else {
    // Pawn move
    piece = "P";
    let match;
    if (match = /^([a-w])x([a-w])(\d+)/.exec(raw.slice(ptr))) {
      ptr += match[0].length;
      p2 = [letter_to_index(match[2]), +match[3]];
      p1 = [letter_to_index(match[1])];
    } else if (match = /^([a-w])(\d+)/.exec(raw.slice(ptr))) {
      ptr += match[0].length;
      p2 = [letter_to_index(match[1]), +match[2]];
      p1 = [letter_to_index(match[1])];
      takes = true;
    } else throw new Error("Invalid move: invalid pawn move or missing/wrong piece name: " + raw.slice(ptr, 10) + "...");

    if (match = /^=([QRBNDU])?/.exec(raw.slice(ptr))) {
      promotion = match[1] || "Q";
      ptr += match[0].length;
    }

    if (raw.slice(ptr).startsWith("+")) {
      ptr++;
      check = true;
    } else if (raw.slice(ptr).startsWith("#")) {
      ptr++;
      checkmate = true;
    } else if (raw.slice(ptr).startsWith("*")) {
      ptr++;
      softmate = true;
    }
  }

  if (p1.length === 2) p1[1]--;
  if (p2.length === 2) p2[1]--;

  return [{
    type: "move",
    from: [...sp1, ...p1],
    to: [...sp2, ...p2],
    src_piece_raw: piece,
    takes,
    jumps,
    check,
    checkmate,
    softmate,
    raw: raw.slice(0, ptr),
    ...(jumps ? {branches} : {}),
    ...(branches ? {moves_present} : {}),
    ...(promotion ? {promotion} : {}),
  }, raw.slice(ptr).trimLeft()];
}

function write_move(move, game) {
  if (move.type == "castle" || move.castle) {
    let res = `(${write_timeline(move.from[0])}T${move.from[1] + 1})O${"-O".repeat((move.long || move.castle_long) + 1)}`;
    if (move.check) res += "+";
    if (move.checkmate) res += "#";
    if (move.softmate) res += "*";
    return res;
  }
  let res = `(${write_timeline(move.from[0])}T${move.from[1] + 1})`;
  if (move.from[0] !== move.to[0] || move.from[1] !== move.to[1]) {
    res += NUM_TO_PIECE[move.src_piece % PIECES.B_OFFSET];
    res += `${index_to_letter(move.from[2])}${move.from[3] + 1}`;
    if (move.branches) res += ">>";
    else res += ">";
    if (move.src_piece_taken_raw !== 0) res += "x";
    res += `(${write_timeline(move.to[0])}T${move.to[1] + 1})`;
    res += `${index_to_letter(move.to[2])}${move.to[3] + 1}`;
    if (move.check) res += "+";
    if (move.checkmate) res += "#";
    if (move.softmate) res += "*";
    if (move.moves_present) res += "~";
  } else {
    let omit_x = false;
    let omit_y = false;

    if (move.src_piece % PIECES.B_OFFSET !== PIECES.W_PAWN) {
      res += NUM_TO_PIECE[move.src_piece % PIECES.B_OFFSET];
    }
    if (move.src_piece % PIECES.B_OFFSET === PIECES.W_PAWN) {
      omit_y = true;
      if (move.from[2] == move.to[2]) omit_x = true;
    } else {
      let board = game.get_board(move.from[0], move.from[1] * 2 + !move.white);
      if (!board) throw new Error("Couldn't find board!");
      if (board.filter(p => p === move.src_piece).length == 1) {
        omit_x = true;
        omit_y = true;
      } else {
        [omit_x, omit_y] = game.can_omit(move.src_piece, move.from, move.to, move.white);
      }
    }

    res += `${omit_x ? "" : index_to_letter(move.from[2])}${omit_y ? "" : move.from[3] + 1}`;
    if (move.src_piece_taken_raw !== 0) res += "x";
    res += `${index_to_letter(move.to[2])}${move.to[3] + 1}`;
    if (move.check) res += "+";
    if (move.checkmate) res += "#";
    if (move.softmate) res += "*";
  }
  return res;
}

function parse_comment(raw) {
  let to = raw.split("").findIndex(e => e == "}");
  return [{
    type: "comment",
    value: raw.slice(1, to),
  }, raw.slice(to + 1).trimLeft()];
}

// TODO: parse_branch?
