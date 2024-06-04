Telegram.WebApp.ready();


const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D cardTexture;
    uniform float offsetX;
    uniform float offsetY;
    varying vec2 vUv;
    void main() {
        vec2 uv = vUv;
        if (!gl_FrontFacing) {
            uv.x = vUv.x + 0.3825;
            uv.y = vUv.y - 0.543;
        } else {
            uv.x = vUv.x + offsetX;
            uv.y = vUv.y + offsetY;
        }
        gl_FragColor = texture2D(cardTexture, uv);
    }
`;

let cardObjects = [];
let cardsIndexes = [];



let scene, camera, renderer; 
        function simulate() {
            Telegram.WebApp.sendData(JSON.stringify({message: "Симулировали раздачу"}));
            

            for (let i = 0; i< cardObjects.length; i++)
                scene.remove(cardObjects[i]);
            cardObjects = [];
             cardsIndexes = [];
            simulateGame();



        }

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('container').appendChild(renderer.domElement);

        const textureLoader = new THREE.TextureLoader();
            const tableTexture = textureLoader.load('resources/tableTex.png');

        const fbxLoader = new THREE.FBXLoader();
        fbxLoader.load(
        'resources/table.fbx',
        (object) => {
         object.traverse(function (child) {
             if ((child).isMesh) {
                  (child).material = material
                 if ((child).material) {
                     ((child).material).transparent = false
                 }
             }
         })
         object.scale.set(.1, .1, .1);
         object.rotation.set (0, Math.PI/2, 0);
         object.position.y = -2;
         object.position.z = -3;
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ map: tableTexture });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = -1;
        cube.scale.set(10,1,10);
        //scene.add(cube);
        
        camera.position.z = 5;
        camera.position.y = 2;

        camera.rotation.set(-0.5,0,0);

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        animate();
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        


        function generateCardsInef(){
            const textureLoader = new THREE.TextureLoader();
            const cardTexture = textureLoader.load('resources/texturePack.jpg');

            const fbxLoader = new THREE.FBXLoader();
            fbxLoader.load('resources/card.fbx', (object) => {
                const cardWidth = 0.6;
                const cardHeight = 1.04;
                const suits = 4;
                const ranks = 13;
                const uvYOffset = 0.1365;
                const uvXOffset = 0.07225;
                let i = 0;
                for (let suit = 0; suit < suits; suit++) {
                    for (let rank = 0; rank < ranks; rank++) {
                        const card = object.clone(true);
                        
                        const material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * rank },
                                offsetY: { value: -uvYOffset * suit }
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
            
                        card.traverse((child) => {
                            if (child.isMesh) {
                                child.scale.set(10, 10, 10);
                                child.rotation.set(Math.PI/2, 0, 0);
                                child.material = material;
                            }
                        });
            
                        const posX = rank * (cardWidth + 0.1);
                        const posY = suit * (cardHeight + 0.1);
                        card.position.set(0, cardObjects.length * 0.002 -.45, -2);
                        //gsap.to(card.rotation, { duration: .3, x: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: (suit * ranks + rank) * 0.05 });
                        cardObjects.push(card);
                        cardsIndexes.push(i);
                        i++;
                        scene.add(card);
                    }
                }
            });

        }


        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }


        function shuffleCards(){
            cardsIndexes = shuffleArray(cardsIndexes);
            console.log(cardsIndexes);

            for (let i = 0; i < 52; i++){
                gsap.to(cardObjects[i].position, {duration: .1, y:cardsIndexes[i] * 0.005 -.45, delay: i*0.01 })
                gsap.to(cardObjects[i].position, {duration: .1, y:cardsIndexes[i] * 0.002 -.45, delay: i*0.02 })
                //translateCard(cardObjects[i], (1,cardsIndexes[i] * 0.002 -.45,2), i * 0.02, 1);
            }

        }

        function translateCard(card, targetPos, delay, repeat){
            gsap.to(card.position, { duration: .1, y: targetPos, repeat: repeat, yoyo: true, ease: "power2.inOut", delay: delay });
        }


        function simulateGame(){


            //создали колоду
            generateCardsInef();

            //перемешали
            setTimeout(()=>shuffleCards(), 200);
            //setTimeout(()=>{translateCard(cardObjects[cardsIndexes[0]], (-.5, -.45, 1), 0, 0)}, 1000);
            //раздаем две карты игроку
            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[51]].position, { duration: .1, x: -.25, y: -.05, z: 4, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 0 })}, 2000) ;
            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[50]].position, { duration: .1, x:  .25, y: -.05, z: 4.01, repeat: 0, yoyo: true, ease: "power2.inOut", delay: .5 })}, 2000) ;


            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[51]].rotation, { duration: .1, x: Math.PI/3, y: Math.PI + .1, z: Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 0 })}, 2000) ;
            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[50]].rotation, { duration: .1, x: Math.PI/3, y: Math.PI -.1, z: Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: .5 })}, 2000) ;



            //раздаем 5 карт на стол
            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[49]].position, { duration: .1, x: -1.4, y: -.45, z: 1, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 1 })}, 2000) ;
            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[49]].rotation, { duration: .1, z: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 1 })}, 2000) ;

            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[48]].position, { duration: .1, x:  -.7, y: -.45, z: 1, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 1.5 })}, 2000) ;           
            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[48]].rotation, { duration: .1, z: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 1.5 })}, 2000) ;

            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[47]].position, { duration: .1, x:  0, y: -.45, z: 1, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 2 })}, 2000) ;           
            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[47]].rotation, { duration: .1, z: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 2 })}, 2000) ;

            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[46]].position, { duration: .1, x:  .7, y: -.45, z: 1, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 2.5 })}, 2000) ;           
            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[46]].rotation, { duration: .1, z: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 2.5 })}, 2000) ;

            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[44]].position, { duration: .1, x:  1.4, y: -.45, z: 1, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 3 })}, 2000) ;           
            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[44]].rotation, { duration: .1, z: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 3 })}, 2000) ;
        }
