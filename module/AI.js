let chess_AI_move = null;
let minimax_alg_searching_limit = 4;
let AI_chooser = 5;
let ev_func_version = 2;
let MCTS_select_num = 3000;


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
    [0, 0, 0, 2.3, 2.3, 0, 0, 0],
    [0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5],
    [0.5, 1, 1, -2, -2, 1, 1, 0.5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

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
    let node = Chess(board_situation)
    if (node.game_over()){
      if (node.in_checkmate()){
        if (node.turn() == 'b') return 99999
        return -99999
      }
      return 0
    }
    for (let i = 0; i < board_situation.length; i++) {
      if (board_situation[i] === " ") break;
      else if (board_situation[i] === "/") {
        cc_step++;
        cc_ind = 0;
      } else if (board_situation[i] === "P") {
        evnum += 10;
        evnum += piece_value_ev.pawn[cc_step][cc_ind];
        cc_ind++;
      } else if (board_situation[i] === "N") {
        evnum += 30;
        evnum += piece_value_ev.knight[cc_step][cc_ind];
        cc_ind++;
      } else if (board_situation[i] === "B") {
        evnum += 30;
        evnum += piece_value_ev.bishop[cc_step][cc_ind];
        cc_ind++;
      } else if (board_situation[i] === "R") {
        evnum += 50;
        evnum += piece_value_ev.rook[cc_step][cc_ind];
        cc_ind++;
      } else if (board_situation[i] === "Q") {
        evnum += 90;
        evnum += piece_value_ev.queen[cc_step][cc_ind];
        cc_ind++;
      } else if (board_situation[i] === "K") {
        evnum += 900;
        evnum += piece_value_ev.king[cc_step][cc_ind];
        cc_ind++;
      } else if (board_situation[i] === "p") {
        evnum -= 10;
        evnum -= piece_value_ev.pawn[7 - cc_step][7 - cc_ind];
        cc_ind++;
      } else if (board_situation[i] === "n") {
        evnum -= 30;
        evnum -= piece_value_ev.knight[7 - cc_step][7 - cc_ind];
        cc_ind++;
      } else if (board_situation[i] === "b") {
        evnum -= 30;
        evnum -= piece_value_ev.bishop[7 - cc_step][7 - cc_ind];
        cc_ind++;
      } else if (board_situation[i] === "r") {
        evnum -= 50;
        evnum -= piece_value_ev.rook[7 - cc_step][7 - cc_ind];
        cc_ind++;
      } else if (board_situation[i] === "q") {
        evnum -= 90;
        evnum -= piece_value_ev.queen[7 - cc_step][7 - cc_ind];
        cc_ind++;
      } else if (board_situation[i] === "k") {
        evnum -= 900;
        evnum -= piece_value_ev.king[7 - cc_step][7 - cc_ind];
        cc_ind++;
      } else if (
        board_situation[i].charCodeAt() >= 49 &&
        board_situation[i].charCodeAt() <= 57
      ) {
        cc_ind += parseInt(board_situation[i]);
      }
    }
    return evnum;
  }
}

// 最陽春的AI演算法 參數game傳入當下盤面的chess物件，depth傳入目前深度(預設為0)
// 回傳AI要走的棋
function chess_board_minimax_evaluate(game, depth = 0) {
  if (depth === minimax_alg_searching_limit) {
    if (game.turn() == "b")
      return -chess_board_evaluate(ev_func_version, game.fen());
    return chess_board_evaluate(ev_func_version, game.fen());
  }
  let valid_move = game.moves();
    let mmValue = -Infinity;
    let mmindex = -1;
    for (let jnd = 0; jnd < valid_move.length; jnd++) {
      game.move(valid_move[jnd]);
      let calcu_temp = -chess_board_minimax_evaluate(
        game,
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
      return valid_move[mmindex];
    }
    return mmValue;
}

// alpha beta 剪枝版本 與陽春版參數設定相同，加入alpha值與beta值
// 回傳AI要走的棋
function chess_board_minimax_evaluate_alpha_beta(
  game,
  depth = 0,
  orientation,
  alpha,
  beta
) {
  if (depth === minimax_alg_searching_limit) {
    if (game_imfo.AI_player === "black")
      return -chess_board_evaluate(ev_func_version, game.fen());
    else return chess_board_evaluate(ev_func_version, game.fen());
  }
  let valid_move = game.moves();
  //orientation means if the section is maximiser or not
  if (orientation) {
    let mmValue = -Infinity;
    let mmindex = -1;
    for (let jnd = 0; jnd < valid_move.length; jnd++) {
      game.move(valid_move[jnd]);
      let calcu_temp = chess_board_minimax_evaluate_alpha_beta(
        game,
        depth + 1,
        !orientation,
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
      return valid_move[mmindex];
    }
    return mmValue;
  } else {
    let mmValue = Infinity;
    for (let jnd = 0; jnd < valid_move.length; jnd++) {
      game.move(valid_move[jnd]);
      let calcu_temp = chess_board_minimax_evaluate_alpha_beta(
        depth + 1,
        !orientation,
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

// negascout 剪枝版本 與陽春版參數設定相同，加入alpha值與beta值
// 回傳計算數值(以run_negascout函式運算回傳AI要走的棋)
function chess_board_negascout(game, depth, alpha, beta) {
  if (depth === minimax_alg_searching_limit) {
    if (game.turn() == "b")
      return -chess_board_evaluate(ev_func_version, game.fen());
    return chess_board_evaluate(ev_func_version, game.fen());
  }
  let valid_move = game.moves();
  //ori means if the section is maximiser or not
  let mmValue = -Infinity;
  let mmn = beta;
  for (let jnd = 0; jnd < valid_move.length; jnd++) {
    game.move(valid_move[jnd]);
    let calcu_temp = -chess_board_negascout(game, depth + 1, -mmn, -alpha);

    if (calcu_temp > mmValue) {
      if (mmn === beta || depth <= 2) {
        mmValue = calcu_temp;
      } else {
        mmValue = -chess_board_negascout(game, depth + 1, -beta, -calcu_temp);
      }
    }
    if (mmValue > alpha) alpha = mmValue;
    game.undo();
    if (alpha >= beta) return alpha;
    mmn = alpha + 1;
  }
  return mmValue;
}

function run_negascout(game) {
  let mmValue = -Infinity;
  let mmindex = -1;
  let valid_move = game.moves()
  for (let ind = 0; ind < valid_move.length; ind++) {
    game.move(valid_move[ind]);
    let curValue = -chess_board_negascout(game, 1, -Infinity, Infinity);
    if (curValue >= mmValue) {
      mmValue = curValue;
      mmindex = ind;
    }
    game.undo();
  }
  return valid_move[mmindex];
}

// MCTS樹的節點
class MCTS_node {
  constructor(bd_fen) {
    this.state = new Chess(bd_fen);
    this.children = [];
    this.parent = null;
    this.nn = 0;
    this.n = 0;
    this.w = 0;
  }
}

// ucb1公式 計算該走哪點的依據
function ucb1(node) {
  return (
    node.w / (node.n + Math.pow(10, -10)) +
    Math.sqrt(2) *
      Math.sqrt(
        Math.log(node.nn + Math.exp(1) + Math.pow(10, -6)) /
          (node.n + Math.pow(10, -10))
      )
  );
}

// MCTS expand 函式
function MCTS_expand(node, gonnawin) {
  if (!node.children.length) return node;
  if (gonnawin) {
    let max_ucb = -Infinity;
    let max_ucb_child = null;
    for (let i = 0; i < node.children.length; i++) {
      let curr_ucb = ucb1(node.children[i]);
      if (curr_ucb > max_ucb) {
        max_ucb = curr_ucb;
        max_ucb_child = node.children[i];
      }
    }
    return MCTS_expand(max_ucb_child, !gonnawin);
  } else {
    let min_ucb = Infinity;
    let min_ucb_child = null;
    for (let i = 0; i < node.children.length; i++) {
      let curr_ucb = ucb1(node.children[i]);
      if (curr_ucb < min_ucb) {
        min_ucb = curr_ucb;
        min_ucb_child = node.children[i];
      }
    }
    return MCTS_expand(min_ucb_child, !gonnawin);
  }
}

//MCTS rollout結果函式
function MCTS_rollout(initnode ,node, step) {
  if (node.state.game_over()) {
    if (node.state.in_checkmate()) {
      if (node.state.turn() == game_imfo.player[0]) {
        return [1, node];
      }
      return [-1, node];
    }
    return [0, node];
  } else if (step === minimax_alg_searching_limit) {
    let ev_esta = chess_board_evaluate(ev_func_version, node.state.fen());
    let ev_cur = chess_board_evaluate(ev_func_version, initnode.state.fen());
    if (game_imfo.AI_player === "black") {
      ev_cur *= -1;
      ev_esta *= -1;
    }
    if (ev_esta >= ev_cur) return [0.6, node];
    else return [-0.6, node];
  }
  let valid_move = node.state.moves();
  for (let i = 0; i < valid_move.length; i++) {
    node.state.move(valid_move[i]);
    let cdstate = new MCTS_node(node.state.fen());
    cdstate.parent = node;
    node.children.push(cdstate);
    node.state.undo();
  }
  let random_child =
    node.children[Math.floor(Math.random() * node.children.length)];
  return MCTS_rollout(initnode,random_child, step + 1);
}

//MCTS 更新節點值函式
function MCTS_rollup(node, rwd) {
  while (node.parent != null) {
    node.nn++;
    node.n++;
    node.w += rwd;
    node = node.parent;
  }
  node.nn++;
  node.n++;
  node.w += rwd;
}

//蒙地卡羅樹搜尋，傳入參數node為當前盤面的MCTS node物件，iterations為需要測試的次數
//回傳AI要走的棋
function chess_board_monte_carol(node, iterations=MCTS_select_num) {
  let valid_move = node.state.moves();
  for (let i = 0; i < valid_move.length; i++) {
    node.state.move(valid_move[i]);
    let child = new MCTS_node(node.state.fen());
    node.state.undo();
    node.children.push(child);
    child.parent = node;
  }
  while (iterations > 0) {
    let max_ucb = -Infinity;
    let max_ucb_child = null;
    for (let i = 0; i < node.children.length; i++) {
      let calcu_temp = ucb1(node.children[i]);
      if (calcu_temp >= max_ucb) {
        max_ucb = calcu_temp;
        max_ucb_child = node.children[i];
      }
    }
    let expand_child = MCTS_expand(max_ucb_child, false);
    let rollout_outcome = MCTS_rollout(node,expand_child, 0);
    MCTS_rollup(rollout_outcome[1], rollout_outcome[0]);
    iterations--;
  }
  max_ucb = -Infinity;
  let max_index = -1;
  for (let i = 0; i < node.children.length; i++) {
    let curr_ucb = ucb1(node.children[i]);
    if (curr_ucb >= max_ucb) {
      max_ucb = curr_ucb;
      max_index = i;
    }
  }
  return valid_move[max_index];
}


//實際執行移動的函式 gamep傳入當前盤面的fen，AIchooserp傳入選擇的AI演算法，minimax_alg_searching_limitp傳入計算的深度，ev_func_versionp傳入使用的評估函式版本，MCTS_select_nump傳入MCTS的次數
//回傳AI要走的棋
chess_AI_move = function (
  gamep,
  AI_chooserp=5,
  minimax_alg_searching_limitp=4,
  ev_func_versionp=2,
  MCTS_select_nump=500
) {
  ev_func_version = ev_func_versionp;
  minimax_alg_searching_limit = minimax_alg_searching_limitp;
  AI_chooser = AI_chooserp;
  MCTS_select_num = MCTS_select_nump;
  
  let game = new Chess(gamep);
  if (game.turn() === 'w'){
    game_imfo.AI_player = 'white'
    game_imfo.player = 'black'
  }
  let valid_move = game.moves();
  if (game.game_over()) return false;
  if (AI_chooser === 0) {
    let rdm_index = new Date().getTime() % valid_move.length;
    return valid_move[rdm_index];
  } else if (AI_chooser === 1) {
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
    return valid_move[mmindex];
  } else if (AI_chooser === 2)
    return chess_board_minimax_evaluate(game,0);
  else if (AI_chooser === 3) {
    return chess_board_minimax_evaluate_alpha_beta(
      game,
      0,
      true,
      -Infinity,
      Infinity
    );
  } else if (AI_chooser === 4) {
    let root = new MCTS_node(game.fen());
    return chess_board_monte_carol(root, MCTS_select_num);
  } else if (AI_chooser === 5) {
    return run_negascout(game);
  }
};
