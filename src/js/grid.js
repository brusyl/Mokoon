// jshint esversion:6
/*global MOON*/

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
        var terrain = MOON.HexaMatrix.generate(4);
    
        terrain.forEach(function(tilePosition) {
            this.addTile({
                position : tilePosition
            });
        }.bind(this));
    }
    
    addTile(options) {
        var tile = new MOON.Tile(this.scene, options);
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
        MOON.Debug.log("Tile count: " + this.tilesMesh.length);
        return this.tilesMesh;
    }
    
    getTile(gPosition) {
        var tile = this.tiles[gPosition.toKey()];
        
        MOON.Debug.log(tile);
        return tile;
    }
    
    convertGridToPosition(pos) {
        var gPosition = null,
            tile = this.getTile(pos),
            position = tile.getPosition();
        return position;
    }
    
    convertPositionToGrid(position) {
        var gPosition = null,
            tile = this.getTile(new MOON.GridPosition(0, 0)),
            tHeight = tile.getHeight(),
            tWidth = tile.getWidth();
        
        gPosition = new MOON.GridPosition(Math.trunc(position.x / tWidth), 
                                    Math.trunc(position.z / tHeight));
        
        return gPosition;
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
        
        MOON.Debug.log("neighbours " + position.toString());
        MOON.Debug.log("neighbours " + neighbours.length);
        return neighbours;
    }
    
    generateNeighbourPositions(originPosition, maxDistance, minDistance) {
        var neighbourMatrix = MOON.HexaMatrix.generate(maxDistance, {
            excludeCenter : true
        });
        
        if (minDistance > 0) {
            var minNeighbourMatrix = MOON.HexaMatrix.generate(minDistance);
            MOON.HexaMatrix.intersect(neighbourMatrix, minNeighbourMatrix);
        }
        
        MOON.HexaMatrix.shift(originPosition, neighbourMatrix);
               
        return neighbourMatrix;
    }
};

MOON.Grid = Grid;