import Vector, { ORIGIN_VECTOR } from "../common/interfaces/vector";
import Size from "../common/interfaces/size";
import Rect from "../common/interfaces/rect";
import GameContext from "../gameContext";
import {
    FOREGROUND_TILE_SIZE,
    MILLISECONDS_BETWEEN_BIRD_FRAMES,
} from "../common/constants";

const BIRD_SCALE = 64;

const GRAVITY = 1.2 * BIRD_SCALE;
const FRICTION_FORCE = 0.4 * BIRD_SCALE;
const JUMP_FORCE = 2.4 * BIRD_SCALE;

const ROTATION_READJUST_RATE = 15;
const MAX_BIRD_ROTATION = 25;

class Bird {
    private readonly gameCtx: GameContext;
    private birdFrames: HTMLImageElement[] = [];
    private frameIndex: number = 0;
    private jumpAudio: HTMLAudioElement;

    private startingPosition: Vector;
    private position: Vector;
    private acceleration: Vector = ORIGIN_VECTOR;

    private rotation: number = 0;
    private rotationOffset: number = 0;

    private size: Size;

    public onBirdOutOfBounds: () => void = function () {};

    private canvas: HTMLCanvasElement;

    constructor(gameCtx: GameContext) {
        this.gameCtx = gameCtx;
    }

    public async setup(): Promise<void> {
        const resourceManager = this.gameCtx.getResourceManager();
        this.jumpAudio = resourceManager.getResource("jump_sfx");

        const numberOfFrames = 3;
        for (let i = 0; i < numberOfFrames; i++) {
            this.birdFrames.push(resourceManager.getResource(`bird-${i}_img`));
        }

        this.canvas = this.gameCtx.getCanvas();

        this.size = {
            width: BIRD_SCALE,
            height:
                BIRD_SCALE *
                (this.birdFrames[0].height / this.birdFrames[0].width),
        };

        this.startingPosition = {
            x: this.canvas.width / 2 - this.size.width / 2,
            y: this.canvas.height / 2 - this.size.height / 2,
        };
        this.position = { ...this.startingPosition };

        this.updateFrame();
    }

    private async updateFrame(): Promise<void> {
        if (!this.gameCtx.getIsPaused()) {
            this.frameIndex = (this.frameIndex + 1) % this.birdFrames.length;
        }

        setTimeout(
            this.updateFrame.bind(this),
            MILLISECONDS_BETWEEN_BIRD_FRAMES
        );
    }

    public updateLogic(deltaTime: number) {
        this.position.y += deltaTime * (GRAVITY - this.acceleration.y);

        if (this.acceleration.y > 0) {
            this.acceleration.y = Math.max(
                this.acceleration.y - FRICTION_FORCE * deltaTime,
                0
            );
        }

        this.rotation -= this.rotationOffset * deltaTime;

        if (this.rotation < 45) {
            this.rotation = Math.min(
                this.rotation + (deltaTime * ROTATION_READJUST_RATE) / 2,
                45
            );
        }

        this.rotation = Math.max(-MAX_BIRD_ROTATION, this.rotation);

        if (this.rotationOffset > 0) {
            this.rotationOffset = Math.max(
                this.rotationOffset - ROTATION_READJUST_RATE * deltaTime,
                0
            );
        }

        const floorHeight =
            this.canvas.height - FOREGROUND_TILE_SIZE - this.size.height;
        const isBirdOutOfBounds =
            this.position.y > floorHeight || this.position.y < 0;
        if (isBirdOutOfBounds) {
            this.onBirdOutOfBounds();
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(
            this.position.x - this.size.width / 2,
            this.position.y + this.size.height / 2
        );
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.drawImage(
            this.birdFrames[this.frameIndex],
            this.size.width / 2,
            -this.size.height / 2,
            this.size.width,
            this.size.height
        );
        ctx.restore();
    }

    public jump() {
        this.acceleration.y = JUMP_FORCE;

        this.jumpAudio.currentTime = 0;
        this.jumpAudio.playbackRate = 1 - Math.random() * 0.2;
        this.jumpAudio.play();

        this.rotationOffset = 45;
    }

    public reset() {
        this.acceleration = {
            x: 0,
            y: 0,
        };
        this.position = { ...this.startingPosition };
        this.rotation = 0;
        this.rotationOffset = 0;
        this.frameIndex = 0;
    }

    public getRect(): Rect {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.size.width,
            height: this.size.height,
        };
    }
}

export default Bird;
