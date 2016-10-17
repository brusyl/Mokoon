// jshint esversion:6

import * as THREE from "three";

import Debug from "./debug";

var Color = class {
	/**
	 * Create a dot.
	 * @param {number} x - The x value.
	 * @param {number} y - The y value.
	 * @param {number} width - The width of the dot, in pixels.
	 */
	constructor(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;

        var rgbString = "rgb(" + this.toString() + ")";
		this.threeColor = new THREE.Color(rgbString);
	}
    
    toString() {
        return this.red + "," + this.green + "," + this.blue;
    }
    
    getHex() {
        return this.threeColor.getHex();
    }

};

export default Color;