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
        var tileNeighbours = this.grid.getNeighbours(originTile),
            closestTile,
            neighbours = [];
        
        tileNeighbours.forEach(function(tileNeighbour) {
            neighbours.push({
                tile : tileNeighbour,
                distance : tileNeighbour.distanceTo(targetTile)
            });
        });
        
        this.sortNeighbours2(neighbours);
        
        var closest = neighbours[0],
            i = 1,
            result = [closest];
        while (!neighbours[i] || 
               closest.distance >= neighbours[i].distance - 0.2) {
            result.push(neighbours[i]);
            i++;
        }
        
        // Improve pathfinder
        if (result.length > 1) {
            var nextClosestNeighbours = [];
            result.forEach(function(n) {
                var next = this.grid.getNeighbours(n.tile);
                var nextNeighbours = [];
                next.forEach(function(nn) {
                    nextNeighbours.push({
                        tile : nn,
                        distance : nn.distanceTo(targetTile),
                        originNeighbour : n
                    });
                });
                
                this.sortNeighbours2(nextNeighbours, targetTile);
                
                
                nextClosestNeighbours.push(nextNeighbours[0]);
            }.bind(this));
            
            this.sortNeighbours2(nextClosestNeighbours, targetTile);
            closestTile = nextClosestNeighbours[0].originNeighbour.tile;
            /*
            var listNext = this.grid.getNeighbours(result[0].tile);
            var listNext2 = this.grid.getNeighbours(result[1].tile);
            this.sortNeighbours(listNext, targetTile);
            this.sortNeighbours(listNext2, targetTile);
            var closestNextTile = listNext[0];
            var closestNextTile2 = listNext2[0];
            var d1 = closestNextTile.distanceTo(targetTile);
            var d2 = closestNextTile2.distanceTo(targetTile);
            if (d1 < d2) {
                closestTile = result[0].tile;
            } else {
                closestTile = result[1].tile; 
            }*/
        } else {
            closestTile = result[0].tile;
        }
        
        
        
        /*this.sortNeighbours(tileNeighbours, targetTile);
        closestTile = tileNeighbours[0];*/
        
        return closestTile;
    }

    sortNeighbours(tiles, targetTile) {
        tiles.sort(function (tileA, tileB) {
            var distanceA = tileA.distanceTo(targetTile),
                distanceB = tileB.distanceTo(targetTile);
            return distanceA - distanceB;
        });
    }
        
    sortNeighbours2(neighbours) {
        neighbours.sort(function (neighbourA, neighbourB) {
            var distanceA = neighbourA.distance,
                distanceB = neighbourB.distance;
            return distanceA - distanceB;
        });
    }

};

export default PathFinding;