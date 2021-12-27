import { PositionInTile, TileNumbers } from '../game.interfaces';
import { HALF_SCREEN, MAP, TILE, PIECE_TYPES, INITIAL_BOARD_SCREEN, TOTAL_OF_PIECE_TYPE } from '../Utils/gameValues';
import { getRandomValueFromArray, getPieceTypeNumber, isNumberInsideBoard } from '../Utils/utils';
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
                const x = (INITIAL_BOARD_SCREEN.WIDTH) + (i * (TILE.WIDTH));
                const y = INITIAL_BOARD_SCREEN.HEIGHT + (j * (TILE.HEIGHT));
                const pieceTypeLetter = getRandomValueFromArray(PIECE_TYPES);
                const piece = new Piece(pieceTypeLetter, { x, y });
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

    public setPieceOnTile(newPiece:Piece, tile: PositionInTile) {
        this.currentMap[tile.tileX][tile.tileY] = newPiece;
    }

    public isPieceAdjacent(selectedPiece: Piece): boolean {
        const { currentTile } = gameManager.currentPiece;
        const selectedTile = selectedPiece.currentTile;
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

    public checkMatch(piece:Piece): Piece[] {
        const { pieceTypeByLetter } = piece;
        const arr = [1, -1, 1, -1];
        let matchArrOfPieces: Piece[] = [piece]; //First Piece
        let direction: 'horizontal' | 'vertical' = 'horizontal';

        for (let i = 0; i < 4; i++) {
            let tileX = piece.currentTile.tileX + arr[i];
            let { tileY } = piece.currentTile;
            if (i >= 2) {
                direction = 'vertical';
                tileX = piece.currentTile.tileX;
                tileY = piece.currentTile.tileY + arr[i] as TileNumbers;
            }

            if (isNumberInsideBoard(i >= 2 ? tileY : tileX)) {
                const pieceSelected = this.currentMap[tileX][tileY];
                if (pieceSelected.pieceTypeByLetter === pieceTypeByLetter) {
                    matchArrOfPieces.push(pieceSelected); //Second Piece
                    matchArrOfPieces = this.checkAdjacentForMatch(pieceSelected, piece, matchArrOfPieces, arr[i], direction); //Third and more Pieces
                }
            }
        }
        return matchArrOfPieces;
    }

    private checkAdjacentForMatch(pieceSelected, piece, matchArrOfPieces, currentValueSide, direction: 'horizontal' | 'vertical'): Piece[] {
        const { pieceTypeByLetter } = piece;
        let nextMatch = currentValueSide < 0 ? -1 : 1;
        let tileX = direction === 'horizontal' ? piece.currentTile.tileX + (currentValueSide + nextMatch) : piece.currentTile.tileX;
        let tileY = direction === 'horizontal' ? piece.currentTile.tileY : piece.currentTile.tileY + (currentValueSide + nextMatch);
        //let nextPosition = piece.currentTile.tileX + (currentValueSide + nextMatch);

        if (isNumberInsideBoard(direction === 'horizontal' ? tileX : tileY)) {
            pieceSelected = this.currentMap[tileX][tileY];
            while (pieceSelected.pieceTypeByLetter === pieceTypeByLetter) {
                nextMatch += currentValueSide < 0 ? -1 : 1;
                matchArrOfPieces.push(pieceSelected);
                tileX = direction === 'horizontal' ? piece.currentTile.tileX + (currentValueSide + nextMatch) : piece.currentTile.tileX;
                tileY = direction === 'horizontal' ? piece.currentTile.tileY : piece.currentTile.tileY + (currentValueSide + nextMatch);
                pieceSelected = this.currentMap[tileX][tileY];
            }
        }
        return matchArrOfPieces;
    }
}
