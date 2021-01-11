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
  W_PRINCESS: 9,
  W_BRAWN: 10,
  W_CKING: 11,
  W_RQUEEN: 12,

  B_PAWN: 33,
  B_KNIGHT: 34,
  B_BISHOP: 35,
  B_ROOK: 36,
  B_QUEEN: 37,
  B_KING: 38,
  B_UNICORN: 39,
  B_DRAGON: 40,
  B_PRINCESS: 41,
  B_BRAWN: 42,
  B_CKING: 43,
  B_RQUEEN: 44,

  MARKER: 99,

  B_OFFSET: 32,
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
  [PIECES.W_PRINCESS]: "S",
  [PIECES.W_BRAWN]: "Β",
  [PIECES.W_RQUEEN]: "Ρ",
  [PIECES.W_CKING]: "Κ",
  [PIECES.B_PAWN]: "p",
  [PIECES.B_KNIGHT]: "n",
  [PIECES.B_BISHOP]: "b",
  [PIECES.B_ROOK]: "r",
  [PIECES.B_QUEEN]: "q",
  [PIECES.B_KING]: "k",
  [PIECES.B_UNICORN]: "u",
  [PIECES.B_DRAGON]: "d",
  [PIECES.B_PRINCESS]: "s",
  [PIECES.B_BRAWN]: "β",
  [PIECES.B_RQUEEN]: "ρ",
  [PIECES.B_CKING]: "κ",
  [PIECES.MARKER]: "*",
};

export const MOVE_KIND = {
  MOVE: 0,
  JUMP_OUT: 1,
  JUMP_IN: 2,
  CASTLE_SHORT: 3,
  CASTLE_LONG: 4,
  NONE: 99,
};

export const BOARDS = {
  "STANDARD": ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", "0", "8x8"],
  "STANDARD - TURN ZERO": ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR|rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", "0:-1", "8x8"],
  "STANDARD - PRINCESS": ["rnbskbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBSKBNR", "0", "8x8"],
  "STANDARD - TWO TIMELINES": ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", "-0 +0", "8x8"],
  "STANDARD - DEFENDED PAWN": ["rqbnkbnr/pppppppp/8/8/8/8/PPPPPPPP/RQBNKBNR", "0", "8x8"],
  "STANDARD - REVERSED ROYALTY": ["rnbρκbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBΡΚBNR", "0", "8x8"],
  "SMALL": ["kqbnr/ppppp/5/PPPPP/KQBNR", "0", "5x5"],
  "MISC - TIMELINE INVASION": ["nbkrb/ppppp/5/5/PPPPP ppppp/5/5/PPPPP/NBKRB", "-0 +0", "5x5"],
  "SIMPLE - NO QUEENS": ["rnbknbr/ppppppp/7/7/7/PPPPPPP/RNBKNBR", "0", "7x7"],
  "SIMPLE - KNIGHTS VS. BISHOP": ["rbqkbr/pppppp/6/6/PPPPPP/RNQKNR", "0", "6x6"],
  "SIMPLE - NO BISHOPS": ["rnqknr/pppppp/6/6/PPPPPP/RNQKNR", "0", "6x6"],
  "SIMPLE - NO KNIGHTS": ["rbqkbr/pppppp/6/6/PPPPPP/RBQKBR", "0", "6x6"],
  "SIMPLE - NO ROOKS": ["nbqkbn/pppppp/6/6/PPPPPP/NBQKBN", "0", "6x6"],
  "SIMPLE - SIMPLE SET": ["rnbqkr/pppppp/6/6/PPPPPP/RKQBNR", "0", "6x6"],
  "SMALL - FLIPPED": ["nbrqk/ppppp/5/PPPPP/KQRBN", "0", "5x5"],
  "SMALL - CENTERED": ["rnkqr/ppppp/5/PPPPP/RQKNR", "0", "5x5"],
  "SMALL - OPEN": ["prnbk/3pp/5/PP3/KBNRP", "0", "5x5"],
  "VERY SMALL": ["nbrk/pppp/PPPP/KRBN", "0", "4x4"],
  "VERY SMALL - OPEN": ["nbrk/3p/P3/KRBN", "0", "4x4"],
  "MISC - TIMELINE FORMATIONS": ["ppppp/5/5/5/2K2 2k2/5/5/5/PPPPP", "-0 +0", "5x5"],
  "MISC - TIMELINE TACTITIAN": ["kbnr/pppp/4/4 4/4/PPPP/KBNR", "-0 +0", "4x4"],
  "MISC - TIMELINE STRATEGOS": ["nbkur/ppppp/5/5/5 5/5/5/PPPPP/RUKBN", "-0 +0", "5x5"],
  "MISC - TIMELINE BATTLEGROUNDS": ["rrkrr/bbqbb/ppppp/5/PPPPP nnnnn/ppppp/5/PPPPP/NNNNN ppppp/5/PPPPP/BBQBB/RRKRR", "-1 0 1", "5x5"],
  "MISC - TIMELINE SKIRMISH": ["3rk/3pp/5/BB3/NN3 3nn/3bb/5/PP3/KR3", "-0 +0", "5x5"],
  "MISC - TIMELINE FRAGMENTS": ["kppp/4/4/NBRU nbru/4/4/KPPP", "-0:1 +0", "4x4"],
  "MISC - TIMELINE MARAUDERS": ["βrkrβ/1βββ1/5/5/5 β1β1β/5/5/5/Β1Β1Β 5/5/5/1ΒΒΒ1/ΒRKRΒ", "-1 0 1", "5x5"],
  "MISC - KING OF KINGS": ["κκkκκ/5/5/5/ΚΚKΚΚ", "0", "5x5"],
  "MISC - ROYAL QUEEN SHOWDOWN": ["4ρ1/6/6/6/6/1Ρ4", "0", "6x6"],
  "MISC - EXCESSIVE": ["kruqdrk/rnbknbr/ppppppp/7/PPPPPPP/RNBKNBR/KRUQDRK", "0", "7x7"],
  "STANDARD - HALF REFLECTED": ["rnbkqbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", "0", "8x8"],
  "MISC - GLOBAL WARMING": ["1", "0", "1x1"],
  "FOCUSED - JUST KNIGHTS": ["n1kn1/5/5/5/1NK1N", "0", "5x5"],
  "FOCUSED - JUST BISHOPS": ["1bbk1/5/5/5/1KBB1", "0", "5x5"],
  "FOCUSED - JUST ROOKS": ["1rk1r/5/5/5/R1KR1", "0", "5x5"],
  "FOCUSED - JUST QUEENS": ["1q1k2/6/6/6/6/2K1Q1", "0", "6x6"],
  "FOCUSED - JUST PAWNS": ["ppppk/5/5/5/KPPPP", "0", "5x5"],
  "FOCUSED - JUST KINGS": ["2k/3/k2", "0", "3x3"],
  "FOCUSED - JUST UNICORNS": ["1u1uk/5/5/5/KU1U1", "0", "5x5"],
  "FOCUSED - JUST DRAGONS": ["2ddk/5/5/5/KDD2", "0", "5x5"],
  "FOCUSED - JUST BRAWNS": ["ββββk/5/5/5/KΒΒΒΒ", "0", "5x5"],
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

export const FEN_TO_PIECE = {
  "p": PIECES.B_PAWN,
  "P": PIECES.W_PAWN,
  "b": PIECES.B_BISHOP,
  "B": PIECES.W_BISHOP,
  "n": PIECES.B_KNIGHT,
  "N": PIECES.W_KNIGHT,
  "r": PIECES.B_ROOK,
  "R": PIECES.W_ROOK,
  "q": PIECES.B_QUEEN,
  "Q": PIECES.W_QUEEN,
  "k": PIECES.B_KING,
  "K": PIECES.W_KING,
  "s": PIECES.B_PRINCESS,
  "S": PIECES.W_PRINCESS,
  "w": PIECES.B_BRAWN,
  "W": PIECES.W_BRAWN,
  "u": PIECES.B_UNICORN,
  "U": PIECES.W_UNICORN,
  "d": PIECES.B_DRAGON,
  "D": PIECES.W_DRAGON,
  "c": PIECES.B_CKING,
  "C": PIECES.W_CKING,
  "q+": PIECES.B_RQUEEN,
  "Q+": PIECES.W_RQUEEN,
};

export const PIECE_TO_FEN = {
  [PIECES.B_PAWN]: "p",
  [PIECES.W_PAWN]: "P",
  [PIECES.B_BISHOP]: "b",
  [PIECES.W_BISHOP]: "B",
  [PIECES.B_KNIGHT]: "n",
  [PIECES.W_KNIGHT]: "N",
  [PIECES.B_ROOK]: "r",
  [PIECES.W_ROOK]: "R",
  [PIECES.B_QUEEN]: "q",
  [PIECES.W_QUEEN]: "Q",
  [PIECES.B_KING]: "k",
  [PIECES.W_KING]: "K",
  [PIECES.B_PRINCESS]: "s",
  [PIECES.W_PRINCESS]: "S",
  [PIECES.B_BRAWN]: "w",
  [PIECES.W_BRAWN]: "W",
  [PIECES.B_UNICORN]: "u",
  [PIECES.W_UNICORN]: "U",
  [PIECES.B_DRAGON]: "d",
  [PIECES.W_DRAGON]: "D",
  [PIECES.B_CKING]: "c",
  [PIECES.W_CKING]: "C",
  [PIECES.B_RQUEEN]: "q+",
  [PIECES.W_RQUEEN]: "Q+",
};

export class Game {
  /**?
    Constructs a new boardset, with `board_indices.length` initial boards
  **/
  constructor(width, height, board_indices = [0]) {
    this.width = width;
    this.height = height;
    this.board_indices = board_indices.map(x => Array.isArray(x) ? x[0] : x);
    this.initial_board_indices = board_indices.map(x => Array.isArray(x) ? x[0] : x);
    this.timelines = new Array(board_indices.length).fill(null).map((_, i) => new Timeline(width, height, board_indices[i]));
    this.moves = [];
    this.active_player = true;
    this.turn = 0;
    this.last_white = true;
  }

  /**?
    Parses a legacy FEN-formatted board (or boards, separated by spaces). Overwrites the first board.
  **/
  parse_legacy_fen(fen) {
    let boards = fen.split(" ");
    for (let n = 0; n < this.board_indices.length; n++) {
      let sub_boards = boards[n].split("|");
      for (let o = 0; o < sub_boards.length; o++) {
        if (o > 0) {
          this.timelines[n].moves.push({
            kind: MOVE_KIND.NONE,
          });
        }
        let board = this.timelines[n].states[o] = [];
        let rows = sub_boards[o].split("/");
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
              case "s": board.push(PIECES.B_PRINCESS); break;
              case "β": board.push(PIECES.B_BRAWN); break;
              case "ρ": board.push(PIECES.B_RQUEEN); break;
              case "κ": board.push(PIECES.B_CKING); break;
              case "P": board.push(PIECES.W_PAWN); break;
              case "N": board.push(PIECES.W_KNIGHT); break;
              case "B": board.push(PIECES.W_BISHOP); break;
              case "R": board.push(PIECES.W_ROOK); break;
              case "Q": board.push(PIECES.W_QUEEN); break;
              case "K": board.push(PIECES.W_KING); break;
              case "U": board.push(PIECES.W_UNICORN); break;
              case "D": board.push(PIECES.W_DRAGON); break;
              case "S": board.push(PIECES.W_PRINCESS); break;
              case "Β": board.push(PIECES.W_BRAWN); break;
              case "Ρ": board.push(PIECES.W_RQUEEN); break;
              case "Κ": board.push(PIECES.W_CKING); break;
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
  }

  parse_5dfen(fen) {
    if (fen.startsWith('[') && fen.endsWith(']')) {
      fen = fen.slice(1, -1);
    }
    let split = fen.split(':');
    if (split.length !== 4) {
      throw new Error("SyntaxError: raw 5DFEN board string doesn't have 4 fields.");
    }

    let rows = split[0].split('/');
    rows.reverse();
    if (rows.length !== this.height) {
      throw new Error("SyntaxError: the amount of rows isn't equal to the height of the board, did you forget a slash (/) or to set the `size` header?");
    }

    let board = [];
    for (let raw_row of rows) {
      let row = [];
      while (raw_row.length) {
        let match;
        if (match = /^\d+/.exec(raw_row)) {
          raw_row = raw_row.slice(match[0].length);
          for (let n = 0; n < +match[0]; n++) {
            row.push(PIECES.BLANK);
          }
        } else if (match = /^([a-zA-Z]\+?)(\*?)/.exec(raw_row)) {
          raw_row = raw_row.slice(match[0].length);
          let piece = FEN_TO_PIECE[match[1]];
          if (!piece) {
            throw new Error(`SyntaxError: invalid piece '${match[1]}'`);
          }
          // The internal structure of this converter doesn't make use of unmoved pieces; should support that later though!
          // row.push(match[2] ? -piece : piece);
          row.push(piece);
        } else {
          throw new Error(`SyntaxError: unexpected character: '${raw_row[0]}'`)
        }
      }
      if (row.length !== this.width) {
        throw new Error("SyntaxError: row doesn't have the right width, did you forget a slash (/) or to set the `size` header?");
      }
      board = board.concat(row);
    }

    let l = 0;
    if (split[1] === '-0') l = -0.5;
    if (split[1] === '+0') l = +0.5;
    else l = Math.round(+l);

    if (isNaN(l)) {
      throw new Error("Invalid 5DFEN timeline: " + split[1]);
    }

    let t = +split[2] * 2;

    if (isNaN(t)) {
        throw new Error("Invalid 5DFEN turn: " + split[2]);
    }

    if (split[3] === 'w') {
        t -= 2;
    } else if (split[3] === 'b') {
        t -= 1;
    } else {
        throw new Error("Invalid 5DFEN color: " + split[3]);
    }

    this.set_board(l, t, board, true);
  }

  /**
    Exports the "initial" boards for 5DFEN
  **/
  export_5dfen() {
    let res = "";
    for (let tl of this.timelines) {
      for (let dt = 0; dt < tl.states.length; dt++) {
        if (dt == 0 || tl.moves[dt - 1].kind == MOVE_KIND.NONE) {
          res += "[";
          let blanks = 0;
          for (let y = this.height - 1; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
              let piece = tl.states[dt][x + y * this.width];
              if (piece == PIECES.BLANK) {
                blanks++;
              } else if (blanks > 0) {
                res += blanks.toString(10);
                blanks = 0;
              }

              if (piece != PIECES.BLANK) {
                // TODO: support unmoved pieces
                res += PIECE_TO_FEN[piece];
              }
            }

            if (blanks > 0) {
              res += blanks.toString(10);
              blanks = 0;
            }
            res += "/";
          }
          res = res.slice(0, -1);
          res += ":";
          if (tl.index == -0.5) {
            res += "-0";
          } else if (tl.index == +0.5) {
            res += "0";
          } else {
            res += Math.round(tl.index);
          }
          res += ":";
          res += Math.floor((tl.begins_at + dt + 2) / 2);
          res += ":";
          res += (tl.begins_at + dt) % 2 ? "b" : "w";
          res += "]\n";
        }
      }
    }

    return res.slice(0, -1);
  }

  /**
    Get board (l, t)
    @param l The timeline coordinate
    @param t The time as stored internally
  **/
  get_board(l, t) {
    let timeline = this.timelines.find(tl => tl.index === l);
    if (timeline == null) return null;
    return timeline.states[t - timeline.begins_at];
  }

  /**
    Get board (l, t)
    @param l The timeline coordinate
    @param t The time as stored internally
  **/
  set_board(l, t, board, indices = false) {
    let timeline = this.timelines.find(tl => tl.index === l);
    if (timeline == null) {
      timeline = new Timeline(this.width, this.height, l, t);
      this.timelines.push(timeline);
      if (indices) {
        this.initial_board_indices.push(l);
      }
    }

    if (t < timeline.begins_at) {
      let new_states = [board];
      if (timeline.begins_at - t > 1) {
        new_states.fill(undefined, 1, timeline.begins_at - t - 1);
      }
      timeline.states = new_states.concat(timeline.states);
      for (let n = 0; n < timeline.begins_at - t; n++) {
        timeline.moves.unshift({kind: MOVE_KIND.NONE});
      }
      timeline.begins_at = t;
    } else if (t == timeline.begins_at + 1) {
      timeline.moves.push({kind: MOVE_KIND.NONE});
      timeline.states[t - timeline.begins_at] = board;
    } else {
      timeline.states[t - timeline.begins_at] = board;
    }
  }

  /**
    Get the board (l, t) as `white`
    @param l The timeline coordinate
    @param t The time coordinate as displayed in-game, minus one (T1 becomes 0, T2 becomes 1, ...)
    @param white Which player owns the board
  **/
  get_board_as(l, t, white) {
    let timeline = this.timelines.find(tl => tl.index === l);
    if (timeline == null) return null;
    return timeline.states[t * 2 + !white - timeline.begins_at];
  }

  /**
    Get tile (l, t, x, y)
    @param l The timeline coordinate
    @param t The time as stored internally
    @param x The tile's X coordinate (starts at 0)
    @param y The tile's Y coordinate (starts at 0)
  **/
  get(l, t, x, y) {
    let board = this.get_board(l, t);
    if (!board) return null;
    return board[x + y * this.width];
  }

  /**
    Get tile (l, t, x, y) as `white`
    @param l The timeline coordinate
    @param t The time coordinate as displayed in-game, minus one (T1 becomes 0, T2 becomes 1, ...)
    @param x The tile's X coordinate (starts at 0)
    @param y The tile's Y coordinate (starts at 0)
    @param white Which player owns the board
  **/
  get_as(l, t, x, y, white) {
    let board = this.get_board_as(l, t, white);
    if (!board) return null;
    return board[x + y * this.width];
  }

  /**
    Returns whether or not the timeline `l`'s last board is at `t`
  **/
  is_at_present(l, t) {
    let timeline = this.timelines.find(board => board.index === l);
    if (timeline == null) return null;
    return timeline.states.length - 1 === t - timeline.begins_at;
  }

  /**
    Push `board` to timeline `l`
  **/
  push_board(l, board) {
    let timeline = this.timelines.find(board => board.index === l);
    if (timeline == null) return false;
    timeline.states.push(board);
    timeline.turn = !timeline.turn;
    return true;
  }

  /**
    Internal; used to record a move made on a timeline (be it a jump in or out)
  **/
  record_move(l, kind, piece, from, to, white, piece_taken, {check, checkmate, softmate} = {}) {
    let timeline = this.timelines.find(board => board.index === l);
    if (timeline == null) return false;
    timeline.moves.push({
      kind,
      piece,
      from,
      to,
      white,
      piece_taken,
      check: !!check,
      checkmate: !!checkmate,
      softmate: !!softmate,
    });
    return true;
  }

  can_move(piece, from, to, white) {
    if (from[0] === to[0] && from[1] === to[1] && from[2] === to[2] && from[3] === to[3]) return false;
    switch (piece) {
      case PIECES.W_BRAWN: { // brawn's generalized moves
          let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
          a = a.map(x => Math.abs(x)).sort().reverse();
          if (a[0] === 1 && a[1] === 1 && a[2] === 0 && a[3] === 0 && this.get_as(to[0], to[1], to[2], to[3] - 1, white) !== PIECES.BLANK) {
            return true; // We shall be permissive
          }
        }
        // fallthrough
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
      case PIECES.B_BRAWN: { // brawn's generalized moves
          let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
          a = a.map(x => Math.abs(x)).sort().reverse();
          if (a[0] === 1 && a[1] === 1 && a[2] === 0 && a[3] === 0 && this.get_as(to[0], to[1], to[2], to[3] - 1, white) !== PIECES.BLANK) {
            return true; // We shall be permissive
          }
        }
        // fallthrough
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
      case PIECES.W_RQUEEN:
      case PIECES.B_RQUEEN:
      case PIECES.W_QUEEN:
      case PIECES.B_QUEEN: {
        let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
        a = a.map(x => Math.abs(x)).sort().reverse();
        return (
            a[1] === 0 && a[2] === 0 && a[3] === 0 // orthogonal
            || a[0] === a[1] && a[2] === 0 && a[3] === 0 // diagonal
            || a[0] === a[1] && a[1] === a[2] && a[3] === 0 // trigonal
            || a[0] === a[1] && a[1] === a[2] && a[2] === a[3] // quadragonal
          ) && this.path_clear(from, to, white);
      }
      case PIECES.W_PRINCESS:
      case PIECES.B_PRINCESS: {
        let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
        a = a.map(x => Math.abs(x)).sort().reverse();
        return (
            a[1] === 0 && a[2] === 0 && a[3] === 0 // orthogonal
            || a[0] === a[1] && a[2] === 0 && a[3] === 0 // diagonal
          ) && this.path_clear(from, to, white);
      }
      case PIECES.W_CKING:
      case PIECES.B_CKING:
      case PIECES.W_KING:
      case PIECES.B_KING: {
        let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
        a = a.map(x => Math.abs(x)).sort().reverse();
        return a.every(x => x < 2);
      }
    }
  }

  is_en_passant(from, to, white) {
    // Here
    if (from[0] === to[0] && from[1] === to[1] && (from[2] === to[2] + 1 || from[2] === to[2] - 1)) {
      return this.get_as(...to, white) === PIECES.BLANK
        && this.get_as(to[0], to[1] - 1, to[2], to[3] + (white ? -1 : 1), white) === PIECES.BLANK
        && is_opponent_pawnlike(this.get_as(to[0], to[1], to[2], to[3] + (white ? -1 : 1), white), white)
        && is_opponent_pawnlike(this.get_as(to[0], to[1] - 1, to[2], to[3] + (white ? 1 : -1), white), white)
        && this.get_as(to[0], to[1], to[2], to[3] + (white ? 1 : -1), white) === PIECES.BLANK
    }
  }

  /**?
    Checks that the path from `from` to `to` is clear as `white`. Asserts that this path is an n-gonal.
  **/
  path_clear(from, to, white) {
    let a = [to[0] - from[0], to[1] - from[1], to[2] - from[2], to[3] - from[3]];
    let length = a.map(x => Math.abs(x)).sort()[3];
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
    Plays a Move instance; returns a filled-in version of the Move object
  **/
  play_move(move) {
    if (move.castle) {
      return this.castle(move.src_piece, move.from, move.castle_long, move.white, {...move});
    } else {
      return this.play(move.src_piece, move.from, move.to, move.white, move.promotion, {...move});
    }
  }

  /**?
    Plays the move and returns information on the move done
    @param piece - The piece moved
    @param from - The origin square (partial)
    @param to - The target square (full)
    @param white - Which player is making the move
    @param {check, checkmate, softmate} - Check, checkmate and softmate information
  **/
  play(piece, from, to, white, promotion, {check, checkmate, softmate} = {}) {
    if (white && !this.last_white) {
      this.turn++;
    }
    this.last_white = white;

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
    let en_passant = false;

    if (source_board === target_board) {
      let new_board = [...source_board];
      new_board[from[2] + from[3] * this.width] = PIECES.BLANK;
      if (promotion) {
        new_board[to[2] + to[3] * this.width] = promotion;
      } else {
        new_board[to[2] + to[3] * this.width] = piece;
      }
      en_passant = this.is_en_passant(from, to, white);
      if (en_passant) {
        new_board[to[2] + (to[3] + (white ? -1 : 1)) * this.width] = PIECES.BLANK;
      }
      if (!this.push_board(from[0], new_board)) throw new Error("Couldn't push board");

      this.record_move(from[0], MOVE_KIND.MOVE, piece, from, to, white, piece_taken, {check, checkmate, softmate});

      if (piece % PIECES.B_OFFSET == PIECES.W_PAWN) {
        if (to[3] == 0 || to[3] == this.height - 1) {
          if (!promotion) {
            throw new Error("Pawn reaches the end of the board without promoting!");
          }
        }
      }

    } else if (this.is_at_present(to[0], to[1] * 2 + !white)) {
      let new_source_board = [...source_board];
      let new_target_board = [...target_board];
      new_source_board[from[2] + from[3] * this.width] = PIECES.BLANK;
      new_target_board[to[2] + to[3] * this.width] = piece;
      if (!this.push_board(from[0], new_source_board)) throw new Error("Couldn't push board");
      if (!this.push_board(to[0], new_target_board)) throw new Error("Couldn't push board");

      this.record_move(from[0], MOVE_KIND.JUMP_OUT, piece, from, to, white, piece_taken, {check, checkmate, softmate});
      this.record_move(to[0], MOVE_KIND.JUMP_IN, piece, from, to, white, piece_taken, {check, checkmate, softmate});
    } else {
      let new_source_board = [...source_board];
      let new_target_board = [...target_board];
      new_source_board[from[2] + from[3] * this.width] = PIECES.BLANK;
      new_target_board[to[2] + to[3] * this.width] = piece;
      if (!this.push_board(from[0], new_source_board)) throw new Error("Couldn't push board");
      this.record_move(from[0], MOVE_KIND.JUMP_OUT, piece, from, to, white, piece_taken, {check, checkmate, softmate});

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
      this.record_move(new_index, MOVE_KIND.JUMP_IN, piece, from, to, white, piece_taken, {check, checkmate, softmate});
    }

    let res = new Move(
      from,
      to,
      piece,
      piece_taken,
      this.turn,
      white,
      {
        promotion,
        check,
        checkmate,
        softmate,
        new_index,
        moves_present: new_index !== null && Math.abs(this.highest_timeline() + this.lowest_timeline()) < 2,
        en_passant,
      }
    );

    this.moves.push(res);

    return res;
  }

  /** Commit a castling move
    @param piece - W_KING or B_KING
    @param from - The position of that king (partial)
    @param long - True if the player castles queen-side
    @param white - Which player is castling
    @param {check, checkmate, softmate} - Check, checkmate and softmate information
  **/
  castle(piece, from, long, white, {check, checkmate, softmate} = {}) {
    if (white && !this.last_white) {
      this.turn++;
    }
    this.last_white = white;

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
      {check, checkmate, softmate},
    );

    let res = new Move(
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
      PIECES.W_KING + !white * PIECES.B_OFFSET,
      PIECES.BLANK,
      this.turn,
      white,
      {check, checkmate, softmate, castle: true, castle_long: long,},
    );

    this.moves.push(res);

    return res;
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
        console.log(`Existing timelines are ${this.timelines.map(t => t.index).join(", ")}.`);
      } else {
        console.log(`Couldn't find timeline ${token.from[0]}: existing timelines are ${this.timelines.map(t => t.index).join(", ")}.`);
      }
    } else if (token.to && !this.get_board_as(token.to[0], token.to[1], white)) {
      // Couldn't find target board
      console.log(`\nBoard (${token.to[0]}T${token.to[1] + 1}) does not exit (yet)!`);
      if (this.get_timeline(token.to[0])) {
        let tl = this.get_timeline(token.to[0]);
        console.log(`Timeline ${token.to[0]} has an history up to ${~~((tl.states.length + tl.begins_at) / 2) + 1} ${(tl.states.length + tl.begins_at) % 2 ? "white" : "black"} (raw ${tl.states.length + tl.begins_at} / ${tl.states.length}+${tl.begins_at})`);
        console.log(`Existing timelines are ${this.timelines.map(t => t.index).join(", ")}.`);
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
    if (Array.isArray(index)) {
      this.index = index[0];
      this.begins_at = index[1];
    } else {
      this.index = index;
      this.begins_at = begins_at;
    }
    this.width = width;
    this.height = height;
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

// Common move format; each of its fields are supposed to contain the necessary information, should they be available
export class Move {
  constructor(from, to, src_piece, dst_piece, turn, white, {
    promotion = null,
    softmate = false,
    check = false,
    checkmate = false,
    stalemate = false,
    castle = false,
    castle_long = null,
    new_index = null,
    moves_present = false,
    en_passant = false,
  } = {}) {
    // Granted pieces of information
    this.type = "move";
    this.from = from;
    this.to = to;
    this.src_piece = src_piece;
    this.dst_piece = dst_piece;
    this.takes = dst_piece !== PIECES.BLANK;
    this.turn = turn;
    this.white = white;

    this.castle = castle;
    this.castle_long = castle_long;

    this.comments = [];
    this.new_index = new_index;
    this.branches = this.new_index !== null;
    this.promotion = promotion;
    this.softmate = softmate;
    this.check = check;
    this.checkmate = checkmate;
    this.stalemate = stalemate;

    this.moves_present = moves_present;
    this.en_passant = false;
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
  let split = str.split(":");
  if (split.length == 1) {
    if (split[0] === "-0") {
      return -0.5;
    } else if (split[0] === "+0") {
      return 0.5;
    } else {
      return +split[0];
    }
  } else {
    return [parse_timeline(split[0]), +split[1]];
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

export function is_opponent_pawnlike(piece, white) {
  if ((piece <= PIECES.W_OFFSET) === white) return false;
  piece = piece % PIECES.W_OFFSET;
  return piece === PIECES.W_PAWN || piece === PIECES.W_BRAWN;
}
