// jshint esversion:6
/* global window*/

import * as THREE from "three";
import * as io from "socket.io-client";
//import * as t from "./tween";
//import * as c from "./rtsCameraControl";
//import * as dat from "./dat.gui.min";

import Debug from "./debug";
import Grid from "./grid";
import Character from "./character";

var debug = new Debug();
Debug.mode(true);
Debug.log("0.0.1");

window.THREE = THREE;
//var socket = io.connect('http://localhost:3000');


var scene;
var renderer;
var mesh;
var controls;
var clock;
var gui;
var guiControls;
var controllerActive;
var currentFov;
var currentCameraRotation;
var raycaster;
var mouse = new THREE.Vector2(), INTERSECTED;
var selectable = [];
var direction;
var planes = [];
var DESTINATION;
var tween;
var distance;
var line;
var counter = 0;
var tangent = new THREE.Vector3();
var axis = new THREE.Vector3();
var up = new THREE.Vector3(0, 1, 0);
var grid;

function degreesToRadians(degrees) {

	return degrees * (Math.PI / 180);

}

var guiText = function() {

	// camera controls
	this.fov = currentFov;
	this.cameraAngle = currentCameraRotation;
	this.groundRotation = 0;
	
	// material controls
	this.solid = false;
	this.wireframe = false;
	// this.textured = false;
	
	this.explode = function() {
		// Define render logic ...
	};

};

function initGui() {
	
	gui = new dat.GUI();
	guiControls = new guiText();
	
	// fov
	var minFov = 30;
	var maxFov = 95;
	var fovController = gui.add(guiControls, 'fov', minFov, maxFov).listen();
	fovController.onChange(function(value) {
	
		camera.fov = value;
		camera.updateProjectionMatrix();
		
		controllerActive = false;
		
	});
	fovController.onFinishChange(function() {
	
		controllerActive = true;
		
	});
	
	// camera angle
	var minAngle = 0;
	var maxAngle = 90;
	var angleController = gui.add(guiControls, 'cameraAngle', minAngle, maxAngle);
	angleController.onChange(function(value) {
	
		camera.rotation.x = degreesToRadians(-value);
		camera.updateProjectionMatrix();
		
		controllerActive = false;
		
	});
	angleController.onFinishChange(function() {
	
		controllerActive = true;
		
	});
	
	// ground rotation
	var minGroundAngle = -180;
	var maxGroundAngle = 180;
	var groundAngleController = gui.add(guiControls, 'groundRotation', minGroundAngle, maxGroundAngle);
	groundAngleController.onChange(function(value) {
	
		mesh.rotation.z = degreesToRadians(-value);
		
		controllerActive = false;
		
	});
	groundAngleController.onFinishChange(function() {
	
		controllerActive = true;
		
	});
	
}

function initSampleSceneGeometry() {

	// dummy mesh to show something alive on the scene
	//var phongMaterial = new THREE.MeshPhongMaterial({
	//	overdraw: true,
	//	color: 0xCCCCCC
	//})

	// single directional light
	var light = new THREE.DirectionalLight(0xF6E86D, 1);
	light.position.set(1, 3, 2);
	scene.add(light);

	//var mgeometry = new THREE.CubeGeometry(100, 100, 100);
	//var mmaterial = new THREE.MeshBasicMaterial({
	//	color: 0x000000,
	//	wireframe: true,
	//	wireframeLinewidth: 2
	//});
	//mesh = new THREE.Mesh(mgeometry, phongMaterial);
	//mesh.position.y = 90;
	//scene.add(mesh);

	// ground plane
	//var wgeometry = new THREE.PlaneGeometry(1000, 1000, 25, 25);
	//var image = THREE.ImageUtils.loadTexture('./Resources/io_background.jpg'); // 2500x1400
 	// var wmaterial = new THREE.MeshBasicMaterial({
		// map: image
	// });
	//var wmaterial = new THREE.MeshBasicMaterial({
	//	color: 0x000000,
	//	wireframe: true,
	//	wireframeLinewidth: 1
	//});
	
	//var wireplane = new THREE.Mesh(wgeometry, phongMaterial);
	//wireplane.rotation.x = degreesToRadians(-90); // initially the plane is in the XY-plane
	//scene.add(wireplane);
	
	var geometry = new THREE.PlaneGeometry( 50, 50, 50, 50 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
	//var plane = new THREE.Mesh( geometry, material );
	//plane.rotation.x = degreesToRadians(-90); // initially the plane is in the XY-plane
	//scene.add( plane );
	
	//planes.push(plane);
	
	//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	//var material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} );
	//var cube = new THREE.Mesh( geometry, material );
	//cube.position.y = 1;
	//scene.add( cube );
    //selectable.push(cube);
    
    
    
    
	
    grid = new Grid(scene);
    grid.create();
    
    var character = new Character({
        team: 1
    });
    character.create(grid, selectable);
    
    /*var character2 = new Character({
        gridPosition : new GridPosition(2, 2)
    });
    character2.create(grid, selectable);
    */
    /*var tile = new Tile();
    tile.create(scene);
	
    var tile2 = new Tile();
    tile2.create(scene);
    
    tile2.movePosition();
*/
    
   /* var tile3 = new Tile();
    tile3.create(scene);
    
    tile3.mesh.position.x = 3.5;
    
    var tile4 = new Tile();
    tile4.create(scene);
    
    tile4.mesh.position.x = 0.85;
    tile4.mesh.position.z = 1.5;
    
    var tile5 = new Tile();
    tile5.create(scene);
    
    tile5.mesh.position.x = 2.6;
    tile5.mesh.position.z = 1.5;
	*/
}

/*function loadCustomModels() {
	
	var loader = new THREE.ColladaLoader();
	loader.load('Resources/models/ground.dae', function(result) {
		mesh = result.scene;
		mesh.rotation.x = degreesToRadians(-90);
	
		scene.add(mesh);
        Debug.log(mesh);
	});

}*/

function onWindowResize() {

	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

}

function init() {

	clock = new THREE.Clock();
	
	// renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0xcccccc, 1);
	document.body.appendChild(renderer.domElement);
	
	window.addEventListener('resize', onWindowResize, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );

	// camera
	currentFov = 45;
	var aspectRatio = window.innerWidth / window.innerHeight;
	var nearPlane = 10;
	var farPlane = 500;
	window.camera = new THREE.PerspectiveCamera(currentFov, aspectRatio, nearPlane, farPlane);
	// raise the camera a bit & rotate toward the ground
	currentCameraRotation = 45;
	camera.position.y = 25;
	camera.position.z = 25;
	camera.rotation.x = degreesToRadians(-currentCameraRotation);
		
	// control
	controls = new rtsCameraControl(camera);
	controls.moveSpeed = 1;
	controls.lookSpeed = 0.005;
	controllerActive = true;

	// scene & geometry
	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2(0x9DB3B5, 0.0005);

	// add some ambient lighting
    var ambientLight = new THREE.AmbientLight(0xCCCCCC);
    scene.add(ambientLight);
	
    // directional lighting
	var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
	directionalLight.position.set(0, 1, 0);
	scene.add(directionalLight);
	
	raycaster = new THREE.Raycaster();
	
	//direction = new THREE.Vector3(0.03, 0, 0.05);
	
}

function onDocumentMouseDown( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	raycaster.setFromCamera( mouse, camera );
	if (!INTERSECTED) {

        
        
		var intersects = raycaster.intersectObjects(selectable);
	
		if ( intersects.length > 0) {
			if ( INTERSECTED != intersects[ 0 ].object ) {
				if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
				INTERSECTED = intersects[ 0 ].object;
				INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
				INTERSECTED.material.color.setHex( 0xff0000 );
			} else {
				INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
				INTERSECTED = null;
			}
		} 
	} else {
        if (line) {
            scene.remove(line);
        }
		var projector = new THREE.Projector();
		var vector = new THREE.Vector3(mouse.x,mouse.y,1);
		projector.unprojectVector(vector,camera);
		raycaster.set(camera.position, vector.sub(camera.position).normalize());
		var intersect = raycaster.intersectObjects(grid.getTilesMesh());
		if (intersect.length > 0) {
			DESTINATION = new THREE.Vector3(intersect[0].point.x,1,intersect[0].point.z);
			var numPoints = 50;

            var speed = 0.05;
            

            /*spline = new THREE.CatmullRomCurve3([
			    INTERSECTED.position,
			    DESTINATION]);
            */

            //spline = new THREE.CatmullRomCurve3([
			 //   INTERSECTED.position,
			  //  DESTINATION]);

            //var gPosition = grid.convertPositionToGrid(DESTINATION);
            
            var gPosition = intersect[0].object.tile.position;
            
            Debug.log(INTERSECTED.character);
            
            var spline = null;
            if (INTERSECTED.character) {
                var character = INTERSECTED.character;
                spline = character.moveTo(gPosition);
                
                //spline = new THREE.CatmullRomCurve3([
			    //INTERSECTED.position,
			    //moveTo]);
            }
            
            
            //var cPosition = grid.convertGridToPosition(gPosition);
            //var test = new THREE.Vector3(cPosition.x,1,cPosition.z);
            
            //spline = new THREE.CatmullRomCurve3([
			  //  INTERSECTED.position,
			    //test]);
            
            
                distance = spline.getLength();
           numPoints = distance / speed;

			    var material = new THREE.LineBasicMaterial({
				color: 0xff00f0,
			    });

			    var geometry = new THREE.Geometry();
			    var splinePoints = spline.getPoints(numPoints);

			    for (var i = 0; i < splinePoints.length; i++) {
				geometry.vertices.push(splinePoints[i]);
			    }

			    line = new THREE.Line(geometry, material);
			    scene.add(line);
            
counter = 0;


			
			//INTERSECTED.lookAt(DESTINATION);

			//distance = DESTINATION.distanceTo(INTERSECTED.position);

			/*var pos = INTERSECTED.position.clone();
			
			tween = new TWEEN.Tween(pos)
					.to(DESTINATION, 20)
					//.delay(1000)
					.easing(TWEEN.Easing.Elastic.InOut)
					.onUpdate(function(){
				pos.y = 1;
				INTERSECTED.position.add(pos);
			});
					
			
			tween.onComplete(function() { 
				tween = null;
			});
			
			tween.start();
			*/
			//direction = new THREE.Vector3((DESTINATION.x - INTERSECTED.position.x), 0, (DESTINATION.z - INTERSECTED.position.z));
			
			
		}
			
			//INTERSECTED.position.set(intersect[0].point.x,1,intersect[0].point.z);
		
		
		/*var intersects = raycaster.intersectObjects(planes);
		if (intersects[ 0 ]) {
			DESTINATION = intersects[ 0 ].point;
			INTERSECTED.position.add(DESTINATION);
		}
		//direction = new THREE.Vector3(mouse.x, 0, -mouse.y);
		INTERSECTED.position.add(DESTINATION);*/
	}
	
	
}

function animate(time) {

	if ( INTERSECTED && line) {
        var points = line.geometry.vertices;
        
        if (counter < (points.length - 1)) {
            INTERSECTED.position.copy(points[counter]);
            INTERSECTED.lookAt(points[counter + 1]);
			INTERSECTED.character.updateGridPosition();
            counter++;
        } else {
            scene.remove(line);
            //line.remove();
            line = null;
        }
        
        
        /*if (counter >= 1) {
          counter = 0; 
      }  
        // add up to position for movement
      counter += 0.1;

      // get the point at position
      var point = spline.getPointAt(counter);
      //INTERSECTED.position.copy(point);  
      INTERSECTED.position.x = point.x;
      INTERSECTED.position.z = point.z;
*/
      //var angle = getAngle(counter);
      // set the quaternion
      //INTERSECTED.quaternion.setFromAxisAngle( up, angle );
       
        
	//if (counter <= line.geometry.vertices.length) {
        
        
        
        //var point = spline.getPointAt(counter);
		//INTERSECTED.position.copy( spline.getPointAt(counter) );
        
       // INTERSECTED.lookAt(spline.getPointAt(counter));

		/*tangent = spline.getTangentAt(counter).normalize();

		axis.crossVectors(up, tangent).normalize();

		var radians = Math.acos(up.dot(tangent));

		INTERSECTED.quaternion.setFromAxisAngle(axis, radians);
*/
		//counter += 0.0005;
	    //} else {
		//counter = 0;
//}
		//tween.update(time);
		/*var distance = DESTINATION.distanceTo(INTERSECTED.position);
		var speed = 5;
		var direction2 = direction.clone();
		direction2.multiplyScalar((speed / distance) * clock.getDelta());
		INTERSECTED.position.add(direction2);*/
		//INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
		//var speed = 0.5;
		//INTERSECTED.translateZ(distance *  clock.getDelta() * speed);
	}

	renderer.render(scene, camera);
	controls.update(clock.getDelta(), controllerActive);
	//guiControls.fov = camera.fov;
	requestAnimationFrame(animate);

}

function drawPath() {
  var point, shapes = path.toShapes();
  shape = shapes[0];
  var vertices = path.getSpacedPoints(20);

  // Change 2D points to 3D points
  for (var i = 0; i < vertices.length; i++) {
    point = vertices[i];
    vertices[i] = new THREE.Vector3(point.x, point.y, 0);
  }
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices = vertices;
  var lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff
  });
  var line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
}

function getAngle( position ){
    
    
// get the 2Dtangent to the curve
  var tangent = spline.getTangent(position).normalize();

  // change tangent to 3D
  angle = - Math.atan( tangent.x / tangent.z);
  
  return angle;
}

function run() {

	init();
	//initGui();
	initSampleSceneGeometry();
	//loadCustomModels();
	animate();

}

run();