// jshint esversion:6

import * as THREE from "three";

import Debug from "./debug";
import GridPosition from "./grid-position";

/**
 * Class representing a dot.
 * @extends Point
 */
var Tile = class {
    /**
     * Create a dot.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} width - The width of the dot, in pixels.
     */
    constructor(scene, options) {
        this.scene = scene;
        this.mesh = null;
        this.position = options.position;
        this.id = this.position.toKey();
    }

    create() {
        var height = 0,
            geometry = new THREE.CylinderGeometry(1, 1, height, 6),
            material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true
            }),
            cylinder = new THREE.Mesh(geometry, material);
        
        this.scene.add(cylinder);
        
        cylinder.tile = this;
        
        this.mesh = cylinder;
    }
    
    getWidth() {
        var vertices = this.mesh.geometry.vertices,
            xMin = 0,
            xMax = 0;
        
        vertices.forEach(function (vertice) {
            if (xMin > vertice.x) {
                xMin = vertice.x;
            } else if (xMax < vertice.x) {
                xMax = vertice.x;
            }
        });
        
        return xMax - xMin;
    }
    
    getHeight() {
        var vertices = this.mesh.geometry.vertices,
            zMin = 0,
            zMax = 0;
        
        vertices.forEach(function (vertice) {
            if (zMin > vertice.z) {
                zMin = vertice.z;
            } else if (zMax < vertice.z) {
                zMax = vertice.z;
            }
        });
        
        return zMax - zMin;
    }
    
    movePosition() {
        var width = this.getWidth(),
            height = this.getHeight(),
            row = this.position.row,
            column = this.position.column;
        
        if (row % 2 !== 0) {
            this.mesh.position.x = column * width + (width / 2);
        } else {
            this.mesh.position.x = column * width;
        }

        this.mesh.position.z = row * height * 0.75;

        Debug.log("Tile position (ROW : " + this.mesh.position.z +
                       ", COLUMN : " + this.mesh.position.x + ") " +
                      this.position.toKey());
    }
    
    getCenter() {
        var geometry = this.mesh.geometry,
            bbox = null;
        
        geometry.computeBoundingBox();
        bbox = geometry.boundingBox;
       
        return {
            x : 0.5 * (bbox.max.x - bbox.min.x),
            y : 0.5 * (bbox.max.z - bbox.min.z)
        };
    }
    
    getPosition() {
        return this.mesh.position;
    }
    
    getGridPosition() {
        var pos = this.position,
            result = new GridPosition(pos.row, pos.column, pos.height);
        
        return result;
    }
    
    distance(targetTile) {
        var pos = this.position,
            result = new GridPosition(pos.row, pos.column, pos.height);
        
        return result;
    }
};

export default Tile;