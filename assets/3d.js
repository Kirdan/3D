
puzzle = 'puzzle.jpg';
puzzle_img = new Image();
puzzle_img.src = puzzle;
original = 'original.jpg';
original_img = new Image();
original_img.src = original;

original_time_interval = 30;
var NOW = new Date();
var RELEASE_TIME = new Date();
RELEASE_TIME.setMinutes(RELEASE_TIME.getMinutes() + original_time_interval);

var originalTexture;
var UP_TIME = 600;
var DOWN_TIME = 600;
var SPIN_TIME = 600;
var DIMENTIONS =560;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
var gift;
var sphere;
var UNLOCKED = false;

raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var c = 4;
var R = 19;
var Z = -4;

var reveal_sequance = [0, 24, 4, 20, 12, 10, 14, 2, 22, 5, 19, 15, 9, 21, 3, 1, 23, 6, 18, 8, 16, 7, 17, 11, 13];

THREE.ImageUtils.crossOrigin = '';

var texture = new THREE.TextureLoader().load( puzzle_img.src );

var material1 =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( puzzle_img.src ) });
var material2 =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( puzzle_img.src ) });
var material3 =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( puzzle_img.src ) });
var material4 =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( puzzle_img.src ) });
var material5 =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( puzzle_img.src ) });
var material6 =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( original_img.src ) });

var materials = [material1, material2, material3, material4, material5, material6];
var meshFaceMaterial = new THREE.MeshFaceMaterial( materials );

var material = new THREE.MeshBasicMaterial( { map: texture } );
var spheregeometry =  new THREE.SphereGeometry( 20, 32, 16 );
var giftbox;
var giftcover;
var vectors = [];
var original_vectors = [];
var cubes = [];
var final_coordinates = [];
var initial_coordinates = [];
var distances = [];
var coors = [1,1,1];

var faces = [[0, 90 * Math.PI / 180, 90 * Math.PI / 180],
             [0, 270 * Math.PI / 180, 90 * Math.PI / 180],
             [0,  0 * Math.PI / 180, 90 * Math.PI / 180],
             [90 * Math.PI / 180, 0, 90 * Math.PI / 180],
             [-90 * Math.PI / 180, 0, 90 * Math.PI / 180]];

var fullFace = [0, 180 * Math.PI / 180, -90 * Math.PI / 180];


$( document ).ready( function() {
   originalTexture = new THREE.TextureLoader().load( original_img.src );

  $.when(loadOriginal())
    .then(initVectors())
    .then(init())
    .then($('#3d-content').removeClass('initiallyInvisible'));
});

function loadOriginal() {
   originalTexture = new THREE.TextureLoader().load( original_img.src );
}

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xf0f0f0 );
function init() {
  DIMENTIONS = $("#3d-content").width();
  renderer.setSize( DIMENTIONS, DIMENTIONS );
  document.getElementById("3d-content").innerHTML = '';
  renderer.domElement.style.opacity = 0;
  document.getElementById("3d-content").appendChild(renderer.domElement);
  renderer.domElement.style.opacity = 1;
  initSphere();
  initDistances();
  initInitialCoordinates();
  initFinalCoordinates();
  stackupCubes();
  camera.position.z = c;
  renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
  render();
}


  function initVectors() {
    for (var j = 0; j < 8; j++) {
      for (var i = 0; i < 8; i++) {
        vectors[j*8 + i] = [new THREE.Vector2(i/8, j/8), new THREE.Vector2((i+1)/8, j/8), new THREE.Vector2((i+1)/8, (j+1)/8), new THREE.Vector2(i/8, (j+1)/8)];
      }
    }

    for (var j = 0; j < 5; j++) {
      for (var i = 0; i < 5; i++) {
         original_vectors[j*5 + i] = [new THREE.Vector2(i/5, 1 - (j+1)/5), new THREE.Vector2((i+1)/5, 1 - (j+1)/5),  new THREE.Vector2((i+1)/5, 1 - j/5), new THREE.Vector2(i/5, 1 - j/5)];
      }
    }
  }

  function initSphere() {
      textureUrl = 'blue-texture-circle.jpg';
      changeSphereBackground(textureUrl);
  }


  function changeSphereBackground(textureUrl) {
	  scene.remove(sphere);
	  var textureLoader = new THREE.TextureLoader();
	  textureLoader.crossOrigin = 'anonymous';
	  textureLoader.load(
		// resource URL
		textureUrl,
		// Function when resource is loaded
		function ( sphereTexture ) {
    // map the texture to a sphere
		var sphereMaterial = new THREE.MeshBasicMaterial( { map: sphereTexture } );
		sphereMaterial.side = THREE.BackSide;
		sphereMaterial.transparent = true;
		sphereMaterial.opacity = 0.55;
    sphere = new THREE.Mesh( spheregeometry, sphereMaterial );
    scene.add(sphere);
		},
		// Function called when download progresses
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		// Function called when download errors
		function ( xhr ) {
			console.log( 'An error happened' );
			console.log( xhr );
			console.log( xhr.detail );
		}
	  );
  }


  function rotateSphere(){
	  if(!sphere)
		  return;

      var theta = 0.0005;

      sphere.rotation.x += theta;
      sphere.rotation.y += theta;
      sphere.rotation.z += theta;
  }


  function initInitialCoordinates() {
      var i = 0;
      for (var y = 1; y > -1; y -= .2) {
        for(var x = -0.6; x < 0.8; x += .28) {
          initial_coordinates[i] = [x, y, -13];
          i++;
        }
      }
  }


  function initFinalCoordinates() {
    var i = 0;
    for (var y = 2; y > -3; y--) {
      for(var x = -2; x < 3; x++) {
        final_coordinates[i] = [x, y, 0];
        i++;
      }

    }

  }

  function initDistances() {
    for  (var y = 0; y < 5; y++){
      for  (var x = 0; x < 5; x++){
        distances[y*5 + x] = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
      }
    }
  }

  function getRandomSet(n,m) {
    var arr = [];
    while(arr.length < n){
      var randomnumber=Math.floor(Math.random()*m)
      var found = false;
      for(var i=0; i<arr.length; i++){
        if(arr[i]==randomnumber){found=true;break}
      }

      if(!found) {
        arr[arr.length]=randomnumber;
      }
    }
    return arr;
  }

  function createGeometry(original_index) {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    geometry.faceVertexUvs[0] = [];

    for (var i = 0; i < 10; i += 2) {

      var vector = Math.round(Math.random()*63);

      geometry.faceVertexUvs[0][i] = [ vectors[vector][0], vectors[vector][1], vectors[vector][3] ];
      geometry.faceVertexUvs[0][i + 1] = [ vectors[vector][1], vectors[vector][2], vectors[vector][3] ];

    }

    geometry.faceVertexUvs[0][10] = [ original_vectors[original_index][0], original_vectors[original_index][1], original_vectors[original_index][3]];
    geometry.faceVertexUvs[0][11] = [ original_vectors[original_index][1], original_vectors[original_index][2], original_vectors[original_index][3]];

    return geometry;
  }


  function initCube(i) {

      cubes[i] = new THREE.Mesh( createGeometry(i), meshFaceMaterial );

      cubes[i].position.x = 0;
      cubes[i].position.y = initial_coordinates[i][1];
      cubes[i].position.z = initial_coordinates[i][2];
      cubes[i].rotation.z = 90 * Math.PI / 180;
      cubes[i].rotation.x = 25 * Math.PI / 180;
      cubes[i].rotation.y = 75 * Math.PI / 180;

      scene.add(cubes[i]);

  }

  function kickGrid(anchor) {
    for (var i = 0; i < 25; i++) {
      cueCube(anchor, i);
    }

    RELEASE_TIME.setMinutes(RELEASE_TIME.getMinutes() - 2);
  }


 function cueCube(anchor, current) {

  var deltaX = Math.abs(final_coordinates[anchor][0] - final_coordinates[current][0]);
  var deltaY = Math.abs(final_coordinates[anchor][1] - final_coordinates[current][1]);
  var delta_wait = distances[deltaY * 5 + deltaX] * 200;

  setTimeout(() => kickCube(current), delta_wait);

 }


  function kickCube(i) {

    var z_stick = 0;
    face = getFace(i);

    if(face == fullFace) z_stick = 0.1;

    var down = new TWEEN.Tween( cubes[i].position )
            .to( { x: final_coordinates[i][0]*(1 + Math.abs(Z)/c), y: final_coordinates[i][1]*(1 + Math.abs(Z)/c), z: Z }, DOWN_TIME )
            .easing( TWEEN.Easing.Exponential.InOut ).start();

    var down_rotate = new TWEEN.Tween( cubes[i].rotation )
            .to( { x: 1 , y: 2, z: -10 }, DOWN_TIME )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

    var mid = new TWEEN.Tween( cubes[i].position )
            .to( { x: final_coordinates[i][0]*(1 + Math.abs(Z)/c), y: final_coordinates[i][1]*(1 + Math.abs(Z)/c), z: Z }, SPIN_TIME )
            .easing( TWEEN.Easing.Exponential.InOut );


    var mid_spin = new TWEEN.Tween( cubes[i].rotation )
            .to( { x: 2 , y: -1, z: 2 }, SPIN_TIME )
            .easing( TWEEN.Easing.Exponential.InOut );


    var up = new TWEEN.Tween( cubes[i].position )
            .to( { x: final_coordinates[i][0], y: final_coordinates[i][1], z: z_stick }, UP_TIME )
            .easing( TWEEN.Easing.Exponential.InOut );

    var up_rotate = new TWEEN.Tween( cubes[i].rotation )
            .to( { x: face[0] , y: face[1] , z: face[2] }, UP_TIME )
            .easing( TWEEN.Easing.Exponential.InOut );

    down.chain(mid);
    mid.chain(up);

    down_rotate.chain(mid_spin);
    mid_spin.chain(up_rotate);
  }

  function stackupCubes() {
    var CLIMB_UP_TIME = 500;
    var CLIMB_DOWN_TIME = 500;

    for (var i = 24; i > -1; i--) {
      stackupCube(i);
    }
  }

  function stackupCube(i) {

    var CLIMB_UP_TIME = 600;
    var CLIMB_MID_TIME = 600;
    var CLIMB_DOWN_TIME = 600;

    var z_stick = 0;

    face = getFace(i);
    if(face == fullFace) z_stick = 0.1;

      initCube(i);

        var climb_up = new TWEEN.Tween( cubes[i].position )
              .to( { x: final_coordinates[i][0]*3, y: final_coordinates[i][1] + 9, z: -10 }, CLIMB_UP_TIME )
              .easing( TWEEN.Easing.Exponential.InOut ).start();

        var climb_mid = new TWEEN.Tween( cubes[i].position )
              .to( { x: final_coordinates[i][0], y: 10, z: -11 }, CLIMB_MID_TIME )
              .easing( TWEEN.Easing.Exponential.InOut );

        var climb_down = new TWEEN.Tween( cubes[i].position )
              .to( { x: final_coordinates[i][0], y: final_coordinates[i][1], z: z_stick }, CLIMB_DOWN_TIME )
              .easing( TWEEN.Easing.Exponential.InOut );


        var climb_up_spin = new TWEEN.Tween( cubes[i].rotation )
              .to( { x: 2.5 , y: 2.5, z: 2.5 }, CLIMB_UP_TIME )
              .easing( TWEEN.Easing.Exponential.InOut ).start();

        var climb_mid_spin = new TWEEN.Tween( cubes[i].rotation )
              .to( { x: 5 , y: 5, z: 5 }, CLIMB_MID_TIME )
              .easing( TWEEN.Easing.Exponential.InOut )

        var climb_down_spin = new TWEEN.Tween( cubes[i].rotation )
               .to( { x: face[0] , y: face[1] , z: face[2] }, CLIMB_DOWN_TIME )
              .easing( TWEEN.Easing.Exponential.InOut );

       climb_up.chain(climb_mid);
       climb_mid.chain(climb_down)
       climb_up_spin.chain(climb_mid_spin);
       climb_mid_spin.chain(climb_down_spin);

  }

  function getFace(i) {

      if(UNLOCKED) {
        return fullFace;
      }

      var progress = getProgress();
      var position = getCubeProgressPosition(i)/24;

      if(position < progress){
        return fullFace;
      } else {
        return faces[Math.round(Math.random() * 4)];
      }

  }

  document.addEventListener( 'mousedown', onDocumentMouseDown, false );

  function onDocumentMouseDown(event) {

    mouse.x = ( (event.clientX - $("#3d-content").offset().left) / DIMENTIONS) * 2 - 1;
    mouse.y = - ( (event.clientY - $("#3d-content").offset().top + $(window).scrollTop()) / DIMENTIONS) * 2 + 1;
    mouse.z = 1;

    touchCube();

  }

  function touchCube() {
      raycaster.setFromCamera( mouse, camera , {far: 15});
      var intersects = raycaster.intersectObjects( cubes );

      if(intersects.length > 0) {

          if(cubes[cubes.indexOf(intersects[0].object)].position.z >= 0) {
            kickGrid(cubes.indexOf(intersects[0].object));
          }
      }
  }


  function unlock() {
    UNLOCKED = true;
    kickGrid(0);
  }

  function getProgress(){
    var diff_time = (RELEASE_TIME.getTime() - NOW.getTime())/1000;
    var time_progress = 1 - diff_time / original_time_interval;
    return time_progress;
  }

  function getCubeProgressPosition(i) {
      return reveal_sequance.indexOf(i);
  }

  function render() {
    requestAnimationFrame( render );
    rotateSphere();
    TWEEN.update();
    renderer.render( scene, camera );
  }
