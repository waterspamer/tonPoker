
Telegram.WebApp.ready();



let userState = 0;

let pokerTableModel;

let rotationAnim;

let twentyFChips;
let decChips;
let fiveChips;
let oneChips;
let chipsArray = [];


function createChips(chips) {
    const colors = {
        25: 0x0000aa, // Синий для 25
        10: 0x00aa00, // Зеленый для 10
        5: 0xff0000, // Красный для 5
        1: 0xffffff // Белый для 1
    };

    // Начальная позиция для фишек
    let xPos = -.3;
    clearChips();
    // Создание фишек
    for (let value in chips) {
        for (let i = 0; i < chips[value]; i++) {
            const geometry = new THREE.CylinderGeometry(.1, .1, 0.01, 32);
            const material = new THREE.MeshBasicMaterial({ color: colors[value] });
            const chip = new THREE.Mesh(geometry, material);
            chip.position.set(xPos, i* 0.1, 2);
            scene.add(chip);
            chipsArray.push(chip);
            tg.HapticFeedback.impactOccurred('soft');
        }
        xPos += .2;
    }
}

// Функция для удаления всех фишек
function clearChips() {
    for (let chip of chipsArray) {
        scene.remove(chip);
        chip.geometry.dispose();
        chip.material.dispose();
    }
    chipsArray = [];
}


function goToPokerTable(){
    document.getElementById("play-button").style.display = 'none';
    document.getElementById("betslidercontainer").style.display = 'block';
    rotationAnim.kill();
    gsap.to(pokerTableModel.rotation, { y: pokerTableModel.rotation.y + .3, duration: 1, repeat: 0, ease: "power2.Out" });

    gsap.to(pokerTableModel.position, { z: -1, y: -4, duration: .5, repeat: 0, ease: "power2.inOut" });
    gsap.to(pokerTableModel.rotation, { x: 0, duration: .5, repeat: 0, ease: "power2.inOut" });
    
    //gsap.to(pokerTableModel.position, { z: -1, duration: 1, repeat: 0, ease: "power2.inOut" });
}


function placeChips(bet){
    let ch =  breakBetIntoChips(bet);
    createChips(ch);

}


function breakBetIntoChips(bet) {
    if (bet < 1 || bet > 100) {
        throw new Error("Bet must be between 1 and 100 inclusive.");
    }

    const chipValues = [25, 10, 5, 1];
    const chips = { 25: 0, 10: 0, 5: 0, 1: 0 };

    for (let value of chipValues) {
        chips[value] = Math.floor(bet / value);
        bet %= value;
    }

    return chips;
}



function makeBet(){

}

function betOnTurn(){

}

function betOnReaver(){

}

function getFlop(){

}

function fold(){

}

function getTurn(){

}

function getReaver(){

}


const GrainShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'amount': { value: 10000.05 },
        'time': { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float amount;
        uniform float time;
        varying vec2 vUv;

        float rand(vec2 co) {
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }

        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            vec2 uvRandom = vUv;
            uvRandom.y *= rand(vec2(uvRandom.y, time));
            color.rgb += rand(uvRandom) * amount;
            gl_FragColor = color;
        }
    `
};

const ColorDistortionShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'amount': { value: 0.05 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float amount;
        varying vec2 vUv;

        void main() {
            vec2 uv = vUv;
            vec4 color = texture2D(tDiffuse, uv);
            float r = texture2D(tDiffuse, uv + vec2(amount, 0.0)).r;
            float g = texture2D(tDiffuse, uv + vec2(-amount, 0.0)).g;
            float b = texture2D(tDiffuse, uv + vec2(0.0, amount)).b;
            gl_FragColor = vec4(r, g, b, color.a);
        }
    `
};






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

let balance = 1000;

let flopEndPoint = 'https://1be7-176-231-182-34.ngrok-free.app/deal_texas_hold_em_solo';

let turnEndPoint = 'https://1be7-176-231-182-34.ngrok-free.app/deal_texas_hold_em_solo_turn';

let riverEndPoint = 'https://1be7-176-231-182-34.ngrok-free.app/deal_texas_hold_em_solo_river';

let scene, camera, renderer; 
        function bet() {
            Telegram.WebApp.sendData(JSON.stringify({message: "Симулировали раздачу"}));
            

            for (let i = 0; i< cardObjects.length; i++)
                scene.remove(cardObjects[i]);
            cardObjects = [];
             cardsIndexes = [];
             firstBet();



        }

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({antialias: true});

        renderer.setPixelRatio(window.devicePixelRatio*1);
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        
        document.getElementById('container').appendChild(renderer.domElement);


        const composer = new THREE.EffectComposer(renderer);
        const renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);

        // Настройка FXAA
        effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
effectFXAA.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * window.devicePixelRatio );
effectFXAA.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * window.devicePixelRatio );
composer.addPass( effectFXAA ); 

        const grainPass = new THREE.ShaderPass(GrainShader);
        grainPass.uniforms['amount'].value = 0.05;
        composer.addPass(grainPass);

        const colorDistortionPass = new THREE.ShaderPass(ColorDistortionShader);
        colorDistortionPass.uniforms['amount'].value = 0.00035;
        composer.addPass(colorDistortionPass);

        



        const textureLoader = new THREE.TextureLoader();
            const tableTexture = textureLoader.load('resources/TableTex.jpg');

        const fbxLoader = new THREE.FBXLoader();
        fbxLoader.load(
        'resources/tableLow.fbx',
        (object) => {
         object.traverse(function (child) {
             if ((child).isMesh) {
                  (child).material = material;
                  console.log(child.geometry.attributes);
                  const uvSetIndex = 2; // Номер UV-набора, который вы хотите использовать
            const uvAttribute = `uv${uvSetIndex}`;
            if (child.geometry.attributes[uvAttribute]) {
                child.geometry.attributes.uv = child.geometry.attributes[uvAttribute];
            }
                 if ((child).material) {
                     ((child).material).transparent = false
                 }
             }
         })
         object.scale.set(.06, .06, .06);
         object.rotation.set (-.2, Math.PI/2, 0);
         object.position.y = -5;
         object.position.z = -3;
         object.position.x = 0;
         pokerTableModel = object;
        scene.add(pokerTableModel);
        rotationAnim = gsap.to(pokerTableModel.rotation, { y: pokerTableModel.rotation.y + Math.PI * 2, duration: 20, repeat: -1, ease: "linear" });
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
        
        camera.position.z = 3;
        camera.position.y = 2;

        camera.rotation.set(-0.9,0,0);

        function animate() {
            requestAnimationFrame(animate);
            composer.render(scene, camera);
            grainPass.uniforms['time'].value += 0.01;
        }

        animate();
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        


        async function generateCardsInef(){
            for (obj in cardObjects) scene.remove(obj);
            cardObjects = [];
            cardsIndexes = [];
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
                                child.scale.set(6, 6, 6);
                                child.rotation.set(Math.PI/2, 0, 0);
                                child.material = material;
                                child.morphTargetInfluences[0] = 1;
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


        function getCardNominal(id){
            
            var cardIndex = cardsIndexes[id];
            //пики-буби-черви-крести
            var cardSuit = Math.floor((cardIndex) / 13);
            var cardRank = (cardIndex) % 13;
            return {suit: cardSuit, rank: cardRank};
        }

        function stringifyNominal(nominal){
            var result = "";
            if (nominal.rank === 0) result+="A";
            if (nominal.rank === 1) result+="2";
            if (nominal.rank === 2) result+="3";
            if (nominal.rank === 3) result+="4";
            if (nominal.rank === 4) result+="5";
            if (nominal.rank === 5) result+="6";
            if (nominal.rank === 6) result+="7";
            if (nominal.rank === 7) result+="8";
            if (nominal.rank === 8) result+="9";
            if (nominal.rank === 9) result+="10";
            if (nominal.rank === 10) result+="J";
            if (nominal.rank === 11) result+="Q";
            if (nominal.rank === 12) result+="K";

            if (nominal.suit === 0) result+="♠";
            if (nominal.suit === 1) result+="♦";
            if (nominal.suit === 2) result+="♥";
            if (nominal.suit === 3) result+="♣";

            return result;
        }

        

        function convertCard(id){
            var s = id;
            if (s % 13 === 0) {s += 12}
            else{
                s-=1;
            }
            return s;
        }

        function firstBet(){
            
            balance -= 100;
            document.getElementById('balance').innerText = `БАЛАНС: ${balance}TON`;
            //dealTexasHoldEm(2);

            //console.log(findBestHandTexasHoldEm([1,5], [10, 15, 16, 17,18])[0].display );
            document.getElementById('mult').style.display = '';

            //создали колоду
            generateCardsInef();

            //перемешали
            //setTimeout(()=>shuffleCards(), 200);
            var flop = fetchDataFromJSON(flopEndPoint);
            console.log(flop);

             

            //раздаем две карты игроку
            setTimeout(()=> {
                gsap.to(cardObjects[cardsIndexes[flop.table[0]]].position, { duration: .2, x: -.25, y: .15, z: 3, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 0 });
                gsap.to(cardObjects[cardsIndexes[flop.table[1]]].position, { duration: .2, x:  .25, y: .15, z: 3.01, repeat: 0, yoyo: true, ease: "power2.inOut", delay: .5 });
                gsap.to(cardObjects[cardsIndexes[flop.table[0]]].rotation, { duration: .2, x: Math.PI/4, y: Math.PI + .1, z: Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 0 });
                gsap.to(cardObjects[cardsIndexes[flop.table[1]]].rotation, { duration: .2, x: Math.PI/4, y: Math.PI -.1, z: Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: .5 });
                document.getElementById('playercards').innerText = `игрок: ${stringifyNominal (getCardNominal(51))}, ${stringifyNominal (getCardNominal(50))} `;
            }, 2000) ;

            //раздаем две карты дилеру
            setTimeout(()=> {
                gsap.to(cardObjects[cardsIndexes[49]].position, { duration: .2, x:  -0.35, y: -.45, z: -0.5, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 1 });
                gsap.to(cardObjects[cardsIndexes[48]].position, { duration: .2, x:  0.35, y: -.45, z: -0.5, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 1.5 });
                gsap.to(cardObjects[cardsIndexes[49]].rotation, { duration: .2, x: 0, y: 0, z: 0, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 1 });
                gsap.to(cardObjects[cardsIndexes[48]].rotation, { duration: .2, x: 0, y: 0, z: 0, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 1.5 });
                document.getElementById('dealercards').innerText = `дилер: *, * `;
            }, 2000) ;
        



            //раздаем 3 карты на стол
            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[47]].position, { duration: .3, x: -1.4, y: -.45, z: 1, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 2 })}, 2000) ;
            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[47]].rotation, { duration: .3, z: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 2 })}, 2000) ;

            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[46]].position, { duration: .3, x:  -.7, y: -.45, z: 1, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 2.3 })}, 2000) ;           
            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[46]].rotation, { duration: .3, z: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 2.3 })}, 2000) ;

            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[45]].position, { duration: .3, x:  0, y: -.45, z: 1, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 2.6 })}, 2000) ;           
            setTimeout(()=> {gsap.to(cardObjects[cardsIndexes[45]].rotation, { duration: .3, z: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 2.6 });
            document.getElementById('tablecards').innerText = `стол: ${stringifyNominal (getCardNominal(47))}, ${stringifyNominal (getCardNominal(46))}, ${stringifyNominal (getCardNominal(45))}`;;
        }, 2000) ;

            

           document.getElementById('bet').style.display = "none";
           //document.getElementById('mult').addEventListener('click', ()=> secondBet());
           document.getElementById('fold').style.display = '';

        }

        function reset(){
            removeAllCards();
            cardsIndexes = [];
            document.getElementById('bet').style.display = "";
            document.getElementById('mult').style.display = 'none';
            document.getElementById('fold').style.display = 'none';
        }

        function removeAllCards() {
            cardObjects.forEach(card => {
                scene.remove(card);
                card.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry.dispose();
                        child.material.dispose();
                    }
                });
            });
            cardObjects.length = 0; // Очистить массив
        }


        function secondBet(){
            balance -= 200;
            document.getElementById('balance').innerText = `БАЛАНС: ${balance}TON`;
            document.getElementById('balance').innerText = `БАЛАНС: ${balance}TON`;

            setTimeout(()=> {
            gsap.to(cardObjects[cardsIndexes[44]].position, { duration: .3, x:  .7, y: -.45, z: 1, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 0 });
            gsap.to(cardObjects[cardsIndexes[44]].rotation, { duration: .3, z: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 0 });
            gsap.to(cardObjects[cardsIndexes[43]].position, { duration: .3, x:  1.4, y: -.45, z: 1, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 0.3 });
            gsap.to(cardObjects[cardsIndexes[43]].rotation, { duration: .3, z: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 0.3 });
            gsap.to(cardObjects[cardsIndexes[49]].rotation, { duration: .2, x: 0, y: 0, z: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 1 });
            gsap.to(cardObjects[cardsIndexes[48]].rotation, { duration: .2, x: 0, y: 0, z: -Math.PI, repeat: 0, yoyo: true, ease: "power2.inOut", delay: 1.5 });
            document.getElementById('tablecards').innerText = `стол: ${stringifyNominal (getCardNominal(47))}, ${stringifyNominal (getCardNominal(46))}, ${stringifyNominal (getCardNominal(45))}, ${stringifyNominal (getCardNominal(44))}, ${stringifyNominal (getCardNominal(43))}`;;
            document.getElementById('dealercards').innerText = `дилер: ${stringifyNominal (getCardNominal(49))}, ${stringifyNominal (getCardNominal(48))} `;


            //собираем стол
            var table = [ 
                convertCard(cardsIndexes[47]),
                convertCard(cardsIndexes[46]),
                convertCard(cardsIndexes[45]),
                convertCard(cardsIndexes[44]),
                convertCard(cardsIndexes[43])];

            //собираем карты игрока
            var player = [
                convertCard(cardsIndexes[51]),
                convertCard(cardsIndexes[50])
            ];

            //собираем карты дилера
            var dealer = [
                convertCard(cardsIndexes[49]),
                convertCard(cardsIndexes[48])
            ];


            var playerHand = findBestHandTexasHoldEm(player, table);

            

            var dealerHand = findBestHandTexasHoldEm(dealer, table);

            console.log(playerHand[0].rankValue - dealerHand[0].rankValue);


            setTimeout(()=>{
                if (playerHand[0].rankValue - dealerHand[0].rankValue > 0){
                    var res = document.getElementById('gameresult');
                    res.innerText = "Залутал";
                    res.style.opacity = '1';
                    
                    setTimeout(()=>{res.style.opacity = '0';
                    balance+=400;
                    document.getElementById('balance').innerText = `БАЛАНС: ${balance}TON`;
                    reset();
                    }, 2000)
                };
    
                if (playerHand[0].rankValue - dealerHand[0].rankValue === 0){
                    var res = document.getElementById('gameresult');
                    console.log(res);
                    res.innerText = "Ничья";
                    balance+=300;
                    res.style.opacity = '1';
                    setTimeout(()=>{res.style.opacity = '0';
                    reset();
                    }, 2000)
                }
    
                if (playerHand[0].rankValue - dealerHand[0].rankValue < 0){
                    var res = document.getElementById('gameresult');
                    console.log(res);
                    res.innerText = "Проебал";
                    res.style.opacity = '1';
                    setTimeout(()=>{res.style.opacity = '0';
                    reset();
                    }, 2000)
                }
            }, 1000);

        }, 0) ;           
        }
