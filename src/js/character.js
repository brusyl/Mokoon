// jshint esversion:6
/*global MOON, THREE*/

var Character = class {
    /**
     * Create a dot.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} width - The width of the dot, in pixels.
     */
    constructor(options) {
        this.gridPosition = new MOON.GridPosition(0, 0);
        if (options && options.gridPosition) {
            this.gridPosition = options.gridPosition;
        }
        
        this.mesh = null;
        this.grid = null;
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
            x : 0.5 * (bbox.max.x - bbox.min.x),
            y : 0.5 * (bbox.max.z - bbox.min.z)
        };
    }
    
    moveTo(targetGridPosition) {
        var grid = this.grid,
            targetTile = grid.getTile(targetGridPosition),
            originTile = grid.getTile(this.gridPosition),
            position = grid.convertGridToPosition(targetGridPosition),
            pathFinding = new MOON.PathFinding(grid);
        
        this.gridPosition = targetGridPosition;
        
        var path = pathFinding.findPath(originTile, targetTile);
        MOON.Debug.log("moveTo", position);
        // TODO : gerer le deplacement du personnage ici !
        return position;
    }
};

MOON.Character = Character;