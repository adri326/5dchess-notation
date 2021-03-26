const {PIECES, MOVE_KIND, index_to_letter, write_timeline} = require("./parsers/game.js");
const preview = require("./preview.js");

function run(game, piece_set, black_bg, blessed) {
  let screen = blessed.screen({
    smartCSR: true
  });
  screen.title = "5D Chess game previewer";

  let main_box_dims = [game.width * 4 + 1, game.height * 2 + 1];

  let l = 0;
  if (game.board_indices.find(x => x === 0.5)) l = -0.5;

  let t = game.timelines.find(tl => tl.index === l).begins_at;

  let main_box = blessed.box({
    top: "center",
    left: "center",
    width: game.width * 4 + 1,
    height: game.height * 2 + 1,
    content: print_board(game.get_board(l, t), game, piece_set),
    tags: true,
    style: {
      fg: "white",
      border: {
        fg: "#f0f0f0"
      },
      bg: black_bg,
    }
  });

  let left_box = blessed.box({
    top: "center",
    left: "50%-" + ~~(main_box_dims[0] / 2 + 6),
    width: 5,
    height: 5,
    tags: true,
    content: "",
    border: {
      type: "line"
    },
    style: {
      fg: "white",
      border: {
        fg: "#606060",
      },
      hover: {
        fg: "#fff000",
      }
    }
  });

  let right_box = blessed.box({
    top: "center",
    left: "50%+" + ~~(main_box_dims[0] / 2 + 2),
    width: 5,
    height: 5,
    tags: true,
    content: "\n{center}{bold}→{/bold}{/center}",
    border: {
      type: "line"
    },
    style: {
      fg: "white",
      border: {
        fg: "#606060",
      },
      hover: {
        fg: "#fff000",
      }
    }
  });

  let top_box = blessed.box({
    top: "50%-" + ~~(main_box_dims[1] / 2 + 3),
    left: "center",
    width: 7,
    height: 3,
    tags: true,
    content: game.get_board(preview.timeline_below(l, game), t) ? "{center}{bold}↑{/bold}{/center}" : "",
    border: {
      type: "line"
    },
    style: {
      fg: "white",
      border: {
        fg: "#606060",
      },
      hover: {
        fg: "#fff000",
      }
    }
  });

  let bottom_box = blessed.box({
    top: "50%+" + ~~(main_box_dims[1] / 2 + 1),
    left: "center",
    width: 7,
    height: 3,
    tags: true,
    content: game.get_board(preview.timeline_above(l, game), t) ? "{center}{bold}↓{/bold}{/center}" : "",
    border: {
      type: "line"
    },
    style: {
      fg: "white",
      border: {
        fg: "#606060",
      },
      hover: {
        fg: "#fff000",
      }
    }
  });

  let move_box = blessed.box({
    top: "50%+" + ~~(main_box_dims[1] / 2 + 4),
    left: "center",
    width: Math.max(main_box_dims[0], 15),
    height: 3,
    tags: true,
    content: "{center}(Starting pos.){/center}",
    border: {
      type: "line"
    },
    style: {
      fg: "white",
      border: {
        fg: "#606060",
      }
    }
  });

  let turn_box = blessed.box({
    top: "50%+" + ~~(main_box_dims[1] / 2 + 4),
    left: "50%-" + (~~(Math.max(main_box_dims[0], 15) / 2) + 14),
    width: 14,
    height: 3,
    tags: true,
    content: `{center}(${write_timeline(l)}T${~~(t / 2) + 1}); ${t % 2 ? "b" : "w"}{/center}`,
    border: {
      type: "line"
    },
    style: {
      fg: "white",
      border: {
        fg: "#606060",
      }
    }
  });

  screen.append(left_box);
  screen.append(right_box);
  screen.append(top_box);
  screen.append(bottom_box);
  screen.append(main_box);
  screen.append(move_box);
  screen.append(turn_box);

  screen.key(['escape', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  function update() {
    let highlight_x = -1;
    let highlight_y = -1;
    if (t === 0 && game.initial_board_indices.findIndex(x => x === l) !== -1) {
      move_box.setContent("{center}(Starting pos.){/center}");
    } else {
      let tl = game.get_timeline(l);
      if (tl) {
        let move = tl.moves[t - tl.begins_at - (tl.synthetic ? 0 : 1)];
        if (move && move.kind !== MOVE_KIND.NONE) {
          move_box.setContent("{center}" + preview.write_move(move) + "{/center}");
          if (move.to && (move.kind === MOVE_KIND.MOVE || move.kind === MOVE_KIND.JUMP_IN)) {
            highlight_x = move.to[2];
            highlight_y = move.to[3];
          }
        } else {
          move_box.setContent("");
        }
      } else {
        move_box.setContent("{center}(No such TL.){/center}");
      }
    }

    let board = game.get_board(l, t);
    if (board) {
      main_box.setContent(print_board(board, game, piece_set, highlight_x, highlight_y));
    } else {
      main_box.setContent("\n".repeat(~~(main_box_dims[0] / 4)) + "{center}(No board){/center}");
    }

    if (game.get_board(l, t - 1)) {
      left_box.setContent("\n{center}{bold}←{/bold}{/center}");
    } else {
      left_box.setContent("");
    }

    if (game.get_board(l, t + 1)) {
      right_box.setContent("\n{center}{bold}→{/bold}{/center}");
    } else {
      right_box.setContent("");
    }

    if (game.get_board(preview.timeline_above(l, game), t)) {
      bottom_box.setContent("{center}{bold}↓{/bold}{/center}");
    } else {
      bottom_box.setContent("");
    }

    if (game.get_board(preview.timeline_below(l, game), t)) {
      top_box.setContent("{center}{bold}↑{/bold}{/center}");
    } else {
      top_box.setContent("");
    }

    turn_box.setContent(`{center}(${write_timeline(l)}T${~~(t / 2) + 1}); ${t % 2 ? "b" : "w"}{/center}`);

    screen.render();
  }

  function move_left() {
    if (t > 0) t--;
    update();
  }

  function move_right() {
    t++;
    update();
  }

  function move_down() {
    l = preview.timeline_above(l, game);
    update();
  }

  function move_up() {
    l = preview.timeline_below(l, game);
    update();
  }

  screen.key(['left', 'a', 'q'], move_left);
  left_box.on("click", move_left);

  screen.key(['right', 'd'], move_right);
  right_box.on("click", move_right);

  screen.key(['down', 's'], move_down);
  bottom_box.on("click", move_down);

  screen.key(['up', 'w', 'z'], move_up);
  top_box.on("click", move_up);

  screen.render();
}
exports.run = run;

function print_board(board, game, set = preview.PIECE_CHAR, highlight_x = -1, highlight_y = -1) {
  let res = "";
  res += "{gray-fg}┌───";
  res += "┬───".repeat(game.width - 1);
  res += "┐\n";

  for (let y = 0; y < game.height; y++) {
    res += "{gray-fg}│";

    for (let x = 0; x < game.width; x++) {
      res += "{white-fg} ";
      if ((x + y) % 2 === 0) {
        res += preview.WHITE_BG;
      }
      if (x === highlight_x && (game.height - y - 1) === highlight_y) {
        res += preview.MOVE_BG;
      }
      res += set[board[x + (game.height - y - 1) * game.width]] + "{/} {gray-fg}│";
    }

    res += "\n";

    if (y !== game.height - 1) {
      res += "{gray-fg}├───";
      res += "┼───".repeat(game.width - 1);
      res += "┤\n";
    }
  }

  res += "{gray-fg}└───";
  res += "┴───".repeat(game.width - 1);
  res += "┘\n";
  return res;
}
