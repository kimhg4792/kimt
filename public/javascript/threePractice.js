import * as THREE from '../build/three.module.js';

function main() {

    //-------------------インスタンス追加----------------//
    function makeInstance(geomatry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});
    const cube = new THREE.Mesh(geomatry, material, x);
    scene.add(cube);

    cube.position.x = x;
    return cube;
    }
    // ------------------------------------------------ //

    //------------------基本定義-----------------------//
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    const fov = 75;
    const aspect = 2; //　canvasのdefault
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); // camera設定
    camera.position.z = 2; // camera_position 設定

    const scene = new THREE.Scene(); // scene_graph_formの定義
    // ------------------------------------------------ //

    // -------------------照明追加---------------------- //
    {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
    }
    // ------------------------------------------------ //


    //-------------------- box 定義 --------------------//
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth); // geometry定義
    //const meterial = new THREE.MeshPhongMaterial({color : 0x47C83E}); // 基本MESH定義
    //const cube = new THREE.Mesh(geometry, meterial);  //　cube設定

    const cubes = [
        makeInstance(geometry, 0xFF0000, 0),
        makeInstance(geometry, 0xFFBB00, -2),
        makeInstance(geometry, 0x1DDB16, 2),
    ]; //cube_array定義


    scene.add(cubes); // scene_graph_formにcube追加
    // ------------------------------------------------ //


    //-------------------- animation --------------------//
   function render(time) {
    time *= 0.001; // 時間を秒に変換

    //cube.rotation.x = time;
    //cube.rotation.y = time;

    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    })

    renderer.render(scene, camera);// renererにcameraとsceneをrendering
    requestAnimationFrame(render);
   }
    // ------------------------------------------------ //
    
    requestAnimationFrame(render);

}

main();
