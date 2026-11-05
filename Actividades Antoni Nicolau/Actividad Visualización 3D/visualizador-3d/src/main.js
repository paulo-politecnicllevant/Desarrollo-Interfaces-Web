import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Iluminación
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.8));

// Cargar texturas
const textureLoader = new THREE.TextureLoader();

const textureBark = textureLoader.load(
  `${import.meta.env.BASE_URL}textures/mossybark02.png`
);

const textureBranch = textureLoader.load(
  `${import.meta.env.BASE_URL}textures/branch05.png`
);

// Configuración de texturas
textureBark.colorSpace = THREE.SRGBColorSpace;
textureBranch.colorSpace = THREE.SRGBColorSpace;

textureBark.wrapS = THREE.RepeatWrapping;
textureBark.wrapT = THREE.RepeatWrapping;

textureBranch.wrapS = THREE.RepeatWrapping;
textureBranch.wrapT = THREE.RepeatWrapping;

// Materiales
const materialBark = new THREE.MeshStandardMaterial({
  map: textureBark,
  roughness: 0.9
});

const materialBranch = new THREE.MeshStandardMaterial({
  map: textureBranch,
  roughness: 0.9,
  side: THREE.DoubleSide,
  alphaTest: 0.5
});

// Cargar modelo OBJ
const loader = new OBJLoader();

loader.load(
  `${import.meta.env.BASE_URL}QuickMapleOptimized.obj`,

  (object) => {

    // Centrar modelo
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());

    object.position.sub(center);

    // Asignar materiales
    
object.traverse((child) => {

  if (child.isMesh) {

    const name = child.name.toLowerCase();

    console.log('Malla:', name);

    // Hojas: branch05.png
    if (
      name.includes('leaf') ||
      name.includes('leaves') ||
      name.includes('foliage') ||
      name.includes('canopy') ||
      name.includes('leavesmesh')
    ) {

      child.material = materialBranch;

    } else {

      // Tronco y ramas: mossybark02.png
      child.material = materialBark;

    }

    child.material.needsUpdate = true;

  }

});


    scene.add(object);

  },

  (progress) => {
    console.log('Cargando modelo...');
  },

  (error) => {
    console.error('Error cargando modelo:', error);
  }
);

// Responsive
window.addEventListener('resize', () => {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

});

// Animación
function animate() {

  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);

}

animate();