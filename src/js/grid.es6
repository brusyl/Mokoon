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
        var terrain = HexaMatrix.generate(4);
    
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
	
	updateTileColor(gridPosition, color) {
		var tile = this.getTile(gridPosition);
		tile.mesh.material.color.setHex(color);
	}
    
    convertGridToPosition(pos) {
        var gPosition = null,
            tile = this.getTile(pos),
            position = tile.getPosition();
        return position;
    }
    
    convertPositionToGrid(position) {
        var gPosition = null,
            tile = this.getTile(new GridPosition(0, 0)),
            tHeight = tile.getHeight(),
            tWidth = tile.getWidth();
        
		for(var key in this.tiles) {
			var t = this.tiles[key];
			if (t.mesh.geometry.boundingBox.containsPoint(position)) {
				tile = t;
				break;
			}
		} 
		
       // gPosition = new GridPosition(Math.trunc(position.z / tWidth), 
       //                             Math.trunc(position.x / tHeight));
		
        //return gPosition;
		
		return tile.getGridPosition();
        
    }
    
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