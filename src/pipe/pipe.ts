import Vector from "../common/interfaces/vector";
import GameContext from "../gameContext";
import Size from "../common/interfaces/size";
import Bird from "../bird/bird";
import Rect from "../common/interfaces/rect";
import {
    PIPE_COLLISION_THRESHOLD,
    PIPE_SCALE,
    VIRTUAL_HEIGHT,
    VIRTUAL_WIDTH,
} from "../common/constants";
import { isColliding } from "../common/utils";

class Pipe {
    private position: Vector;

    private size: Size;

    private speed: number;
    private gapSize: number;

    private isCleared: boolean;

    private readonly gameCtx: GameContext;
    private canvas: HTMLCanvasElement;

    public onClearPipe: () => void;

    private pipeNorthImage: HTMLImageElement;
    private pipeSouthImage: HTMLImageElement;

    constructor(
        position: Vector,
        speed: number,
        gapSize: number,
        gameCtx: GameContext
    ) {
        this.position = { ...position };
        this.speed = speed;
        this.gapSize = gapSize;
        this.gameCtx = gameCtx;

        this.canvas = this.gameCtx.getCanvas();

        this.isCleared = false;

        this.load();

        this.size = {
            width: PIPE_SCALE,
            height:
                PIPE_SCALE *
                (this.pipeNorthImage.height / this.pipeNorthImage.width),
        };
    }

    private load(): void {
        const resourceManager = this.gameCtx.getResourceManager();
        this.pipeNorthImage = resourceManager.getResource("pipe-north_img");
        this.pipeSouthImage = resourceManager.getResource("pipe-south_img");
    }

    public updateLogic(deltaTime: number, resetGame: () => void, bird: Bird) {
        this.position.x -= this.speed * deltaTime;

        if (
            !this.isCleared &&
            this.position.x < this.canvas.width / 2 - this.size.width / 2
        ) {
            this.isCleared = true;
            this.onClearPipe();
        }

        if (
            isColliding(bird.getRect(), this.getNorthRect()) ||
            isColliding(bird.getRect(), this.getSouthRect())
        ) {
            resetGame();
        }
    }

    public getNorthRect(): Rect {
        return {
            x: this.position.x,
            y: this.position.y - this.size.height - this.gapSize,
            width: this.size.width,
            height: this.size.height - PIPE_COLLISION_THRESHOLD,
        };
    }

    public getSouthRect(): Rect {
        return {
            x: this.position.x,
            y: this.position.y + this.gapSize + PIPE_COLLISION_THRESHOLD,
            width: this.size.width,
            height: this.size.height,
        };
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(
            this.pipeNorthImage,
            this.position.x,
            this.position.y - this.size.height - this.gapSize,
            this.size.width,
            this.size.height
        );
        ctx.drawImage(
            this.pipeSouthImage,
            this.position.x,
            this.position.y + this.gapSize,
            this.size.width,
            this.size.height
        );
    }
}

export default Pipe;
