// jshint esversion:6
/* global MOON */

/**
 * Class representing a dot.
 * @extends Point
 */
var GridPosition = class {
    /**
     * Create a dot.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} width - The width of the dot, in pixels.
     */
    constructor(row, column, height) {
        this.row = row;
        this.column = column;
        this.height = height;
    }

    toString() {
        return this.row + "," + this.column + "," + this.height;
    }

    toKey() {
        return this.row + "," + this.column;
    }
};

export default GridPosition;