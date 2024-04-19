import Bird from "../bird/bird";
import Vector from "../common/interfaces/vector";
import {
    MAX_PIPE_X_OFFSET,
    MAX_PIPE_Y_OFFSET,
    PIPE_SPAWN_TIMEOUT_MILLISECONDS,
    PIPE_STARTING_X_OFFSET,
    PIPE_STARTING_Y_POSITION,
} from "../common/constants";
import GameContext from "../gameContext";
import Pipe from "./pipe";

class PipePool {
    private poolSize: number;
    private startingSpeed: number;
    private startingGap: number;

    private pipeStartingPosition: Vector;

    private pipes: Pipe[] = [];

    public onCollisionWithPipe: () => void = function () {};
    public onClearPipe: () => void = function () {};

    private readonly gameCtx: GameContext;
    private bird: Bird;
    private canvas: HTMLCanvasElement;

    constructor(
        poolSize: number,
        startingSpeed: number,
        startingGap: number,
        gameCtx: GameContext
    ) {
        this.poolSize = poolSize;
        this.startingSpeed = startingSpeed;
        this.startingGap = startingGap;
        this.gameCtx = gameCtx;

        this.bird = this.gameCtx.getBird();
        this.canvas = this.gameCtx.getCanvas();

        this.pipeStartingPosition = {
            x: this.canvas.width + PIPE_STARTING_X_OFFSET,
            y: PIPE_STARTING_Y_POSITION,
        };
    }

    public setup(): void {
        this.spawnTimeout();
    }

    private async spawnTimeout(): Promise<void> {
        if (!this.gameCtx.getIsPaused()) {
            console.log("Spawn pipe");
            this.spawnPipe();
        }

        setTimeout(
            this.spawnTimeout.bind(this),
            PIPE_SPAWN_TIMEOUT_MILLISECONDS
        );
    }

    public updateLogic(deltaTime: number): void {
        while (this.pipes.length > this.poolSize) {
            this.pipes.shift();
        }

        for (const pipe of this.pipes) {
            pipe.updateLogic(deltaTime, this.onCollisionWithPipe, this.bird);
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for (const pipe of this.pipes) {
            pipe.draw(ctx);
        }
    }

    private spawnPipe(): void {
        const xOffset = Math.random() * MAX_PIPE_X_OFFSET;
        const yOffset = Math.random() * MAX_PIPE_Y_OFFSET;

        const position = {
            x: this.pipeStartingPosition.x + xOffset,
            y: this.pipeStartingPosition.y + yOffset,
        };

        const pipe = new Pipe(
            position,
            this.startingSpeed,
            this.startingGap,
            this.gameCtx
        );
        pipe.onClearPipe = this.onClearPipe;

        this.pipes.push(pipe);
    }

    public clearPool(): void {
        this.pipes = [];
    }
}

export default PipePool;
