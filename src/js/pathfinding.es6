// jshint esversion:6

import Debug from "./debug";

import * as THREE from "three";

/**
 * Class representing a dot.
 * @extends Point
 */
var PathFinding = class {
    /**
     * Create a dot.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} width - The width of the dot, in pixels.
     */
    constructor(grid) {
        this.grid = grid;
    }

    findPath(originTile, targetTile) {
        var path = [originTile],
            lastStep = originTile,
            maxStep = 10;
        
        while (lastStep.getId() !== targetTile.getId() && maxStep > path.length) {
            lastStep = this.findClosestTile(lastStep, targetTile);
            path.push(lastStep);
        }
        
        Debug.log("Count step : " + path.length);
        
        var points = [];
        path.forEach(function(tile) {
            points.push(tile.mesh.position);
        });
        return new THREE.CatmullRomCurve3(points);

        // TODO Ajouter tuiles blocantes
		// TODO Ameliorer algo
    }

    findClosestTile(originTile, targetTile) {
        var neighbours = this.grid.getNeighbours(originTile),
            closestTile;
        
        this.sortNeighbours(neighbours, targetTile);
        closestTile = neighbours[0];
        
        return closestTile;
    }

    sortNeighbours(tiles, targetTile) {
        var nombres = [4, 2, 5, 1, 3];
        tiles.sort(function (tileA, tileB) {
            var distanceA = tileA.distanceTo(targetTile),
                distanceB = tileB.distanceTo(targetTile);
            return distanceA - distanceB;
        });
    }

};

export default PathFinding;