let cc = 0;
let roundcc = 0;
const turnInnerHTML = `Player's turn<br/><span>click me</span>`


function init() {
  initboard(cc);
  $("#turn").on("click", () => {
    if (game.turn() == game_imfo.AI_player[0]) {
      $("#turn span").text("AI's turn");
      window.setTimeout(() => {
        let tempmove = chess_AI_move(game.fen());
        game.move(tempmove);
        board.position(game.fen());
        $("#turn span").html(turnInnerHTML);
      }, 20);
    }
  });
  return 0;
}
