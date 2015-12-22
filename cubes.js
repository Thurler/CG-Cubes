//Code for assignment 2 of Computer Graphics class

//----- Global Variables and Functions
var scene, camera, renderer; //Three.js variables
var width, height, aspect; //Window variables

var selected = -1; //Stores which cube is currently selected

var objects = [] //Stores instances of Cube class
var cubes = []; //Stores cubes in scene
var mousepos = new THREE.Vector2(); //Stores mouse position in normalized coords
var raycaster = new THREE.Raycaster();

function createCube(x, y, z){
	//Creates a cube centered at [x,y,z]
	var cube_geometry = new THREE.BoxGeometry(1, 1, 1);
	var cube_material = new THREE.MeshBasicMaterial({color: 0x9ADBF3});
	var line_material = new THREE.LineBasicMaterial({color: 0x7c7c7c});

	var object = new Cube();
	
	var cube = new THREE.Mesh(cube_geometry, cube_material);
	cube.position.set(x,y,z);
	cubes.push(cube);
	
	//Creates lines around cube for easily visualizing cubes
	//One mesh for upper face, another for lower, and another for sides
	
	var upperLines = object.genUpperLines(x,y,z);
	
	var lowerLines = object.genLowerLines(x,y,z);
	
	var side_line1_geometry = new THREE.Geometry();
	side_line1_geometry.vertices.push(new THREE.Vector3(x+0.5,y-0.5,z-0.5),
									  new THREE.Vector3(x+0.5,y-0.5,z+0.5));
	
	var side1 = new THREE.Line(side_line1_geometry, line_material);
	
	var side_line2_geometry = new THREE.Geometry();
	side_line2_geometry.vertices.push(new THREE.Vector3(x-0.5,y+0.5,z-0.5),
									  new THREE.Vector3(x-0.5,y+0.5,z+0.5));
	
	var side2 = new THREE.Line(side_line2_geometry, line_material);
	
	//Add things to scene
	scene.add(upperLines);
	scene.add(lowerLines);
	scene.add(side1);
	scene.add(side2);
	scene.add(cube);
	
	//Store cube in memory
	object.init(cube,[x,y,z],upperLines,lowerLines,side1,side2);
	objects.push(object)
}

//----- Main class that stores cube information

function Cube(){
	this.cube = null; //Stores cube mesh
	this.center = null; //Stores cube center
	this.upperLines = null; //Stores lines that surround upper face + a side line
	this.lowerLines = null; //Stores lines that surround lower face + a side line
	this.sideLine1 = null; //Stores a line that surrounds the side faces
	this.sideLine2 = null; //Stores a line that surrounds the side faces
}

Cube.prototype.init = function(cube, center, upLines, downLines, sideLine1, sideLine2){
	//Receives a cube mesh, a 3-coordinate vector and an array of line meshes
	this.cube = cube;
	this.center = center;
	this.upperLines = upLines;
	this.downLines = downLines;
	this.sideLine1 = sideLine1;
	this.sideLine2 = sideLine2;
}

Cube.prototype.genUpperLines = function(x, y, z){
	var line_material = new THREE.LineBasicMaterial({color: 0x7c7c7c});
	var upper_line_geometry = new THREE.Geometry();
	upper_line_geometry.vertices.push(new THREE.Vector3(x-0.5,y-0.5,z+0.5),
									  new THREE.Vector3(x-0.5,y+0.5,z+0.5),
									  new THREE.Vector3(x+0.5,y+0.5,z+0.5),
									  new THREE.Vector3(x+0.5,y-0.5,z+0.5),
									  new THREE.Vector3(x-0.5,y-0.5,z+0.5),
									  new THREE.Vector3(x-0.5,y-0.5,z-0.5));
	var tmp = new THREE.Line(upper_line_geometry, line_material);
	return tmp;
}

Cube.prototype.genLowerLines = function(x, y, z){
	var line_material = new THREE.LineBasicMaterial({color: 0x7c7c7c});
	var lower_line_geometry = new THREE.Geometry();
	lower_line_geometry.vertices.push(new THREE.Vector3(x+0.5,y+0.5,z-0.5),
									  new THREE.Vector3(x+0.5,y-0.5,z-0.5),
									  new THREE.Vector3(x-0.5,y-0.5,z-0.5),
									  new THREE.Vector3(x-0.5,y+0.5,z-0.5),
									  new THREE.Vector3(x+0.5,y+0.5,z-0.5),
									  new THREE.Vector3(x+0.5,y+0.5,z+0.5));
	var tmp = new THREE.Line(lower_line_geometry, line_material);
	return tmp;
}

Cube.prototype.deleteCube = function(){
	//Remove cube from data structures
	objects.splice(selected, 1);
	cubes.splice(selected, 1);
	
	//Remove cube and lines from scene
	scene.remove(scene.getObjectById(this.cube.id));
	scene.remove(scene.getObjectById(this.upperLines.id));
	scene.remove(scene.getObjectById(this.downLines.id));
	scene.remove(scene.getObjectById(this.sideLine1.id));
	scene.remove(scene.getObjectById(this.sideLine2.id));
	
	//Reset selected cube to none
	selected = -1;
}

//----- Main function calls

init();
animate();

function init(){

	//Create scene and set size
	scene = new THREE.Scene();
	
	width = window.innerWidth;
	height = window.innerHeight;
	aspect = width/height;
	
	// Create a renderer and add it to the DOM.
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
	
	//Set background color to light gray
	renderer.setClearColor(0xf1f1f1, 1);
	
	//Initializes camera
	camera = new THREE.PerspectiveCamera(45, aspect, 1, 10000);
	camera.position.z = 15;
	
	controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 20;
    controls.noZoom = true;
    controls.noPan = true;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.2;
	
	//Create a light source relative to camera's position
	//???
	
	//Add event listeners
	window.addEventListener('resize', onWindowResize, false);
	renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener('keydown', onKeyPress, false);
	
	//Draw 3 cubes at different positions
	for (i = -3; i < 5; i+=3){
		createCube(i,i,0)
	}
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
	controls.update()
	renderer.render(scene, camera)
}

//----- Event listeners

function onWindowResize() {
    //Resizes window accordingly
	width = window.innerWidth;
	height = window.innerHeight;
	aspect = width/height;
	
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function onMouseMove(event) {
	//Stores mouse position in each cycle and checks for intersections
	//If intersects an object, change color to darker blue
	mousepos.x = (event.clientX / width) * 2 - 1;
	mousepos.y = - (event.clientY / height) * 2 + 1;
	raycaster.setFromCamera(mousepos, camera);
	
	var intersections = raycaster.intersectObjects(cubes);
	for (i = 0; i < cubes.length; i++){
		if (i === selected) continue;
		cubes[i].material.color.setHex(0x9ADBF3);
	}
	if (intersections.length > 0){
		//Only the first intersection matters
		intersections[0].object.material.color.setHex(0x779EAC);
	}
}

function onMouseDown(event) {
	//Checks if left click was on top of an existing cube - select it if so
	//Creates a new cube on right click - if intersects with a cube, put in front
	
	event.preventDefault();
	raycaster.setFromCamera(mousepos, camera);
	var intersections = raycaster.intersectObjects(cubes);
	
	switch (event.button){
		case 0: //left click
			if (intersections.length > 0){
				//Store intersected cube
				var tmp = intersections[0].object;
				//Check which cub was intersected among all in the array
				for (i = 0; i < cubes.length; i++){
					if (cubes[i] === tmp){
						//Unselect it if it was previously selected
						if (selected === i){
							selected = -1;
							tmp.material.color.setHex(0x9ADBF3);
							break;
						}
						if (selected+1) cubes[selected].material.color.setHex(0x9ADBF3);
						selected = i;
					}
				}
			}
			break;

		case 2: //right click
			//We will always insert a new cube in the plane z=0, so we find the
			//world coordinates for the mouse click on that plane
			
			console.log("no")
			var vector = new THREE.Vector3();
			vector.set(mousepos.x, mousepos.y, 1);
			vector.unproject(camera);
			
			var dir = vector.sub(camera.position).normalize();
			var distance = -camera.position.z / dir.z;
			
			var pos = camera.position.clone().add(dir.multiplyScalar(distance));
			
			createCube(pos.x,pos.y,pos.z);
			
			break;
	}
}

function onMouseUp(event){}

function onKeyPress(event){
	//Handles keydown events for deleting the selected cube
	//Does so if pressed DEL or BACKSPACE
	
	if (!(selected+1)) return; //If nothing selected (selected is -1) do nothing

	if (event.which === 46 || event.which === 8){
		//Delete selected cube
		objects[selected].deleteCube();
	}
}