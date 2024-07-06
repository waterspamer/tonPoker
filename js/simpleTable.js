
Telegram.WebApp.ready();



let userState = 0;

let pokerTableModel;

let rotationAnim;

let twentyFChips;
let decChips;
let fiveChips;
let oneChips;

let loadedFBX;
let chipsArray = [];

let playerBalance = 1000; //сосать с бэка

let chipShadowsArray = [];


const uvYOffset = 0.1186;
const uvXOffset = 0.07655;





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

// Load the texture
const chipTextureLoader = new THREE.TextureLoader();
const chipTexture = chipTextureLoader.load('resources/ChipTex.jpg', function (texture) {
    console.log(chipTexture);
    chipTexture.wrapS = chipTexture.wrapT = THREE.RepeatWrapping;
});


const chipShadowTexture = chipTextureLoader.load('resources/shadowTex.png', function (texture) {
    console.log(chipTexture);
    chipTexture.wrapS = chipTexture.wrapT = THREE.RepeatWrapping;
});

const shadowMaterial = new THREE.MeshBasicMaterial({
    map: chipShadowTexture,
    transparent: true,
    color: 0x001100,
    opacity: .8, // Set the desired opacity
});



const cardTexture = chipTextureLoader.load('resources/customCards.jpg', function (texture) {
    cardTexture.wrapS = cardTexture.wrapT = THREE.RepeatWrapping;
});


let cardMeshes = [];
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

            document.getElementById("connect-btn").addEventListener("click", ()=>{
                isStartAnim = false;

                gsap.to(previewC1.scale, {x: 0,y : -.04, z: .0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC2.scale, {x: 0,y : -.02, z: .0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC3.scale, {x: 0, y: -0.02, z: 0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC4.scale, {x: 0, y: -.02, z: -.0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(previewC5.scale, {x: 0, y : -.04, z: -.0, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });

                gsap.to(pokerTableModel.scale, {x: 0.044,y : 0.044, z: 0.044, duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(document.getElementById('hello-container'), {y: 100 + 'vh', duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(document.getElementById('footer-menu'), {x: 0 + 'px', duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
                gsap.to(document.getElementById('games-container'), {x: 0 + 'px', duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });

                //gsap.to(document.getElementById('top-cloud'), {x: 30 + 'vh', duration: .5, delay: 0, repeat: 0,  ease: "power2.inOut" });
            });

        }
    });
});


let isStartAnim = true;






function createParticles() {
    setInterval(() => {
        if (loadedCard) {
            const particle = createParticle();
            scene.add(particle);
            animateParticle(particle);
        }
    }, 100); // Adjust interval as needed
}

// Function to create a single particle
function createParticle() {
    const particle = loadedCard.clone();
    particle.traverse(function (child) {
        if (child.isMesh) {
            child.scale.set(3,3,3);
            child.material = new THREE.ShaderMaterial({
                uniforms: {
                    cardTexture: { value: cardTexture },
                    offsetX: { value: uvXOffset * Math.floor(Math.random() * 13) },
                    offsetY: { value: -uvYOffset * Math.floor(Math.random() * 4) },
                    
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                side: THREE.DoubleSide,
                transparent: true
            });
        }
    });
    return particle;
}

// Animate the particle using GSAP
function animateParticle(particle) {
    const timeline = gsap.timeline({
        onComplete: () => {
            scene.remove(particle);
        }
    });

    const spiralFactor = Math.random()*5;

    timeline.to(particle.position, {
        duration: 3,
        x: `+=${5}`,
        z: `+=${Math.cos(Math.PI * 2 * spiralFactor) * 2}`,
        y: 1,
        ease: "power1.inOut"
    });

    timeline.to(particle.rotation, {
        duration: 3,
        x: `+=${5}`,
        z: `+=${Math.cos(Math.PI * 2 * spiralFactor) * 2}`,
        y: 1,
        ease: "power1.inOut"
    });

    timeline.to(particle.material, {
        duration: 1,
        opacity: 0,
        ease: "power1.inOut"
    }, "-=1");
}




//createParticles();



const chipLoader = new THREE.FBXLoader();
chipLoader.load('resources/chip.fbx', function (object) {
    loadedFBX = object;
    loadedFBX.traverse(function (child) {
        if (child.isMesh) {
            child.material.map = chipTexture;
            console.log(chipTexture);
            child.material.needsUpdate = true;
        }
    });
});

let prevCount = 0;
let prevArrayState = chipsArray;

const colors = {
    10: new THREE.Vector3(.8, .1, .8), // Синий для 25
    5: new THREE.Vector3(.1, .8, .8), // Зеленый для 10
    2: new THREE.Vector3(.2, .35, .7), // Красный для 5
    1: new THREE.Vector3(.8, .8, .8) // Белый для 1
};

function createChips(chips) {

    
    
    

    // Начальная позиция для фишек
    let xPos = -0.65;
    clearChips();

    // Ensure the FBX model is loaded
    if (!loadedFBX) {
        console.error("FBX model not loaded yet.");
        return;
    }
    
    // Создание фишек
    for (let value in chips) {
        if (chips[value] >= 1){
            
        }
        for (let i = 0; i < chips[value]; i++) {
            
            const chip = loadedFBX.clone();
            chip.traverse(function (child) {
                if (child.isMesh) {
                    child.material = new THREE.ShaderMaterial({
                        uniforms: {
                            cardTexture: { value: chipTexture },
                            offsetX: { value: 0 },
                            offsetY: { value: 0 },
                            colorMultiplier: {value: colors[value]}
                        },
                        vertexShader: vertexShader,
                        fragmentShader: fragmentShader,
                        side: THREE.DoubleSide
                    });
                }
            });

            const geometry = new THREE.PlaneGeometry(5, 5);
            const plane = new THREE.Mesh(geometry, shadowMaterial);
            plane.scale.set(.1,.1,.1);
            plane.rotation.x = -1.5;
            //plane.rotation.set(1,0,0);
            
            scene.add(plane);
            var ranX =Math.random()*0.01;
            var ranZ =Math.random()*0.01;
            chipShadowsArray.push(plane);


            chip.scale.set(.055,.055,.055);

            chip.position.set(xPos + ranX, i * 0.05 -1.2, 1.47 + ranZ);
            chip.rotation.y = (0.5 - Math.random()) * 0.45;
            plane.position.set(xPos + ranX, i * 0.05 -1.2, 1.47 + ranZ);
            //gsap.to(chip.position, {y: i * 0.05, duration: .1, repeat: 0, delay: ease: "power2.inOut" });
            scene.add(chip);
            chipsArray.push(chip);
            tg.HapticFeedback.impactOccurred('soft');
        }
        xPos += 0.43;
    }


    if ( prevArrayState != chipsArray){
                playChipSound();
        prevCount = chipsArray.length;
        prevArrayState = chipsArray;

    }
}

// Функция для удаления всех фишек
function clearChips() {
    for (let chipShadow of chipShadowsArray){
        scene.remove(chipShadow);
        chipShadow.traverse(function (child) {
            if (child.isMesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
    }
    for (let chip of chipsArray) {
        scene.remove(chip);
        chip.traverse(function (child) {
            if (child.isMesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
    }
    chipsArray = [];
    chipShadowsArray = [];
}


function goToPokerTable(){
    document.getElementById("games-container").style.bottom = '-50vh';
    document.getElementById("footer-menu").style.bottom = '-50vh';
    document.getElementById('main-nav').classList.add('hidden');
    rangeSlide(10);
    //document.getElementById("play-poker-button").style.display = 'none';
    document.getElementById("betslidercontainer").style.display = 'block';
    rotationAnim.kill();
    setTimeout(()=>placeChips(10), 400);
    //gsap.to(pokerTableModel.rotation, { y: pokerTableModel.rotation.y + .3, duration: 1, repeat: 0, ease: "power2.Out" });
    gsap.to(pokerTableModel.rotation, {x: 0, y: -Math.PI/2, duration: 1, repeat: 0, ease: "power2.Out" });
    gsap.to(pokerTableModel.position, { z: -1, y: -1.3, duration: .5, repeat: 0, ease: "power2.inOut" });

    gsap.to(camera.position, { z: 2, y: .3, duration: .5, repeat: 0, ease: "power2.inOut" });
    //gsap.to(pokerTableModel.rotation, { x: 0, duration: .5, repeat: 0, ease: "power2.inOut" });
    
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

    const chipValues = [10, 5, 2, 1];
    const chips = { 10: 0, 5: 0, 2: 0, 1: 0 };

    for (let value of chipValues) {
        chips[value] = Math.floor(bet / value);
        bet %= value;
    }

    return chips;
}

const flopUrl = 'http://pokerjack.space/deal_texas_hold_em_solo';



function getCardSuitRank(id){
            
    //пики-буби-черви-крести
    var cardSuit = Math.floor((id) / 13);
    var cardRank = (id) % 13;
    return {suit: cardSuit, rank: cardRank};
}


let cardsIndexes = [];
for(let i =0; i < 52; i++){
    cardsIndexes.push(i);
}

function animateBlendShapes(mesh) {
    mesh.traverse(function (child) {
        if (child.isMesh && child.morphTargetInfluences) {
            const blendShapeCount = child.morphTargetInfluences.length;
            for (let i = 0; i < blendShapeCount; i++) {
                gsap.to(child.morphTargetInfluences, { duration: 0.5, [i]: 1 });
            }
        }
    });
}


var cardD1;
var cardD2;


function makeBet(){


    setTimeout(()=>{playCardSound()}, 500);
    setTimeout(()=>{playCardSound()}, 1000);
    setTimeout(()=>{playCardSound()}, 1500);
    setTimeout(()=>{playCardSound()}, 2000);
    setTimeout(()=>{playCardSound()}, 2500);
    console.log('flop bet');
    document.getElementById("bet-but").style.display = 'none';
    document.getElementById("call-but").style.display = '';
    document.getElementById("call-but").addEventListener('click', ()=> getTurn());
    document.getElementById("river-but").addEventListener('click', ()=> getReaver());
    document.getElementById("fold-but").style.display = '';
    document.getElementById("plus").style.display = 'none';
    document.getElementById("minus").style.display = 'none';
    document.getElementsByClassName("slidershell")[0].style.display = 'none';
    gsap.to(camera.position, { x: 0, y: 2.5, z: 1.09, duration: .3, repeat: 0, ease: "power2.inOut", delay: 0 });
    gsap.to(camera.rotation, { x: -1.3, duration: .3, repeat: 0, ease: "power2.inOut", delay: 0 });
    //переделать на бэк
    
    shuffleArray(cardsIndexes);


    //#region card player 1
    var rank = getCardSuitRank(cardsIndexes[0]).rank;
    var suit = getCardSuitRank(cardsIndexes[0]).suit;
    console.log(rank);
    
    var cardP1 = loadedCard.clone();
    
    cardP1.scale.set(.045, .045, .045);
    cardP1.rotation.set (Math.PI, 0, 0);
    cardP1.position.set (3, -.85, 0);
    gsap.to(cardP1.position, { x: -.3, z: .78, duration: .3, repeat: 0, ease: "power2.inOut", delay: .5 });
    gsap.to(cardP1.rotation, { x: 0, y: (0.5 - Math.random()) *.1,  duration: .3, repeat: 0, ease: "power2.inOut" , delay: .5 });
    

    cardP1.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * rank },
                                offsetY: { value: -uvYOffset * suit },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    scene.add(cardP1);    
    //#endregion 

    //#region card player 2
    rank = getCardSuitRank(cardsIndexes[1]).rank;
    suit = getCardSuitRank(cardsIndexes[1]).suit;
    console.log(rank);
    
    var cardP2 = loadedCard.clone();
    
    cardP2.scale.set(.045, .045, .045);
    cardP2.rotation.set (Math.PI, 0, 0);
    cardP2.position.set (3, -.85, 0);
    gsap.to(cardP2.position, { x: .3,  z: .78, duration: .3, repeat: 0, ease: "power2.inOut", delay: 1 });
    gsap.to(cardP2.rotation, { x: 0, y:(0.5 - Math.random()) *.1, duration: .3, repeat: 0, ease: "power2.inOut", delay: 1 });

    cardP2.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * rank },
                                offsetY: { value: -uvYOffset * suit },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    scene.add(cardP2);    
    //#endregion 

    rank = getCardSuitRank(cardsIndexes[2]).rank;
    suit = getCardSuitRank(cardsIndexes[2]).suit;


    cardD1 = loadedCard.clone();
    
    cardD1.scale.set(.045, .045, .045);
    cardD1.rotation.set (Math.PI, 0, 0);
    cardD1.position.set (3, -.85, 0);
    gsap.to(cardD1.position, { x: -.3, z: -1.15*2, duration: .3, repeat: 0, ease: "power2.inOut", delay: .75 });
    gsap.to(cardD1.rotation, { x: Math.PI, y: (0.5 - Math.random()) *.1,  duration: .3, repeat: 0, ease: "power2.inOut" , delay: .5 });
    

    cardD1.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * rank },
                                offsetY: { value: -uvYOffset * suit },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    scene.add(cardD1);    

    rank = getCardSuitRank(cardsIndexes[3]).rank;
    suit = getCardSuitRank(cardsIndexes[3]).suit;
    cardD2 = loadedCard.clone();
    
    cardD2.scale.set(.045, .045, .045);
    cardD2.rotation.set (Math.PI, 0, 0);
    cardD2.position.set (3, -.85, 0);
    gsap.to(cardD2.position, { x: .3, z: -1.15*2, duration: .3, repeat: 0, ease: "power2.inOut", delay: 1.25 });
    gsap.to(cardD2.rotation, { x: Math.PI, y: (0.5 - Math.random()) *.1,  duration: .3, repeat: 0, ease: "power2.inOut" , delay: .5 });
    

    cardD2.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * rank },
                                offsetY: { value: -uvYOffset * suit },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    scene.add(cardD2);    





    //#region table 1
    rank = getCardSuitRank(cardsIndexes[4]).rank;
    suit = getCardSuitRank(cardsIndexes[4]).suit;
    console.log(rank);
    
    var cardT1 = loadedCard.clone();
    
    cardT1.scale.set(.045, .045, .045);
    cardT1.rotation.set (Math.PI, 0, 0);
    cardT1.position.set (3, -.85, -.74);
    gsap.to(cardT1.position, { x: -1.2, duration: .3, repeat: 0, ease: "power2.inOut", delay: 1.5 });
    gsap.to(cardT1.rotation, { x: 0, y:(0.5 - Math.random()) *.1, duration: .3, repeat: 0, ease: "power2.inOut", delay: 1.5 });

    cardT1.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * rank },
                                offsetY: { value: -uvYOffset * suit },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    scene.add(cardT1);    
    //#endregion 
    
    //#region table 2
    rank = getCardSuitRank(cardsIndexes[5]).rank;
    suit = getCardSuitRank(cardsIndexes[5]).suit;
    console.log(rank);
    
    var cardT2 = loadedCard.clone();
    
    cardT2.scale.set(.045, .045, .045);
    cardT2.rotation.set (Math.PI, 0, 0);
    cardT2.position.set (3, -.85, -.74);
    gsap.to(cardT2.position, { x: -.6, duration: .3, repeat: 0, ease: "power2.inOut", delay: 2 });
    gsap.to(cardT2.rotation, { x: 0,y:(0.5 - Math.random()) *.1, duration: .3, repeat: 0, ease: "power2.inOut", delay: 2 });

    cardT2.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * rank },
                                offsetY: { value: -uvYOffset * suit },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    scene.add(cardT2);    
    //#endregion 

    //#region table 3
    rank = getCardSuitRank(cardsIndexes[6]).rank;
    suit = getCardSuitRank(cardsIndexes[6]).suit;
    console.log(rank);
    
    var cardT3 = loadedCard.clone();
    
    cardT3.scale.set(.045, .045, .045);
    cardT3.rotation.set (Math.PI, 0, 0);
    cardT3.position.set (3, -.85, -.74);
    gsap.to(cardT3.position, { x: 0, duration: .3, repeat: 0, ease: "power2.inOut", delay: 2.5 });
    gsap.to(cardT3.rotation, { x: 0,y:(0.5 - Math.random()) *.1, duration: .3, repeat: 0, ease: "power2.inOut", delay: 2.5 });

    cardT3.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * rank },
                                offsetY: { value: -uvYOffset * suit },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    scene.add(cardT3);    
    //#endregion 
    
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
    document.getElementById("call-but").style.display = 'none';
    document.getElementById("river-but").style.display = ''
    setTimeout(()=>{playCardSound()}, 500);
//#region table 4
    var rank = getCardSuitRank(cardsIndexes[7]).rank;
    var suit = getCardSuitRank(cardsIndexes[7]).suit;
    console.log(rank);
    
    var cardT4 = loadedCard.clone();
    
    cardT4.scale.set(.045, .045, .045);
    cardT4.rotation.set (Math.PI, 0, 0);
    cardT4.position.set (3, -.85, -.76);
    gsap.to(cardT4.position, { x: 0.6, duration: .3, repeat: 0, ease: "power2.inOut", delay: .5 });
    gsap.to(cardT4.rotation, { x: 0,y:(0.5 - Math.random()) *.1, duration: .3, repeat: 0, ease: "power2.inOut", delay: .5 });

    cardT4.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * rank },
                                offsetY: { value: -uvYOffset * suit },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    scene.add(cardT4);    
    //#endregion 
}

function getReaver(){

    setTimeout(()=>{playCardSound()}, 500);
//#region table 5
    var rank = getCardSuitRank(cardsIndexes[8]).rank;
    var suit = getCardSuitRank(cardsIndexes[8]).suit;
    console.log(rank);
    
    var cardT5 = loadedCard.clone();
    
    cardT5.scale.set(.045, .045, .045);
    cardT5.rotation.set (Math.PI, 0, 0);
    cardT5.position.set (3, -.85, -.76);
    gsap.to(cardT5.position, { x: 1.2, duration: .3, repeat: 0, ease: "power2.inOut", delay: .5 });
    gsap.to(cardT5.rotation, { x: 0,y:(0.5 - Math.random()) *.1, duration: .3, repeat: 0, ease: "power2.inOut", delay: .5 });

    cardT5.traverse(function (child) {
                    if (child.isMesh) {
                        
                        child.material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * rank },
                                offsetY: { value: -uvYOffset * suit },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
                            },
                            vertexShader: vertexShader,
                            fragmentShader: fragmentShader,
                            side: THREE.DoubleSide
                        });
                    }
                    });
    scene.add(cardT5);    


    gsap.to(cardD1.rotation, { x: 0, duration: .3, repeat: 0, ease: "power2.inOut", delay: 1.25 });
    gsap.to(cardD2.rotation, { x: 0, duration: .3, repeat: 0, ease: "power2.inOut", delay: 1.5 });


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
    uniform vec3 colorMultiplier;
    
    varying vec2 vUv;


    vec3 fresnelSchlick(float cosTheta, vec3 F0)
{
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}


    void main() {
        vec2 uv = vUv;
        if (!gl_FrontFacing) {
            //uv.x = vUv.x + 0.3825;
            uv.y = vUv.y - 0.47;
        } else {
            uv.x = vUv.x + offsetX;
            uv.y = vUv.y + offsetY;
        }
        gl_FragColor = texture2D(cardTexture, uv) * vec4(colorMultiplier, 1.0);
    }
`;

let cardObjects = [];


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
        //scene.background = new THREE.Color( 0x131217 );
        camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
        renderer.setClearColor( 0x000000, 0 );
        renderer.setPixelRatio(window.devicePixelRatio*1);
        renderer.setSize(window.innerWidth, window.innerHeight, true);
        
        document.getElementById('container').appendChild(renderer.domElement);


        const composer = new THREE.EffectComposer(renderer);
        const renderPass = new THREE.RenderPass(scene, camera);

        //const renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);

        // Настройка FXAA
        effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
effectFXAA.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * window.devicePixelRatio );
effectFXAA.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * window.devicePixelRatio );
composer.addPass( effectFXAA ); 
const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5,    // strength
    0.4,    // radius
    0.25    // threshold
);

const outputPass = new THREE.ShaderPass(THREE.CopyShader);
outputPass.renderToScreen = true;

composer.addPass(renderPass);
//composer.addPass(bloomPass);
composer.addPass(outputPass);
        const grainPass = new THREE.ShaderPass(GrainShader);
        grainPass.uniforms['amount'].value = 0.1;
        composer.addPass(grainPass);

        const colorDistortionPass = new THREE.ShaderPass(ColorDistortionShader);
        colorDistortionPass.uniforms['amount'].value = 0.00035;
  //      composer.addPass(colorDistortionPass);

        
        let gameStarted = false;


        const textureLoader = new THREE.TextureLoader();
            const tableTexture = textureLoader.load('resources/TableTex.jpg');
            const tableTopTexture = textureLoader.load('resources/violetTable.jpg');

        const fbxLoader = new THREE.FBXLoader();
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
                });;
                  const uvSetIndex = 2; // Номер UV-набора, который вы хотите использовать
            const uvAttribute = `uv${uvSetIndex}`;
            if (child.geometry.attributes[uvAttribute]) {
                child.geometry.attributes.uv = child.geometry.attributes[uvAttribute];
            }
                 if ((child).material) {
                     //((child).material).transparent = false
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
                 }
             })
             object.scale.set(.205, .205, .205);
             object.rotation.set (0, Math.PI/2, 0);
             object.position.y = 0;
             object.position.z = 0;
             object.position.x = 0;
             //gsap.to(object.position, { y: 55, duration: 1, repeat: -1, ease: "linear" });
            pokerTableModel.add(object);
        
             
        
            //rotationAnim = gsap.to(pokerTableModel.rotation, { y: pokerTableModel.rotation.y + Math.PI * 2, duration: 20, repeat: -1, ease: "linear" });
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
        )


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
        camera.position.y = 4;

        camera.rotation.set(-1.2,0,0);

        function animate() {
            requestAnimationFrame(animate);
            //composer.render(scene, camera);
            renderer.render(scene,camera);
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
                const uvYOffset = 0.1186;
                const uvXOffset = 0.07655;
                let i = 0;
                for (let suit = 0; suit < suits; suit++) {
                    for (let rank = 0; rank < ranks; rank++) {
                        const card = object.clone(true);
                        
                        const material = new THREE.ShaderMaterial({
                            uniforms: {
                                cardTexture: { value: cardTexture },
                                offsetX: { value: uvXOffset * rank },
                                offsetY: { value: -uvYOffset * suit },
                                colorMultiplier: {value: new THREE.Vector3(1, 1, 1)}
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
