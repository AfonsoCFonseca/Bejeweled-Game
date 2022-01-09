import { PositionInTile, TileNumbers } from '../game.interfaces';
import { HALF_SCREEN, MAP, TILE, PIECE_TYPES, INITIAL_BOARD_SCREEN, TOTAL_OF_PIECE_TYPE } from '../Utils/gameValues';
import { getRandomValueFromArray, getPieceTypeNumber, isNumberInsideBoard, convertTileToPosition, removeDuplicates } from '../Utils/utils';
import { gameManager } from './GameManager';
import Piece from './Piece'
import * as _ from 'lodash';
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

    public resetMap() {
        this.currentMap.forEach((line) => line.forEach((piece) => {
            piece.destroy();
            this.currentMap = [];
        }));
        this.start();
    }

    createRealMap() {
        let tempMap: Piece[][];
        do {
            if (tempMap) this.clearMap(tempMap);
            tempMap = this.generateMap();
        } while (this.isBoardMatch(tempMap).isMatch === true);
        this.currentMap = tempMap;
    }

    createFakeMap() {
        let newFakeMap: Piece[][] = [];
        const fakeMap = [ // No match
            ['g', 'y', 'b', 'b', 'r', 'g', 'p', 'p'],
            ['w', 'w', 'g', 'g', 'g', 'w', 'g', 'g'],
            ['w', 'g', 'r', 'r', 'g', 'p', 'r', 'p'],
            ['r', 'w', 'b', 'w', 'r', 'w', 'r', 'b'],
            ['w', 'y', 'g', 'r', 'w', 'b', 'w', 'b'],
            ['w', 'y', 'y', 'w', 'w', 'p', 'g', 'r'],
            ['p', 'w', 'b', 'p', 'g', 'p', 'g', 'y'],
            ['w', 'b', 'b', 'w', 'y', 'w', 'p', 'y'],
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

    setPieceOnTile = (newPiece:Piece | null, tile: PositionInTile) => {
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
    public isBoardMatch(tempMap: Piece[][]): { isMatch: boolean, piece: Piece } {
        const result = {
            isMatch: false,
            piece: null
        };
        // eslint-disable-next-line no-restricted-syntax
        for (const x of tempMap) {
            const found = x.find((piece:Piece) => this.checkMatch(tempMap, piece).matchArrOfPieces.length >= 3);
            if (found && found.active === true) {
                result.isMatch = true;
                result.piece = found;
            } 
        } 

        return result;
    }

    public isExistantFutureMoves(tempMap: Piece[][]): boolean {
        for (let i = 0; i < tempMap.length; i++) {
            for (let j = 0; j < tempMap[i].length; j++) {
                if (map.calculatEachFourMoves(i, j)) {
                    return true;
                } 
            }
        }
        return false;
    }

    private calculatEachFourMoves(mTileX, mTileY) {
        const arr = [1, -1, 1, -1];
        for (let i = 0; i < 4; i++) {
            let possibleMap: Piece[][] = [];
            this.getCurrentMap().forEach((line, indexX) => line.forEach((piece, indexY) => {
                if (!possibleMap[indexX]) possibleMap[indexX] = [];
                possibleMap[indexX].push(piece);
            }));
            let piece = Object.assign({}, possibleMap[mTileX][mTileY]) ;

            const tileX = (i >= 2 ? piece.currentTile.tileX + arr[i] : piece.currentTile.tileX) as TileNumbers;
            const tileY = (i >= 2 ? piece.currentTile.tileY : piece.currentTile.tileY + arr[i]) as TileNumbers;
            if (isNumberInsideBoard(i >= 2 ? tileX : tileY)) {
                const futurePiece = Object.assign({}, possibleMap[tileX][tileY]); 
                const currentPiece = Object.assign({}, piece);

                possibleMap[tileX][tileY] = currentPiece;
                possibleMap[tileX][tileY].currentTile = { tileX, tileY };

                possibleMap[piece.currentTile.tileX][piece.currentTile.tileY] = futurePiece;
                possibleMap[piece.currentTile.tileX][piece.currentTile.tileY].currentTile = { tileX: piece.currentTile.tileX, tileY: piece.currentTile.tileY };

                const currentSituation = map.checkMatch(possibleMap, possibleMap[tileX][tileY]);
                if (currentSituation.matchArrOfPieces.length >= 3) {
                    return true;
                } 
            }
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
                if (pieceSelected && pieceSelected.pieceTypeByLetter === pieceTypeByLetter) {
                    arrOfPiecesToMatch.push(pieceSelected); //Second Piece
                    const obj = this.checkAdjacentForMatch(map, pieceSelected, piece, arrOfPiecesToMatch, arr[i], direction); //Third and more Pieces

                    if (obj.matchArrOfPieces.length >= 3) matchArrOfPieces = matchArrOfPieces.concat(obj.matchArrOfPieces);
                    finalMap = obj.finalMap;
                }
            }
        }

        matchArrOfPieces = removeDuplicates(matchArrOfPieces);

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
            while (pieceSelected && pieceSelected.pieceTypeByLetter === pieceTypeByLetter) {
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
