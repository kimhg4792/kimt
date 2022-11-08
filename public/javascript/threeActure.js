import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
//import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

function main() {
    const canvas = document.querySelector('#c');
    const scene = new THREE.Scene();
        scene.background = new THREE.Color('black');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        logarithmicDepthBuffer: true,
    });
    renderer.shadowMap.enabled = true;

    //-------------------------------------- camera Setting ------------------------------------------//
    const fov = 20;
    const aspect = 2;  // the canvas default
    const near = 0.01;
    const far = 10000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();
    //----------------------------------------------------------------------------------------------//
    window.onkeydown = (e) => {
        if(e.keyCode === 38) {
            fov++;
        }
    }


    const width = 200;
    const height = 200;
    const loader = new THREE.TextureLoader();
    //------------------------------------------- objects -----------------------------------------------//
    //floor
    {
        const planeSize = 20;
  
        const texture = loader.load('/images/checker.png');
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

    //---------------------------------------------------------------------------------------------------//

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


main();