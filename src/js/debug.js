// jshint esversion:6
/* global MOON */

/**
 * Class representing a dot.
 * @extends Point
 */
var Debug = class {
    /**
     * Create a dot.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} width - The width of the dot, in pixels.
     */
      constructor() {
        this.mode = false;
      }
    
    static mode(mode) {
        if (mode !== undefined) {
            this.mode = mode;
        }
    }
    
    static log(obj) {
        if (this.mode) {
            console.log(obj);
        }
    }
};



MOON.Debug = Debug;

/*class Chien extends MOON.GridPosition {
  parle() {
    console.log(this.nom + ' aboie.');
  }
}*/