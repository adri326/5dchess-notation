import {PIECES, MOVE_KIND, index_to_letter, write_timeline} from "./parsers/game.js";

export const WHITE_FG = "{#20d0f0-fg}{bold}";
export const BLACK_FG = "{#f06036-fg}{bold}";
export const WHITE_BG = "{#333-bg}";
export const BLACK_BG = "{black-bg}";
export const MOVE_BG = "{#660-bg}";
export const JUMP_BG = "{#66a-bg}";
export const SELECTION_HIGHLIGHT = "gray";
export const JUMP_HIGHLIGHT = "#66a";
export const BLACK_BG_ON = "black";
export const BLACK_BG_OFF = null;

export const PIECE_CHAR = {
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
  [PIECES.B_PAWN]: BLACK_FG + "p" + "{/}",
  [PIECES.B_KNIGHT]: BLACK_FG + "n" + "{/}",
  [PIECES.B_BISHOP]: BLACK_FG + "b" + "{/}",
  [PIECES.B_ROOK]: BLACK_FG + "r" + "{/}",
  [PIECES.B_QUEEN]: BLACK_FG + "q" + "{/}",
  [PIECES.B_KING]: BLACK_FG + "k" + "{/}",
  [PIECES.B_UNICORN]: BLACK_FG + "u" + "{/}",
  [PIECES.B_DRAGON]: BLACK_FG + "d" + "{/}",
  [PIECES.B_PRINCESS]: BLACK_FG + "s" + "{/}",
  [PIECES.MARKER]: "*",
}

export const PIECE_CHAR_UNICODE = {
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
  [PIECES.B_PAWN]: BLACK_FG + "♟︎" + "{/}",
  [PIECES.B_KNIGHT]: BLACK_FG + "♞" + "{/}",
  [PIECES.B_BISHOP]: BLACK_FG + "♝" + "{/}",
  [PIECES.B_ROOK]: BLACK_FG + "♜" + "{/}",
  [PIECES.B_QUEEN]: BLACK_FG + "♛" + "{/}",
  [PIECES.B_KING]: BLACK_FG + "♚" + "{/}",
  [PIECES.B_UNICORN]: BLACK_FG + "u" + "{/}",
  [PIECES.B_DRAGON]: BLACK_FG + "d" + "{/}",
  [PIECES.B_PRINCESS]: BLACK_FG + "s" + "{/}",
  [PIECES.MARKER]: "*",
};

export function preview(game, use_unicode = false, multi_board = false, black_bg = false) {
  let piece_set = use_unicode ? PIECE_CHAR_UNICODE : PIECE_CHAR;
  import("blessed").then((blessed) => {
    blessed = blessed.default;
    if (multi_board) {
      import("./preview-multi.js").then((multi) => {
        multi.run(game, piece_set, black_bg ? BLACK_BG_ON : BLACK_BG_OFF, blessed);
      }).catch(console.error);
    } else {
      import("./preview-single.js").then((single) => {
        single.run(game, piece_set, black_bg ? BLACK_BG_ON : BLACK_BG_OFF, blessed);
      }).catch(console.error);
    }
  }).catch((err) => {
    console.log("Couldn't load module 'blessed': did you install it with `npm i blessed`?");
    console.error(err);
  });
}

export function timeline_above(n, game) {
  if (game.board_indices.find(x => x === 0.5)) {
    if (n === -1) return -0.5;
    if (n === 0.5) return 1;
    else return n + 1;
  } else {
    return n + 1;
  }
}

export function timeline_below(n, game) {
  if (game.board_indices.find(x => x === 0.5)) {
    if (n === 1) return 0.5;
    if (n === -0.5) return -1;
    else return n - 1;
  } else {
    return n - 1;
  }
}

export function shift_timeline(l, dl, game) {
  if (dl > 0) while (dl-- > 0) l = timeline_above(l, game);
  else if (dl < 0) while (dl++ < 0) l = timeline_below(l, game);
  return l;
}

export function write_move(move) {
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
