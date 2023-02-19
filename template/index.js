/* const {bd} = require('./board.js') */
/* const initb = bd.initb */
let cc = 0;
function init() {
    initboard(cc);
    document.getElementById("clear").addEventListener("click", () => {
        cc++;
        initboard(cc);
    });
    return 0;
}
