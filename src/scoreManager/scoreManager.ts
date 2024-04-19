import { SCORE_LOCAL_STORAGE_KEY } from "../common/constants";
import GameContext from "../gameContext";
import Score from "./interfaces/score";

const LEFT_PADDING: number = 12;
const TOP_PADDING: number = 34;
const FONT: string = "22pt monospace";
const FONT_COLOR: string = "#000000";

class ScoreManager {
    private readonly initialScore: number;
    private score: number;

    private gameCtx: GameContext;

    public constructor(initialScore: number, gameCtx: GameContext) {
        this.initialScore = initialScore;
        this.score = initialScore;
        this.gameCtx = gameCtx;
    }

    public increment() {
        this.score++;
    }

    public reset() {
        const bestScore = this.retrieveBestScore();
        if (this.score > bestScore.score) {
            const playerScore: Score = {
                timestamp: new Date(),
                score: this.score,
            };

            this.storeScore(playerScore);
        }

        this.score = this.initialScore;
    }

    private storeScore(score: Score): void {
        window.localStorage.setItem(
            SCORE_LOCAL_STORAGE_KEY,
            JSON.stringify(score)
        );
    }

    public retrieveBestScore(): Score {
        const initialScore: Score = {
            timestamp: new Date(),
            score: 0,
        };

        return (
            JSON.parse(window.localStorage.getItem(SCORE_LOCAL_STORAGE_KEY)) ??
            initialScore
        );
    }

    public draw(ctx: CanvasRenderingContext2D) {
        const canvas = this.gameCtx.getCanvas();

        const scoreText = !this.gameCtx.getIsPaused()
            ? this.score.toString()
            : "";
        const x = canvas.width / 2 - ctx.measureText(scoreText).width / 2;

        ctx.fillStyle = FONT_COLOR;
        ctx.font = FONT;
        ctx.fillText(scoreText, x, TOP_PADDING);
    }

    public getScore(): number {
        return this.score;
    }
}

export default ScoreManager;
