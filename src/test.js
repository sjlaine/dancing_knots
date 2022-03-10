var camera, scene, renderer, controls;
var cubes = [];
var drag_obj =[];
var links = [];
var dragControls;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(1, 1, 1).setLength(15);
camera.lookAt(scene.position);

renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
controls = new THREE.OrbitControls(camera, renderer.domElement);
var plane = new THREE.GridHelper(10,20);
scene.add(plane);

var cube1 = createCube("red");
var cube2 = createCube("green");
var cube3 = createCube("blue");
//scene.matrixAutoupdate = false;
init();
animate();

function init() {
  dragControls = new THREE.DragControls(drag_obj, camera, renderer.domElement);
  dragControls.transformRoot = true;
  dragControls.addEventListener('dragstart', function(event) {
    controls.enabled = false;
  });
  dragControls.addEventListener('dragend', function(event) {
    controls.enabled = true;
  });

}
function createCube(color) {
  var cubegeom = new THREE.BoxGeometry(1, 1, 1);
   var edgeGeo = new THREE.EdgesGeometry(cubegeom);
   let material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: 1
});
let lines_mesh = new THREE.LineSegments(edgeGeo, material);
  var cube = new THREE.Mesh(cubegeom, new THREE.MeshBasicMaterial({
    color: color
  }));
  cube.add(lines_mesh);
  setRandomPosition(cube);
  scene.add(cube);
  cubes.push(cube);
  return cube;
}
var raycaster, mouse = { x : 0, y : 0 };
raycaster = new THREE.Raycaster();
window.addEventListener( 'mousedown', raycast, false );
var INTERSECTED;

function setRandomPosition(obj) {
  obj.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}


function render() {
  renderer.render(scene, camera);
}

function raycast(e) {
    drag_obj.length = 0;
    var canvasBounds = renderer.domElement.getBoundingClientRect();
    mouse.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
    mouse.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );    

     intersects = raycaster.intersectObjects( cubes );
    if(intersects.length > 0) {
            INTERSECTED = intersects[0].object;
            drag_obj.push(INTERSECTED);
            // }
        }
        dragControls.removeEventListener('dragstart', function(event) {
            controls.enabled = false;
          });
          dragControls.removeEventListener('dragend', function(event) {
            controls.enabled = true;
          });
          init();
}
