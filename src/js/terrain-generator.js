// jshint esversion:6
/* global MOON */

/**
 * Class representing a dot.
 * @extends Point
 */
var TerrainGenerator = class {
    /**
     * Create a dot.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} width - The width of the dot, in pixels.
     */
    constructor(size, maxHeight) {
        this.size = size;
        this.maxHeight = maxHeight;
    }

    getTerrain() {
        var terrain = this.generateTerrain(),
            result = [];
        
        terrain.forEach(function(row, rowIndex) {
            row.forEach(function(height, colIndex) {
                result.push(new MOON.GridPosition(rowIndex, colIndex, height));
            });
        });
        
        return result;
    }
    
    generateTerrain() {
        var matrix = [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ];
        
        return matrix;
    }
};




MOON.TerrainGenerator = TerrainGenerator;