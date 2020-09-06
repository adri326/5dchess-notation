/**!
  Contains various bits useful for parsing and handling different notations.

  The inner, coordinate format is as follows:
  [l, t, x, y]
  Where `l` is the index of the branch, `t` is the turn (**starts at 0**), `x` is the X coordinate (**starts at 0**) and `y` is the Y coordinate (**starts at 0**).

  Functions which work with a `white` parameter will accept as `t` the value that is seen on the game, minus one.
  Others will accept as `t` the actual index of the board (`t = 2*t' + !white`, with `t'` the visible board index minus one).
**/

export const PIECES = {
  BLANK: 0,
  W_PAWN: 1,
  W_KNIGHT: 2,
  W_BISHOP: 3,
  W_ROOK: 4,
  W_QUEEN: 5,
  W_KING: 6,
  W_UNICORN: 7,
  W_DRAGON: 8,
  B_PAWN: 11,
  B_KNIGHT: 12,
  B_BISHOP: 13,
  B_ROOK: 14,
  B_QUEEN: 15,
  B_KING: 16,
  B_UNICORN: 17,
  B_DRAGON: 18,

  MARKER: 99,

  B_OFFSET: 10,
};

export const PIECE_CHAR = {
  [PIECES.BLANK]: ".",
  [PIECES.W_PAWN]: "P",
  [PIECES.W_KNIGHT]: "N",
  [PIECES.W_BISHOP]: "B",
  [PIECES.W_ROOK]: "R",
  [PIECES.W_QUEEN]: "Q",
  [PIECES.W_KING]: "K",
  [PIECES.W_UNICORN]: "U",
  [PIECES.W_DRAGON]: "D",
  [PIECES.B_PAWN]: "p",
  [PIECES.B_KNIGHT]: "n",
  [PIECES.B_BISHOP]: "b",
  [PIECES.B_ROOK]: "r",
  [PIECES.B_QUEEN]: "q",
  [PIECES.B_KING]: "k",
  [PIECES.B_UNICORN]: "u",
  [PIECES.B_DRAGON]: "d",
  [PIECES.MARKER]: "*",
};

export const MOVE_KIND = {
  MOVE: 0,
  JUMP_OUT: 1,
  JUMP_IN: 2,
  CASTLE_SHORT: 3,
  CASTLE_LONG: 4,
};

export const BOARDS = {
  "STANDARD": ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", "0", "8x8"],
  "MISC - SMALL": ["kqbnr/ppppp/5/PPPPP/KQBNR", "0", "5x5"],
  "MISC - TIMELINE INVASION": ["nbkrb/ppppp/5/5/PPPPP ppppp/5/5/PPPPP/NBKRB", "-0 +0", "5x5"],
  "SIMPLE - NO QUEENS": ["rnbknbr/ppppppp/7/7/7/PPPPPPP/RNBKNBR", "0", "7x7"],
  "SIMPLE - KNIGHTS VS. BISHOP": ["rbqkbr/pppppp/6/6/PPPPPP/RNQKNR", "0", "6x6"],
  "SIMPLE - NO BISHOPS": ["rnqknr/pppppp/6/6/PPPPPP/RNQKNR", "0", "6x6"],
  "SIMPLE - NO KNIGHTS": ["rbqkbr/pppppp/6/6/PPPPPP/RBQKBR", "0", "6x6"],
  "SIMPLE - NO ROOKS": ["nbqkbn/pppppp/6/6/PPPPPP/NBQKBN", "0", "6x6"],
  "MISC - SMALL FLIPPED": ["nbrqk/ppppp/5/PPPPP/KQRBN", "0", "5x5"],
  "MISC - SMALL CENTERED": ["rnkqr/ppppp/5/PPPPP/RQKNR", "0", "5x5"],
  "MISC - SMALL OPEN": ["prnbk/3pp/5/PP3/KBNRP", "0", "5x5"],
  "MISC - VERY SMALL": ["krbn/pppp/PPPP/KRBN", "0", "4x4"],
  "MISC - VERY SMALL OPEN": ["nbrk/4p/P4/KRBN", "0", "4x4"],
  "MISC - TIMELINE FORMATIONS": ["ppppp/5/5/5/2K2 2k2/5/5/5/PPPPP", "-0 +0", "5x5"],
  "MISC - TIMELINE TACTITIAN": ["kbnr/pppp/4/4 4/4/PPPP/KBNR", "-0 +0", "4x4"],
  "MISC - TIMELINE STRATEGOS": ["nbkur/ppppp/5/5/5 5/5/5/PPPPP/RUKBN", "-0 +0", "5x5"],
  "MISC - TIMELINE BATTLEGROUNDS": ["rrkrr/bbqbb/ppppp/5/PPPPP nnnnn/ppppp/5/PPPPP/NNNNN ppppp/5/PPPPP/BBQBB/RRKRR", "-1 0 1", "5x5"],
  "MISC - EXCESSIVE": ["kruqdrk/rnbknbr/ppppppp/7/PPPPPPP/RNBKNBR/KRUQDRK", "0", "7x7"],
  "MISC - REFLECTED STANDARD": ["rnbkqbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBKQBNR", "0", "8x8"],
  "MISC - GLOBAL WARMING": ["1", "0", "1x1"],
  "FOCUSED - JUST KNIGHTS": ["n1kn1/5/5/5/1NK1N", "0", "5x5"],
  "FOCUSED - JUST BISHOPS": ["1bbk1/5/5/5/1KBB1", "0", "5x5"],
  "FOCUSED - JUST ROOKS": ["1rk1r/5/5/5/R1KR1", "0", "5x5"],
  "FOCUSED - JUST QUEENS": ["1q1k2/6/6/6/6/2K1Q1", "0", "6x6"],
  "FOCUSED - JUST PAWNS": ["ppppk/5/5/5/KPPPP", "0", "5x5"],
  "FOCUSED - JUST KINGS": ["2k/3/k2", "0", "3x3"],
  "FOCUSED - JUST UNICORNS": ["1u1uk/5/5/5/KU1U1", "0", "5x5"],
  "FOCUSED - JUST DRAGONS": ["2ddk/5/5/5/KDD2", "0", "5x5"],
  "CHECKMATE PRACTICE - KNIGHT": ["5n/6/6/6/6/K5", "0", "6x6"],
  "CHECKMATE PRACTICE - BISHOP": ["4b1/6/6/6/6/K5", "0", "6x6"],
  "CHECKMATE PRACTICE - ROOK": ["5r/6/6/6/6/K5", "0", "6x6"],
  "CHECKMATE PRACTICE - KNIGHT": ["5n/6/6/6/6/K5", "0", "6x6"],
  "CHECKMATE PRACTICE - QUEEN": ["4q1/6/6/6/6/K5", "0", "6x6"],
  "CHECKMATE PRACTICE - KNIGHT": ["5n/6/6/6/6/K5", "0", "6x6"],
  "CHECKMATE PRACTICE - PAWNS": ["2ppp1/6/6/6/6/3K2", "0", "6x6"]
};

export const OMIT = {
  NONE: 0,
  X: 1,
  Y: 2,
  BOTH: 3,
};

export class Game {
  /**?
    Constructs a new boardset, with `board_indices.length` initial boards
  **/
  constructor(width, height, board_indices = [0]) {
    this.width = width;
    this.height = height;
    this.board_indices = board_indices;
    this.initial_board_indices = [...board_indices];
    this.timelines = new Array(board_indices.length).fill(null).map((_, i) => new Timeline(width, height, board_indices[i]));
    this.moves = [];
    this.active_player = true;
  }

  /**?
    Parses a FEN-formatted board (or boards, separated by spaces). Overwrites the first board.
  **/
  parse_fen(fen) {
    let boards = fen.split(" ");
    for (let n = 0; n < this.board_indices.length; n++) {
      let board = this.timelines[n].states[0] = [];
      let rows = boards[n].split("/");
      rows.reverse();

      if (rows.length != this.height) {
        throw new Error("Invalid FEN: expected " + this.height + " rows!");
      }

      for (let row in rows) {
        let chars = rows[row].split("");

        for (let n = 0, o = 0; n < this.width; n++, o++) {
          switch (chars[o]) {
            case "p": board.push(PIECES.B_PAWN); break;
            case "n": board.push(PIECES.B_KNIGHT); break;
            case "b": board.push(PIECES.B_BISHOP); break;
            case "r": board.push(PIECES.B_ROOK); break;
            case "q": board.push(PIECES.B_QUEEN); break;
            case "k": board.push(PIECES.B_KING); break;
            case "u": board.push(PIECES.B_UNICORN); break;
            case "d": board.push(PIECES.B_DRAGON); break;
            case "P": board.push(PIECES.W_PAWN); break;
            case "N": board.push(PIECES.W_KNIGHT); break;
            case "B": board.push(PIECES.W_BISHOP); break;
            case "R": board.push(PIECES.W_ROOK); break;
            case "Q": board.push(PIECES.W_QUEEN); break;
            case "K": board.push(PIECES.W_KING); break;
            case "U": board.push(PIECES.W_UNICORN); break;
            case "D": board.push(PIECES.W_DRAGON); break;
            default:
              if (/^\d$/.exec(chars[o])) {
                for (let p = 0; p < +chars[o]; p++) {
                  board.push(PIECES.BLANK);
                }
                n += +chars[o] - 1;
              } else throw new Error("Unexpected character in FEN: " + chars[o]);
          }
        }
      }
    }
  }

  get_board(l, t) {
    let timeline = this.timelines.find(board => board.index === l);
    if (timeline == null) return null;
    return timeline.states[t - timeline.begins_at];
  }

  get_board_as(l, t, white) {
    let timeline = this.timelines.find(board => board.index === l);
    if (timeline == null) return null;
    return timeline.states[t * 2 + !white - timeline.begins_at];
  }

  get(l, t, x, y) {
    let board = this.get_board(l, t);
    if (!board) return null;
    return board[x + y * this.width];
  }

  get_as(l, t, x, y, white) {
    let board = this.get_board_as(l, t, white);
    if (!board) return null;
    return board[x + y * this.width];
  }

  is_present(l, t) {
    let timeline = this.timelines.find(board => board.index === l);
    if (timeline == null) return null;
    return timeline.states.length - 1 === t - timeline.begins_at;
  }

  push_board(l, board) {
    let timeline = this.timelines.find(board => board.index === l);
    if (timeline == null) return false;
    timeline.states.push(board);
    timeline.turn = !timeline.turn;
    return true;
  }

  record_move(l, kind, piece, from, to, white, piece_taken) {
    let timeline = this.timelines.find(board => board.index === l);
    if (timeline == null) return false;
    timeline.moves.push({
      kind,
      piece,
      from,
      to,
      white,
      piece_taken,
    });
    return true;
  }

  can_move(piece, from, to, white) {
    if (from[0] === to[0] && from[1] === to[1] && from[2] === to[2] && from[3] === to[3]) return false;
    switch (piece) {
      case PIECES.W_PAWN:
        if (this.is_en_passant(from, to, white)) return true;
        if (this.get_as(...to, white) != PIECES.BLANK) {
          return from[0] === to[0]
            && from[1] === to[1]
            && (from[2] === to[2] + 1 || from[2] === to[2] - 1)
            && from[3] === to[3] - 1
            || from[0] === to[0] - 1
            && from[1] === to[1] + 1
            && from[2] === to[2]
            && from[3] === to[3];
        } else {
          return from[0] === to[0]
            && from[1] === to[1]
            && from[2] === to[2]
            && (
              from[3] === to[3] - 1
              || from[3] === to[3] - 2 && this.get_as(to[0], to[1], to[2], to[3] - 1, white) === PIECES.BLANK
            )
            || from[0] === to[1] - 1
            && from[1] === to[1]
            && from[2] === to[2]
            && from[3] === to[3]
        }
        break;
      case PIECES.B_PAWN:
        if (this.is_en_passant(from, to, white)) return true;
        if (this.get_as(...to, white) != PIECES.BLANK) {
          return from[0] === to[0]
            && from[1] === to[1]
            && (from[2] === to[2] + 1 || from[2] === to[2] - 1)
            && from[3] === to[3] + 1
            || from[0] === to[0] + 1
            && from[1] === to[1] + 1
            && from[2] === to[2]
            && from[3] === to[3];
        } else {
          return from[0] === to[0]
            && from[1] === to[1]
            && from[2] === to[2]
            && (
              from[3] === to[3] + 1
              || from[3] === to[3] + 2 && this.get_as(to[0], to[1], to[2], to[3] + 1, white) === PIECES.BLANK
            )
            || from[0] === to[0] + 1
            && from[1] === to[1]
            && from[2] === to[2]
            && from[3] === to[3]
        }
        break;
      case PIECES.W_KNIGHT:
      case PIECES.B_KNIGHT: {
        let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
        a = a.map(x => Math.abs(x)).sort().reverse();
        return a[0] === 2 && a[1] === 1 && a[2] === 0 && a[3] === 0;
      }
      case PIECES.W_ROOK:
      case PIECES.B_ROOK: {
        let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
        a = a.map(x => Math.abs(x)).sort().reverse();
        return a[1] === 0 && a[2] === 0 && a[3] === 0 && this.path_clear(from, to, white);
      }
      case PIECES.W_BISHOP:
      case PIECES.B_BISHOP: {
        let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
        a = a.map(x => Math.abs(x)).sort().reverse();
        return a[0] === a[1] && a[2] === 0 && a[3] === 0 && this.path_clear(from, to, white);
      }
      case PIECES.W_UNICORN:
      case PIECES.B_UNICORN: {
        let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
        a = a.map(x => Math.abs(x)).sort().reverse();
        return a[0] === a[1] && a[1] === a[2] && a[3] === 0 && this.path_clear(from, to, white);
      }
      case PIECES.W_DRAGON:
      case PIECES.B_DRAGON: {
        let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
        a = a.map(x => Math.abs(x)).sort().reverse();
        return a[0] === a[1] && a[1] === a[2] && a[2] === a[3] && this.path_clear(from, to, white);
      }
      case PIECES.W_QUEEN:
      case PIECES.B_QUEEN: {
        let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
        a = a.map(x => Math.abs(x)).sort().reverse();
        return (
            a[1] === 0 && a[2] === 0 && a[3] === 0
            || a[0] === a[1] && a[2] === 0 && a[3] === 0 // diagonal
            || a[0] === a[1] && a[1] === a[2] && a[3] === 0 // trigonal
            || a[0] === a[1] && a[1] === a[2] && a[2] === a[3] // quadragonal
          ) && this.path_clear(from, to, white);
      }
      case PIECES.W_KING:
      case PIECES.B_KING: {
        let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
        a = a.map(x => Math.abs(x)).sort().reverse();
        return a.every(x => x < 2);
      }
    }
  }

  is_en_passant(from, to, white) {
    if (from[0] === to[0] && from[1] === to[1] && (from[2] === to[2] + 1 || from[2] === to[2] - 1)) {
      return this.get_as(...to, white) === PIECES.BLANK
        && this.get_as(to[0], to[1] - 1, to[2], to[3] + (white ? -1 : 1), white) === PIECES.BLANK
        && this.get_as(to[0], to[1], to[2], to[3] + (white ? -1 : 1), white) === PIECES.W_PAWN + PIECES.B_OFFSET * white
        && this.get_as(to[0], to[1] - 1, to[2], to[3] + (white ? 1 : -1), white) === PIECES.W_PAWN + PIECES.B_OFFSET * white
        && this.get_as(to[0], to[1], to[2], to[3] + (white ? 1 : -1), white) === PIECES.BLANK
    }
  }

  /**?
    Checks that the path from `from` to `to` is clear as `white`. Asserts that this path is an n-gonal.
  **/
  path_clear(from, to, white) {
    let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
    let length = Math.abs([...a].sort()[0]);
    let inc = a.map(x => x / length);
    for (let n = 1; n < length; n++) {
      if (this.get_as(
        from[0] + inc[0] * n,
        from[1] + inc[1] * n,
        from[2] + inc[2] * n,
        from[3] + inc[3] * n,
        white
      ) !== PIECES.BLANK) return false;
    }
    return true;
  }


  /**?
    Returns if parts of a move's source coordinates can be omitted
  **/
  can_omit(piece, from, to, white) {
    let board = this.get_board_as(from[0], from[1], white);
    if (!board) throw new Error("No board found matching " + from[0] + ":" + from[1]);
    let candidates = [...board.entries()].filter(([i, p]) => p === piece);
    let candidates_x = candidates.filter(([i]) => i % this.width === from[2]);
    let candidates_y = candidates.filter(([i]) => ~~(i / this.width) === from[3]);
    let filter = ([i, p]) => this.can_move(piece, [from[0], from[1], i % this.width, ~~(i / this.width)], to, white);
    candidates = candidates.filter(filter);
    candidates_x = candidates_x.filter(filter);
    candidates_y = candidates_y.filter(filter);

    if (candidates.length === 1) {
      return [true, true];
    } else {
      if (candidates_x.length === 1) {
        return [true, false];
      } else if (candidates_y.length === 1) {
        return [false, true];
      }
      return [false, false];
    }
  }

  /**?
    Plays the move and returns information on the move done
  **/
  play(piece, from, to, white, promotion) {
    let source_board = this.get_board(from[0], from[1] * 2 + !white);
    let target_board = this.get_board(to[0], to[1] * 2 + !white);
    if (!source_board) {
      throw new Error(`Invalid source board: ${from} (${from[0]}, ${from[1] * 2 + !white})`);
    }
    if (!target_board) {
      throw new Error(`Invalid target board: ${to} (${to[0]}, ${to[1] * 2 + !white})`);
    }

    if (from[2] === -1 || from[3] === -1 || from.length < 4) {
      let has_x = from[2] !== -1 && from.length > 2;
      let has_y = from[3] !== -1 && from.length > 3;

      // re-determine the origin position
      let candidates = [...source_board.entries()].filter(([i, p]) => p === piece);
      if (has_x) {
        candidates = candidates.filter(([i, p]) => i % this.width === from[2]);
      }
      if (has_y) {
        candidates = candidates.filter(([i, p]) => ~~(i / this.width) === from[3]);
      }

      candidates = candidates.filter(([i, p]) => this.can_move(
        p,
        [from[0], from[1], i % this.width, ~~(i / this.width)],
        to,
        white
      ));

      if (candidates.length > 1) {
        throw new Error(
          `Ambiguous move: two or more source pieces could be found: `
          + candidates.map(([i, p]) =>
            `${index_to_letter(i % this.width)}${~~(i / this.width) + 1}`
          ).join(", ")
        );
      } else if (candidates.length === 0) {
        throw new Error(`No piece candidate found! (${write_timeline(from[0])}T${from[1] + 1})${has_x ? index_to_letter(from[2]) : ""}${has_y ? from[3] + 1 : ""} to (${write_timeline(to[0])}T${to[1] + 1})${index_to_letter(to[2])}${to[3] + 1}; ${PIECE_CHAR[piece]}`);
      }
      from[2] = candidates[0][0] % this.width;
      from[3] = ~~(candidates[0][0] / this.width);
      // TODO: filter according to checking positions
    }

    let piece_taken = target_board[to[2] + to[3] * this.width];
    let new_index = null;

    if (source_board === target_board) {
      let new_board = [...source_board];
      new_board[from[2] + from[3] * this.width] = PIECES.BLANK;
      if (promotion) {
        new_board[to[2] + to[3] * this.width] = promotion;
      } else {
        new_board[to[2] + to[3] * this.width] = piece;
      }
      if (this.is_en_passant(from, to, white)) {
        new_board[to[2] + (to[3] + (white ? -1 : 1)) * this.width] = PIECES.BLANK;
      }
      if (!this.push_board(from[0], new_board)) throw new Error("Couldn't push board");

      this.record_move(from[0], MOVE_KIND.MOVE, piece, from, to, white, piece_taken);
    } else if (this.is_present(to[0], to[1] * 2 + !white)) {
      let new_source_board = [...source_board];
      let new_target_board = [...target_board];
      new_source_board[from[2] + from[3] * this.width] = PIECES.BLANK;
      new_target_board[to[2] + to[3] * this.width] = piece;
      if (!this.push_board(from[0], new_source_board)) throw new Error("Couldn't push board");
      if (!this.push_board(to[0], new_target_board)) throw new Error("Couldn't push board");

      this.record_move(from[0], MOVE_KIND.JUMP_OUT, piece, from, to, white, piece_taken);
      this.record_move(to[0], MOVE_KIND.JUMP_IN, piece, from, to, white, piece_taken);
    } else {
      let new_source_board = [...source_board];
      let new_target_board = [...target_board];
      new_source_board[from[2] + from[3] * this.width] = PIECES.BLANK;
      new_target_board[to[2] + to[3] * this.width] = piece;
      if (!this.push_board(from[0], new_source_board)) throw new Error("Couldn't push board");
      this.record_move(from[0], MOVE_KIND.JUMP_OUT, piece, from, to, white, piece_taken);

      if (white) {
        new_index = ~~this.highest_timeline() + 1;
      } else {
        new_index = ~~this.lowest_timeline() - 1;
      }

      let new_timeline = new Timeline(this.width, this.height, new_index, to[1] * 2 + !white + 1, to[0]);
      new_timeline.turn = !white;
      new_timeline.states = [new_target_board];
      this.timelines.push(new_timeline);
      this.board_indices.push(new_index);
      this.record_move(new_index, MOVE_KIND.JUMP_IN, piece, from, to, white, piece_taken);
    }

    return {
      from,
      to,
      ...(new_index !== null ? {new_index} : {}),
      piece_taken,
      takes: piece_taken !== PIECES.BLANK,
    };
  }

  castle(piece, from, long, white) {
    let king_candidates = [...this.get_board_as(from[0], from[1], white).entries()].filter(([i, p]) =>
      p === PIECES.W_KING + !white * PIECES.B_OFFSET
    );
    let rook_candidates = [...this.get_board_as(from[0], from[1], white).entries()].filter(([i, p]) =>
      p === PIECES.W_ROOK + !white * PIECES.B_OFFSET
    );
    this.bubble_up_as(from[0], from[1], (board, l, t) => {
      king_candidates = king_candidates.filter(([i, p]) => board[i] === p);
      rook_candidates = rook_candidates.filter(([i, p]) => board[i] === p);
    }, white);

    if (king_candidates.length > 1) {
      throw new Error(
        "Ambiguous castling: several kings are eligible ("
        + king_candidates.map(([i]) =>
          `${index_to_letter(i % this.width)}${~~(i / this.width)}`
        ).join(", ")
        + ")"
      );
    } else if (king_candidates.length === 0) {
      throw new Error("No valid king found to castle!");
    }

    rook_candidates = rook_candidates.filter(([i]) => ~~(i / this.width) === ~~(king_candidates[0][0] / this.width));

    rook_candidates = rook_candidates.sort(([i], [j]) => i - j);

    if (long) { // castle to the rightmost left rook
      rook_candidates = rook_candidates.filter(([i]) => i % this.width < king_candidates[0][0] % this.width);
      rook_candidates = rook_candidates.slice(-1);
    } else {
      rook_candidates = rook_candidates.filter(([i]) => i % this.width > king_candidates[0][0] % this.width);
      rook_candidates = rook_candidates.slice(0, 1);
    }

    if (!rook_candidates.length) throw new Error("No valid rooks found to castle!");

    let source_board = this.get_board_as(from[0], from[1], white);
    let new_source_board = [...source_board];
    let y = ~~(rook_candidates[0][0] / this.width);

    new_source_board[rook_candidates[0][0]] = PIECES.BLANK;
    new_source_board[king_candidates[0][0]] = PIECES.BLANK;
    new_source_board[(long ? 2 : this.width - 2) + y * this.width] = PIECES.W_KING + !white * PIECES.B_OFFSET;
    new_source_board[(long ? 3 : this.width - 3) + y * this.width] = PIECES.W_ROOK + !white * PIECES.B_OFFSET;

    if (!this.push_board(from[0], new_source_board)) throw new Error("Couldn't push board");

    this.record_move(
      from[0],
      long ? MOVE_KIND.CASTLE_LONG : MOVE_KIND.CASTLE_SHORT,
      PIECES.W_KING + !white * PIECES.B_OFFSET,
      [
        from[0],
        from[1],
        king_candidates[0][0] % this.width,
        y
      ],
      [
        from[0],
        from[1],
        long ? 2 : this.width - 1,
        y
      ],
      white,
      PIECES.BLANK,
    );
  }

  lowest_active_timeline(white = null) {
    let index = this.highest_timeline();
    for (let timeline of this.timelines) {
      if ((timeline.active_player() == white || white === null) && timeline.index < index) {
        index = timeline.index;
      }
    }
    return index;
  }

  highest_active_timeline(white = null) {
    let index = this.lowest_timeline();
    for (let timeline of this.timelines) {
      if ((timeline.active_player() == white || white === null) && timeline.index > index) {
        index = timeline.index;
      }
    }
    return index;
  }

  lowest_timeline() {
    let index = Infinity;
    for (let timeline of this.timelines) {
      if (timeline.index < index) {
        index = timeline.index;
      }
    }
    return index;
  }

  highest_timeline() {
    let index = -Infinity;
    for (let timeline of this.timelines) {
      if (timeline.index > index) {
        index = timeline.index;
      }
    }
    return index;
  }

  get_last_turn_in(l) {
    let timeline = this.timelines.find(board => board.index === l);
    if (timeline == null) return null;
    return ~~((timeline.states.length + timeline.begins_at - 1) / 2);
  }

  get_timeline(l) {
    let timeline = this.timelines.find(board => board.index === l);
    return timeline;
  }

  print(...boards) {
    for (let y = this.height - 1; y >= 0; y--) {
      for (let board of boards) {
        for (let x = 0; x < this.width; x++) {
          process.stdout.write(PIECE_CHAR[
            board[x + y * this.width]
          ]);
        }
        process.stdout.write("  ");
      }
      process.stdout.write("\n");
    }
  }

  bubble_up(l, t, fn) {
    let timeline = this.get_timeline(l);
    if (timeline === null) return false;
    while (t > 1) {
      fn(this.get_board(l, t), l, t);
      if (t == timeline.begins_at) {
        l = timeline.emerges_from;
        if (l === null) break;
        timeline = this.get_timeline(l);
        if (timeline === null) return false;
      }
      t--;
    }
    return true;
  }

  bubble_up_as(l, t, fn, white) {
    this.bubble_up(l, t * 2 + !white, fn);
  }

  error_info(token, white, l = null) {
    if (token.raw) console.log("Raw move: " + token.raw);
    console.log("As: " + (white ? "white" : "black"));

    if (token.from) {
      process.stdout.write("From: ");

      if (token.from[0] !== null && token.from[1] !== -1) {
        process.stdout.write(`(L${write_timeline(token.from[0])} T${token.from[1] + 1})`);
      } else if (token.from[0] !== null) {
        process.stdout.write(`(L${write_timeline(token.from[0])}`);
      } else if (token.from[1] !== -1) {
        if (l === null) {
          process.stdout.write(`(T${token.from[1] + 1})`);
        } else {
          process.stdout.write(`(L${write_timeline(l)}? T${token.from[1] + 1})`);
        }
      }

      if (token.from.length > 2 && token.from[2] !== -1) {
        process.stdout.write(index_to_letter(token.from[2]));
      }
      if (token.from.length > 3 && token.from[3] !== -1) {
        process.stdout.write((token.from[3] + 1).toString());
      }

      process.stdout.write("\n");
    }

    if (token.to) {
      process.stdout.write("To: ");

      if (token.to[0] !== null && token.to[1] !== -1) {
        process.stdout.write(`(L${write_timeline(token.to[0])} T${token.to[1] + 1})`);
      } else if (token.to[0] !== null) {
        process.stdout.write(`(L${write_timeline(token.to[0])}`);
      } else if (token.to[1] !== -1) {
        process.stdout.write(`(T${token.to[1] + 1})`);
      }

      if (token.to.length > 2 && token.to[2] !== -1) {
        process.stdout.write(index_to_letter(token.to[2]));
      }
      if (token.to.length > 3 && token.to[3] !== -1) {
        process.stdout.write((token.to[3] + 1).toString());
      }

      process.stdout.write("\n");
    }

    if (token.piece) {
      console.log("Piece: '" + token.piece + "'");
    } else if (token.piece_index) {
      console.log("Piece: '" + PIECE_CHAR[token.piece_index] + "'");
    }

    if (!this.get_board_as(token.from && token.from[0], token.from[1], white)) {
      // Couldn't find source board
      console.log(`\nBoard (${token.from[0]}T${token.from[1] + 1}) does not exit (yet)!`);
      if (this.get_timeline(token.from[0])) {
        let tl = this.get_timeline(token.from[0]);
        console.log(`Timeline ${token.from[0]} has an history up to ${~~((tl.states.length + tl.begins_at) / 2) + 1} ${(tl.states.length + tl.begins_at) % 2 ? "white" : "black"} (raw ${tl.states.length + tl.begins_at} / ${tl.states.length}+${tl.begins_at})`);
      } else {
        console.log(`Couldn't find timeline ${token.from[0]}: existing timelines are ${this.timelines.map(t => t.index).join(", ")}.`);
      }
    } else if (token.to && !this.get_board_as(token.to[0], token.to[1], white)) {
      // Couldn't find target board
      console.log(`\nBoard (${token.to[0]}T${token.to[1] + 1}) does not exit (yet)!`);
      if (this.get_timeline(token.to[0])) {
        let tl = this.get_timeline(token.to[0]);
        console.log(`Timeline ${token.to[0]} has an history up to ${~~((tl.states.length + tl.begins_at) / 2) + 1} ${(tl.states.length + tl.begins_at) % 2 ? "white" : "black"} (raw ${tl.states.length + tl.begins_at} / ${tl.states.length}+${tl.begins_at})`);
      } else {
        console.log(`Couldn't find timeline ${token.to[0]}: existing timelines are ${this.timelines.map(t => t.index).join(", ")}.`);
      }
    } else if (token.from && (!token.to || (token.from[0] === token.to[0] && token.from[1] === token.to[1]))) {
      // Show one marked & unmarked board
      console.log("\nBoard / marked board:\n");

      let board = [...this.get_board_as(token.from[0], token.from[1], white)];
      if (token.to) board[token.to[2] + token.to[3] * this.width] = PIECES.MARKER;
      this.print(this.get_board_as(token.from[0], token.from[1], white), board);
    } else if (token.to) {
      // Show the source board and the marked target board
      console.log("Source board / marked target board:\n");

      let target_board = [...this.get_board_as(token.to[0], token.to[1], white)];
      target_board[token.to[2] + token.to[3] * this.width] = PIECES.MARKER;
      this.print(this.get_board_as(token.from[0], token.from[1], white), target_board);
    }
    console.log("\n");
  }
}

export class Timeline {
  constructor(width, height, index, begins_at = 0, emerges_from = null) {
    this.states = [new Array(width * height).fill(PIECES.BLANK)];
    this.index = index;
    this.width = width;
    this.height = height;
    this.begins_at = begins_at;
    this.emerges_from = emerges_from;
    this.moves = [];
    this.synthetic = begins_at != 0;
    this.turn = true;
  }

  active_player() {
    return this.turn;
    return !!((this.states.length + this.begins_at) % 2) != this.synthetic;
  }
}

export function letter_to_index(letter) {
  if (!letter || letter < "a" || letter > "z" || letter.length != 1) return -1;
  return "abcdefghijklmnopqrstuvw".split("").indexOf(letter);
}

export function index_to_letter(index) {
  return "abcdefghijklmnopqrstuvw"[index];
}

export function parse_timeline(str) {
  if (str === "-0") {
    return -0.5;
  } else if (str === "+0") {
    return 0.5;
  } else {
    return +str;
  }
}

export function write_timeline(num, plus = false) {
  if (num === -0.5) {
    return "-0";
  } else if (num === 0.5) {
    return "+0";
  } else {
    if (plus && num > 0) {
      return "+" + num.toString();
    }
    return num.toString();
  }
}
