const {PIECES, MOVE_KIND, index_to_letter, write_timeline} = require("./parsers/game.js");
const blessed = require("blessed");
const multi = require("./preview-multi.js");
const single = require("./preview-single.js");

// TODO: handle negative time!

const WHITE_FG = "{#20d0f0-fg}{bold}";
exports.WHITE_FG = WHITE_FG;
const BLACK_FG = "{#f06036-fg}{bold}";
exports.BLACK_FG = BLACK_FG;
const WHITE_BG = "{#333-bg}";
exports.WHITE_BG = WHITE_BG;
const BLACK_BG = "{black-bg}";
exports.BLACK_BG = BLACK_BG;
const MOVE_BG = "{#660-bg}";
exports.MOVE_BG = MOVE_BG;
const JUMP_BG = "{#66a-bg}";
exports.JUMP_BG = JUMP_BG;
const SELECTION_HIGHLIGHT = "gray";
exports.SELECTION_HIGHLIGHT = SELECTION_HIGHLIGHT;
const JUMP_HIGHLIGHT = "#66a";
exports.JUMP_HIGHLIGHT = JUMP_HIGHLIGHT;
const BLACK_BG_ON = "black";
exports.BLACK_BG_ON = BLACK_BG_ON;
const BLACK_BG_OFF = null;
exports.BLACK_BG_OFF = BLACK_BG_OFF;

const PIECE_CHAR = {
  [PIECES.BLANK]: " ",
  [PIECES.W_PAWN]: WHITE_FG + "P" + "{/}",
  [PIECES.W_KNIGHT]: WHITE_FG + "N" + "{/}",
  [PIECES.W_BISHOP]: WHITE_FG + "B" + "{/}",
  [PIECES.W_ROOK]: WHITE_FG + "R" + "{/}",
  [PIECES.W_QUEEN]: WHITE_FG + "Q" + "{/}",
  [PIECES.W_KING]: WHITE_FG + "K" + "{/}",
  [PIECES.W_UNICORN]: WHITE_FG + "U" + "{/}",
  [PIECES.W_DRAGON]: WHITE_FG + "D" + "{/}",
  [PIECES.W_PRINCESS]: WHITE_FG + "S" + "{/}",
  [PIECES.W_BRAWN]: WHITE_FG + "W" + "{/}",
  [PIECES.W_CKING]: WHITE_FG + "C" + "{/}",
  [PIECES.W_RQUEEN]: WHITE_FG + "Y" + "{/}",
  [PIECES.B_PAWN]: BLACK_FG + "p" + "{/}",
  [PIECES.B_KNIGHT]: BLACK_FG + "n" + "{/}",
  [PIECES.B_BISHOP]: BLACK_FG + "b" + "{/}",
  [PIECES.B_ROOK]: BLACK_FG + "r" + "{/}",
  [PIECES.B_QUEEN]: BLACK_FG + "q" + "{/}",
  [PIECES.B_KING]: BLACK_FG + "k" + "{/}",
  [PIECES.B_UNICORN]: BLACK_FG + "u" + "{/}",
  [PIECES.B_DRAGON]: BLACK_FG + "d" + "{/}",
  [PIECES.B_PRINCESS]: BLACK_FG + "s" + "{/}",
  [PIECES.B_BRAWN]: BLACK_FG + "w" + "{/}",
  [PIECES.B_CKING]: BLACK_FG + "c" + "{/}",
  [PIECES.B_RQUEEN]: BLACK_FG + "y" + "{/}",
  [PIECES.MARKER]: "*",
};
exports.PIECE_CHAR = PIECE_CHAR;

PIECE_CHAR_UNICODE = {
  [PIECES.BLANK]: " ",
  [PIECES.W_PAWN]: WHITE_FG + "♙" + "{/}",
  [PIECES.W_KNIGHT]: WHITE_FG + "♘" + "{/}",
  [PIECES.W_BISHOP]: WHITE_FG + "♗" + "{/}",
  [PIECES.W_ROOK]: WHITE_FG + "♖" + "{/}",
  [PIECES.W_QUEEN]: WHITE_FG + "♕" + "{/}",
  [PIECES.W_KING]: WHITE_FG + "♔" + "{/}",
  [PIECES.W_UNICORN]: WHITE_FG + "U" + "{/}",
  [PIECES.W_DRAGON]: WHITE_FG + "D" + "{/}",
  [PIECES.W_PRINCESS]: WHITE_FG + "S" + "{/}",
  [PIECES.W_BRAWN]: WHITE_FG + "W" + "{/}",
  [PIECES.W_CKING]: WHITE_FG + "C" + "{/}",
  [PIECES.W_RQUEEN]: WHITE_FG + "Y" + "{/}",
  [PIECES.B_PAWN]: BLACK_FG + "♟︎" + "{/}",
  [PIECES.B_KNIGHT]: BLACK_FG + "♞" + "{/}",
  [PIECES.B_BISHOP]: BLACK_FG + "♝" + "{/}",
  [PIECES.B_ROOK]: BLACK_FG + "♜" + "{/}",
  [PIECES.B_QUEEN]: BLACK_FG + "♛" + "{/}",
  [PIECES.B_KING]: BLACK_FG + "♚" + "{/}",
  [PIECES.B_UNICORN]: BLACK_FG + "u" + "{/}",
  [PIECES.B_DRAGON]: BLACK_FG + "d" + "{/}",
  [PIECES.B_PRINCESS]: BLACK_FG + "s" + "{/}",
  [PIECES.B_BRAWN]: BLACK_FG + "w" + "{/}",
  [PIECES.B_CKING]: BLACK_FG + "c" + "{/}",
  [PIECES.B_RQUEEN]: BLACK_FG + "y" + "{/}",
  [PIECES.MARKER]: "*",
};
exports.PIECE_CHAR_UNICODE = PIECE_CHAR_UNICODE;

function preview(game, use_unicode = false, multi_board = false, black_bg = false) {
  let piece_set = use_unicode ? PIECE_CHAR_UNICODE : PIECE_CHAR;
  if (multi_board) {
    multi.run(game, piece_set, black_bg ? BLACK_BG_ON : BLACK_BG_OFF, blessed);
  } else {
    single.run(game, piece_set, black_bg ? BLACK_BG_ON : BLACK_BG_OFF, blessed);
  };
}
exports.preview = preview;

function timeline_above(n, game) {
  if (game.board_indices.find(x => x === 0.5)) {
    if (n === -1) return -0.5;
    if (n === 0.5) return 1;
    else return n + 1;
  } else {
    return n + 1;
  }
}
exports.timeline_above = timeline_above;

function timeline_below(n, game) {
  if (game.board_indices.find(x => x === 0.5)) {
    if (n === 1) return 0.5;
    if (n === -0.5) return -1;
    else return n - 1;
  } else {
    return n - 1;
  }
}
exports.timeline_below = timeline_below;

function shift_timeline(l, dl, game) {
  if (dl > 0) while (dl-- > 0) l = timeline_above(l, game);
  else if (dl < 0) while (dl++ < 0) l = timeline_below(l, game);
  return l;
}
exports.shift_timeline = shift_timeline;

function write_move(move) {
  let res;
  if (move.kind === MOVE_KIND.JUMP_OUT) {
    res = `${PIECE_CHAR[move.piece]}${index_to_letter(move.from[2])}${move.from[3] + 1} {yellow-fg}→{/} (${write_timeline(move.to[0])}T${move.to[1] + 1})`;
  } else if (move.kind === MOVE_KIND.JUMP_IN) {
    res = `(${write_timeline(move.to[0])}T${move.to[1] + 1})${index_to_letter(move.to[2])}${move.to[3] + 1} {yellow-fg}←{/} (${write_timeline(move.from[0])}T${move.from[1] + 1})${PIECE_CHAR[move.piece]}`
  } else if (move.kind === MOVE_KIND.CASTLE_SHORT) {
    res = "O-O";
  } else if (move.kind === MOVE_KIND.CASTLE_LONG) {
    res = "O-O-O";
  } else {
    if (move.piece % PIECES.B_OFFSET === PIECES.W_PAWN) {
      if (move.piece_taken !== PIECES.BLANK) {
        res = `${move.white ? WHITE_FG : BLACK_FG}${index_to_letter(move.from[2])}{/}x${index_to_letter(move.to[2])}${move.to[3] + 1}`
      } else {
        res = `${move.white ? WHITE_FG : BLACK_FG}${index_to_letter(move.to[2])}${move.to[3] + 1}{/}`
      }
    } else {
      res = `${PIECE_CHAR[move.piece]}${index_to_letter(move.from[2])}${move.from[3] + 1}${move.piece_taken !== PIECES.BLANK ? " x " : " "}${index_to_letter(move.to[2])}${move.to[3] + 1}`;
    }
  }

  if (move.checkmate) {
    res += "{yellow-fg}#{/}";
  } else if (move.check) {
    res += "{yellow-fg}+{/}";
  } else if (move.softmate) {
    res += "{yellow-fg}*{/}";
  }

  return res;
}
exports.write_move = write_move;
