// jshint esversion:6

import * as THREE from "three";

import Debug from "./debug";
import GridPosition from "./grid-position";
import Color from "./color";

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
        this.color = new Color(0,0,0);
        this.team = null;
        this.tileSize = 1;
    }
    
    _createVertex(i) {
        var TAU = Math.PI * 2,
            angle = (TAU / 6) * i;
        
        return new THREE.Vector3((this.tileSize * Math.sin(angle)), (this.tileSize * Math.cos(angle)), 0);
	}

    create() {
        var activeWireframe = false;
        var height = 0,
            cGeometry = new THREE.CylinderGeometry(1, 1, height, 6),
            material = new THREE.MeshPhongMaterial({
                color: this.color.getHex(),
                wireframe: activeWireframe
            });
        
        // create base shape used for building geometry
        var i, verts = [];
        // create the skeleton of the hex
        for (i = 0; i < 6; i++) {
            verts.push(this._createVertex(i));
        }
        
        this.cellShape = new THREE.Shape();
        this.cellShape.moveTo(verts[0].x, verts[0].y);
        for (i = 1; i < verts.length; i++) {
            this.cellShape.lineTo(verts[i].x, verts[i].y);
        }
        this.cellShape.lineTo(verts[0].x, verts[0].y);
        this.cellShape.autoClose = true;
                
        var geometry = new THREE.ExtrudeGeometry(this.cellShape, {
            amount: 0.2,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.1,
            bevelSegments: 1,
            steps: 1
        });

        geometry.rotateX(Math.PI / 2);
        
        var cylinder = new THREE.Mesh(geometry, material);
		cylinder.geometry.computeBoundingBox();
        cylinder.tile = this;
		
        this.scene.add(cylinder);
        this.mesh = cylinder;
    }
    
    updateTileTeam(team) {
        this.color = team.getColor();
        this.team = team;
        
        this.mesh.material.color.setHex(this.color);
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