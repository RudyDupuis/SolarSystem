import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function createControls(
  camera: THREE.Camera,
  canvas: HTMLCanvasElement,
) {
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.maxDistance = 10000;
  controls.minDistance = 20;

  return controls;
}
