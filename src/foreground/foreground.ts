import {
    FOREGROUND_SCROLLING_SPEED,
    FOREGROUND_TILE_SIZE,
} from "../common/constants";
import GameContext from "../gameContext";

class Foreground {
    private tileImage: HTMLImageElement;

    private readonly gameCtx: GameContext;
    private canvas: HTMLCanvasElement;

    private scrollOffset = 0;

    constructor(gameCtx: GameContext) {
        this.gameCtx = gameCtx;
    }

    public setup(): void {
        this.canvas = this.gameCtx.getCanvas();

        const resourceManager = this.gameCtx.getResourceManager();
        this.tileImage = resourceManager.getResource("foreground-tile_img");
    }

    public updateLogic(deltaTime: number) {
        this.scrollOffset -= deltaTime * FOREGROUND_SCROLLING_SPEED;

        const minimum = -FOREGROUND_TILE_SIZE;
        const difference = this.scrollOffset - minimum;
        if (difference < 0) {
            this.scrollOffset = difference;
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for (
            let x = 0;
            x < this.canvas.width + FOREGROUND_TILE_SIZE;
            x += FOREGROUND_TILE_SIZE
        ) {
            ctx.drawImage(
                this.tileImage,
                x + this.scrollOffset,
                this.canvas.height - FOREGROUND_TILE_SIZE,
                FOREGROUND_TILE_SIZE,
                FOREGROUND_TILE_SIZE
            );
        }
    }
}

export default Foreground;
