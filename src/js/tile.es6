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
        
		cylinder.geometry.computeBoundingBox();
		
        this.scene.add(cylinder);
        
        cylinder.tile = this;
        
        this.mesh = cylinder;
    }
    
    getWidth() {
		var bBox = this.mesh.geometry.boundingBox;
        
        return bBox.max.x - bBox.min.x;
    }
    
    getHeight() {
		var bBox = this.mesh.geometry.boundingBox;
        
        return bBox.max.z - bBox.min.z;
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
    
    getId() {
        return this.id;
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
    
    distanceTo(targetTile) {
        return this.mesh.position.distanceTo(targetTile.mesh.position);
    }
};

export default Tile;