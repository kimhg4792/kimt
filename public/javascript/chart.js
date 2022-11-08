import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {GLTFLoader} from 'three/GLTFLoader';

const saveBlob = (function() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = none;

    return function saveData(blub, fileName) {
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
    };
})


//------------------ local variable ---------------------//
const planeSize = 10;


let localtime = 0;
let keyboardBuffer = [0, 0];
let camera_x = 10;
let camera_y = 3;
let camera_z = 0;

let timmer1;
let timmer2 = 0;


//--- rendering method : renderer.render(canvas, camera); ---//

window.addEventListener("DOMContentLoaded", init);

//---- init ----//
function init() {
    render();
}





//-- canvas size --//
const width = 960;
const height = 540;



//--------------------- loader ------------------------//
const gltfLoader = new GLTFLoader();




//--------------------- renderer ----------------------// (1)
const canvas = document.querySelector('#canvas_vr');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);







//----------------------- scene ------------------------// (2)
const scene = new THREE.Scene;
scene.background = new THREE.Color(0xefefef);







//----------------------- camera -----------------------// (3)
              //new THREE.PerspectiveCamera(画角, アスペクト比, 描画開始距離, 描画終了距離)
const camera = new THREE.PerspectiveCamera(45, width/height, 1, 10000);
camera.position.set(camera_x, camera_y, camera_z, 3);



//------------------- camera controller ---------------------//
const controls = new OrbitControls(camera, canvas);
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2.1;


//--------------------------- class ----------------------------//



//--------------------------- function ----------------------------//
function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.Math.degToRad(camera.fov * .5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = (new THREE.Vector3())
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(1, 0, 1))
        .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}

function inputKeyboard () {

    

    let bufferChecker;
    window.onkeydown = (e) => {
        keyboardBuffer[0] = keyboardBuffer[1];
        keyboardBuffer[1] = e.keyCode;

        if(keyboardBuffer[1] === 87) {
            box.position.set(positionX, positionZ, positionY);
            positionY -= .02;
            scene.add(box)
            camera.position.set(camera_x, camera_y, camera_z);
            camera_z++;
            //console.log("positionY: " + positionY);

            console.log(controls);
        } else if(keyboardBuffer[1] === 83) {
            box.position.set(positionX, positionZ, positionY);
            positionY += .02;
            scene.add(box)
            //console.log("positionY: " + positionY);
        } else if(keyboardBuffer[1] === 65) {
            box.position.set(positionX, positionZ, positionY);
            positionX -= .02;
            scene.add(box)
           //console.log("positionX: " + positionX);
        } else if(keyboardBuffer[1] === 68) {
            box.position.set(positionX, positionZ, positionY);
            positionX += .02;
            scene.add(box)
            //console.log("positionX: " + positionX);
        } else if(keyboardBuffer[1] === 81) {
            box.position.set(positionX, positionZ, positionY);
            positionZ += .02;
            scene.add(box)
            //console.log("positionX: " + positionX);
        } else if(keyboardBuffer[1] === 69) {
            box.position.set(positionX, positionZ, positionY);
            positionZ -= .02;
            scene.add(box)
            //console.log("positionX: " + positionX);
        }

        console.log("buffer[last]: " + keyboardBuffer[0]);
        console.log("buffer[first]: " + keyboardBuffer[1]);
        console.log("--------------------------------");
    }

}

function timmer(time) {
    timmer1 = Math.floor(time);

    if(timmer1 !== timmer2) {
        timmer2 = timmer1;
        console.log(timmer2);
        return timmer2;
    }
}

//------------------------ helper ------------------------//




//------------------------object-------------------------// 

{
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1);
//scene.add(directionalLight);
}

{
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
}

{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 10, 2);
    scene.add(light);
    scene.add(light.target);
}

{
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/images/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);
const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
});
planeMat.color.setRGB(1.5, 1.5, 1.5);
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);
}

{
const maxX = 10;
let axisXLength = maxX * 2;                     // 矢印の長さ
const axisXHeadLength = axisXLength * 0.05;     // 矢印の頭の長さ
const axisXHeadWidth = axisXHeadLength * 0.5;   // 矢印の頭の太さ
const directionX = new THREE.Vector3(1, 0, 0);  // 矢印の向き(X方向)
const startX = new THREE.Vector3(-axisXLength, 0, 0);  // 矢印の始点
const colorX = 0xff0000;
const axisX = new THREE.ArrowHelper(directionX, startX, axisXLength + axisXHeadLength * 2, colorX, axisXHeadLength, axisXHeadWidth);
            //new THREE.ArrowHelper( dir, origin, length, hex );
//scene.add(axisX);
}

{
let positionX = 0.5;
let positionY = 0.5;
let positionZ = 0.5;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({color:0x0000ff});
const box = new THREE.Mesh(geometry, material);
box.position.set(positionX, positionY, positionZ);
scene.add(box);
}

//----------------------- rendering----------------------//
let test = 1;

function render(time) { 
    time *= 0.001;

    timmer(time);
    //inputKeyboard();
    
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(render);
}