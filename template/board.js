

var board = null;
let chess_AI_move = null;
const game = new Chess();
var $status = $("#status");
let $fen = $("#fen");
let $pgn = $("#pgn");
const minimax_alg_searching_limit = 3;
const AI_chooser = 3;
const ev_func_version = 2;
const piece_value_ev = {
  king: [
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-2, -3, -3, -4, -4, -3, -3, -2],
    [-1, -2, -2, -2, -2, -2, -2, -1],
    [2, 2, 0, 0, 0, 0, 2, 2],
    [2, 3, 1, 0, 0, 1, 3, 2],
  ],

  queen: [
    [-2, -1, -1, -0.5, -0.5, -1, -1, -2],
    [-1, 0, 0, 0, 0, 0, 0, -1],
    [-1, 0, 0.5, 0.5, 0.5, 0.5, 0, -1],
    [-0.5, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
    [0, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
    [-1, 0.5, 0.5, 0.5, 0.5, 0.5, 0, -1],
    [-1, 0, 0.5, 0, 0, 0, 0, -1],
    [-2, -1, -1, -0.5, -0.5, -1, -1, -2],
  ],
  rook: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0.5, 1, 1, 1, 1, 1, 1, 0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  bishop: [
    [-2, -1, -1, -1, -1, -1, -1, -2],
    [-1, 0, 0, 0, 0, 0, 0, -1],
    [-1, 0, 0.5, 1, 1, 0.5, 0, -1],
    [-1, 0.5, 0.5, 1, 1, 0.5, 0.5, -1],
    [-1, 0, 1, 1, 1, 1, 0, -1],
    [-1, 1, 1, 1, 1, 1, 1, -1],
    [-1, 0.5, 0, 0, 0, 0, 0.5, -1],
    [-2, -1, -1, -1, -1, -1, -1, -2],
  ],
  knight: [
    [-5, -4, -3, -3, -3, -3, -4, -5],
    [-4, -2, 0, 0, 0, 0, -2, -4],
    [-3, 0, 1, 1.5, 1.5, 1, 0, -3],
    [-3, 0.5, 1.5, 2, 2, 1.5, 0.5, -3],
    [-3, 0, 1.5, 2, 2, 1.5, 0, -3],
    [-3, 0.5, 1, 1.5, 1.5, 1, 0.5, -3],
    [-4, -2, 0, 0.5, 0.5, 0, -2, -4],
    [-5, -4, -3, -3, -3, -3, -4, -5],
  ],
  pawn: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5],
    [1, 1, 2, 3, 3, 2, 1, 1],
    [0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5],
    [0, 0, 0, 2, 2, 0, 0, 0],
    [0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5],
    [0.5, 1, 1, -2, -2, 1, 1, 0.5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;

  // only pick up pieces for the side to move
  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

function onDrop(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return "snapback";
  updateStatus();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
  chess_AI_move(AI_chooser);
}

function updateStatus() {
  let status = "";
  let moveColor = "White";
  if (game.turn() === "b") {
    moveColor = "Black";
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = "Game over, " + moveColor + " is in checkmate.";
  }

  // draw?
  else if (game.in_draw()) {
    status = "Game over, drawn position";
  }

  // game still on
  else {
    status = moveColor + " to move";

    // check?
    if (game.in_check()) {
      status += ", " + moveColor + " is in check";
    }
  }
  $status.html(status);
  $fen.html(game.fen());
  $pgn.html(game.pgn());
}

var config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  orientation: "white",
};
var game_imfo = {
  player: "white",
  AI_player: "black",
};
function initboard(num) {
  if (num % 2) {
    game_imfo.player = "black";
    game_imfo.AI_player = "white";
  } else {
    game_imfo.player = "white";
    game_imfo.AI_player = "black";
  }
  config.orientation = game_imfo.player;
  board = Chessboard("myBoard", config);
  game.reset();
  if (game_imfo.AI_player === "white") chess_AI_move(AI_chooser);
  updateStatus();
}
function chess_board_evaluate(version, board_situation) {
  if (version === 1) {
    let evnum = 0;
    for (let i = 0; i < board_situation.length; i++) {
      if (board_situation[i] === " ") break;
      else if (board_situation[i] === "p") evnum -= 10;
      else if (board_situation[i] === "P") evnum += 10;
      else if (board_situation[i] === "n") evnum -= 30;
      else if (board_situation[i] === "N") evnum += 30;
      else if (board_situation[i] === "b") evnum -= 30;
      else if (board_situation[i] === "B") evnum += 30;
      else if (board_situation[i] === "r") evnum -= 50;
      else if (board_situation[i] === "R") evnum += 50;
      else if (board_situation[i] === "q") evnum -= 90;
      else if (board_situation[i] === "Q") evnum += 90;
      else if (board_situation[i] === "k") evnum -= 900;
      else if (board_situation[i] === "K") evnum += 900;
    }
    return evnum;
  } else if (version === 2) {
    let evnum = 0;
    let cc_step = 0;
    let cc_ind = 0;
    //console.log(board_situation)
    for (let i = 0; i < board_situation.length; i++) {
      if (board_situation[i] === " ") break;
      else if (board_situation[i] === "/") {
        cc_step++;
        cc_ind = 0;
      } else if (board_situation[i] === "P") {
        evnum += 10;
        evnum += piece_value_ev.pawn[cc_step][cc_ind];
        //console.log(board_situation[i],cc_step,cc_ind,piece_value_ev.pawn[cc_step][cc_ind])
        cc_ind++;
      } else if (board_situation[i] === "N") {
        evnum += 30;
        evnum += piece_value_ev.knight[cc_step][cc_ind];
        //console.log(board_situation[i],cc_step,cc_ind,piece_value_ev.knight[cc_step][cc_ind])
        cc_ind++;
      } else if (board_situation[i] === "B") {
        evnum += 30;
        evnum += piece_value_ev.bishop[cc_step][cc_ind];
        //console.log(board_situation[i],cc_step,cc_ind,piece_value_ev.bishop[cc_step][cc_ind])
        cc_ind++;
      } else if (board_situation[i] === "R") {
        evnum += 50;
        evnum += piece_value_ev.rook[cc_step][cc_ind];
        //console.log(board_situation[i],cc_step,cc_ind,piece_value_ev.rook[cc_step][cc_ind])
        cc_ind++;
      } else if (board_situation[i] === "Q") {
        evnum += 90;
        evnum += piece_value_ev.queen[cc_step][cc_ind];
        //console.log(board_situation[i],cc_step,cc_ind,piece_value_ev.queen[cc_step][cc_ind])
        cc_ind++;
      } else if (board_situation[i] === "K") {
        evnum += 900;
        evnum += piece_value_ev.king[cc_step][cc_ind];
        //console.log(board_situation[i],cc_step,cc_ind,piece_value_ev.king[cc_step][cc_ind])
        cc_ind++;
      } else if (board_situation[i] === "p") {
        evnum -= 10;
        evnum -= piece_value_ev.pawn[7 - cc_step][7 - cc_ind];
        //console.log(board_situation[i],7-cc_step,7-cc_ind,piece_value_ev.pawn[7-cc_step][7-cc_ind])
        cc_ind++;
      } else if (board_situation[i] === "n") {
        evnum -= 30;
        evnum -= piece_value_ev.knight[7 - cc_step][7 - cc_ind];
        //console.log(board_situation[i],7-cc_step,7-cc_ind,piece_value_ev.knight[7-cc_step][7-cc_ind])
        cc_ind++;
      } else if (board_situation[i] === "b") {
        evnum -= 30;
        evnum -= piece_value_ev.bishop[7 - cc_step][7 - cc_ind];
        //console.log(board_situation[i],7-cc_step,7-cc_ind,piece_value_ev.bishop[7-cc_step][7-cc_ind])
        cc_ind++;
      } else if (board_situation[i] === "r") {
        evnum -= 50;
        evnum -= piece_value_ev.rook[7 - cc_step][7 - cc_ind];
        //console.log(board_situation[i],7-cc_step,7-cc_ind,piece_value_ev.rook[7-cc_step][7-cc_ind])
        cc_ind++;
      } else if (board_situation[i] === "q") {
        evnum -= 90;
        evnum -= piece_value_ev.queen[7 - cc_step][7 - cc_ind];
        //console.log(board_situation[i],7-cc_step,7-cc_ind,piece_value_ev.queen[7-cc_step][7-cc_ind])
        cc_ind++;
      } else if (board_situation[i] === "k") {
        evnum -= 900;
        evnum -= piece_value_ev.king[7 - cc_step][7 - cc_ind];
        //console.log(board_situation[i],7-cc_step,7-cc_ind,piece_value_ev.king[7-cc_step][7-cc_ind])
        cc_ind++;
      } else if (
        board_situation[i].charCodeAt() >= 49 &&
        board_situation[i].charCodeAt() <= 57
      ) {
        cc_ind += parseInt(board_situation[i]);
      }
    }
    //console.log(evnum)
    return evnum;
  }
}

function chess_board_minimax_evaluate(depth, ori) {
  if (depth === minimax_alg_searching_limit) {
    if (game_imfo.AI_player === "black")
      return chess_board_evaluate(ev_func_version, game.fen()) * -1;
    return chess_board_evaluate(ev_func_version, game.fen());
  }
  let valid_move = game.moves();
  if (ori === game_imfo.AI_player) {
    let mmValue = -Infinity;
    let mmindex = -1;
    for (let jnd = 0; jnd < valid_move.length; jnd++) {
      game.move(valid_move[jnd]);
      let calcu_temp = chess_board_minimax_evaluate(
        depth + 1,
        game_imfo.player
      );
      if (calcu_temp >= mmValue) {
        mmValue = calcu_temp;
        mmindex = jnd;
      }
      game.undo();
    }
    if (depth === 0) {
      game.move(valid_move[mmindex]);
      board.position(game.fen());
      return;
    }
    return mmValue;
  } else {
    let mmValue = Infinity;
    for (let jnd = 0; jnd < valid_move.length; jnd++) {
      game.move(valid_move[jnd]);
      let calcu_temp = chess_board_minimax_evaluate(
        depth + 1,
        game_imfo.AI_player
      );
      if (calcu_temp < mmValue) {
        mmValue = calcu_temp;
      }
      game.undo();
    }
    return mmValue;
  }
}

function chess_board_minimax_evaluate_alpha_beta(depth, ori, alpha, beta) {
  if (depth === minimax_alg_searching_limit) {
    if (game_imfo.AI_player === "black")
      return -chess_board_evaluate(ev_func_version, game.fen());
    else return chess_board_evaluate(ev_func_version, game.fen());
  }
  let valid_move = game.moves();
  //ori means if the section is maximiser or not
  if (ori) {
    let mmValue = -Infinity;
    let mmindex = -1;
    for (let jnd = 0; jnd < valid_move.length; jnd++) {
      game.move(valid_move[jnd]);
      let calcu_temp = chess_board_minimax_evaluate_alpha_beta(
        depth + 1,
        !ori,
        alpha,
        beta
      );
      if (calcu_temp >= mmValue) {
        mmValue = calcu_temp;
        mmindex = jnd;
      }
      game.undo();
      if (mmValue > beta) break;
      alpha = Math.max(alpha, mmValue);
    }
    if (depth === 0) {
      game.move(valid_move[mmindex]);
      board.position(game.fen());
      return;
    }
    return mmValue;
  } else {
    let mmValue = Infinity;
    for (let jnd = 0; jnd < valid_move.length; jnd++) {
      game.move(valid_move[jnd]);
      let calcu_temp = chess_board_minimax_evaluate_alpha_beta(
        depth + 1,
        !ori,
        alpha,
        beta
      );
      if (calcu_temp < mmValue) {
        mmValue = calcu_temp;
      }
      game.undo();

      if (alpha > mmValue) break;
      beta = Math.min(beta, mmValue);
    }
    return mmValue;
  }
}

chess_AI_move = function (version) {
  let valid_move = game.moves();
  if (game.game_over()) return;
  if (version === 0) {
    let rdm_index = new Date().getTime() % valid_move.length;
    game.move(valid_move[rdm_index]);
    board.position(game.fen());
  } else if (version === 1) {
    let mmValue = -Infinity;
    let mmindex = -1;
    for (let ind = 0; ind < valid_move.length; ind++) {
      game.move(valid_move[ind]);
      let curValue = chess_board_evaluate(ev_func_version, game.fen());
      if (game_imfo.AI_player === "black") curValue *= -1;
      if (curValue >= mmValue) {
        mmValue = curValue;
        mmindex = ind;
      }
      game.undo();
    }
    game.move(valid_move[mmindex]);
    board.position(game.fen());
    /* console.log(game.fen(),mmValue,mmindex) */
  } else if (version === 2) chess_board_minimax_evaluate(0, game_imfo.AI_player);
  else if (version === 3) {
    chess_board_minimax_evaluate_alpha_beta(0, true, -Infinity, Infinity);
  }
};
