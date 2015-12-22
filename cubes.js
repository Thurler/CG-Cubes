//Code for assignment 2 of Computer Graphics class

//Global Variables
var scene, camera, renderer;
var width, height, aspect;
var cubes = []; //Stores cubes in scene

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
	var line_material = new THREE.LineBasicMaterial({color: 0x999999});
	var upper_line_geometry = new THREE.Geometry();
	upper_line_geometry.vertices.push(new THREE.Vector3(i-0.5,i-0.5,0.5),
									  new THREE.Vector3(i-0.5,i+0.5,0.5),
									  new THREE.Vector3(i+0.5,i+0.5,0.5),
									  new THREE.Vector3(i+0.5,i-0.5,0.5),
									  new THREE.Vector3(i-0.5,i-0.5,0.5),
									  new THREE.Vector3(i-0.5,i-0.5,-0.5));
	var tmp = new THREE.Line(upper_line_geometry, line_material);
	return tmp;
}

Cube.prototype.genLowerLines = function(x, y, z){
	var line_material = new THREE.LineBasicMaterial({color: 0x999999});
	var lower_line_geometry = new THREE.Geometry();
	lower_line_geometry.vertices.push(new THREE.Vector3(i+0.5,i+0.5,-0.5),
									  new THREE.Vector3(i+0.5,i-0.5,-0.5),
									  new THREE.Vector3(i-0.5,i-0.5,-0.5),
									  new THREE.Vector3(i-0.5,i+0.5,-0.5),
									  new THREE.Vector3(i+0.5,i+0.5,-0.5),
									  new THREE.Vector3(i+0.5,i+0.5,0.5));
	var tmp = new THREE.Line(lower_line_geometry, line_material);
	return tmp;
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
	
	//Draw first few cubes
	var cube_geometry = new THREE.BoxGeometry(1, 1, 1);
	var cube_material = new THREE.MeshBasicMaterial({color: 0x9ADBF3});
	var line_material = new THREE.LineBasicMaterial({color: 0x999999});
	
	//Draw 3 cubes at different positions
	for (i = -3; i < 5; i+=3){
		var object = new Cube();
		
		var cube = new THREE.Mesh(cube_geometry, cube_material);
		cube.position.set(i,i,0); //Position depends on instance of for loop
		
		//Creates lines around cube for easily visualizing cubes
		//One mesh for upper face, another for lower, and another for sides
		
		var upperLines = object.genUpperLines(i,i,0);
		
		var lowerLines = object.genLowerLines(i,i,0);
		
		var side_line1_geometry = new THREE.Geometry();
		side_line1_geometry.vertices.push(new THREE.Vector3(i+0.5,i-0.5,-0.5),
										  new THREE.Vector3(i+0.5,i-0.5,0.5));
		
		var side1 = new THREE.Line(side_line1_geometry, line_material);
		
		var side_line2_geometry = new THREE.Geometry();
		side_line2_geometry.vertices.push(new THREE.Vector3(i-0.5,i+0.5,-0.5),
										  new THREE.Vector3(i-0.5,i+0.5,0.5));
		
		var side2 = new THREE.Line(side_line2_geometry, line_material);
		
		//Add things to scene
		scene.add(cube);
		scene.add(upperLines);
		scene.add(lowerLines);
		scene.add(side1);
		scene.add(side2);
		
		//Store cube in memory
		object.init(cube,[i,i,0],upperLines,lowerLines,side1,side2);
		cubes.push(object)
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