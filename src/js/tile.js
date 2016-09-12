/*global MOON*/
(function () {
    "use strict";
    var Tile = function (scene, options) {
        this.scene = scene;
        this.mesh = null;
        this.position = options.position;
        this.id = this.position.toKey();
    };

    Tile.prototype.create = function () {
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
    };
    
    Tile.prototype.getWidth = function () {
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
    };
    
    Tile.prototype.getHeight = function () {
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
    };
    
    Tile.prototype.movePosition = function () {
        var width = this.getWidth(),
            height = this.getHeight(),
            row = this.position.row,
            column = this.position.column;
        
        if (column % 2 === 0) {
            this.mesh.position.x = row * width;
        } else {
            this.mesh.position.x = row * width + (width / 2);
        }
        
        this.mesh.position.z = column * (height * 0.75);
    };
    
    Tile.prototype.getCenter = function () {
        var geometry = this.mesh.geometry,
            bbox = null;
        
        geometry.computeBoundingBox();
        bbox = geometry.boundingBox;
       
        return {
            x : 0.5 * (bbox.max.x - bbox.min.x),
            y : 0.5 * (bbox.max.z - bbox.min.z)
        };
    };
    
    Tile.prototype.getPosition = function () {
        return this.mesh.position;
    };
    
    Tile.prototype.getGridPosition = function () {
        var pos = this.position,
            result = new MOON.GridPosition(pos.row, pos.column, pos.height);
        
        return result;
    };
    
    Tile.prototype.distance = function (targetTile) {
        var pos = this.position,
            result = new MOON.GridPosition(pos.row, pos.column, pos.height);
        
        return result;
    };
    

    
    MOON.Tile = Tile;
}());