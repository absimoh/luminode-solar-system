const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 50, 130);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.3));
scene.add(new THREE.PointLight(0xffffff, 3));

// Textures
const loader = new THREE.TextureLoader();

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(10, 32, 32),
  new THREE.MeshBasicMaterial({ map: loader.load("assets/sun.jpg") })
);
scene.add(sun);

const planets = [
  { name: "MERCURY", size: 1.5, dist: 18, tex: "mercury.jpg", speed: 0.04 },
  { name: "VENUS", size: 3, dist: 26, tex: "venus.jpg", speed: 0.03 },
  { name: "EARTH", size: 3.2, dist: 34, tex: "earth.jpg", speed: 0.02 },
  { name: "MARS", size: 2.5, dist: 42, tex: "mars.jpg", speed: 0.018 },
  { name: "JUPITER", size: 7, dist: 60, tex: "jupiter.jpg", speed: 0.01 },
  { name: "SATURN", size: 6, dist: 75, tex: "saturn.jpg", speed: 0.009 },
  { name: "URANUS", size: 4.5, dist: 88, tex: "uranus.jpg", speed: 0.007 },
  { name: "NEPTUNE", size: 4.3, dist: 100, tex: "neptune.jpg", speed: 0.006 },
  { name: "PLUTO", size: 1, dist: 112, tex: "pluto.jpg", speed: 0.005 }
];

const planetMeshes = [];

planets.forEach(p => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(p.size, 32, 32),
    new THREE.MeshStandardMaterial({ map: loader.load(`assets/${p.tex}`) })
  );
  mesh.userData = p;
  mesh.position.x = p.dist;
  scene.add(mesh);
  planetMeshes.push(mesh);

  // Orbit ring
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(p.dist - 0.1, p.dist + 0.1, 64),
    new THREE.MeshBasicMaterial({ color: 0x00aaff, side: THREE.DoubleSide })
  );
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
});

function addStars() {
  for (let i = 0; i < 5000; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    s.position.set(
      THREE.MathUtils.randFloatSpread(600),
      THREE.MathUtils.randFloatSpread(600),
      THREE.MathUtils.randFloatSpread(600)
    );
    scene.add(s);
  }
}
addStars();

function animate() {
  sun.rotation.y += 0.002;

  planetMeshes.forEach(m => {
    m.rotation.y += 0.02;
    m.position.x = Math.cos(Date.now() * m.userData.speed * 0.001) * m.userData.dist;
    m.position.z = Math.sin(Date.now() * m.userData.speed * 0.001) * m.userData.dist;
  });

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
