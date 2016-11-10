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
        this.r = r;
        this.g = g;
        this.b = b;

        var rgbString = "rgb(" + this.toString() + ")";
		this.threeColor = new THREE.Color(rgbString);
	}
    
    toString() {
        return this.r + "," + this.g + "," + this.b;
    }
    
    getHex() {
        return this.threeColor.getHex();
    }

};

export default Color;