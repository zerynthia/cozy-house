import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

/**
 * House
 */
const house = new THREE.Group();

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({ color: "#ac8e82" })
);
walls.position.y = 1.25;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.rotation.y = Math.PI / 4;
roof.position.y = 3;
house.add(roof);

scene.add(house);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1.6),
  new THREE.MeshStandardMaterial({ color: "#aa7b7d" })
);
door.position.y = 0.8;
door.position.z = 2 + 0.01;
house.add(door);

const theWindowFirst = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1),
  new THREE.MeshStandardMaterial({ color: "#45b93" })
);
theWindowFirst.rotateY(Math.PI / 2);
theWindowFirst.position.y = 1.2;
theWindowFirst.position.x = 2 + 0.01;
theWindowFirst.position.z = 0;
house.add(theWindowFirst);

const theWindowSecond = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1),
  new THREE.MeshStandardMaterial({ color: "#45b93" })
);
theWindowSecond.rotateY(Math.PI / -2);
theWindowSecond.position.y = 1.2;
theWindowSecond.position.x = -2.02 + 0.01;
theWindowSecond.position.z = 0;
house.add(theWindowSecond);

// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.1);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// Graves
const rocks = new THREE.Group();

const rockMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 100; i++) {
  const radius = Math.random() * 0.5 + 0.1;
  const widthSegments = Math.floor(Math.random() * 5) + 5;
  const heightSegments = Math.floor(Math.random() * 5) + 5;
  const rockGeometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );

  const angle = Math.random() * Math.PI * 2;
  const distance = 5 + Math.random() * 12;
  const x = Math.sin(angle) * distance;
  const z = Math.cos(angle) * distance;

  const rock = new THREE.Mesh(rockGeometry, rockMaterial);
  rock.position.set(x, radius / 2, z);
  rock.rotation.y = (Math.random() - 0.5) * 0.4;
  rock.rotation.z = (Math.random() - 0.5) * 0.4;
  rock.rotation.x = (Math.random() - 0.5) * 0.4;
  rock.castShadow = true;
  rocks.add(rock);
}

scene.add(rocks);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: "#a9c388", side: THREE.DoubleSide })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 1);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.2);
moonLight.position.set(4, 5, -2);
scene.add(moonLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.minDistance = 5;
controls.maxDistance = 10;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");
renderer.shadowMap.enabled = true;

/**
 * Shadows
 */
moonLight.castShadow = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
floor.receiveShadow = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
