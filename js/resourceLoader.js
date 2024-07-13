


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
let loadedCard;
    const cardLoader = new THREE.FBXLoader();
    
let previewC1;
let previewC2;
let previewC3;
let previewC4;
let previewC5;


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

// Load a texture using a Promise
function loadTexture(url) {
    return new Promise((resolve, reject) => {
        textureLoader.load(url, resolve, undefined, reject);
    });
}

// Load an FBX model using a Promise
function loadFBXModel(url) {
    return new Promise((resolve, reject) => {
        fbxLoader.load(url, resolve, undefined, reject);
    });
}

async function loadAll() {
    document.getElementById('loading-label').innerHTML = 'Creating scene';
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;
        camera.position.y = 4;

        camera.rotation.set(-1.2,0,0);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio * 1);
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    
    document.getElementById('container').appendChild(renderer.domElement);

    document.getElementById('loading-label').innerHTML = 'Loading textures';

    try {
        [chipTexture, chipShadowTexture, cardTexture, tableTexture, tableTopTexture] = await Promise.all([
            loadTexture('resources/ChipTex.jpg'),
            loadTexture('resources/shadowTex.png'),
            loadTexture('resources/customCards.jpg'),
            loadTexture('resources/TableTex.jpg'),
            loadTexture('resources/slotTexture.jpg')
        ]);

        chipTexture.wrapS = chipTexture.wrapT = THREE.RepeatWrapping;
        chipShadowTexture.wrapS = chipShadowTexture.wrapT = THREE.RepeatWrapping;
        cardTexture.wrapS = cardTexture.wrapT = THREE.RepeatWrapping;

        document.getElementById('loading-label').innerHTML = 'Loading table';

        pokerTableModel = await loadFBXModel('resources/tableLow.fbx');
        processTableModel(pokerTableModel);

        document.getElementById('loading-label').innerHTML = 'Loading poker skin';

        const tableTopModel = await loadFBXModel('resources/tableTop.fbx');
        processTableTopModel(tableTopModel, tableTopTexture);

        loadedCard = await loadFBXModel('resources/card.fbx');
        processCardModel(loadedCard);

        animate();
        login(); // Call login after everything is loaded

    } catch (error) {
        console.error('Error loading resources:', error);
    }
}

function processTableModel(object) {
    object.traverse(function (child) {
        if (child.isMesh) {
            child.material = new THREE.ShaderMaterial({
                uniforms: {
                    cardTexture: { value: tableTexture },
                    offsetX: { value: 0 },
                    offsetY: { value: 0 },
                    colorMultiplier: { value: new THREE.Vector3(1, 1, 1) }
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
    });
    object.scale.set(.0, .0, .0);
    object.position.set(0, 0, -3);
    rotationAnim = gsap.to(pokerTableModel.rotation, { y: pokerTableModel.rotation.y + Math.PI * 2, duration: 20, repeat: -1, ease: "linear" });
    scene.add(object);
}

function processTableTopModel(object, texture) {
    object.traverse(function (child) {
        if (child.isMesh) {
            child.material = new THREE.ShaderMaterial({
                uniforms: {
                    cardTexture: { value: texture },
                    offsetX: { value: 0 },
                    offsetY: { value: 0 },
                    colorMultiplier: { value: new THREE.Vector3(1, 1, 1) }
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                side: THREE.DoubleSide
            });
            tableTopMaterial = child.material;
        }
    });
    object.scale.set(.205, .205, .205);
    object.rotation.set(0, Math.PI / 2, 0);
    object.position.set(0, 0, 0);
    pokerTableModel.add(object);
}

function processCardModel(object) {
    object.traverse(function (child) {
        if (child.isMesh) {
            // Process blend shapes and create preview cards
            createPreviewCards(child);
        }
    });
}

function createPreviewCards(mesh) {
    const blendShapeCount = mesh.morphTargetInfluences.length;
    for (let i = 0; i < blendShapeCount; i++) {
        gsap.to(mesh.morphTargetInfluences, { duration: 0.5, [i]: 1 });
    }

    [previewC1, previewC2, previewC3, previewC4, previewC5] = Array(5).fill().map(() => loadedCard.clone());

    [previewC1, previewC2, previewC3, previewC4, previewC5].forEach((preview, index) => {
        preview.traverse(function (child) {
            if (child.isMesh) {
                child.material = new THREE.ShaderMaterial({
                    uniforms: {
                        cardTexture: { value: cardTexture },
                        offsetX: { value: uvXOffset * (12 - index) },
                        offsetY: { value: -uvYOffset * 1 },
                        colorMultiplier: { value: new THREE.Vector3(1, 1, 1) }
                    },
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    side: THREE.DoubleSide
                });
            }
        });
        preview.scale.set(.1, .1, .1);
        preview.rotation.set(.4, 0, 0);
        scene.add(preview);
    });

    setPreviewCardsPosition([previewC1, previewC2, previewC3, previewC4, previewC5]);

    setInterval(() => {
        if (isStartAnim) {
            animatePreviewCards([previewC1, previewC2, previewC3, previewC4, previewC5]);
        }
    }, 2000);
}

function setPreviewCardsPosition(previews) {
    const positions = [
        { x: 1, y: .04, z: .4 },
        { x: .5, y: .02, z: .2 },
        { x: 0, y: 0, z: 0 },
        { x: -.5, y: -.02, z: -.2 },
        { x: -1, y: -.04, z: -.3 }
    ];
    previews.forEach((preview, index) => {
        gsap.to(preview.position, { ...positions[index], duration: 1, ease: "power2.inOut" });
        gsap.to(preview.rotation, { y: -.2 + .1 * index, duration: 1, ease: "power2.inOut" });
    });
    gsap.delayedCall(1, resetPreviewCardsPosition, [previews]);
}

function resetPreviewCardsPosition(previews) {
    previews.forEach((preview) => {
        gsap.to(preview.position, { x: 0, y: .04, z: 0, duration: 1, ease: "power2.inOut" });
        gsap.to(preview.rotation, { y: 0, duration: 1, ease: "power2.inOut" });
    });
}

function animatePreviewCards(previews) {
    setPreviewCardsPosition(previews);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.onload = loadAll;


window.onload = loadAll;
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}

