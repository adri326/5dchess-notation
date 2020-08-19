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

  B_OFFSET: 10,
};

export const MOVE_KIND = {
  MOVE: 0,
  JUMP_OUT: 1,
  JUMP_IN: 2,
  CASTLE_SHORT: 3,
  CASTLE_LONG: 4,
};

export const BOARDS = {
  "STANDARD": ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", "0"],
  "MISC - SMALL": ["kqbnr/ppppp/5/PPPPP/KQBNR", "0"],
}

export class Game {
  /**?
    Constructs a new boardset, with `board_indices.length` initial boards
  **/
  constructor(width, height, board_indices = [0]) {
    this.width = width;
    this.height = height;
    this.board_indices = board_indices;
    this.timelines = new Array(board_indices.length).fill(null).map((_, i) => new Timeline(width, height, board_indices[i]));
    this.moves = [];
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

        for (let n = 0; n < this.width; n++) {
          switch (chars[n]) {
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
              if (/^\d$/.exec(chars[n])) {
                for (let o = 0; o < +chars[n]; o++) {
                  board.push(PIECES.BLANK);
                }
                n += +chars[n];
              } else throw new Error("Unexpected character in FEN: " + chars[n]);
          }
        }
      }
    }
  }

  get_board(l, t) {
    let timeline = this.timelines.find(board => board.index === l);
    if (timeline == null) return null;
    return timeline.states[t - timeline.begins_at] || null;
  }

  get(l, t, x, y) {
    let board = get_board(l, t);
    if (!board) return null;
    return board[x + y * this.width] || null;
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
    })
    return true;
  }

  /**?
    Plays the move and returns information on the move done
  **/
  play(piece, from, to, white) {
    let source_board = this.get_board(from[0], from[1] * 2 + !white);
    let target_board = this.get_board(to[0], to[1] * 2 + !white);
    if (!source_board) throw new Error(`Invalid source board: ${from} (${from[0]}, ${from[1] * 2 + !white})`);
    if (!target_board) throw new Error(`Invalid target board: ${to} (${to[0]}, ${to[1] * 2 + !white})`);

    if (from[2] === -1 || from[3] === -1 || from.length < 4) {
      let has_x = from[2] !== -1 && from.length > 2;
      let has_y = from[3] !== -1 && from.length > 3;

      if (from[0] !== to[0] || from[1] !== to[1]) {
        throw new Error("Super-physical move desambiguation is not supported!");
      }
      // re-determine the origin position
      let candidates = [...source_board.entries()].filter(([i, p]) => p === piece);
      if (has_x) {
        candidates = candidates.filter(([i, p]) => i % this.width === from[2]);
      }
      if (has_y) {
        candidates = candidates.filter(([i, p]) => ~~(i / this.width) === from[3]);
      }
      if (piece % PIECES.B_OFFSET === PIECES.W_ROOK) {
        candidates = candidates.filter(([i, p]) => i % this.width === to[2] || ~~(i / this.width) === to[3]);
      } else if (piece % PIECES.B_OFFSET === PIECES.W_PAWN) {
        if (has_x && to[2] !== from[2]) {
          // pawn takes
          candidates = candidates.filter(([i, p]) => i % this.width === from[2]);
        } else {
          candidates = candidates.filter(([i, p]) => i % this.width === to[2]);
        }
      }

      if (piece === PIECES.W_PAWN) {
        candidates = [candidates.reduce(([i, p], [ai, ap]) => i > ai ? [i, p] : [ai, ap])];
      } else if (piece === PIECES.B_PAWN) {
        candidates = [candidates.reduce(([i, p], [ai, ap]) => i < ai ? [i, p] : [ai, ap])];
      }

      if (candidates.length > 1) {
        throw new Error(
          "Ambiguous move: two or more source pieces could be found ("
          + candidates.map(([i, p]) => `(${i % this.width}, ${~~(i / this.width)})`).join("; ")
          + ")");
      } else if (candidates.length === 0) {
        throw new Error(`No valid move found! ${from}; ${to};${piece}`);
      }
      from[2] = candidates[0][0] % this.width;
      from[3] = ~~(candidates[0][0] / this.width);
      // TODO: filter according to checking positions
    }

    let piece_taken = target_board[to[2] + to[3] * this.width];

    if (source_board === target_board) {
      let new_board = [...source_board];
      new_board[from[2] + from[3] * this.width] = PIECES.BLANK;
      new_board[to[2] + to[3] * this.width] = piece;
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

      let new_index = white ? 1 : -1;
      for (let timeline of this.timelines) {
        if (white) {
          if (timeline.index > new_index) new_index = timeline.index + 1;
        } else {
          if (timeline.index < new_index) new_index = timeline.index - 1;
        }
      }

      let new_timeline = new Timeline(this.width, this.height, new_index, to[1] * 2 + !white + 1);
      new_timeline.states = [new_target_board];
      this.timelines.push(new_timeline);
      this.board_indices.push(new_index);
      this.record_move(new_index, MOVE_KIND.JUMP_IN, piece, from, to, white, piece_taken);
    }

    return {
      from,
      to,
      piece_taken,
    };
  }

  castle(piece, from, long, white) {
    throw new Error("Castling hasn't been implemented yet!");
  }
}

export class Timeline {
  constructor(width, height, index, begins_at = 2) {
    this.states = [new Array(width * height).fill(PIECES.BLANK)];
    this.index = index;
    this.width = width;
    this.height = height;
    this.begins_at = begins_at;
    this.moves = [];
  }
}
