export type TileType = 'W' | 'R' | 'Y' | 'G' | 'O' | 'B' | 'P';
export type TileNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface PositionInPixel {
    x: number,
    y: number
}

export interface PositionInTile {
    tileX: TileNumbers,
    tileY: TileNumbers
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum GAME_STATE {
    RUNNING,
    PAUSE,
    GAME_OVER,
    START,
    TUTORIAL
}

export enum PIECE_TYPES {
    WHITE,
    RED,
    YELLOW,
    GREEN,
    ORANGE,
    BLUE,
    PURPLE
}
