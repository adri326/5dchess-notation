# Shad's 5D chess algebraic notation (5dpgn)

This is my take at an algebraic notation for [5D Chess](https://5dchesswithmultiversetimetravel.com/), which has been adopted as the standard notation for interfacing with programs, for storing games and is commonly used to write out complex moves.
This algebraic notation is meant to be an extension of [PGN](https://en.wikipedia.org/wiki/Portable_Game_Notation) for 5D chess.

Other, publicly available notations for 5D Chess include:

- ["Axel's algebraic, a take on 5D chess notation"](https://docs.google.com/document/d/1G456NzkPc_ZsAj3HBpdTZuTP3tP-g1k98GdoRE38E5A/view)
- [Matrix Notation](https://drive.google.com/drive/folders/10332r6crq_pD-d4pG4VSynM8ziu1uT98)
- [Hexicube's adaptation of Axel' AN](https://github.com/Hexicube/5D-Chess-Game-Viewer)
- [nidlatam's notation](https://github.com/nidlatam/my-5d-chess-notation)
- [AverageHuman's Simplified 5D Algebraic notation](https://pastebin.com/raw/EwVSTFbj)
- [AquaBaby's analysis of several notations and proposal for a modern notation](https://docs.google.com/document/d/1-SnsdYIzrGao0ToyGXSaoEd_0tYKxYePO1C-Bp5ziXA/view)
- [Alexbay's notation as part of their library **\[DEPRECIATED\]**](https://gitlab.com/alexbay218/5d-chess-js/)
- [AquaBaby's client, written in Java and using a custom notation for both moves and FEN](https://github.com/Slavrick/5dChessGUI/)

The priorities of this notation, as of right now, are:

- Accurate transcription of games (any state of the game should be able to be transcribed)
- Ease of writing by a human
- Ease of reading for a computer (there should be no need to hold the state of the game while initially parsing the moves)
- Ease of reading for a human
- Ability to convert from/to other notations
- Ease of writing by a computer (a computer should be able to automatically transcribe any state of the game)

To accomplish this, the notation is built around the following components:

- Coordinates, to describe where the pieces move from and to
- Piece names, to describe which pieces move
- A move notation, to describe a single move
- A turn notation, to describe a sequence of moves
- Headers, to store the metadata of a game, including the different variants

## Included converter

This repository includes a converter and previewer. For information on how to run it and use it, check [USAGE.md](USAGE.md).

## TOC

- [Shad's 5D chess algebraic notation (5dpgn)](#shads-5d-chess-algebraic-notation-5dpgn)
  - [Included converter](#included-converter)
  - [TOC](#toc)
  - [Vocabulary](#vocabulary)
  - [Coordinates](#coordinates)
  - [Moves](#moves)
    - [Castling](#castling)
    - [Jumps](#jumps)
    - [Promotions](#promotions)
    - [Inactive timeline reactivation](#inactive-timeline-reactivation)
    - [Complex scenarios](#complex-scenarios)
  - [Turns](#turns)
  - [Tags](#tags)
  - [Examples](#examples)
    - [Rook Tactics I](#rook-tactics-i)
    - [Knight tactics III](#knight-tactics-iii)
    - [Actual game](#actual-game)
  - [5DFEN and custom variants](#5dfen-and-custom-variants)
    - [Additional Metadata](#additional-metadata)
    - [Examples](#examples-1)
  - [Export or minimal notation](#export-or-minimal-notation)
    - [Export moves](#export-moves)
    - [Export turns](#export-turns)
  - [Hashing](#hashing)
    - [5DFEN Strictness](#5dfen-strictness)
    - [Examples](#examples-2)
  - [Notes](#notes)
    - [Even-numbered starting boards](#even-numbered-starting-boards)
    - [Branching](#branching)
    - [Omission](#omission)
    - [Turn zero](#turn-zero)
    - [FEN](#fen)

## Vocabulary

- A **turn** is an alternation between white's sub-turn and black's sub-turn. Each player may only make moves during their (sub-)turn. This differs from a board **step**, as playing on some boards becomes optionnal when new timelines are created.
- A **move** happens when a player moves one of their pieces to a legal position. Moves that were not submitted with the submit button yet are referred to as **temporary moves**, but we will only consider moves that were already submitted.
- An **actions** is a sequence of moves within a player's turn.
- A **board** is the state of the chess board at any point in time. Each time a player moves a piece, one or two new board(s) is/are created, with the new piece disposition(s).
- A **multiverse** or a **timeline** is an alternate version of one of the game's universe. A new multiverse is created when a piece from another dimension or from the future jumps to an already-played board. Each game starts with at least one multiverse.
- A **jump** is when a piece moves outside of its board; if it jumps to another board whose turn is the current player's turn, no new multiverse is created. Otherwise, a new multiverse is created containing the piece that jumped.
- A **step** is the unit of time between board states. It is made up of two **sub-steps**, each being a board in time.
- **Physical** coordinates and moves are coordinates and moves within a single board.
- **Super-physical** coordinates and moves are those that span across boards. Both time- and multiverse travels are super-physical moves or jumps.
- **Check** is a state of the game where one or more pieces directly attack one or more of the opponent's kings *and* the opponent can make one or more moves to get out of this situation.
- **Checkmate** is the state of the game where one or more pieces directly attack one or more of the opponent's kings *and* the opponent has no legal move.
- **Softmate** is the state of the game where one or more pieces directly attack one or more of the opponent's kings *and* the opponent may only travel back in time.

## Coordinates

Within a board, each tile is numbered as it would be with the classical chess notation: `a1` refers to the bottom-left corner of the board and `h8` to the top-right corner of an 8 by 8 board.

Boards themselved are localized using their time coordinate (denoted in-game with `T1`, `T2`, ...) and their timeline coordinate (in-game: `L`, `1L`, `-1L`, `2L`, `-2L`).
Since players can only interact with boards belonging to their sub-turns, it is not necessary to annotate the sub-turn of boards.

Super-physical coordinates use the following notation: `(L<a> T<b>)`, which can be shortened to `(<a>T<b>)`.
Both should be considered valid by parsers, though the latter is the recommended form and will be used throughout this document.

`<a>` is the multiverse coordinate, it is an integer ranging from `-n` to `n`. Timelines created by the white player are given the next, unused positive integer; while timelines created by black are given the next, unused negative integer.
`<b>` is the time coordinate, it is an integer ranging from `0` to `n'`.

*Note:* On even timelines, the centermost timelines have as coordinates `-0` and `+0`. More information on this can be found in the [Notes](#notes) section.

*Note:* On turn zero variants, the turn zero board(s) has as time coordinate `T0`, while the others have `T1`, `T2`, etc. On non-turn-zero variants, no board has as time coordinate `T0`.

*Example:* A `Standard` game starts with one empty timeline on `L0`.
Using this notation, the first board of a `Standard` game is referred to as `(0T1)` or `(L0 T1)`.

When combined with physical coordinates, super-physical coordinates are written before the physical coordinates: `(-1T6)e4` is the square `e4` on the `(L-1 T6)` board.

## Moves

### Physical moves

Physical moves are written the same as traditional chess [standard algebraic notation](https://en.wikipedia.org/wiki/Algebraic_notation_%28chess%29).

*Note:* omissions follow similar rules, which can be found in the [Notes](#notes) section.

They *must* be preceded by their board's coordinates if there is more than one timeline at the currently described state of the game.
If there is only one timeline up to this point, then physical moves may be written without their corresponding board's coordinate.

Piece letters are the same as standard algebraic notation, with additional letters used for fairy pieces:

- `P` for **p**awn
- `W` for bra**w**n
- `K` for **k**ing
- `C` for **c**ommon king (non-royal king)
- `Q` for **q**ueen
- `Y` or `RQ` for ro**y**al queen (the former is the recommended one)
- `S` or `PR` for princes**s** (the former is the recommended one)
- `N` for k**n**ight
- `R` for **r**ook
- `B` for **b**ishop
- `U` for **u**nicorn
- `D` for **d**ragon

The following informations about checks can be appended to the move:

- `+` if the move checks the opponent's king
- `*` if the move softmates the opponent's king (if the softmate is the result of a sequence of moves, the last move of that sequence should have the softmate indicator)
- `#` if the move checkmates the opponent's king (similarly, the last move contributing to the checkmate should have the checkmate indicator)

### Castling

Castling moves have the same super-physical prefix requirements as normal moves.

On starting positions with the white king on `e1` and the black king on `e8`, `O-O` (using the upper case latin letter O, not the digit zero) may be used to denote castling towards `g1` and `g8` for either player, whereas `O-O-O` may be used to denote castling towards `c1` and `c8` for either player.

On starting positions with more than one king for either player or kings in other places than `e1` and `e8`, the notation `K<file_from><rank_from><file_to><rank_to>` must be used. `file_from` and `rank_from` may be left out if no other king can go to `(file_to, rank_to)`.

*Note:* `O-O` can be seen as a shortcut for `Ke1g1`/`Ke8g8` and `O-O-O` as a shortcut for `Ke1c1`/`Ke8c8`.

### Jumps

Jumps use the following syntax:

- The super-physical coordinate of the origin board
- The piece's letter
- The piece's physical coordinate
- `>>` if the jump is branching, `>` if the jump isn't branching
- `x` if a piece is being taken
- The super-physical coordinate of the target board
- The physical coordinate of the target square
- Promotions, if any (see [Promotions](#promotions))
- `+`, `*` or `#` if the moves checks, softmates or checkmates the adversary
- `~` if the jump is branching and the present is being moved to the new branch

All put together, it looks like this: `(-1T4)Nc3>>x(0T2)c3+~` ("The knight from board -1L, T4, c3 jumps and takes on L, T2, c3, creating a new timeline (-2L) and moving the present").

A non-branching jump may look like this: `(0T6)Pd5>(1T6)d5`.

### Promotions

Underpromotion in the base game is not available, but other clients for the game have implemented underpromotion.

Promotions are denoted by adding the `=` symbol at the end of the move (before `+`, `*` or `#`), followed by the piece that the pawn/brawn promotes as (`Q` for queen, `N` for knight, etc).

### Inactive timeline reactivation

Should a past, inactive timeline be reactivated, the following token may be put after a move to clarify where the present gets put back:

`(~Tx)`, with `x` being replaced by the corresponding turn.

There is no need to precise which sub-turn it is, as the current player will have to play on any now-activated board that they may play on (leaving the present to the opponent's sub-turn after these moves), unless another branching move is made to bring the present even further back.

### Complex scenarios

In complex scenarios, especially with inactive timelines being reactivated or created, it may become hard for humans to keep track of which timelines were created.
To aid this, one may put the following token after a move:

`(>Lx)`, with `x` being replaced by the new timeline's index.

A fully-detailled, complex move may thus look like this: `(-1T4)Nc3>>x(0T2)c3+ (>L2) (~T1)`

Both present movement and created timeline tokens are purely for better human comprehension and should match with what can be induced from the described state of the game (if the piece of notation needs to be parsed).

## Turns

During their turn, each player may make several moves. Each move is written next to each other, separated by one or more spaces.
Sub-turns are separated by a forward slash (`/`).

A turn's basic syntax is the following:

- `<x>.` or `<x>w.`, with `<x>` being the turn number; the former is the recommended syntax for simple turns
- White's moves
- `/` or `<x>b.`; the former is the recommended syntax for simple turns
- Black's moves

Such a turn looks like this:

```
1. (0T1)d4 / (0T1)d6
```

In some rare cases, especially in puzzles, black's moves need to be annotated first.
In this case, the first turn should ommit white's moves:

```
1b. (0T10)Qg6+
2w. (0T11)Kh1 / (0T11)Bb7+
3. (0T12)Nf3 / (0T12)Qg6>>(0T8)g2#~
```

## Headers

Metadata is stored as **Headers** or tags. They are formatted like PGN headers.
A header's format is as follows:

```pgn
[HeaderName "Header Value"]
```

*Note:* There must be at least one space between the header name and the header value. Several headers can be on the same line, but it is recommended to put them on different lines.

*Note:* The header value is encoded as a unicode string, unlike classical PGN.

It is recommended to include the metadata also used for PGN (`White`, `Black`, `Result`, `Date`, etc.); additionally, this format recommends the use of its specific headers:

- `Board`: which variation was chosen (`Standard`, `Simple - No Queens`, etc.), defaults to `Standard`
- `Size`: the size of the board (`8x8`, `7x7`, `5x5`), recommended for non-standard variants and required for custom variants
- `Mode`: should always be set to `5D`
- `Puzzle`: used for puzzles, to indicate what kind of puzzle it is (mate in N, aid mate, find the best move, etc.)
- `Promotions`: a space-separated list of piece letters, describing which pieces pawns can promote into, recommended for non-standard variants and required for custom variants

## Comments

Comments may be put within curly braces: `{}`.
Nested comments are not supported.

## Full examples

### Rook Tactics I

```pgn
[Size "5x5"]
[Mode "5D"]

1. (0T1)Kb2 / (0T1)Ke4
2. (0T2)Re1 / (0T2)Kd3
3. (0T3)Re5# {attacks (0T1)Ke5}
```

### Knight tactics III

```pgn
[Size "5x5"]
[Mode "5D"]

1. (0T1)Nd2 / (0T1)c3
2. (0T2)Nb3 / (0T2)c2
3. (0T3)Nb3>>(0T1)a3 / (1T1)Ke4
4. (1T2)Nb5# {attacks (0T3)Kd5}
```

### Actual game

Following is an example of a game, encoded in the described standard:

```pgn
[White "Teln0"]
[Black "Shad Amethyst"]
[Board "Simple - No Queens"]
[Size "7x7"]
[Date "2020.08.14"]
[Result "1-0"]
[Mode "5D"]

1. (0T1)Nd3 / (0T1)Nc5
2. (0T2)Nxc5+ / (0T2)bxc5
3. (0T3)g3 / (0T3)g4
4. (0T4)Bg2 / (0T4)d5
5. (0T5)O-O {to the right} / (0T5)Be5
6. (0T6)Nb1>>(0T5)b3 / (1T5)Bb6
7. (1T6)Nc3 / (0T6)Ne7>(1T6)e5
8. (0T7)a4 (1T7)O-O {to the right} / (0T7)Be5>>(0T6)e4
9. (-1T7)Bxe4 / (-1T7)dxe4 (1T7)c4
10. (1T8)Nb3>(0T8)d3 (-1T8)a4 / (-1T8)Bd4 (0T8)Kd7>(1T8)d6
11. (-1T9)Ra3 (0T9)Ra3 (1T9)b3 / (-1T9)Bd4>x(0T9)d3 (1T9)cxb3
12. (-1T10)d3 (0T10)cxd3 (1T10)Ba3 / (-1T10)Nd5 (0T10)Rb7 (1T10)c5?
13. (-1T11)dxe4 (0T11)Rc3 (1T11)axb3 / (0T11)Rg5 (1T11)Ne5>x(-1T11)e4
14. (-1T12)Rd3 (0T12)d4 (1T12)b4 / (-1T12)c4 (0T12)c4 (1T12)cxb4
15. (-1T13)Rd4 (0T13)d3 (1T13)Ba4+ / (-1T13)O-O-O {to the left} (0T13)cxd3 (1T13)Bc5
16. (-1T14)Rxe4 (0T14)exd3 (1T14)Bxc5+ / (0T14)Bg2 (-1T14)Nd5>x(1T14)c5
17. (-1T15)Rc4 (0T15)Rc6 (1T15)Ra5 / (-1T15)e5 (0T15)Bd3+ (1T15)Ne4
18. (-1T16)Rb4+ (0T16)Kg1 (1T16)Nxe4 / (-1T16)Kb7>x(0T16)c6 (1T16)dxe4
19. (-1T17)Rb4>(1T17)b4 (0T17)Bxg5 / (-1T17)Bc4 (0T17)Bc4 (1T17)Nd5
20. (-1T18)Be3 (0T18)Rc1 (1T18)Rd4 / (-1T18)Rd7 (0T18)Kc6>(1T18)b6?
21. (-1T19)Bb6+ {checks (1T19)d6} (0T19)Rb1 (1T19)Raxd5+ / (-1T19)c6>(0T19)c6 {blocks (-1T20)Bb6>>x(1T20)d6 1-0} (1T19)exd5
22. (-1T20)Bb6>x(0T20)b7+ {checks (1T20)d7} (1T20)Rxd5+ / (-1T20)Bc4>>x(-1T18)a4
23. (-2T19)Bb6 / (-2T19)Rb7
24. (-2T20)Bb6>>x(-1T20)a6+ {checks (1T20)b6, (2T20)b6 also checks (1T19)b6} 1-0 {Black forfeits}
```

Here is what the end of that game looks like:

![End of the aforementioned game](https://cdn.discordapp.com/attachments/740361438375313540/743827989321744467/unknown.png)

This is another game, between Shad and PseudoAbstractMeta, using the modern features of the notation:

```pgn
[Mode "5D"]
[Board "Standard - Half Reflected"]
[Size "8x8"]
[White "Shad Amethyst"]
[Black "PseudoAbstractMeta"]
[Date "2021.01.22"]
[Result "1-0"]

1. f4 / e5
2. f5 / f6
3. g3 / Bd6
4. b3? {This turned out later to be a weak move} / Qh5
5. Bh3 / Qg5
6. Nf3 / (0T6)Qg5>>x(0T4)g3+~
7. (-1T5)hxg3 / (-1T5)e4
8. (-1T6)e3 / (-1T6)g6?
9. (0T7)Bh3>>x(0T5)h5~ / (1T5)Nc6
10. (1T6)Be8+ / (1T6)Kxe8 {Forced}
11. (-1T7)Ne2 (1T7)e3 / (-1T7)gxf5 (0T7)Ne7 (1T7)h5 {Forced}
12. (0T8)Nf3>x(-1T8)f5 (1T8)Nh3 / (-1T8)Qg6 (0T8)Bd6>(1T8)d5
13. (1T9)Nh3>>x(1T8)h5~ / (2T8)Kd8!
14. (0T9)Rf1 (-1T9)Nxd6 (2T9)Qg4 / (-1T9)cxd6 (0T9)Ng8! {Protects (L+2)g7} (1T9)Nd4? (2T9)b6
15. (-1T10)Ba3 (0T10)Ba3 {Threatening mate on f8} (1T10)exd4 (2T10)Ne2 {Protecting (L+1)e4} / (-1T10)f5! (0T10)d6! (1T10)b6 (2T10)Nge7
16. (-1T11)Rg1 (0T11)Qd1>(2T11)f3 (1T11)Nc3 / (-1T11)Nc6 (0T11)Nc6 (1T11)Bxh1? (2T11)Bb7
17. (-1T12)Nf4 {Threatening the queen} (0T12)Nc3 (2T12)Rh1>x(1T12)h1 / (-1T12)Qg6>>x(-1T9)d6~ (>L-2)
18. (-2T10)Rg1 / (-2T10)h5
19. (-2T11)Nf4 / (-2T11)Qg5
20. (-2T12)Qe2 / (-2T12)h4 (0T12)Nd4 (1T12)Ne7 (2T12)Kc8 {Time trouble for black}
21. (2T13)Qg4>>x(2T10)g7~! (>L+3) / (3T10)Bd6>>x(1T10)d4~ (>L-3)
22. (3T11)Qg7g6*! (-3T11)Qh5+ / (-3T11)Rxh5 (2T13)Bd6>>x(2T9)d2~ {One of the two legal moves, black is losing} (>L-4)
23. (-4T10)Bxd2 / 1-0 {White wins by timeout; possible continuation would have been (-4T10)d4; 24. (-4T10)Qxd4#}
```

The final position looks like this (a dummy move was made on `(3T11)` to highlight the checks causing the softmate).

![End of the second aforementionned game](https://cdn.discordapp.com/attachments/592381888778207242/802304944307961906/Screenshot_2021-01-22_23-33-02.png)

## 5DFEN and custom variants

You can encode custom variants and puzzles using the 5DFEN extension of that notation.
The formal grammar of 5DFEN can be found in [here](./fen.ebnf) in [EBNF](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form) format.

To use this extension, you need to set the board tag to `"custom"` and encode the initial boards as 5DFEN board strings.

A board is considered initial if one of the following conditions is true:
- it does not emanate from any other board (eg. the first board in standard)
- there weren't any moves from the board that it emanated that would yield that board (eg. the second board in standard - turn zero)

A *board string* is the 5DFEN way of describing the state of an initial board.
A board string is enclosed within square brackets (`[]`) and is made of several fields, separated by colons (`:`).
There should be no spaces, as to not confuse a board string with a regular header.

The first field contains the board's pieces.
The different rows of the board are separated by slashes (`/`), the rows are read from top to bottom.
Each row is a string of pieces, encoded using letters (optionally preceded by a `+`), and blanks, encoded using numbers.

A white piece is encoded as an uppercase letter and a black piece as a lowercase letter.
To extend the number of pieces that can be encoded without sacrificing readability, a piece's corresponding letter may be *preceded*
by a `+`.

The list of the pieces' corresponding letters is as follows:
- `P/p` for **p**awn
- `B/b` for **b**ishop
- `R/r` for **r**ook
- `N/n` for k**n**ight
- `K/k` for **k**ing
- `Q/q` for **q**ueen
- `U/u` for **u**nicorn
- `D/d` for **d**ragon
- `S/s` for prince**s**s
- `W/w` for bra**w**n
- `C/c` for **c**ommon king
- `Y/y` for ro**y**al queen

Blanks are encoded using numbers:
- If there is a one-piece blank, then it is encoded using `1`.
- If there is a two-piece blank, then it is encoded using `2`.
- If there is a ten-piece blank, then it is encoded using `10`.
- If there is a N-piece blank, then it is encoded by writing `N` out in base 10.

If a piece is sensitive to having been moved already or not and hasn't moved yet, then it must be followed by an asterisk (`*`):
- An unmoved white pawn is encoded as `P*`
- An unmoved black king is encoded as `k*`

The other three fields are (in order):
- Timeline, may be `-1`, `-0`, `0`, `+0`, `+1`, etc.
- Turn, as displayed in-game, may be `0`, `1`, `2`, etc.
- Player color, may be `w` for white and `b` for black

### Additional Metadata

The following metadata fields are required to have within the headers of a game using this extension:

- `Board = "custom"`, as to indicate that 5DFEN needs to be used
- `Size = "WxH"`, with `W` the width of the boards and `H` the height of the boards
- `Puzzle = "mate-in-N"`, with `N` the number of actions to be made by the current player. This is only required if the position is meant
  as a puzzle and where a mate in N is possible. Other kinds of puzzles may also be encoded in a similar way.
- `Promotions = "Q,R"`, a comma-separated list of pieces that pawns and brawns can promote to. It should be ordered from most important to least important (putting the queen/princess first is a good rule of thumb). *A default behavior has yet to be decided on.*

### Examples

This is how the standard position would be encoded:

```pgn
[Size "8x8"]
[Board "custom"]
[r*nbqk*bnr*/p*p*p*p*p*p*p*p*/8/8/8/8/P*P*P*P*P*P*P*P*/R*NBQK*BNR*:0:1:w]
```

This is how `Rook Tactics I` would be encoded:

```pgn
[Size "5x5"]
[Puzzle "mate-in-1"]
[Board "custom"]
[4k/5/5/5/K1R2:0:1:w]

1. Kb2 / Ke4
2. Re1 / Kd3
```

## Export or minimal notation

Depending on the usecase, the exported, formatted data may not need to or cannot contain all of the information that this notation tries to convey.
The following is a raw or "minimalized" version of this notation, which can later be parsed again into the full notation.

*This raw notation is still a proposal!*

### Export moves

An export move is made up of:

- the super-physical coordinates of the starting board `(<l>T<t>)`
- *the piece's letter (optional)*
- the physical coordinates of the moving piece
- the super-physical coordinates of the target board
- the physical coordinates of the target square

Castling is encoded as the king moving two pieces: `(0T6)Ke1(0T6)g1`. The rook's movement when castling is not annotated.

### Export turns

An export turn is made up of an introductory token, which indicates which player is playing, and a set of space-separated raw moves.

The introductory token is for white `w.` and for black `b.`

Such a raw turn would thus look like:

```
w. (0T1)d2(0T1)d4
b. (0T1)d7(0T1)d6
```

## Hashing

For certain applications, getting a hash or checksum of either the full state (all boards) or a single board is desired. To facilitate standardization, hashing both the full state and a single board should be create by the following processes.

*This standard is still just a proposal and not official yet!*

For single board hashing:

  1. Create the 5DFEN string of the single board, stripping any and all whitespaces (including newlines)
  2. Feed the resulting string (encoded as UTF-8) into the MD5 message-digest algorithm
  3. Extract the resulting hash as hexadecimal digits
  4. Convert to UTF-8 string (alphabet characters should be lowercase)

For full state hashing:

  1. Grab the 5DFEN string of all boards.
  2. Concatenate all of these 5DFEN strings together (sorting boards by timeline (ascending) first and then by turn (ascending)), stripping any and all whitespaces (including newlines)
  3. Feed the resulting string (encoded as UTF-8) into the MD5 message-digest algorithm
  4. Extract the resulting hash as hexadecimal digits
  5. Convert to UTF-8 string (alphabet characters should be lowercase)

### 5DFEN Strictness

For purposes of sorting, timeline -0 is considered lower than timeline +0.

For strictness, extracting 5DFEN strings should standardize on move sensitivity. The following pieces should be marked as unmoved if needed (the rest of the pieces should not include the unmoved marking):

  - Pawn
  - Rook
  - King
  - Brawn

### Examples

For the `Standard` variant, both the single board and full state have the same hash:

```
md5('[r*nbqk*bnr*/p*p*p*p*p*p*p*p*/8/8/8/8/P*P*P*P*P*P*P*P*/R*NBQK*BNR*:0:1:w]')

                |
                V

'd574889fd9da3f2bc65249ff27249b00'
```

For the `Standard - Two Timeline` variant, the full state hash looks like this:

```
md5('[r*nbqk*bnr*/p*p*p*p*p*p*p*p*/8/8/8/8/P*P*P*P*P*P*P*P*/R*NBQK*BNR*:-0:1:w][r*nbqk*bnr*/p*p*p*p*p*p*p*p*/8/8/8/8/P*P*P*P*P*P*P*P*/R*NBQK*BNR*:+0:1:w]')

                |
                V

'3672761404ffcd15ae644c75401812be'
```

## Notes

### Even-numbered starting boards

Originally, this notation planned to not number boards `-0` and `+0`.
There are some arguments for this:

- Under IEEE 754, [`-0 == 0`](https://en.wikipedia.org/wiki/Floating-point_arithmetic#Signed_zero)
- Internally in the game, `-0` is `-1`

Arguments for numbering boards using `-0` and `+0` are:

- The game shows you the board indices as such, making it easier to manually transcribe a game
- The displayed timeline index gives a hint about who has or hasn't branching priority
- It can be converted when parsed and later stored as `-0.5` and `+0.5`
- Axel's notation, Hexicube's parser and the Matrix notation already use `-0` and `+0`

Thus, this notation now allows using `-0` and `+0` as starting board indices.

If `-0` and `+0` are used, the `+` sign is mandatory (just like how it's always displayed in such cases in the game).
The `+` sign can be omitted for other integers.

The included parser goes around the signed zero equality issue by converting during the token parsing phase `"-0"` to `-0.5` and `"+0"` to `0.5`.
The reverse conversion is done whenever we need to write/export the coordinates.

### Branching

Branching notation (as in SAN+RAV) is not yet supported, and it is unknown how it should behave with the super-physical coordinates.
Possibilities include:

- Keeping parenthesis-enclosed super-physical coordinates and simply introducing branching (both are compatible as long as token priority is introduced or if a recursive block is introduced with a space-isolated parenthesis)
- Having square bracket-enclosed super-physical coordinates and parenthesis-enclosed branches
- Having square bracket-enclosed super-physical coordinates *in* parenthesis-enclosed branches
- Remove the parentheses around super-physical coordinates, at the cost of readability
- Use indentation to indicate recursive blocks
- Include the block depth within the turn indicator (`2w1.` or `2~1w.`, for instance)

### Omission

As in SAN, parts of the source square's coordinates may be omitted.
While the parser bundled here could handle omission in super-physical moves, this format requires you to specify these coordinates nonetheless.

In some cases, moving a piece to an otherwise valid square is illegal because it would put the king in check.
In those cases, this piece can be considered pinned and may be left out of the equation when looking for omission.
However, because checks in 5D chess aren't as trivial as in traditional chess (sometimes requiring a specific move order between boards), the source square's coordinates should still be specified.

The super-physical coordinates may now be omitted in one-timeline scenarios.
No omissions beyond that are currently considered, but suggestions are always welcome!

### Turn zero

Turn zero boards have recently been introduced. They can be referenced with `T0`.
