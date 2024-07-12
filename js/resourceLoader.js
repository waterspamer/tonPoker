


//#region Audio
//audio loader
let currentVolume = 0.5;
const audioPath = 'resources/pokerChipSFX.mp3';
        const cardAudioPath = 'resources/cardDis.mp3';


        // Audio context and buffer for poker chip sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let audioBuffer;

        fetch(audioPath)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(buffer => {
                audioBuffer = buffer;
            })
            .catch(error => console.error('Error loading audio:', error));

        // Audio context and buffer for card sound
        const audioCardContext = new (window.AudioContext || window.webkitAudioContext)();
        let audioCardBuffer;

        fetch(cardAudioPath)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioCardContext.decodeAudioData(arrayBuffer))
            .then(buffer => {
                audioCardBuffer = buffer;
            })
            .catch(error => console.error('Error loading audio:', error));

        function playChipSound() {
            if (!audioBuffer) return;

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;

            const gainNode = audioContext.createGain();
            gainNode.gain.value = currentVolume;

            source.connect(gainNode);
            gainNode.connect(audioContext.destination);

            source.start(0);
        }

        function playCardSound() {
            if (!audioCardBuffer) return;

            const source = audioCardContext.createBufferSource();
            source.buffer = audioCardBuffer;

            const gainNode = audioCardContext.createGain();
            gainNode.gain.value = currentVolume;

            source.connect(gainNode);
            gainNode.connect(audioCardContext.destination);

            source.start(0);
        }
//#endregion


//#region Objects
const fbxLoader = new THREE.FBXLoader();
const textureLoader = new THREE.TextureLoader();

let pokerTableModel;


let chipTexture;


//

let isStartAnim = true;
let chipShadowTexture;


const uvYOffset = 0.1186;
const uvXOffset = 0.07655;
let cardTexture;
let tableTexture;
let tableTopTexture;


//#region Materials


const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 oNormal;
    varying vec3 vWorldNormal;
    void main() {
        vUv = uv;
        vNormal = normalize(mat3(modelMatrix) * normal);
        oNormal = normal;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D cardTexture;
    uniform float offsetX;
    uniform float offsetY;
    uniform vec3 colorMultiplier;
    uniform samplerCube uEnvironmentMap;
    //uniform vec3 cameraPosition; // Pass the camera position as a uniform
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vWorldNormal;
    varying vec3 vNormal;

    vec3 fresnelSchlick(float cosTheta, vec3 F0) {
        return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
    }

    void main() {
        vec2 uv = vUv;
        if (!gl_FrontFacing) {
            uv.y = vUv.y - 0.47;
        } else {
            uv.x = vUv.x + offsetX;
            uv.y = vUv.y + offsetY;
        }
        vec4 textureColor = texture2D(cardTexture, uv);
        vec4 color = textureColor * vec4(colorMultiplier, 1.0);
        color.a = textureColor.a; // Use the alpha channel from the texture

        vec3 normal = normalize(vWorldNormal);
        vec3 mN = vNormal;
        // Calculate the world view direction
        vec3 worldViewDir = normalize(cameraPosition - vWorldPosition);
        if (!gl_FrontFacing) mN *= -1.0;
        // Simple diffuse lighting
        vec3 lightDir = normalize(vec3(1.0, 1.0, 0.0)); // Example light direction
        float diff = max(dot(mN, lightDir), 0.0);

        color.rgb *= diff * 1.5;
        // Example use of worldViewDir: Fresnel effect
        float cosTheta = dot(vNormal, worldViewDir);
        //vec3 fresnel = fresnelSchlick(cosTheta, vec3(1.0, 1.0, 1.0));
        //color.rgb = mix(color.rgb, fresnel, .5);
        color.rgb +=  vec3(.7,0,.8) * pow(1.0 - dot(worldViewDir, mN), 3.0);
        gl_FragColor = color;
    }
`;


const shadowMaterial = new THREE.MeshBasicMaterial({
    map: chipShadowTexture,
    transparent: true,
    color: 0x001100,
    opacity: .5, // Set the desired opacity
});


let tableTopMaterial;
//#endregion






let scene, camera, renderer; 

let rotationAnim;

async function loadAll(){
    document.getElementById('loading-label').innerHTML = 'creating scene';
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
    renderer.setClearColor( 0x000000, 0 );
    renderer.setPixelRatio(window.devicePixelRatio*1);
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    
    document.getElementById('container').appendChild(renderer.domElement);

    document.getElementById('loading-label').innerHTML = 'loading textures';

    chipTexture = textureLoader.load('resources/ChipTex.jpg', function (texture) {
        chipTexture.wrapS = chipTexture.wrapT = THREE.RepeatWrapping;
    });
    chipShadowTexture = textureLoader.load('resources/shadowTex.png', function (texture) {
        console.log(chipTexture);
        chipTexture.wrapS = chipTexture.wrapT = THREE.RepeatWrapping;
    });
    cardTexture = textureLoader.load('resources/customCards.jpg', function (texture) {
        cardTexture.wrapS = cardTexture.wrapT = THREE.RepeatWrapping;
    });

    tableTexture = textureLoader.load('resources/TableTex.jpg');
    tableTopTexture = textureLoader.load('resources/slotTexture.jpg');



    document.getElementById('loading-label').innerHTML = 'loading table';

    fbxLoader.load(
        'resources/tableLow.fbx',
        (object) => {
         object.traverse(function (child) {
             if ((child).isMesh) {
                  (child).material = new THREE.ShaderMaterial({
                    uniforms: {
                        cardTexture: { value: tableTexture },
                        offsetX: { value: 0 },
                        offsetY: { value: 0 },
                        colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                    },
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    side: THREE.DoubleSide
                });
                  const uvSetIndex = 2;
            const uvAttribute = `uv${uvSetIndex}`;
            if (child.geometry.attributes[uvAttribute]) {
                child.geometry.attributes.uv = child.geometry.attributes[uvAttribute];
            }
             }
         })
         object.scale.set(.044, .044, .044);
         object.scale.set(.0, .0, .0);
         object.rotation.set (-.2, Math.PI/2, 0);
         object.position.y = 0;
         object.position.z = -3;
         object.position.x = 0;
         pokerTableModel = object;
         scene.add(pokerTableModel);
         document.getElementById('loading-label').innerHTML = 'loading poker skin';
    fbxLoader.load(
        'resources/tableTop.fbx',
        (object) => {
         object.traverse(function (child) {
             if ((child).isMesh) {
                  (child).material = new THREE.ShaderMaterial({
                    uniforms: {
                        cardTexture: { value: tableTopTexture },
                        offsetX: { value: 0 },
                        offsetY: { value: 0 },
                        colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                    },
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    side: THREE.DoubleSide
                });
                tableTopMaterial = child.material;
             }
         })
         object.scale.set(.205, .205, .205);
         object.rotation.set (0, Math.PI/2, 0);
         object.position.y = 0;
         object.position.z = 0;
         object.position.x = 0;

        pokerTableModel.add(object);
    });
    });


    


    

    camera.position.z = 3;
        camera.position.y = 4;

        camera.rotation.set(-1.2,0,0);

        
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

    //rotationAnim = gsap.to(pokerTableModel.rotation, { y: pokerTableModel.rotation.y + Math.PI * 2, duration: 20, repeat: -1, ease: "linear" });







    let loadedCard;
    const cardLoader = new THREE.FBXLoader();
    
    let previewC1;
    let previewC2;
    let previewC3;
    let previewC4;
    let previewC5;
    
    cardLoader.load('resources/card.fbx', function (object) {
        loadedCard = object;
        loadedCard.traverse(function (child) {
            if (child.isMesh) {
                const blendShapeCount = child.morphTargetInfluences.length;
                for (let i = 0; i < blendShapeCount; i++) {
                    gsap.to(child.morphTargetInfluences, { duration: 0.5, [i]: 1 });
                }
    
    
                previewC1 = loadedCard.clone();
                previewC2 = loadedCard.clone();
                previewC3 = loadedCard.clone();
                previewC4 = loadedCard.clone();
                previewC5 = loadedCard.clone();
    
    
                previewC1.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * 12 },
                                offsetY: { value: -uvYOffset * 1 },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    
    
                previewC2.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * 11 },
                                offsetY: { value: -uvYOffset * 1 },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    
    
    
                previewC3.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * 10 },
                                offsetY: { value: -uvYOffset * 1 },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    
    
    
    
                previewC4.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * 9 },
                                offsetY: { value: -uvYOffset * 1 },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    
    
    
    
                previewC5.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * 8 },
                                offsetY: { value: -uvYOffset * 1 },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    
    
                previewC1.scale.set(.1,.1,.1);            
                previewC2.scale.set(.1,.1,.1);
                previewC3.scale.set(.1,.1,.1);
                previewC4.scale.set(.1,.1,.1);
                previewC5.scale.set(.1,.1,.1);
                previewC1.rotation.set(.4,0,0);
                previewC2.rotation.set(.4,0,0);
                previewC3.rotation.set(.4,0,0);
                previewC4.rotation.set(.4,0,0);
                previewC5.rotation.set(.4,0,0);
                scene.add(previewC1);
                scene.add(previewC2);
                scene.add(previewC3);
                scene.add(previewC4);
                scene.add(previewC5);
                previewC1.position.y = .1;
    
    
                gsap.to(previewC1.position, {x: 1,y : .04, z: .4, duration: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC2.position, {x: .5,y : .02, z: .2, duration: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC3.position, {x: 0, y: 0, duration: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC4.position, {x: -.5, y: -.02, z: -.2, duration: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC5.position, {x: -1, y : -.04, z: -.3, duration: 1, repeat: 0,  ease: "power2.inOut" });
    
    
                gsap.to(previewC1.rotation, {y : -.2, duration: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC2.rotation, {y : -.1, duration: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC3.rotation, {y : 0, duration: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC4.rotation, {y : .1, duration: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC5.rotation, {y : .2, duration: 1, repeat: 0,  ease: "power2.inOut" });
    
    
                gsap.to(previewC1.position, {x: 0,y : .04, z: .0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC2.position, {x: .0,y : .02, z: .0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC3.position, {x: 0, y: 0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC4.position, {x: -0, y: -.02, z: -.0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC5.position, {x: -0, y : -.04, z: -.0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
    
    
                gsap.to(previewC1.rotation, {y : -0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC2.rotation, {y : -0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC3.rotation, {y : 0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC4.rotation, {y : .0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC5.rotation, {y : .0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
    
    
    
    
                setInterval(()=>{
                    if (isStartAnim){
                        gsap.to(previewC1.position, {x: 1,y : .04, z: .4, duration: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC2.position, {x: .5,y : .02, z: .2, duration: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC3.position, {x: 0, y: 0, duration: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC4.position, {x: -.5, y: -.02, z: -.2, duration: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC5.position, {x: -1, y : -.04, z: -.3, duration: 1, repeat: 0,  ease: "power2.inOut" });
    
    
                    gsap.to(previewC1.rotation, {y : -.2, duration: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC2.rotation, {y : -.1, duration: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC3.rotation, {y : 0, duration: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC4.rotation, {y : .1, duration: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC5.rotation, {y : .2, duration: 1, repeat: 0,  ease: "power2.inOut" });
    
    
                    gsap.to(previewC1.position, {x: 0,y : .04, z: .0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC2.position, {x: .0,y : .02, z: .0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC3.position, {x: 0, y: 0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC4.position, {x: -0, y: -.02, z: -.0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC5.position, {x: -0, y : -.04, z: -.0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
    
    
                    gsap.to(previewC1.rotation, {y : -0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC2.rotation, {y : -0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC3.rotation, {y : 0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC4.rotation, {y : .0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                    gsap.to(previewC5.rotation, {y : .0, duration: 1, delay: 1, repeat: 0,  ease: "power2.inOut" });
                    }
                    
    
    
    
                }, 2000);
    
            }
        });
    });
    animate();
    login();
}


window.onload = loadAll;
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}

