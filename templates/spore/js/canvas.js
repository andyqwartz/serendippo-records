// Exemple de canvas par Julien Bidoret : https://ateliers.esad-pyrenees.fr/stolon/inertia-creeps
// augmenté avec le plugin OrbitControls qui fonctionne mieux sur mobile
// video texture with ThreeJS : https://stackoverflow.com/questions/18383470/using-video-as-texture-with-three-js


import * as THREE from 'three'
import { OrbitControls } from 'orbit'


// Scene
const scene = new THREE.Scene();




const canvas = document.getElementById('canvas')

const canvascontainer = document.getElementById('canvas').getBoundingClientRect()

const camera = new THREE.PerspectiveCamera(
  60,
  canvascontainer.width / canvascontainer.height,
  1,
  50000,
);




const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);



// ORBIT CONTROLS
const controls = new OrbitControls( camera, renderer.domElement);
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 0.5
camera.position.z = 1200;

controls.update();




var container = document.getElementById('canvas')
container.appendChild(renderer.domElement);

// sprites group
const spriteGroup = new THREE.Group();
scene.add(spriteGroup);

// Images (texture)
const loader = new THREE.TextureLoader();

const imageObjects = document.querySelectorAll('.to-place')
console.log(imageObjects)

const imageUrls = []

imageObjects.forEach(image => {
  var src = image.getAttribute('src')
  imageUrls.push(src)
});

//Get your video element:
                // const video = document.querySelectorAll(".video");
// pas obligé car autoplay true dans le html
// video.onloadeddata = function () {
//     video.play();
// };
// console.log(video)

//Create your video texture:
                // video.forEach(element => {

                //       const videoTexture = new THREE.VideoTexture(element);
                //       videoTexture.needsUpdate = true;
                //       const videoMaterial = new THREE.MeshBasicMaterial({
                //         map: videoTexture,
                //         side: THREE.FrontSide,
                //         toneMapped: false,
                //     });
                //     videoMaterial.needsUpdate = true;
                //     const screen = new THREE.PlaneGeometry(200, 200);
                //     const videoScreen = new THREE.Mesh(screen, videoMaterial);
                //     imageUrls.push(videoScreen)
                // });

//
// Create sprite
//

function createSprite(url) {
  loader.load(url, (texture) => {
    texture.encoding = THREE.sRGBEncoding;
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      fog: false,
    });

    const sprite = new THREE.Sprite(material);

    // position aléatoire dans l’espace 3D 
    sprite.position.set(
      (Math.random() - 0.5) * 1500,
      (Math.random() - 0.5) * 1500,
      (Math.random() - 0.5) * 1500
    );

    // Taille des images
    function getRandomInt (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    const multiplier = getRandomInt(2, 4)
    const width = sprite.material.map.image.width / multiplier;
    const height = sprite.material.map.image.height / multiplier;
    sprite.scale.set(width, height, 1);

    spriteGroup.add(sprite);
  });
}

imageUrls.forEach(createSprite);

// Animation
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();


const isMobile = () => {
  // Check if the new API is supported
  if (navigator.userAgentData) {
    return navigator.userAgentData.mobile;
  }
  
  // Fallback for Safari/Firefox (see Solution 3)
  return /Mobi|Android/i.test(navigator.userAgent);
};

if (isMobile()) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


// Resize
// à la base ça intervenait lors d'un resize de la fenêtre
// mais je me suis aperçu que ça permettait de charger le canvas sur mobile par magie
// donc je l'ai gardé sans le event listener :)

// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });
