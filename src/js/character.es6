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

		if (position.toKey() !== this.gridPosition.toKey()) {
			this.gridPosition = position;
			this.grid.updateTileColor(this.gridPosition, 0x0000ff);

			Debug.log("updateGridPosition", position);
		}
	}

	getGridPosition() {
		var mesh = this.mesh,
			vector = new THREE.Vector3(mesh.position.x, 0, mesh.position.z),
			position = this.grid.convertPositionToGrid(vector);

		return position;
	}

	// Test and avoid collisions
	collision() {

		var collisions, i,
			// Maximum distance from the origin before we consider collision
			distance = 32,
			// Get the obstacles array from our world
			obstacles = basicScene.world.getObstacles();
		// For each ray
		for (i = 0; i < this.rays.length; i += 1) {
			// We reset the raycaster to this direction
			this.caster.set(this.mesh.position, this.rays[i]);
			// Test if we intersect with any obstacle mesh
			collisions = this.caster.intersectObjects(obstacles);
			// And disable that direction if we do
			if (collisions.length > 0 && collisions[0].distance <= distance) {
				// Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
				if ((i === 0 || i === 1 || i === 7) && this.direction.z === 1) {
					this.direction.setZ(0);
				} else if ((i === 3 || i === 4 || i === 5) && this.direction.z === -1) {
					this.direction.setZ(0);
				}
				if ((i === 1 || i === 2 || i === 3) && this.direction.x === 1) {
					this.direction.setX(0);
				} else if ((i === 5 || i === 6 || i === 7) && this.direction.x === -1) {
					this.direction.setX(0);
				}
			}
		}
	}
};

export default Character;