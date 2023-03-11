let cc = 0;
let roundcc = 0;
let AI_calcu_time = 0;

const turnInnerHTML = `Player's turn<br/><span>click me</span>`;

function init() {
  initboard(cc);
  // 第三個按鈕(送出目前盤面 交由AI運算)
  $("#turn").on("click", () => {
    if (game.turn() == game_imfo.AI_player[0] && !whendgame) {
      $("#turn span").text("AI's turn");
      $("#undo_btn span").css("color", "rgb(208,223,230)");
      $("#undo_btn span").css(
        "text-shadow",
        "0px 0px 2rem rgba(208,223,230,0.8),0px 0px 2.2rem rgba(208,223,230,0.5)"
      );
      $("#undo_btn span").text("Thinking...");
      $(".btn_nav div").removeClass("btn_ck");
      $(".btn_nav div").addClass("btn_ck_thinking");
      window.setTimeout(() => {
        // AI 運算耗時
        let time1 = new Date().getTime();
        let tempmove = chess_AI_move(game.fen()); //AI運算函式，回傳AI要移動的步
        let time2 = new Date().getTime();
        AI_calcu_time = time2 - time1;
        AI_calcu_time = Math.round(AI_calcu_time / 10) / 100;
        //移動
        game.move(tempmove);
        board.position(game.fen()); //渲染盤面

        if (game.in_checkmate()) {
          $("#turn span").text("Checkmate! AI win.");
          whendgame = true;
        } else if (game.game_over()) {
          $("#turn span").text("Tie");
          whendgame = true;
        } else {
          $("#turn span").html(turnInnerHTML);
        }
        $(".btn_nav div").removeClass("btn_ck_thinking");
        $(".btn_nav div").addClass("btn_ck");
        $("#undo_btn span").html("Use " + AI_calcu_time + "s<br/>to move");
        hhmove = false;
      }, 20);
    }
  });
  // 第二個按鈕(悔棋按鈕)
  $("#undo_btn").on("click", () => {
    if (hhmove) {
      game.undo();
      board.position(game.fen());
      hhmove = false;
      if (
        game.fen().slice(0, 43) ===
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
      ) {
        $("#undo_btn span").css("color", "rgb(208,223,230)");
        $("#undo_btn span").css(
          "text-shadow",
          "0px 0px 2rem rgba(208,223,230,0.8),0px 0px 2.2rem rgba(208,223,230,0.5)"
        );
        $("#undo_btn span").text("Game Start");
      } else if (
        game.fen().slice(0, 43) !==
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
      ) {
        $("#undo_btn span").css("color", "rgb(208,223,230)");
        $("#undo_btn span").css(
          "text-shadow",
          "0px 0px 2rem rgba(208,223,230,0.8),0px 0px 2.2rem rgba(208,223,230,0.5)"
        );
        $("#undo_btn span").html("Use " + AI_calcu_time + "s<br/>to move");
      }
    }
  });
  // 第一個按鈕(重設按鈕)
  $("#reset_btn").on("click", () => {
    cc++;
    initboard(cc);
    if (game_imfo.AI_player === "white") {
      hhmove = true;
      $("#turn span").text("AI's turn");
      $("#undo_btn span").css("color", "rgb(208,223,230)");
      $("#undo_btn span").css(
        "text-shadow",
        "0px 0px 2rem rgba(208,223,230,0.8),0px 0px 2.2rem rgba(208,223,230,0.5)"
      );
      $("#undo_btn span").text("Thinking...");
      $(".btn_nav div").removeClass("btn_ck");
      $(".btn_nav div").addClass("btn_ck_thinking");
      window.setTimeout(() => {
        // AI 運算耗時
        let time1 = new Date().getTime();
        let tempmove = chess_AI_move(game.fen()); //AI運算函式，回傳AI要移動的步
        let time2 = new Date().getTime();
        AI_calcu_time = time2 - time1;
        AI_calcu_time = Math.round(AI_calcu_time / 10) / 100;
        //移動
        game.move(tempmove);
        board.position(game.fen()); //渲染盤面
        $("#turn span").html(turnInnerHTML);
        $(".btn_nav div").removeClass("btn_ck_thinking");
        $(".btn_nav div").addClass("btn_ck");
        $("#undo_btn span").html("Use " + AI_calcu_time + "s<br/>to move");
        hhmove = false;
      }, 20);
    } else {
      $("#undo_btn span").css("color", "rgb(208,223,230)");
      $("#undo_btn span").css(
        "text-shadow",
        "0px 0px 2rem rgba(208,223,230,0.8),0px 0px 2.2rem rgba(208,223,230,0.5)"
      );
      $("#undo_btn span").text("Game Start");
    }
  });
  return 0;
}
