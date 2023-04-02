// 兩函式庫互動 邏輯計算&盤面輸出
let board = null;

let game = new Chess();
var $status = $("#status");
let $fen = $("#fen");
let $pgn = $("#pgn");
let hhmove = false
let whendgame = false

function onDragStart(source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;

  // only pick up pieces for the side to move
  if (
    (game.turn() === "w" && (piece.search(/^b/) !== -1 || hhmove)) ||
    (game.turn() === "b" && (piece.search(/^w/) !== -1 || hhmove))
  ) {
    return false;
  }
}

function onDrop(source, target) {
  
  // see if the move is legal
  let move = game.move({
    from: source,
    to: target,
    promotion: 'q', // NOTE: always promote to a queen for example simplicity
  });
  // try: using click to move
  // illegal move
  if (move === null) return "snapback";
  updateStatus();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
  $("#select_list>#option_item").remove()
  if (game.in_checkmate()){
    $("#turn span").text("Checkmate! You win.");
    whendgame = true
  }else if (game.game_over()){
    $("#turn span").text("Tie")
    whendgame = true
  }else{
    hhmove = true
    $("#undo_btn span").css("color","rgb(241,28,29)")
      $("#undo_btn span").css("text-shadow","0px 0px 2rem rgba(241,28,29,0.8),0px 0px 2.2rem rgba(241,28,29,0.5)")
    $("#undo_btn span").text("Undo");
  }
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

let config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  orientation: "white",
};

let game_imfo = {
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
  board.position(game.fen())
  whendgame = false
  hhmove = false
  

  //需要換位子
  updateStatus();
}