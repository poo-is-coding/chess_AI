let cc = 0;
let roundcc = 0;
let AI_calcu_time = 0;

const turnInnerHTML = `Player's turn<br/><span>click me</span>`


function init() {
  initboard(cc);
  $("#turn").on("click", () => {
    if (game.turn() == game_imfo.AI_player[0] && !whendgame) {
      $("#turn span").text("AI's turn");
      $("#undo_btn span").text("thinking...")
      document.getElementById("myBoard")
      window.setTimeout(() => {
        let time1 = new Date().getTime()
        let tempmove = chess_AI_move(game.fen());
        let time2 = new Date().getTime()
        AI_calcu_time = time2 - time1
        AI_calcu_time = Math.round(AI_calcu_time/10)/100
        game.move(tempmove);
        board.position(game.fen());
        if (game.in_checkmate()){
          $("#turn span").text("Checkmate! AI win.");
          whendgame = true
        }else if (game.game_over()){
          $("#turn span").text("Tie")
          whendgame = true
        }else{
          $("#turn span").html(turnInnerHTML);
        }
        
        $("#undo_btn span").text("Use "+AI_calcu_time+"s to move")
        hhmove = false
      }, 20);
    }
  });
  $("#undo_btn").on("click",()=>{
    if (hhmove){
      game.undo()
      board.position(game.fen())
      hhmove = false
      if (game.fen().slice(0,43) === "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR" ){
        $("#undo_btn span").text("Game Start")
      }else if (game.fen().slice(0,43) !== "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"){
        $("#undo_btn span").text("Use "+AI_calcu_time+"s to move")
      }
    }
  })
  return 0;
}
