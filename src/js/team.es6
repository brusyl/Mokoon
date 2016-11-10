// jshint esversion:6

import * as THREE from "three";

import Color from "./color";
import Debug from "./debug";

var Team = class {
	/**
	 * Create a dot.
	 * @param {number} x - The x value.
	 * @param {number} y - The y value.
	 * @param {number} width - The width of the dot, in pixels.
	 */
	constructor(teamNumber) {
        this.id = teamNumber;
        this.color = Team.COLOR[teamNumber];
	}
    
    getColor() {
        return this.color.getHex();
    }
    
    getRawColor() {
        return this.color.threeColor;
    }
    
    getTeamNumber() {
        return this.id;
    }
};


// TODO Move to main after clean this class
Team.COLOR = [
    new Color(83,153,224),
    new Color(234,218,75),
    new Color(223,126,214),
    new Color(216,50,47),
    new Color(100,216,82)
];

export default Team;