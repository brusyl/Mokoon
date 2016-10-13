// jshint esversion:6
/* global MOON */

/**
 * Class representing a dot.
 * @extends Point
 */
var PathTile = class {
    /**
     * Create a dot.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} width - The width of the dot, in pixels.
     */
    constructor(tile, targetTile, originPathTile) {
        this.tile = tile;
        this.distance = tile.distanceTo(targetTile);
        this.targetTile = targetTile;
        this.originPathTile = originPathTile;
    }
};

export default PathTile;