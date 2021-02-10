const game = require("../parsers/game.js");
const assert = require("assert");
const {PIECES, PIECE_CHAR, Game} = game;

describe("Testing the FEN parsing", () => {
  it("Parses a 1x1 FEN for all of the pieces", () => {
    for (let index in PIECE_CHAR) {
      let g = new Game(1, 1, [0]);
      if (index == PIECES.BLANK) {
        g.parse_legacy_fen("1");
      } else if (index == PIECES.MARKER) {
        continue;
      } else {
        g.parse_legacy_fen(PIECE_CHAR[index]);
      }
      assert.deepEqual(g.timelines[0].states[0], [index]);
    }
  });

  it("Checks that spaces are handled properly", () => {
    let g = new Game(3, 3, [0]);
    g.parse_legacy_fen("1k1/3/2b");
    assert.deepEqual(g.timelines[0].states[0], [
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.B_BISHOP,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.B_KING,
      PIECES.BLANK,
    ]);
  });

  it("Checks that multiple multiverses are parsed accordingly", () => {
    let g = new Game(1, 2, [0, 1]);
    g.parse_legacy_fen("k/p P/K");
    assert.deepEqual(g.get_timeline(0).states[0], [
      PIECES.B_PAWN,
      PIECES.B_KING,
    ]);
    assert.deepEqual(g.get_timeline(1).states[0], [
      PIECES.W_KING,
      PIECES.W_PAWN,
    ]);
  });

  it("Checks that the standard board is parsed well", () => {
    let g = new Game(8, 8, [0]);
    g.parse_legacy_fen(game.BOARDS.STANDARD[0]);
    assert.deepEqual(g.timelines[0].states[0], [
      PIECES.W_ROOK,
      PIECES.W_KNIGHT,
      PIECES.W_BISHOP,
      PIECES.W_QUEEN,
      PIECES.W_KING,
      PIECES.W_BISHOP,
      PIECES.W_KNIGHT,
      PIECES.W_ROOK,
      PIECES.W_PAWN,
      PIECES.W_PAWN,
      PIECES.W_PAWN,
      PIECES.W_PAWN,
      PIECES.W_PAWN,
      PIECES.W_PAWN,
      PIECES.W_PAWN,
      PIECES.W_PAWN,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.BLANK,
      PIECES.B_PAWN,
      PIECES.B_PAWN,
      PIECES.B_PAWN,
      PIECES.B_PAWN,
      PIECES.B_PAWN,
      PIECES.B_PAWN,
      PIECES.B_PAWN,
      PIECES.B_PAWN,
      PIECES.B_ROOK,
      PIECES.B_KNIGHT,
      PIECES.B_BISHOP,
      PIECES.B_QUEEN,
      PIECES.B_KING,
      PIECES.B_BISHOP,
      PIECES.B_KNIGHT,
      PIECES.B_ROOK,
    ]);
  });

  describe("Checks that every built-in board can be parsed without error", () => {
    for (let name in game.BOARDS) {
      it("Board '" + name + "'", () => {
        let board = game.BOARDS[name];
        let [width, height] = board[2].split("x").map(Number);
        let timelines = board[1].split(" ").map(Number);
        let g = new Game(width, height, timelines);
        g.parse_legacy_fen(board[0]);
      });
    }
  });
});
