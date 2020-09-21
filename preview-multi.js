import {PIECES, MOVE_KIND, index_to_letter, write_timeline} from "./parsers/game.js";
import * as preview from "./preview.js";

export function run(game, piece_set, black_bg, blessed) {
  Board.game = game;
  Board.piece_set = piece_set;
  Board.black_bg = black_bg;
  let screen = blessed.screen({
    smartCSR: true
  });
  screen.title = "5D Chess game previewer";

  let main_box_dims = [screen.width - 10, screen.height - 12];
  let l = 0;
  let t = 0;

  if (game.board_indices.find(x => x === 0.5)) l = -0.5;

  let main_box = blessed.box({
    top: "center",
    left: "center",
    width: main_box_dims[0],
    height: main_box_dims[1],
    content: "",
    tags: true,
    style: {
      fg: "white",
      border: {
        fg: "#f0f0f0"
      }
    }
  });

  let left_box = blessed.box({
    top: "50%-5",
    left: "0",
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
    top: "50%-5",
    left: "100%-5",
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
    top: "0",
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
    top: "100%-6",
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
    top: "100%-3",
    left: "center",
    width: 15,
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
    top: "100%-3",
    left: 0,
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

  let toggle_box = blessed.box({
    top: "100%-3",
    left: "100%-14",
    width: 14,
    height: 3,
    tags: true,
    content: "{center}showing: all{/center}",
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
  screen.append(toggle_box);

  screen.key(['escape', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  let boards = [];

  function update() {
    if (t === 0 && game.initial_board_indices.findIndex(x => x === l) !== -1) {
      move_box.setContent("{center}(Starting pos.){/center}");
    } else {
      let tl = game.get_timeline(l);
      if (tl) {
        let move = tl.moves[t - tl.begins_at - (tl.synthetic ? 0 : 1)];
        if (move) {
          move_box.setContent("{center}" + preview.write_move(move) + "{/center}");
        } else {
          move_box.setContent("");
        }
      } else {
        move_box.setContent("{center}(No such TL.){/center}");
      }
    }

    boards.forEach(board => board.update(l, t));

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
    let amt = Board.one_color_mode ? 2 : 1;
    if (t >= amt) t -= amt;
    update();
  }

  function move_right() {
    let amt = Board.one_color_mode ? 2 : 1;
    t += amt;
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

  function toggle_one_color_mode() {
    Board.one_color_mode = !Board.one_color_mode;
    let showing = Board.one_color_mode ? (t % 2 ? "black only" : "white only") : "showing: all";
    toggle_box.style.border.fg = Board.one_color_mode ? (t % 2 ? "black" : "white") : "gray";
    toggle_box.setContent(`{center}${showing}{/center}`)
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

  screen.key(['t', 'tab', 'space'], toggle_one_color_mode);
  toggle_box.on("click", toggle_one_color_mode);

  let handle_resize = () => {
    boards.forEach(board => main_box.remove(board.box));
    boards.forEach(board => board.box.destroy());
    boards = [];

    [main_box.width, main_box.height] = main_box_dims = [screen.width - 10, screen.height - 12];
    let nx = Board.num_boards_x = Math.max(1, Math.floor(main_box_dims[0] / (game.width + 2)));
    let ny = Board.num_boards_y = Math.max(1, Math.floor(main_box_dims[1] / (game.height + 2)));
    move_box.width = toggle_box.width = Math.max(main_box_dims[0] - 18, 15);

    for (let dl = Math.ceil((1-ny) / 2); dl <= Math.floor(ny / 2); dl++) {
      for (let dt = Math.ceil((1-nx) / 2); dt <= Math.floor(nx / 2); dt++) {
        boards.push(new Board(blessed, dl, dt));
      }
    }
    boards.forEach(board => main_box.append(board.box));
    boards.forEach(board => board.box.on("click", () => {
      if (board.dt == 0 && board.dl == 0) toggle_one_color_mode();
      t += board.dt;
      l = preview.shift_timeline(l, board.dl, game);
      update();
    }));
    update();
  }

  screen.on('resize', handle_resize);

  handle_resize();

  screen.render();
}

class Board {
  static one_color_mode = false;
  static num_boards_x = 1;
  static num_boards_y = 1;
  static game = null;
  static piece_set = null;
  static black_bg = null;

  constructor(blessed, dl, dt) {
    this.dl = dl; // x
    this.dt = dt; // y
    this.box = this.setup_box(blessed);
  }
  get dt() { return Board.one_color_mode ? 2 * this._dt : this._dt; }
  set dt(dt) { this._dt = dt; }

  setup_box(blessed) {
    let x_correction = Board.num_boards_x % 2 ? -0.5 : -1;
    let y_correction = Board.num_boards_y % 2 ? -0.5 : -1;
    let x_offset = Math.ceil((Board.game.width + 2) * (this.dt + x_correction));
    let y_offset = Math.ceil((Board.game.height + 2) * (this.dl + y_correction)) - 3;
    return blessed.box({
      top: "50%" + (y_offset >= 0 ? "+" : "") + y_offset,
      left: "50%" + (x_offset >= 0 ? "+" : "") + x_offset,
      width: Board.game.width + 2,
      height: Board.game.height + 2,
      content: "",
      tags: true,
      border: 'line',
      style: {
        fg: "white",
        border: {
          fg: "#f0f0f0"
        }
      }
    });
  }

  // generate box content for an empty board at (l, t)
  empty_content(l, t) {
    let is_center = (this.dl == 0) && (this.dt == 0);
    let color = is_center ? "{white-fg}" : "{gray-fg}"
    let text_l = write_timeline(l);
    let text_t = String(~~(t / 2) + 1);
    let left_padding = " ".repeat(text_l.length);
    let bw = t % 2 ? "b" : "w";
    let right_padding = " ".repeat(text_t.length);
    return "\n".repeat(Math.floor((Board.game.height-1)/2))
         + `{center}${color}${text_l}T${text_t}{/center}\n`
         + `{center}${color}${left_padding}${bw}${right_padding}{/center}\n`;
         // + `(${this.dl}, ${this.dt})\n[${l}, ${t}]\n`; // debug
  }

  // generate box content representing the board at (l, t)
  board_content(l, t, board) {
    let [from_x, from_y, to_x, to_y] = [-1,-1,-1,-1];
    let highlight_color = preview.MOVE_BG;
    if (t === 0 && Board.game.initial_board_indices.findIndex(x => x === l) !== -1) {
    } else {
      let tl = Board.game.get_timeline(l);
      if (tl) {
        let move = tl.moves[t - tl.begins_at - (tl.synthetic ? 0 : 1)];
        if (move) {
          if (move.from && move.kind === MOVE_KIND.MOVE || move.kind === MOVE_KIND.JUMP_OUT) {
            [from_x, from_y] = [move.from[2], move.from[3]];
          }
          if (move.to && move.kind === MOVE_KIND.MOVE || move.kind === MOVE_KIND.JUMP_IN) {
            [to_x, to_y] = [move.to[2], move.to[3]];
          }
          if ((move.kind === MOVE_KIND.JUMP_OUT) || (move.kind === MOVE_KIND.JUMP_IN)) {
            highlight_color = preview.JUMP_BG;
          }
        }
      }
    }

    let content = "";
    for (let y = Board.game.height - 1; y >= 0; y--) {
      for (let x = 0; x < Board.game.width; x++) {
        content += ((x + y) % 2) ? preview.WHITE_BG : preview.BLACK_BG;
        if ((x === from_x && y === from_y) || (x === to_x && y === to_y)) content += highlight_color;
        content += Board.piece_set[board[x + y * Board.game.width]] + "{/}";
      }
    }
    return content;
  }

  static cache = {};
  draw_content(l, t, board) {
    let key = l + "," + t;
    return Board.cache[key] = Board.cache[key] ? Board.cache[key] :
      board ? this.board_content(l, t, board) : this.empty_content(l, t);
  }

  // setup box for the board (l, t), highlighting jumps if needed
  update(l_curr, t_curr) {
    let l = preview.shift_timeline(l_curr, this.dl, Board.game);
    let t = t_curr + this.dt;
    let board = t >= 0 ? Board.game.get_board(l, t) : null;
    let is_center = (this.dl == 0) && (this.dt == 0);
    if (!board) {
      this.box.border.type = 'bg';
      this.box.style.bg = is_center ? preview.SELECTION_HIGHLIGHT : Board.black_bg;
      this.box.style.border.bg = is_center ? preview.SELECTION_HIGHLIGHT : Board.black_bg;
      this.box.setContent(this.draw_content(l, t));
    } else {
      let is_jump = false;
      // if the move for the current board (l_curr, t_curr) is a jump,
      // highlight the board we're jumping from/to
      if (t >= 0) {
        let tl = Board.game.get_timeline(l_curr);
        if (tl) {
          let move = tl.moves[t_curr - tl.begins_at - (tl.synthetic ? 0 : 1)];
          if (move) {
            let jump_l, jump_t;
            if (move.kind === MOVE_KIND.JUMP_OUT) {
              let turn_correction = !(t_curr % 2);
              [jump_l, jump_t] = [move.to[0], 2 * move.to[1] + turn_correction];
            } else if (move.kind === MOVE_KIND.JUMP_IN) {
              let turn_correction = !(t_curr % 2);
              [jump_l, jump_t] = [move.from[0], 2 * move.from[1] + turn_correction];
            }
            is_jump = (jump_l == l) && (jump_t == t);
          }
        }
      }
      this.box.style.border.fg = t % 2 ? "gray" : "white";
      this.box.style.bg = is_center ? preview.SELECTION_HIGHLIGHT : (is_jump ? preview.JUMP_HIGHLIGHT : Board.black_bg);
      this.box.style.border.bg = is_center ? preview.SELECTION_HIGHLIGHT : (is_jump ? preview.JUMP_HIGHLIGHT : Board.black_bg);
      this.box.border.type = 'line';
      this.box.setContent(this.draw_content(l, t, board));
    }
  }
}
