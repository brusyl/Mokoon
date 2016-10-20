// jshint esversion:6

import Debug from "./debug";

import GridPosition from "./grid-position";
import Tile from "./tile";
import HexaMatrix from "./hexa-matrix";

var Grid = class {
    /**
     * Create a dot.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} width - The width of the dot, in pixels.
     */
    constructor(scene) {
        this.scene = scene;
        this.tiles = {};
        this.tilesMesh = null;
    }
    
    create() {
        var terrain = HexaMatrix.generate(5);
    
        terrain.forEach(function(tilePosition) {
            this.addTile({
                position : tilePosition
            });
        }.bind(this));
    }
    
    addTile(options) {
        var tile = new Tile(this.scene, options);
        tile.create();
        tile.movePosition();
        
        this.tiles[tile.id] = tile;
    }
    
    getTiles() {
        return this.tiles;
    }
    
    getTilesMesh() {
        if (!this.tilesMesh) {
            this.tilesMesh = [];
            
            for(var key in this.tiles) {
                this.tilesMesh.push(this.tiles[key].mesh);
            }    
        }
        Debug.log("Tile count: " + this.tilesMesh.length);
        return this.tilesMesh;
    }
    
    getTile(gPosition) {
        var tile = this.tiles[gPosition.toKey()];
        
        Debug.log(tile);
        return tile;
    }
	
	updateTileTeam(gridPosition, team) {
		var tile = this.getTile(gridPosition);
        if (tile) {
            tile.updateTileTeam(team);
        } else {
            console.log("undefined");
        }
	}
    
    convertGridToPosition(pos) {
        var gPosition = null,
            tile = this.getTile(pos),
            position = tile.getPosition();
        return position;
    }
    
    /*convertPositionToGrid(position) {
        var gPosition = null,
            tile = this.getTile(new GridPosition(0, 0)),
            tHeight = tile.getHeight(),
            tWidth = tile.getWidth();
        var tile2 = this.getTile(new GridPosition(1, 0))
		
        var heightRadius = tHeight / 2;
        var heightRaw = position.z + (tHeight / 2);
        
        if (heightRaw > heightRadius) {
            heightRaw += (tHeight / 2);
        } else if (heightRaw < -heightRadius) {
            heightRaw -= (tHeight / 2);
        }
        
        var row = Math.round(heightRaw);
        
        var widthRadius = tWidth / 2;
        var widthRaw = position.x;
        
        if (widthRaw > widthRadius) {
            widthRaw += widthRadius;
        } else if (widthRaw < -widthRadius) {
            widthRaw -= widthRadius;
        }
        
        var column=Math.round(widthRaw);
		
       gPosition = new GridPosition(row, 
                                   column);
		
        return gPosition;

        
    }*/
    
    getNeighbours(tile, options) {
        if (!options) {
            options = {};
        }
        
        var position = tile.getGridPosition(),
            row = position.row,
            column = position.column,
            neighbours = [],
            maxDistance = options.maxDistance ? options.maxDistance : 1,
            minDistance = options.minDistance ? options.minDistance : 0,
            neighbourPositions = this.generateNeighbourPositions(position, maxDistance, minDistance);
   
        neighbourPositions.forEach(function(neighbourPosition) {
            var neighbourTile = this.getTile(neighbourPosition);
            if (neighbourTile) {
                neighbours.push(neighbourTile);
            }
        }.bind(this));
        
        Debug.log("neighbours " + position.toString());
        Debug.log("neighbours " + neighbours.length);
        return neighbours;
    }
    
    generateNeighbourPositions(originPosition, maxDistance, minDistance) {
        var neighbourMatrix = HexaMatrix.generate(maxDistance, {
            excludeCenter : true
        });
        
        if (minDistance > 0) {
            var minNeighbourMatrix = HexaMatrix.generate(minDistance);
            HexaMatrix.intersect(neighbourMatrix, minNeighbourMatrix);
        }
        
        HexaMatrix.shift(originPosition, neighbourMatrix);
               
        return neighbourMatrix;
    }
};

export default Grid;