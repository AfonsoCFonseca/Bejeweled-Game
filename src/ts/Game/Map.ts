import { PositionInTile } from '../game.interfaces';
import { HALF_SCREEN, MAP, TILE, PIECE_TYPES, INITIAL_BOARD_SCREEN, TOTAL_OF_PIECE_TYPE } from '../Utils/gameValues';
import { getRandomValueFromArray, getPieceTypeNumber } from '../Utils/utils';
import { gameManager } from './GameManager';
import Piece from './Piece'
//import * as gv from '../Utils/gameValues';
// eslint-disable-next-line import/prefer-default-export
export let map: Map;

export default class Map {
    private currentMap: Piece[][] = [[]];

    constructor() {
        map = this;
        this.start();
    }

    start() {
        this.createMap();
    }

    createMap(): Piece[][] {
        for (let i = 0; i < MAP.TOTAL_TILES_WIDTH; i++) {
            this.currentMap[i] = [];
            for (let j = 0; j < MAP.TOTAL_TILES_HEIGHT; j++) {
                const x = INITIAL_BOARD_SCREEN.WIDTH + (i * TILE.WIDTH);
                const y = INITIAL_BOARD_SCREEN.HEIGHT + (j * TILE.HEIGHT);
                const pieceTypeLetter = getRandomValueFromArray(PIECE_TYPES);
                const pieceTypeNumber = getPieceTypeNumber(pieceTypeLetter);
                const piece = new Piece(pieceTypeNumber, { x, y });
                this.currentMap[i][j] = piece;
            }
        }
        return this.currentMap;
    }

    public getCurrentMap() {
        return this.currentMap;
    }

    public getTile(tilePos: PositionInTile): Piece {
        return this.currentMap[tilePos.tileX][tilePos.tileY];
    }

    public isPieceAdjacent(selectedPiece: Piece): boolean {
        const { currentTile } = gameManager.currentPiece.tile();
        const selectedTile = selectedPiece.tile().currentTile;
        if (selectedTile.tileX === currentTile.tileX) { //vertical
            if (selectedTile.tileY === currentTile.tileY - 1 || selectedTile.tileY === currentTile.tileY + 1) {
                return true;
            }
        } else if (selectedTile.tileY === currentTile.tileY) { //horizontal
            if (selectedTile.tileX === currentTile.tileX - 1 || selectedTile.tileX === currentTile.tileX + 1) {
                return true;
            }
        }
        return false;
    }
}
