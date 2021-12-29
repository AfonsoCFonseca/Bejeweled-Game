import { PositionInTile, TileNumbers } from '../game.interfaces';
import { HALF_SCREEN, MAP, TILE, PIECE_TYPES, INITIAL_BOARD_SCREEN, TOTAL_OF_PIECE_TYPE } from '../Utils/gameValues';
import { getRandomValueFromArray, getPieceTypeNumber, isNumberInsideBoard, convertTileToPosition } from '../Utils/utils';
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
        this.createRealMap();
        // this.createFakeMap();
    }

    createRealMap() {
        let tempMap: Piece[][];
        do {
            if (tempMap) this.clearMap(tempMap);
            tempMap = this.generateMap();
        } while (this.isInitialBoardMatch(tempMap) === true);
        this.currentMap = tempMap;
    }

    createFakeMap() {
        let newFakeMap: Piece[][] = [];
        const fakeMap = [
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
            ['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
        ];

        fakeMap.forEach((line, i) => line.forEach((piece, j) => {
            if (!newFakeMap[i] || newFakeMap[i].length === 0) newFakeMap[i] = [];
            newFakeMap[i].push(new Piece(piece, convertTileToPosition({ tileX: i as TileNumbers, tileY: j as TileNumbers })));
        }));

        this.currentMap = newFakeMap;
    }

    private clearMap(tempMap:Piece[][]) {
        tempMap.forEach((line:Piece[]) => line.forEach((piece:Piece) => piece.destroy()));
    }

    generateMap(): Piece[][] {
        const tempMap: Piece[][] = [[]];
        for (let i = 0; i < MAP.TOTAL_TILES_WIDTH; i++) {
            tempMap[i] = [];
            for (let j = 0; j < MAP.TOTAL_TILES_HEIGHT; j++) {
                const x = (INITIAL_BOARD_SCREEN.WIDTH) + (i * (TILE.WIDTH));
                const y = INITIAL_BOARD_SCREEN.HEIGHT + (j * (TILE.HEIGHT));
                const pieceTypeLetter = getRandomValueFromArray(PIECE_TYPES);
                const piece = new Piece(pieceTypeLetter, { x, y });
                tempMap[i][j] = piece;
            }
        }
        return tempMap;
    }

    public getCurrentMap() {
        return this.currentMap;
    }

    public setCurrentMap(currentMap: Piece[][]) {
        this.currentMap = currentMap;
    }

    public getPieceOnTile(tilePos: PositionInTile): Piece {
        return this.currentMap[tilePos.tileX][tilePos.tileY];
    }

    public setPieceOnTile(newPiece:Piece | null, tile: PositionInTile) {
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
    private isInitialBoardMatch(tempMap: Piece[][]):boolean {
        // eslint-disable-next-line no-restricted-syntax
        for (const x of tempMap) {
            const found = x.find((piece:Piece) => this.checkMatch(tempMap, piece).matchArrOfPieces.length >= 3);
            if (found) return true;
        } 

        return false;
    }

    public checkMatch(map:Piece[][], piece:Piece): { matchArrOfPieces: Piece[], finalMap: Piece[][] } {
        const { pieceTypeByLetter } = piece;
        const arr = [1, -1, 1, -1];
        let arrOfPiecesToMatch: Piece[] = [piece]; //First Piece
        let direction: 'horizontal' | 'vertical' = 'horizontal';
        let matchArrOfPieces: Piece[] = [];
        let finalMap: Piece[][];

        for (let i = 0; i < 4; i++) {
            let tileX = piece.currentTile.tileX + arr[i];
            let { tileY } = piece.currentTile;
            if (i >= 2) {
                if (i === 2) arrOfPiecesToMatch = [piece];
                direction = 'vertical';
                tileX = piece.currentTile.tileX;
                tileY = piece.currentTile.tileY + arr[i] as TileNumbers;
            }

            if (isNumberInsideBoard(i >= 2 ? tileY : tileX)) {
                const pieceSelected = map[tileX][tileY];
                if (pieceSelected.pieceTypeByLetter === pieceTypeByLetter) {
                    arrOfPiecesToMatch.push(pieceSelected); //Second Piece
                    const obj = this.checkAdjacentForMatch(map, pieceSelected, piece, arrOfPiecesToMatch, arr[i], direction); //Third and more Pieces

                    if (obj.matchArrOfPieces.length >= 3) matchArrOfPieces = matchArrOfPieces.concat(obj.matchArrOfPieces);
                    finalMap = obj.finalMap;
                }
            }
        }


        return { matchArrOfPieces, finalMap };
    }

    private checkAdjacentForMatch(map, pieceSelected, piece, arrOfPiecesToMatch, currentValueSide, direction: 'horizontal' | 'vertical'): 
    { matchArrOfPieces: Piece[], finalMap: Piece[][] } {
        const { pieceTypeByLetter } = piece;
        let nextMatch = currentValueSide < 0 ? -1 : 1;
        let tileX = direction === 'horizontal' ? piece.currentTile.tileX + (currentValueSide + nextMatch) : piece.currentTile.tileX;
        let tileY = direction === 'horizontal' ? piece.currentTile.tileY : piece.currentTile.tileY + (currentValueSide + nextMatch);
        //let nextPosition = piece.currentTile.tileX + (currentValueSide + nextMatch);
        if (isNumberInsideBoard(direction === 'horizontal' ? tileX : tileY)) {
            pieceSelected = map[tileX][tileY];
            while (pieceSelected.pieceTypeByLetter === pieceTypeByLetter) {
                nextMatch += currentValueSide < 0 ? -1 : 1;
                arrOfPiecesToMatch.push(pieceSelected);
                tileX = direction === 'horizontal' ? piece.currentTile.tileX + (currentValueSide + nextMatch) : piece.currentTile.tileX;
                tileY = direction === 'horizontal' ? piece.currentTile.tileY : piece.currentTile.tileY + (currentValueSide + nextMatch);
                if (!isNumberInsideBoard(direction === 'horizontal' ? tileX : tileY)) break;
                pieceSelected = map[tileX][tileY];
            }
        }

        return { 
            matchArrOfPieces: arrOfPiecesToMatch,
            finalMap: map
        };
    }
}
