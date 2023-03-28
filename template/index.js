let cc = 0;
let roundcc = 0;
let AI_calcu_time = 0;

const turnInnerHTML = `Player's turn<br/><span>click me</span>`;
const add_option_to_select = (bd_fen) => {
  let state = new Chess(bd_fen);
  let valid_moves = state.moves();
  for (let i = 0; i < valid_moves.length; i++) {
    let item = document.createElement("option");
    item.id = "option_item";
    item.value = valid_moves[i];
    item.innerText = valid_moves[i];
    document.getElementById("select_list").appendChild(item);
  }
};
const init_AI_selector = () => {
  $("#ck_box_sel input:radio").prop("checked", false);
  $("#ck_box_sel #default_opt").prop("checked", true);
};

function init() {
  initboard(cc);
  init_AI_selector();
  add_option_to_select(game.fen());
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
      let AI_choose = document.getElementsByName("sel");
      if (AI_choose[1].checked) {
        AI_choose = [4, 4];
      } else {
        AI_choose = [5, 4];
      }
      window.setTimeout(() => {
        // AI 運算耗時
        let time1 = new Date().getTime();
        let tempmove = chess_AI_move(
          game.fen(),
          (AI_chooserp = AI_choose[0]),
          (minimax_alg_searching_limitp = AI_choose[1])
        ); //AI運算函式，回傳AI要移動的步
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
        add_option_to_select(game.fen());
        hhmove = false;
        init_AI_selector();
      }, 20);
    }
  });
  // 第二個按鈕(悔棋按鈕)
  $("#undo_btn").on("click", () => {
    if (hhmove) {
      game.undo();
      board.position(game.fen());
      add_option_to_select(game.fen());
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
    init_AI_selector();
    $("#select_list>#option_item").remove();
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
      let AI_choose = document.getElementsByName("sel");
      if (AI_choose[1].checked) {
        AI_choose = [4, 6];
      } else {
        AI_choose = [5, 4];
      }
      window.setTimeout(() => {
        // AI 運算耗時
        let time1 = new Date().getTime();
        let tempmove = chess_AI_move(
          game.fen(),
          (AI_chooserp = AI_choose[0]),
          (minimax_alg_searching_limitp = AI_choose[1])
        ); //AI運算函式，回傳AI要移動的步
        let time2 = new Date().getTime();
        AI_calcu_time = time2 - time1;
        AI_calcu_time = Math.round(AI_calcu_time / 10) / 100;
        //移動
        game.move(tempmove);
        board.position(game.fen());
        add_option_to_select(game.fen()); //渲染盤面
        $("#turn span").html(turnInnerHTML);
        $("#btn_nav div").removeClass("btn_ck_thinking");
        $("#btn_nav div").addClass("btn_ck");
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
      add_option_to_select(game.fen());
    }
  });
  //選單
  $("#select_list").on("change", () => {
    let sel_move = $("#select_list option:selected").val();
    if (sel_move.length === 0) return;
    game.move(sel_move);
    board.position(game.fen());
    $("#select_list>#option_item").remove();
    if (game.in_checkmate()) {
      $("#turn span").text("Checkmate! You win.");
      whendgame = true;
    } else if (game.game_over()) {
      $("#turn span").text("Tie");
      whendgame = true;
    } else {
      hhmove = true;
      $("#undo_btn span").css("color", "rgb(241,28,29)");
      $("#undo_btn span").css(
        "text-shadow",
        "0px 0px 2rem rgba(241,28,29,0.8),0px 0px 2.2rem rgba(241,28,29,0.5)"
      );
      $("#undo_btn span").text("Undo");
    }
  });
  return 0;
}
