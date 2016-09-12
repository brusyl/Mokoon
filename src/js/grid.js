// jshint esversion:6
/*global MOON*/

(function () {
    "use strict";
    var Grid = function (scene) {
        this.scene = scene;
        this.tiles = {};
        //this.gWidth = 50;
        //this.gHeight = 25;
        this.tilesMesh = null;
    };
    
    Grid.prototype.create = function () {
        var generator = new MOON.TerrainGenerator(),
            terrain = generator.getTerrain();
        
        terrain.forEach(function(tilePosition) {
            this.addTile({
                position : tilePosition
            });
        }.bind(this));
    };

    Grid.prototype.addTile = function (options) {
        var tile = new MOON.Tile(this.scene, options);
        tile.create();
        tile.movePosition();
        
        this.tiles[tile.id] = tile;
    };
    
    Grid.prototype.getTilesMesh = function () {
        if (!this.tilesMesh) {
            this.tilesMesh = [];
            
            for(var key in this.tiles) {
                this.tilesMesh.push(this.tiles[key].mesh);
            }    
        }
        MOON.Debug.log("Tile count: " + this.tilesMesh.length);
        return this.tilesMesh;
    };
    
    
    
    Grid.prototype.getTile = function (gPosition) {
        var tile = this.tiles[gPosition.toKey()];
        
        MOON.Debug.log(tile);
        return tile;
    };
    
    Grid.prototype.convertGridToPosition = function(pos) {
        var gPosition = null,
            tile = this.getTile(pos),
            position = tile.getPosition();
        //console.log(position);
        return position;
    };
    
    Grid.prototype.convertPositionToGrid = function(position) {
        var gPosition = null,
            tile = this.getTile(new MOON.GridPosition(0, 0)),
            tHeight = tile.getHeight(),
            tWidth = tile.getWidth();
        
        gPosition = new MOON.GridPosition(Math.trunc(position.x / tWidth), 
                                    Math.trunc(position.z / tHeight));
        
        /*var test = new Chien();
       test.parle();  */  
        //console.log(gPosition);
        return gPosition;
    };
    
    Grid.prototype.getNeighbours = function(tile, options) {
        var position = tile.getGridPosition(),
            row = position.row,
            column = position.column,
            neighbours = [],
            neighbourPositions = [];
        
        if (options) {
            var thickness = options.thickness ? options.thickness : 0;
            var distance = options.distance ? options.distance : 1;
            
            neighbourPositions = this.generateNeighbourPositions(distance, thickness);
        }
  
        neighbourPositions.forEach(function(neighbourPosition) {
            var neighbourTile = this.getTile(neighbourPosition);
            if (neighbourTile) {
                neighbours.push(neighbourTile);
            }
        }.bind(this));
        
   
        MOON.Debug.log("neighbours " + position.toString());
        MOON.Debug.log("neighbours " + neighbours.length);
        return neighbours;
    };
    
    Grid.prototype.generateNeighbourPositions = function(distance, thickness) {
        var nPositions = [],
            width = thickness;
        
        if (width > 0) {
            width = distance - thickness;
        }
        
        if (width <= 0) {
            width = distance;
        }
        
        while (width < distance) {
            for (var column = -distance; column <= distance; column++) {
                for (var row = -distance; row <= distance; row++) {
                    if (row !== 0 && column !== 0) {
                        nPositions.push(new MOON.GridPosition(row, column));
                    }
                }
            }
            distance --;
        }
                
        return nPositions;
    };
    
    MOON.Grid = Grid;
}());