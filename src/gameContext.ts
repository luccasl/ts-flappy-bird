import Bird from "./bird/bird";
import ResourceManager from "./resourceManager/resourceManager";

class GameContext {
    public onReady: () => void = function () {};
    private isReady: boolean = false;

    private readonly resourceManager: ResourceManager = new ResourceManager();
    private canvas: HTMLCanvasElement;
    private bird: Bird;

    private isPaused: boolean;

    public async config(): Promise<void> {
        await this.resourceManager.setup();

        this.onReady();
        this.isReady = true;
    }

    public getIsReady(): boolean {
        return this.isReady;
    }

    public getResourceManager(): ResourceManager {
        return this.resourceManager;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
    }

    public getBird(): Bird {
        return this.bird;
    }

    public setBird(bird: Bird): void {
        this.bird = bird;
    }

    public setIsPaused(isPaused: boolean) {
        this.isPaused = isPaused;
    }

    public getIsPaused(): boolean {
        return this.isPaused;
    }
}

export default GameContext;
