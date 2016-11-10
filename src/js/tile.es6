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
        var material = new THREE.MeshPhongMaterial({
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
        
        var buffer = new THREE.BufferGeometry();
        buffer.fromGeometry(geometry);
        
        var mesh = new THREE.Mesh(buffer, material);
		mesh.geometry.computeBoundingBox();
        mesh.tile = this;
		
        this.scene.add(mesh);
        this.mesh = mesh;
    }
    
    destroy() {
        this.scene.remove(this.mesh);
    }
    
    updateTileTeam(team) {
        this.color = team.getColor();
        this.team = team;
        
        this.shaderMaterial.uniforms.glowColor.value = team.getRawColor();
        this.mesh.material.setValues({
            color : this.color
        });
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
        
        
        // TODO : ameliorer
        
        var shader1 = this.getShader();
        shader1.side = THREE.FrontSide;
        shader1.blending = THREE.AdditiveBlending;
        shader1.transparent = true;
        var customMaterial = new THREE.ShaderMaterial(shader1);
         
		
        var glow = new THREE.Mesh(this.mesh.geometry.clone(), customMaterial.clone() );
        glow.position.x = this.mesh.position.x;
        glow.position.y = this.mesh.position.y;
        glow.position.z = this.mesh.position.z;
        glow.scale.multiplyScalar(1.1);
        this.scene.add(glow);

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
    
    
    getShader() {
        this.shaderMaterial = {
				        
            uniforms : {
                c:   { type: "f", value: 1.0 },
			    p:   { type: "f", value: 1.4 },
                glowColor: { type: "c", value: new THREE.Color(0xffffff) },
                viewVector: { type: "v3", value: camera.position }
			},

            vertexShader: [
                'uniform vec3 viewVector;',
                'uniform float c;',
                'uniform float p;',
                'varying float intensity;',
                'void main()',
                '{',
                    'vec3 vNormal = normalize( normalMatrix * normal );',
                    'vec3 vNormel = normalize( normalMatrix * viewVector );',
                    'intensity = pow( c - dot(vNormal, vNormel), p );',

                    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                '}'
            ].join( "\n" ),

            fragmentShader: [ 	
                'uniform vec3 glowColor;',
                'varying float intensity;',
                'void main()',
                '{',
                    'vec3 glow = glowColor * intensity;',
                    'gl_FragColor = vec4( glow, 1.0 );',
                '}'

            ].join( "\n" )
        };
        
        return this.shaderMaterial;
    }
};

export default Tile;