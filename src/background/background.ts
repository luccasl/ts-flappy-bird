import {
    BACKGROUND_SCROLLING_SPEED,
    BACKGROUND_TILE_HEIGHT,
    BACKGROUND_TILE_WIDTH,
    FOREGROUND_TILE_SIZE,
} from "../common/constants";
import GameContext from "../gameContext";

class Background {
    private tileImage: HTMLImageElement;

    private gameCtx: GameContext;
    private canvas: HTMLCanvasElement;

    private scrollOffset = 0;

    constructor(gameCtx: GameContext) {
        this.gameCtx = gameCtx;
    }

    public setup(): void {
        this.canvas = this.gameCtx.getCanvas();

        const resourceManager = this.gameCtx.getResourceManager();
        this.tileImage = resourceManager.getResource("background-tile_img");
    }

    public updateLogic(deltaTime: number) {
        this.scrollOffset -= deltaTime * BACKGROUND_SCROLLING_SPEED;

        const minimum = -BACKGROUND_TILE_WIDTH;
        const difference = this.scrollOffset - minimum;
        if (difference < 0) {
            this.scrollOffset = difference;
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for (
            let x = 0;
            x < this.canvas.width + BACKGROUND_TILE_WIDTH;
            x += BACKGROUND_TILE_WIDTH
        ) {
            ctx.drawImage(
                this.tileImage,
                x + this.scrollOffset,
                this.canvas.height - BACKGROUND_TILE_HEIGHT,
                BACKGROUND_TILE_WIDTH,
                BACKGROUND_TILE_HEIGHT
            );
        }
    }
}

export default Background;
