import ScoreManager from "./scoreManager/scoreManager";
import Bird from "./bird/bird";
import {
    BUTTON_TEXT_LOADING,
    BUTTON_TEXT_START,
    PIPE_POOL_SIZE,
    PIPE_STARTING_GAP_SIZE,
    PIPE_STARTING_SPEED,
    SCOREBOARD_CLOSE_BUTTON_CLICK_PROTECTION_TIMEOUT,
    VIRTUAL_HEIGHT,
    VIRTUAL_WIDTH,
} from "./common/constants";
import PipePool from "./pipe/pipePool";
import GameContext from "./gameContext";
import Foreground from "./foreground/foreground";
import Background from "./background/background";

class Game {
    private deathAudio: HTMLAudioElement;
    private scoreAudio: HTMLAudioElement;
    private countAudio: HTMLAudioElement;
    private goAudio: HTMLAudioElement;

    private body: HTMLBodyElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private menu: HTMLDialogElement;
    private startButton: HTMLButtonElement;
    private scoreboard: HTMLDialogElement;
    private scoreboardScoreNew: HTMLParagraphElement;
    private scoreboardScoreBest: HTMLParagraphElement;
    private scoreboardCloseButton: HTMLButtonElement;
    private scoreboardMedalImage: HTMLDivElement;

    private previousTimestamp: DOMHighResTimeStamp;

    private isPaused: boolean = true;

    private gameCtx: GameContext;

    private bird: Bird;
    private canJump: boolean = true;

    private score: ScoreManager;
    private pipePool: PipePool;

    private countdown: number = -1;
    private countdownMap: Map<number, string> = new Map([
        [3, "3"],
        [2, "2.."],
        [1, "1..."],
        [0, "Go!"],
        [-1, ""],
    ]);
    private countdownBackdrop = 0;

    private background: Background;
    private foreground: Foreground;

    public setup(): void {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.menu = document.getElementById("menu") as HTMLDialogElement;
        this.startButton = document.querySelector(
            "#menu>.menu-container>button"
        );
        this.startButton.disabled = true;
        this.startButton.innerText = BUTTON_TEXT_LOADING;
        this.body = document.querySelector("body");
        this.scoreboard = document.getElementById(
            "scoreboard"
        ) as HTMLDialogElement;
        this.scoreboardScoreNew = document.getElementById(
            "scoreboard-score-new"
        ) as HTMLParagraphElement;
        this.scoreboardScoreBest = document.getElementById(
            "scoreboard-score-best"
        ) as HTMLParagraphElement;
        this.scoreboardCloseButton = document.querySelector(
            "#scoreboard>.menu-container>button"
        );
        this.scoreboardCloseButton.disabled = true;
        this.scoreboardMedalImage = document.querySelector(
            "#scoreboard-medal-image"
        );

        this.menu.close();
        this.scoreboard.close();

        this.canvas.height = VIRTUAL_HEIGHT;
        this.canvas.width = VIRTUAL_WIDTH;

        this.gameCtx = new GameContext();
        this.gameCtx.onReady = this.contextReady.bind(this);
        this.gameCtx.setCanvas(this.canvas);
        this.gameCtx.config();

        this.background = new Background(this.gameCtx);
        this.foreground = new Foreground(this.gameCtx);

        this.bird = new Bird(this.gameCtx);
        this.gameCtx.setBird(this.bird);

        this.score = new ScoreManager(0, this.gameCtx);

        this.pipePool = new PipePool(
            PIPE_POOL_SIZE,
            PIPE_STARTING_SPEED,
            PIPE_STARTING_GAP_SIZE,
            this.gameCtx
        );
        this.pipePool.onCollisionWithPipe = this.resetGame.bind(this);
        this.pipePool.onClearPipe = this.onClearPipe.bind(this);

        this.bindEvents();
        this.openMenu();
    }

    private contextReady(): void {
        const resourceManager = this.gameCtx.getResourceManager();
        this.deathAudio = resourceManager.getResource("death_sfx");
        this.scoreAudio = resourceManager.getResource("score_sfx");
        this.countAudio = resourceManager.getResource("count_sfx");
        this.goAudio = resourceManager.getResource("go_sfx");

        this.background.setup();
        this.foreground.setup();

        this.bird.setup();
        this.bird.onBirdOutOfBounds = this.resetGame.bind(this);

        this.pipePool.setup();

        this.startButton.disabled = false;
        this.startButton.innerText = BUTTON_TEXT_START;
        this.startButton.focus();
    }

    private centerDialog(dialog: HTMLDialogElement): void {
        const canvasRect = this.canvas.getBoundingClientRect();
        const dialogRect = dialog.getBoundingClientRect();
        const top =
            canvasRect.top + (canvasRect.height - dialogRect.height) / 2 + "px";
        const left =
            canvasRect.left + (canvasRect.width - dialogRect.width) / 2 + "px";
        dialog.style.top = top;
        dialog.style.left = left;
        dialog.style.margin = "0px";
    }

    private bindEvents(): void {
        this.startButton.addEventListener(
            "pointerup",
            this.onPressStartButton.bind(this)
        );

        this.canvas.addEventListener(
            "pointerdown",
            () => !this.isPaused && this.bird.jump()
        );

        this.body.addEventListener("keydown", (e) => {
            if (!this.isPaused && this.canJump && e.key === " ") {
                this.bird.jump();

                this.canJump = false;
            }
        });
        this.body.addEventListener("keyup", (e) => {
            if (e.key === " ") {
                this.canJump = true;
            }
        });

        this.scoreboardCloseButton.addEventListener(
            "pointerup",
            this.onPressScoreboardCloseButton.bind(this)
        );
    }

    private onPressStartButton(): void {
        this.openMenu(false);
    }

    private onPressScoreboardCloseButton(): void {
        this.openScoreboard(false);
        this.openMenu(true);
    }

    private openMenu(open: boolean = true): void {
        if (open) {
            this.menu.showModal();
            this.centerDialog(this.menu);
            this.isPaused = true;
            this.gameCtx.setIsPaused(true);
        } else {
            this.menu.close();

            this.playCountdown();
        }
    }

    private async playCountdown(): Promise<void> {
        this.countdown = 3;
        this.countAudio.play();
        this.countdownBackdrop = 1;

        let countdownInterval: NodeJS.Timeout;
        countdownInterval = setInterval(() => {
            this.countdown = Math.max(-1, this.countdown - 1);
            if (this.countdown === -1) {
                this.isPaused = false;
                this.gameCtx.setIsPaused(false);
                clearInterval(countdownInterval);
            } else {
                this.countdown === 0
                    ? this.goAudio.play()
                    : this.countAudio.play();
            }

            this.countdownBackdrop = 1;
        }, 700);
    }

    public mainLoop(timestamp: DOMHighResTimeStamp): void {
        if (!this.gameCtx.getIsReady()) {
            return;
        }

        if (!this.previousTimestamp) {
            this.previousTimestamp = timestamp;
        }

        const deltaTime = (timestamp - this.previousTimestamp) / 100;

        this.updateGame(deltaTime);

        this.draw(this.ctx);

        this.previousTimestamp = timestamp;
    }

    private updateGame(deltaTime: number): void {
        if (this.countdownBackdrop > 0) {
            this.countdownBackdrop = Math.max(
                this.countdownBackdrop - 0.1 * deltaTime,
                0
            );
        }

        if (this.isPaused) {
            return;
        }

        this.background.updateLogic(deltaTime);
        this.foreground.updateLogic(deltaTime);
        this.bird.updateLogic(deltaTime);
        this.pipePool.updateLogic(deltaTime);
    }

    private draw(ctx: CanvasRenderingContext2D): void {
        ctx.imageSmoothingEnabled = false;
        this.clearCanvas(ctx);

        this.background.draw(ctx);
        this.pipePool.draw(ctx);
        this.bird.draw(ctx);
        this.foreground.draw(ctx);
        this.score.draw(ctx);

        if (this.countdownMap.get(this.countdown) !== "") {
            ctx.fillStyle =
                this.countdownBackdrop > 0.8
                    ? "rgba(250, 235, 215, 0.4)"
                    : "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        ctx.fillStyle = this.countdownBackdrop > 0.8 ? "#000f" : "#fff";
        ctx.font = "24pt monospace";

        const textSize = ctx.measureText(this.countdownMap.get(this.countdown));
        ctx.fillText(
            this.countdownMap.get(this.countdown),
            this.canvas.width / 2 - textSize.width / 2,
            this.canvas.height / 2
        );
    }

    private clearCanvas(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#afafff";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public resetGame(): void {
        this.isPaused = true;
        this.gameCtx.setIsPaused(true);

        this.deathAudio.currentTime = 0;
        this.deathAudio.play();

        this.bird.reset();
        this.pipePool.clearPool();

        const scorePoints: number = this.score.getScore();
        this.score.reset();
        this.openScoreboard(true, scorePoints);
    }

    private openScoreboard(open: boolean = true, score: number = 0): void {
        if (open) {
            this.scoreboardScoreNew.innerText = score.toString();

            const bestScore = this.score.retrieveBestScore();
            this.scoreboardScoreBest.innerText = bestScore.score.toString();

            const resourceManager = this.gameCtx.getResourceManager();
            if (score >= 50) {
                this.scoreboardMedalImage.replaceChildren(
                    resourceManager.getResource("coin-platinum_img")
                );
            } else if (score >= 25) {
                this.scoreboardMedalImage.replaceChildren(
                    resourceManager.getResource("coin-gold_img")
                );
            } else if (score >= 5) {
                this.scoreboardMedalImage.replaceChildren(
                    resourceManager.getResource("coin-silver_img")
                );
            } else {
                this.scoreboardMedalImage.replaceChildren(
                    resourceManager.getResource("coin-bronze_img")
                );
            }

            this.scoreboard.showModal();

            this.centerDialog(this.scoreboard);

            setTimeout(() => {
                this.scoreboardCloseButton.disabled = false;
                this.scoreboardCloseButton.focus();
            }, SCOREBOARD_CLOSE_BUTTON_CLICK_PROTECTION_TIMEOUT);
        } else {
            this.scoreboard.close();
            this.scoreboardCloseButton.disabled = true;
        }
    }

    public onClearPipe(): void {
        this.scoreAudio.currentTime = 0;
        this.scoreAudio.playbackRate = 1 - Math.random() * 0.2;
        this.scoreAudio.play();
        this.score.increment();
    }
}

export default Game;
