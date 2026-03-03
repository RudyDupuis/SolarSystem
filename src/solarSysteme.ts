import * as THREE from "three";

const sunSize = 50;
const distanceScale = 100;
const planetSizeScale = 4;

const planetsData = [
  {
    name: "Mercury",
    size: 0.383,
    distance: 0.39,
    speed: 4.74,
  },
  { name: "Venus", size: 0.949, distance: 0.72, speed: 3.5 },
  {
    name: "Earth",
    size: 1,
    distance: 1,
    speed: 2.98,
    moons: [{ name: "Moon", size: 0.27, distance: 10, speed: 0.05 }],
  },
  {
    name: "Mars",
    size: 0.532,
    distance: 1.52,
    speed: 2.41,
    moons: [
      { name: "Phobos", size: 0.1, distance: 4, speed: 0.15 },
      { name: "Deimos", size: 0.08, distance: 6, speed: 0.1 },
    ],
  },
  {
    name: "Jupiter",
    size: 11.21,
    distance: 5.2,
    speed: 1.31,
    moons: [
      { name: "Io", size: 0.28, distance: 60, speed: 0.08 },
      { name: "Europa", size: 0.24, distance: 70, speed: 0.06 },
      { name: "Ganymede", size: 0.41, distance: 85, speed: 0.04 },
      { name: "Callisto", size: 0.37, distance: 100, speed: 0.03 },
    ],
  },
  {
    name: "Saturn",
    size: 9.45,
    distance: 9.58,
    speed: 0.97,
    ring: { inner: 20, outer: 50, color: 0x887766 },
    moons: [{ name: "Titan", size: 0.4, distance: 100, speed: 0.04 }],
  },
  {
    name: "Uranus",
    size: 4.01,
    distance: 19.22,
    speed: 0.68,
    moons: [{ name: "Titania", size: 0.12, distance: 100, speed: 0.05 }],
  },
  {
    name: "Neptune",
    size: 3.88,
    distance: 30.05,
    speed: 0.54,
    moons: [{ name: "Triton", size: 0.21, distance: 100, speed: 0.04 }],
  },
];

interface MoonObject {
  mesh: THREE.Mesh;
  distance: number;
  speed: number;
  angle: number;
}

interface PlanetObject {
  mesh: THREE.Mesh;
  distance: number;
  speed: number;
  angle: number;
  moons: MoonObject[];
}

export const planetsMeshes: PlanetObject[] = [];

function createOrbit(scene: THREE.Scene, distance: number) {
  const geometry = new THREE.RingGeometry(distance - 0.5, distance + 0.5, 128);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2,
  });
  const orbit = new THREE.Mesh(geometry, material);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);
}

export default function createSolarSystem(scene: THREE.Scene) {
  const loader = new THREE.TextureLoader();

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(sunSize, 64, 64),
    new THREE.MeshBasicMaterial({ map: loader.load("sun.png") }),
  );
  scene.add(sun);

  const sunLight = new THREE.PointLight(0xffffff, 6, 0, 0);
  scene.add(sunLight);

  planetsData.forEach((planet) => {
    const pSize = planet.size * planetSizeScale;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(pSize, 32, 32),
      new THREE.MeshStandardMaterial({
        map: loader.load(`${planet.name.toLowerCase()}.png`),
      }),
    );

    const orbitDist = sunSize + planet.distance * distanceScale;
    createOrbit(scene, orbitDist);

    if (planet.ring) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(
          pSize + planet.ring.inner,
          pSize + planet.ring.outer,
          64,
        ),
        new THREE.MeshBasicMaterial({
          color: planet.ring.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        }),
      );
      ring.rotation.x = Math.PI / 2.5;
      mesh.add(ring);
    }

    const moons: MoonObject[] = (planet.moons || []).map((m) => {
      const mMesh = new THREE.Mesh(
        new THREE.SphereGeometry(m.size * planetSizeScale, 16, 16),
        new THREE.MeshStandardMaterial({ map: loader.load("moon.png") }),
      );
      mesh.add(mMesh);
      return {
        mesh: mMesh,
        distance: m.distance,
        speed: m.speed,
        angle: Math.random() * Math.PI * 2,
      };
    });

    mesh.position.x = orbitDist;
    scene.add(mesh);
    planetsMeshes.push({
      mesh,
      distance: orbitDist,
      speed: planet.speed * 0.001,
      angle: Math.random() * Math.PI * 2,
      moons,
    });
  });
}
export function animatePlanets() {
  planetsMeshes.forEach((planet) => {
    planet.angle += planet.speed;

    planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
    planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;

    planet.mesh.rotation.y += 0.02;

    planet.moons.forEach((moon) => {
      moon.angle += moon.speed;
      moon.mesh.position.x = Math.cos(moon.angle) * moon.distance;
      moon.mesh.position.z = Math.sin(moon.angle) * moon.distance;
    });
  });
}
