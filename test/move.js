import * as game from "../parsers/game.js";
import assert from "assert";
const {PIECES, PIECE_CHAR, Game} = game;

describe("Testing the move-related mechanics in Game", () => {
  let g = new Game(6, 6, [0]);
  g.parse_fen("NNBBR1/4DU/6/2p3/P2P2/k4K");
  g.print(g.get_board(0, 2));

  it("Checks if Nb4 is only possible as Na6b4", () => {
    let to = [0, 1, 1, 3];
    let piece = PIECES.W_KNIGHT;
    assert(g.can_move(piece, [0, 1, 0, 5], to, true));
    assert(!g.can_move(piece, [0, 1, 1, 5], to, true));
  });

  it("Checks if Bb4 is only possible as Bd6b4", () => {
    let to = [0, 1, 1, 3];
    let piece = PIECES.W_BISHOP;
    assert(!g.can_move(piece, [0, 1, 2, 5], to, true));
    assert(g.can_move(piece, [0, 1, 3, 5], to, true));
  });

  it("Checks if Bb5 is only possible as Bc6b5", () => {
    let to = [0, 1, 1, 4];
    let piece = PIECES.W_BISHOP;
    assert(g.can_move(piece, [0, 1, 2, 5], to, true));
    assert(!g.can_move(piece, [0, 1, 3, 5], to, true));
  });

  it("Checks that Bf4 is impossible", () => {
    let to = [0, 1, 5, 3];
    let piece = PIECES.W_BISHOP;
    assert(!g.can_move(piece, [0, 1, 2, 5], to, true));
    assert(!g.can_move(piece, [0, 1, 3, 5], to, true));
  });

  it("Checks that neither the unicorn, nor the dragon can make a move", () => {
    for (let y = 0; y < g.height; y++) {
      for (let x = 0; x < g.width; x++) {
        assert(!g.can_move(PIECES.W_UNICORN, [0, 1, 5, 4], [0, 1, x, y], true));
        assert(!g.can_move(PIECES.W_DRAGON, [0, 1, 4, 4], [0, 1, x, y], true));
      }
    }
  });

  it("Checks that Rf6 is possible", () => {
    assert(g.can_move(PIECES.W_ROOK, [0, 1, 4, 5], [0, 1, 5, 5], true));
  });

  it("Checks that Re1 is impossible", () => {
    assert(!g.can_move(PIECES.W_ROOK, [0, 1, 4, 5], [0, 1, 4, 0], true));
  });

  it("Checks that a3 is possible", () => {
    assert(g.can_move(PIECES.W_PAWN, [0, 1, 0, 1], [0, 1, 0, 2], true));
    assert(!g.can_move(PIECES.W_PAWN, [0, 1, 3, 1], [0, 1, 0, 2], true));
  });

  it("Checks that a4 is possible", () => {
    assert(g.can_move(PIECES.W_PAWN, [0, 1, 0, 1], [0, 1, 0, 3], true));
    assert(!g.can_move(PIECES.W_PAWN, [0, 1, 3, 1], [0, 1, 0, 3], true));
  });

  it("Checks that d3 is possible", () => {
    assert(!g.can_move(PIECES.W_PAWN, [0, 1, 0, 1], [0, 1, 3, 2], true));
    assert(g.can_move(PIECES.W_PAWN, [0, 1, 3, 1], [0, 1, 3, 2], true));
  });

  it("Checks that d4 is possible", () => {
    assert(!g.can_move(PIECES.W_PAWN, [0, 1, 0, 1], [0, 1, 3, 3], true));
    assert(g.can_move(PIECES.W_PAWN, [0, 1, 3, 1], [0, 1, 3, 3], true));
  });

  it("Checks that dxc3 is possible", () => {
    assert(!g.can_move(PIECES.W_PAWN, [0, 1, 0, 1], [0, 1, 2, 2], true));
    assert(g.can_move(PIECES.W_PAWN, [0, 1, 3, 1], [0, 1, 2, 2], true));
  });

  it("Plays 1. Kf2", () => {
    let res = g.play(PIECES.W_KING, [0, 1, -1, -1], [0, 1, 5, 1], true);
    assert.deepEqual(res.from, [0, 1, 5, 0]);
    assert.equal(g.get_as(0, 1, 5, 0, false), PIECES.BLANK, "f1 should now be empty");
    assert.equal(g.get_as(0, 1, 5, 1, false), PIECES.W_KING, "f2 should contain white's king");
  });

  it("Plays 1. ... cxd2", () => {
    let res = g.play(PIECES.B_PAWN, [0, 1, -1, -1], [0, 1, 3, 1], false);
    assert.deepEqual(res.from, [0, 1, 2, 2]);
    assert.equal(g.get_as(0, 2, 2, 2, true), PIECES.BLANK, "c3 should now be empty");
    assert.equal(g.get_as(0, 2, 3, 1, true), PIECES.B_PAWN, "d2 should contain black's pawn");
  });
});
