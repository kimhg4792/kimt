import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

function main() {

  const canvas = document.querySelector('#c');
  const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    logarithmicDepthBuffer: true, //
  });
  renderer.shadowMap.enabled = true;


  //-------------------------------------- camera Setting ------------------------------------------//
  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.00001;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();
  //----------------------------------------------------------------------------------------------//


  //-------------------------------------- Class Setting ------------------------------------------//
  class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
      this.obj = obj;
      this.minProp = minProp;
      this.maxProp = maxProp;
      this.minDif = minDif;
    }
    get min() {
      return this.obj[this.minProp];
    }
    set min(v) {
      this.obj[this.minProp] = v;
      this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
      return this.obj[this.maxProp];
    }
    set max(v) {
      this.obj[this.maxProp] = v;
      this.min = this.min;  // this will call the min setter
    }
  }

  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  class DimensionGUIHelper {
    constructor(obj, minProp, maxProp) {
      this.obj = obj;
      this.minProp = minProp;
      this.maxProp = maxProp;
    }
    get value() {
      return this.obj[this.maxProp] * 2;
    }
    set value(v) {
      this.obj[this.minProp] = v / 2;
      this.obj[this.maxProp] = v / -2;
    }
  }

  //-------------------------------------------------------------------------------------------------------//

  //----------------------------------------------- function --------------------------------------------------//
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
  }

  function setScissorForElement(elem) {
    const canvasRect = canvas.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();

    // compute a canvas relative rectangle
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);

    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);

    // setup the scissor to only render to that part of the canvas
    const positiveYUpBottom = canvasRect.height - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    // return the aspect
    return width / height;
  }

  
  
  //-----------------------------------------------------------------------------------------------------------//

  //------------------------------------------- objects -----------------------------------------------//
  const loader = new THREE.TextureLoader();

  //floor
  {
    const planeSize = 40;
    const texture = loader.load('/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    planeMat.color.setRGB(1.5, 1.5, 1.5);
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  //cube
  {
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMet = new THREE.MeshPhongMaterial({color: '#8AC'});
    const mesh = new THREE.Mesh(cubeGeo, cubeMet);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
    scene.add(mesh);
  }

  //sphere
  {
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(mesh);
  }


  
  //light
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.SpotLight(color, intensity);
    light.castShadow = true;
    light.position.set(0, 10, 0);
    light.target.position.set(-4, 0, -4);
    scene.add(light);
    scene.add(light.target);

    const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    scene.add(cameraHelper);

    const helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);

    
    cameraHelper.update();
    
    const onChange = () => {
      light.target.updateMatrixWorld();
      helper.update();
    }
    onChange();

    function updateCamera() {
      light.target.updateMatrixWorld();
      helper.update();
      light.shadow.camera.updateProjectionMatrix();
      cameraHelper.update();
    } 
    
    updateCamera();

    

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
    {
      const folder = gui.addFolder('Shadow Camera');
      folder.open();
      folder.add(new DimensionGUIHelper(light.shadow.camera, 'left', 'right'), 'value', 1, 100).name('width').onChange(updateCamera);
      folder.add(new DimensionGUIHelper(light.shadow.camera, 'bottom', 'top'), 'value', 1, 100 ).name('height').onChange(updateCamera);
      const minMaxGUIHelper = new MinMaxGUIHelper(light.shadow.camera, 'near', 'far', 0.1);
      folder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
      folder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);
      folder.add(light.shadow.camera, 'zoom', 0.01, 1.5, 0.01).onChange(updateCamera);
    }
    

    
    makeXYZGUI(gui, light.position, 'position', onChange);
    makeXYZGUI(gui, light.target.position, 'target', onChange);
  }
  //-----------------------------------------------------------------------------------------------------------//
  

  //----------------------------------------------- rendering --------------------------------------------------//
  function render(time) {
    time *= 0.01;

    resizeRendererToDisplaySize(renderer);

    {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }


    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

//-----------------------------------------------------------------------------------------------------------//

main();
