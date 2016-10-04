// jshint esversion:6

import * as THREE from "three";

import Debug from "./debug";
import PathFinding from "./pathfinding";
import GridPosition from "./grid-position";

var Character = class {
	/**
	 * Create a dot.
	 * @param {number} x - The x value.
	 * @param {number} y - The y value.
	 * @param {number} width - The width of the dot, in pixels.
	 */
	constructor(options) {
		this.gridPosition = new GridPosition(0, 0);
		if (options && options.gridPosition) {
			this.gridPosition = options.gridPosition;
		}

		this.mesh = null;
		this.grid = null;

		// Set the rays : one vector for every potential direction
		this.rays = [
		  new THREE.Vector3(0, 0, 1),
		  new THREE.Vector3(1, 0, 1),
		  new THREE.Vector3(1, 0, 0),
		  new THREE.Vector3(1, 0, -1),
		  new THREE.Vector3(0, 0, -1),
		  new THREE.Vector3(-1, 0, -1),
		  new THREE.Vector3(-1, 0, 0),
		  new THREE.Vector3(-1, 0, 1)
		];
		// And the "RayCaster", able to test for intersections
		this.raycaster = new THREE.Raycaster();
	}

	create(grid, selectable) {
		var geometry = new THREE.BoxGeometry(1, 1, 1),
			material = new THREE.MeshBasicMaterial({
				color: 0xff00ff,
				wireframe: true
			}),
			scene = grid.scene,
			gPosition = grid.convertGridToPosition(this.gridPosition);

		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.x = gPosition.x;
		this.mesh.position.y = gPosition.y;
		this.mesh.position.z = gPosition.z;

		scene.add(this.mesh);

		this.mesh.character = this;
		selectable.push(this.mesh);

		this.grid = grid;
	}

	getCenter() {
		var geometry = this.mesh.geometry,
			bbox = null;

		geometry.computeBoundingBox();
		bbox = geometry.boundingBox;

		return {
			x: 0.5 * (bbox.max.x - bbox.min.x),
			y: 0.5 * (bbox.max.z - bbox.min.z)
		};
	}

	moveTo(targetGridPosition) {
		var grid = this.grid,
			targetTile = grid.getTile(targetGridPosition),
			originTile = grid.getTile(this.gridPosition),
			position = grid.convertGridToPosition(targetGridPosition),
			pathFinding = new PathFinding(grid);

		this.gridPosition = targetGridPosition;

		var path = pathFinding.findPath(originTile, targetTile);
		Debug.log("moveTo", position);
		// TODO : gerer le deplacement du personnage ici !
		return path;
	}

	updateGridPosition() {
		var position = this.getGridPosition();

        //this.collision();
		if (position.toKey() !== this.gridPosition.toKey()) {
			this.gridPosition = position;
			this.grid.updateTileColor(this.gridPosition, 0x0000ff);

            
			Debug.log("updateGridPosition", position);
		}
	}

	getGridPosition() {
		var mesh = this.mesh,
			//vector = new THREE.Vector3(mesh.position.x, 0, mesh.position.z),
			position = this.grid.convertPositionToGrid(this.mesh.position);

		return position;
	}

	// Test and avoid collisions
	collision() {

		var collisions, i,
			// Get the obstacles array from our world
			//obstacles = this.grid.getTilesMesh(),
            tiles = this.grid.getTiles();
        
        var firstBB = new THREE.Box3().setFromObject(this.mesh);

        // For each ray
        for (var key in tiles) {
            var tile = tiles[key];
            
            var secondBB = new THREE.Box3().setFromObject(tile.mesh);
            var collision = firstBB.isIntersectionBox(secondBB);
            if (collision) {
                this.grid.updateTileColor(tile.getGridPosition(), 0x0000ff);
                console.log("collision");
                break;
            }
        }
		

        
        
		// For each ray
		/*for (i = 0; i < this.rays.length; i += 1) {
			// We reset the raycaster to this direction
			this.raycaster.set(this.mesh.position, this.rays[i]);
			// Test if we intersect with any obstacle mesh
			collisions = this.raycaster.intersectObjects(obstacles);
			// And disable that direction if we do
			if (collisions.length > 0) {
                console.log(collisions[0]);
				
			}
		}*/
	}
};

export default Character;