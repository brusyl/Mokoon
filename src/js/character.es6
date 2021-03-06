// jshint esversion:6

import * as THREE from "three";

import Debug from "./debug";
import PathFinding from "./pathfinding";
import GridPosition from "./grid-position";
import Team from "./team";

var Character = class {
	/**
	 * Create a dot.
	 * @param {number} x - The x value.
	 * @param {number} y - The y value.
	 * @param {number} width - The width of the dot, in pixels.
	 */
	constructor(options) {
        var settings = options ? options : {};
        
		this.gridPosition = new GridPosition(0, 0);
		if (settings.gridPosition) {
            this.gridPosition = options.gridPosition;
		}
        
        // Define team
        if (settings.team) {
            this.team = new Team(settings.team);
        } else {
            this.team = new Team(0);
        }

		this.mesh = null;
		this.grid = null;
        this.groundElevation_ = 0.6;

		// Set the rays : one vector for every potential direction
        this.ray = new THREE.Vector3(0, -1, 0);
		
		// And the "RayCaster", able to test for intersections
		this.raycaster = new THREE.Raycaster(undefined, undefined, 0, 1);
	}

	create(grid, selectable) {
		var geometry = new THREE.BoxGeometry(1, 1, 1),
			material = new THREE.MeshBasicMaterial({
				color: this.team.getColor(),
				wireframe: true
			}),
			scene = grid.scene,
			gPosition = grid.convertGridToPosition(this.gridPosition);

		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.x = gPosition.x;
		this.mesh.position.y = this.groundElevation_;
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
        
        var points = [];
        path.forEach(function(tile) {
            var pos = tile.mesh.position.clone();
            pos.y = this.groundElevation_;
            points.push(pos);
        }.bind(this));
        return new THREE.CatmullRomCurve3(points);
        
		
		// TODO : gerer le deplacement du personnage ici !
	}

	updateGridPosition() {
		//var position = this.getGridPosition();

        this.collision();
	}

	// Test and avoid collisions
	collision() {

		var collisions,
			// Get the obstacles array from our world
			obstacles = this.grid.getTilesMesh();
            
		
        // We reset the raycaster to this direction
        this.raycaster.set(this.mesh.position, this.ray);
        // Test if we intersect with any obstacle mesh
        collisions = this.raycaster.intersectObjects(obstacles);
        // And disable that direction if we do
        if (collisions.length > 0) {
            var id = collisions[0].object.tile.id;
            var split = id.split(",");
            this.grid.updateTileTeam(new GridPosition(split[0],split[1]), this.team);

            Debug.log("collision " + id);
        }

	}
};

export default Character;