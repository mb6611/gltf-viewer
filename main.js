import * as THREE from 'three';
import { GLTFLoader } from 'GLTF';
import { OrbitControls } from 'OrbitControls';

// Create loader for GLTF file
const loader = new GLTFLoader();

// Create renderer for window
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild( renderer.domElement );

loader.load( 'poly.glb', function ( gltf ) {

    // Add scene
    const scene = gltf.scene;
    const scaleValue = 10;
    scene.scale.set(scaleValue, scaleValue, scaleValue);

    // Light up the scene
    const ambientLight = new THREE.AmbientLight(0xffffff); // Specify the color of the light (white in this case)
    scene.add(ambientLight);

    // Visualize axes
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    // Add camera
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set( 0, 0, 10 );
    camera.lookAt( 0, 0, 0 );

    // Add orbital camera control
    const controls = new OrbitControls( camera, renderer.domElement );


    // Update camera angle
    //controls.addEventListener( 'change'); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set( 0, 0, 0 );
    controls.enableZoom = true;
    //controls.autoRotate = true;

    // Parse window size changes
    window.addEventListener( 'resize', onWindowResize );
    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
        render();
    }

    walk();

    function walk() {

        //console.log("moveX", moveX);
        document.addEventListener("keydown", function(event) {

            let forwardDirection = new THREE.Vector3();
            camera.getWorldDirection(forwardDirection);

            let xMove = 0;
            let zMove = 0;

            // Normalize direction
            let magnitude = Math.sqrt((forwardDirection.x ** 2) + (forwardDirection.z ** 2));
            let cameraDirectionX = forwardDirection.x / magnitude;
            let cameraDirectionZ = forwardDirection.z / magnitude;


            let speed = 1;

            console.log("X", cameraDirectionX);
            console.log("Z", cameraDirectionZ);

            if (event.key === "w" || event.key === "W") {
                xMove += (speed * cameraDirectionX);
                zMove += (speed * cameraDirectionZ);
                console.log(camera.position.z);
                //render();
            }
            if (event.key === "a" || event.key === "A") {


                xMove += (speed * cameraDirectionZ);
                zMove += -(speed * cameraDirectionX);
                console.log("A");
                //render();
            }
            if (event.key === "s" || event.key === "S") {
                xMove += -(speed * cameraDirectionX);
                zMove += -(speed * cameraDirectionZ);
                console.log("S");
                //render();
            }
            if (event.key === "d" || event.key === "D") {

                xMove += -(speed * cameraDirectionZ);
                zMove += (speed * cameraDirectionX);
                console.log("D");
                //render();
            }



            camera.position.x += xMove;
            camera.position.z += zMove;
            controls.target.x += xMove;
            controls.target.z += zMove;


            let cameraDirection = new THREE.Vector3();
            camera.getWorldDirection(cameraDirection);

            let targetPosition = new THREE.Vector3();
            targetPosition.copy(camera.position).add(cameraDirection);
            //controls.target.add(cameraDirection);
            controls.update();

            console.log(controls.target);
            render();
        })
    }

    function render() {
        requestAnimationFrame( render );
        controls.update();

        /*
        let cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);

        let targetPosition = new THREE.Vector3();
        cameraDirection = cameraDirection.multiplyScalar(-1);
        targetPosition.copy(camera.position).add(cameraDirection);
        console.log(targetPosition);

        const geometry = new THREE.BoxGeometry( 0.1, .1, .1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.x = targetPosition.x;
        cube.position.y = targetPosition.y;
        cube.position.z = targetPosition.z;
        //scene.add( cube );
        controls.target.copy(targetPosition);*/

        //controls.target.set(targetPosition);
        renderer.render( scene, camera );
    }

    requestAnimationFrame(render);
}, function ( xhr ) {

        // Return load percentage of .gltf file
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    function ( error ) {

        console.error("Error");

} );
