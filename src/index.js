import * as THREE from 'three';
import { DragControls } from './modules/drag_controls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color('pink');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.TorusKnotGeometry();
const colors = ['pink', '#DB6B97', '#F2FFE9', '#A6CF98', '#557C55'];

const newMaterial = (color) => (new THREE.MeshStandardMaterial({color: color}));
const materials = colors.map(newMaterial);

const getRandomArbitrary = (min, max) => (Math.random() * (max - min) + min);
const cubes = [];

for (let i = 0; i < 20; i++) {
  let cube = new THREE.Mesh(geometry, materials[i % 5]);
  cube.position.set(getRandomArbitrary(-15, 15), getRandomArbitrary(-15, 15), 0);
  cubes.push(cube);
  scene.add(cube);
}

let i = 0;
document.getElementById('button').addEventListener('click', function() {
  cubes[i].material.color.set('#808080');
  i++;
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(25, 50, 25);
scene.add( pointLight );

camera.position.z = 25;

const controls = new DragControls(cubes, camera, renderer.domElement);

// add event listener to highlight dragged objects
let dragCount = 0;
controls.addEventListener('dragstart', function (event) {
  event.object.material.emissive.set(0xaaaaaa);
  event.object.material.color.set(colors[dragCount % 5]);
  dragCount++;
});

controls.addEventListener('dragend', function (event) {
  event.object.material.emissive.set(0x000000);
});

function animate() {
  requestAnimationFrame(animate);

  let rand = Math.round(getRandomArbitrary(0, cubes.length - 1));
  cubes[rand].rotation.x += 10;
  cubes[rand].rotation.y += 10;
  cubes[rand].rotation.z += 10;


  renderer.render( scene, camera );
}
animate();
