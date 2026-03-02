import * as THREE from "three";
import createCamera from "./camera";
import createControls from "./controls";
import createSolarSystem, { animatePlanets } from "./solarSysteme";

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const starsGeometry = new THREE.BufferGeometry();
const starsCount = 5000;
const posArray = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 10000;
}

starsGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({ size: 2, color: 0xffffff });
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

createSolarSystem(scene);

const canvas = document.querySelector("canvas.threejs");
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Canvas element not found");
}

const { camera, renderer } = createCamera(canvas);
const controls = createControls(camera, canvas);

const renderloop = () => {
  controls.update();
  animatePlanets();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
