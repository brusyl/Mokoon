// jshint esversion:6
/* global MOON */

import PathTile from "./pathfinding-tile";

/**
 * Class representing a dot.
 * @extends Point
 */
var PathTiles = class {
    /**
     * Create a dot.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} width - The width of the dot, in pixels.
     */
    constructor(grid) {
        this.list = [];
        this.grid = grid;
    }
    
    addAll(tiles, targetTile, originPathTile) {
        tiles.forEach(function(tileNeighbour) {
            var pathTile = new PathTile(tileNeighbour, targetTile, originPathTile);
            
            this.add(pathTile);
        }.bind(this));
    }
    
    add(pathTile) {
        this.list.push(pathTile);
    }
    
    clear() {
        this.list = [];
    }
    
    sort() {
        this.list.sort(function (pathTileA, pathTileB) {
            var distanceA = pathTileA.distance,
                distanceB = pathTileB.distance;
            return distanceA - distanceB;
        });
    }
    
    closest(level, errorMargin) {
        var closest, result,
            i = 1;
        
        errorMargin = errorMargin ? errorMargin : 0.2;
        
        level = level ? level : 1;
        
        this.sort();
        
        closest = this.list[0];
        result = [closest];
        
        while (!this.list[i] || 
               closest.distance >= this.list[i].distance - errorMargin) {
            result.push(this.list[i]);
            i++;
        }
        
        // If several result are near, we test deeper the closest tile
        if (result.length > 1 && level < 2) {
            var nextClosestPathTiles = new PathTiles(this.grid);
            result.forEach(function(n) {
                var next = this.grid.getNeighbours(n.tile);
                var nextPathTiles = new PathTiles(this.grid);
                nextPathTiles.addAll(next, n.targetTile, n);
               
                
                var nextClosest = nextPathTiles.closest(level + 1);
                nextClosestPathTiles.add(nextClosest);
    
            }.bind(this));
            
            nextClosestPathTiles.sort();
            closest = nextClosestPathTiles.list[0].originPathTile;
        }
        
        return closest;
    }

};

export default PathTiles;