// jshint esversion:6

import Debug from "./debug";

import PathTiles from "./pathfinding-tiles";
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
        
        return path;

        // TODO Ajouter tuiles blocantes
    }

    findClosestTile(originTile, targetTile) {
        var tileNeighbours = this.grid.getNeighbours(originTile),
            closest,
            neighbours = [],
            pathTiles = new PathTiles(this.grid);
        
        pathTiles.addAll(tileNeighbours, targetTile);
        closest = pathTiles.closest();
        return closest.tile;
    }

    sortNeighbours(tiles, targetTile) {
        tiles.sort(function (tileA, tileB) {
            var distanceA = tileA.distanceTo(targetTile),
                distanceB = tileB.distanceTo(targetTile);
            return distanceA - distanceB;
        });
    }
};

export default PathFinding;