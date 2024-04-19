import Game from "./game";

const game = new Game();

function startGame(timestamp: DOMHighResTimeStamp) {
    game.mainLoop(timestamp);

    window.requestAnimationFrame(startGame);
}

addEventListener("load", () => {
    game.setup();

    window.requestAnimationFrame(startGame);
});
