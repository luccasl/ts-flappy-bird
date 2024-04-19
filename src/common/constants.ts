const VIRTUAL_WIDTH: number = 520;
const VIRTUAL_HEIGHT: number = 800;
const BUTTON_TEXT_START: string = "Start";
const BUTTON_TEXT_LOADING: string = "Loading...";
const PIPE_SPAWN_TIMEOUT_MILLISECONDS = 1200;
const PIPE_SCALE: number = 120;
const PIPE_STARTING_SPEED: number = 25;
const PIPE_STARTING_GAP_SIZE: number = 100;
const PIPE_COLLISION_THRESHOLD: number = 6;
const PIPE_POOL_SIZE: number = 3;
const PIPE_STARTING_Y_POSITION: number = 300;
const PIPE_STARTING_X_OFFSET: number = 100;
const MAX_PIPE_X_OFFSET: number = 50;
const MAX_PIPE_Y_OFFSET: number = 250;
const RESOURCES_ROOT_PATH: string = "./resources/";
const SCORE_LOCAL_STORAGE_KEY: string = "ts-flappy-bird_score";
const SCOREBOARD_CLOSE_BUTTON_CLICK_PROTECTION_TIMEOUT: number = 400;
const MILLISECONDS_BETWEEN_BIRD_FRAMES: number = 150;
const FOREGROUND_TILE_SIZE: number = 64;
const FOREGROUND_SCROLLING_SPEED: number = 25;
const BACKGROUND_TILE_WIDTH: number = 250;
const BACKGROUND_TILE_HEIGHT: number = 450;
const BACKGROUND_SCROLLING_SPEED: number = 5;

export {
    VIRTUAL_WIDTH,
    VIRTUAL_HEIGHT,
    PIPE_SPAWN_TIMEOUT_MILLISECONDS,
    PIPE_SCALE,
    PIPE_STARTING_SPEED,
    PIPE_STARTING_GAP_SIZE,
    PIPE_COLLISION_THRESHOLD,
    PIPE_POOL_SIZE,
    MAX_PIPE_X_OFFSET,
    MAX_PIPE_Y_OFFSET,
    PIPE_STARTING_Y_POSITION,
    PIPE_STARTING_X_OFFSET,
    RESOURCES_ROOT_PATH,
    BUTTON_TEXT_START,
    BUTTON_TEXT_LOADING,
    SCORE_LOCAL_STORAGE_KEY,
    SCOREBOARD_CLOSE_BUTTON_CLICK_PROTECTION_TIMEOUT,
    MILLISECONDS_BETWEEN_BIRD_FRAMES,
    FOREGROUND_TILE_SIZE,
    FOREGROUND_SCROLLING_SPEED,
    BACKGROUND_TILE_WIDTH,
    BACKGROUND_TILE_HEIGHT,
    BACKGROUND_SCROLLING_SPEED,
};