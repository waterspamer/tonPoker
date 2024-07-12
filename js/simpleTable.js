
Telegram.WebApp.ready();




let cardObjects = [];



let userState = 0;

let twentyFChips;
let decChips;
let fiveChips;
let oneChips;

let loadedFBX;
let chipsArray = [];

let playerBalance = 1000; //сосать с бэка

let chipShadowsArray = [];




//#region Simulation

async function simulateGamesServer() {
    var simBalance = 500;

    var flushes = 0;
    var fHouses = 0;
    var cares = 0;
    var sFlush = 0;
    var rFlush = 0;

    for (let j = 0; j < 10000; j++) {
        let deck = [];

        try {
            // Initialise the game for the user
            const initResponse = await fetch(`https://pokerjack.space/initialise_texas_hold_em/?user_id=${j}`, {
                mode: 'cors',
            });

            if (!initResponse.ok) {
                throw new Error('Network response was not ok: ' + initResponse.statusText);
            }

            // Get the deck for the user
            const deckResponse = await fetch(`https://pokerjack.space/deck/?user_id=${j}`, {
                mode: 'cors',
            });

            if (!deckResponse.ok) {
                throw new Error('Deck response was not ok: ' + deckResponse.statusText);
            }

            // Parse the deck response
            const data = await deckResponse.json();
            deck = JSON.parse(data); // Parse the JSON string to an array

            console.log('Success:', deck);

            // Collect the table cards
            var table = [
                deck[4],
                deck[5],
                deck[6],
                deck[7],
                deck[8]
            ];

            // Collect player cards
            var player = [
                deck[0],
                deck[1]
            ];

            // Collect dealer cards
            var dealer = [
                deck[2],
                deck[3]
            ];

            console.log(j);

            var playerHand = findBestHandTexasHoldEm(player, table);
            console.log(playerHand);

            var dealerHand = findBestHandTexasHoldEm(dealer, table);

            var result = playerHand[0].rankValue - dealerHand[0].rankValue;

            if (result < 0) {
                simBalance -= 10;
            }

            if (result > 0) {
                switch (playerHand[0].rankDescription) {
                    case 'Flush':
                        simBalance += 60;
                        flushes++;
                        break;
                    case 'Full House':
                        simBalance += 120;
                        fHouses++;
                        break;
                    case 'Quads':
                        simBalance += 210;
                        cares++;
                        break;
                    case 'Straight Flush':
                        simBalance += 270;
                        sFlush++;
                        break;
                    case 'Royal Flush':
                        simBalance += 420;
                        rFlush++;
                        break;
                    default:
                        simBalance += 20;
                }
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            break; // Exit the loop if there's a fetch error
        }
    }

    console.log(flushes + ' флешей, ' +
        fHouses + ' фул хаузов, ' + cares + ' каре, ' +
        sFlush + ' стрит флешей, ' + rFlush + ' роял флешей');
    console.log('Баланс за 10.000 игр при начальной ставке 10: ' + simBalance);
}



async function simulateGames() {
    var simBalance = 500;

    var flushes = 0;
    var fHouses = 0;
    var cares = 0;
    var sFlush = 0;
    var rFlush = 0;
    var dq = 0;

    for (let j = 0; j < 10000; j++) {
        let deck = [];

            for (let i = 0; i < 52; i++)
                deck.push(i);
            //deck = data; // Assuming the response contains a "deck" property with the shuffled deck array
            shuffleArray(deck);

            // соберем стол
            var table = [
                deck[4],
                deck[5],
                deck[6],
                deck[7],
                deck[8]
            ];

            // соберем карты игрока
            var player = [
                deck[0],
                deck[1]
            ];

            // соберем карты дилера
            var dealer = [
                deck[2],
                deck[3]
            ];

            console.log(j);

            var playerHand = findBestHandTexasHoldEm(player, table);
            console.log(playerHand);

            var dealerHand = findBestHandTexasHoldEm(dealer, table);

            var result = playerHand[0].rankValue - dealerHand[0].rankValue;


            if (findBestHandTexasHoldEm(player, [deck[4],
                deck[5],
                deck[6]])[0].rankValue > 2000100000){
                    console.log("идем с ")
                    simBalance-=30;
                    if (result > 0){
                        if (dealerHand[0].rankValue > 2000100000){
                            simBalance+=60;
                            dq++;                        
                        }                        
                        else simBalance+=40;
                    }
                }
            else 
            {
                if (dealerHand[0].rankValue > 2000100000){
                    dq++;                        
                }  
                simBalance-=10;      
            }
                
            
            

                 if (playerHand[0].rankDescription === 'Flush') {
                    simBalance += 60;
                    flushes++;
                } else if (playerHand[0].rankDescription === 'Full House') {
                    simBalance += 90;
                    fHouses++;
                } else if (playerHand[0].rankDescription === 'Quads') {
                    simBalance += 210;
                    cares++;
                } else if (playerHand[0].rankDescription === 'Straight Flush') {
                    simBalance += 270;
                    sFlush++;
                } else if (playerHand[0].rankDescription === 'Royal Flush') {
                    simBalance += 420;
                    rFlush++;
                } else {
                    simBalance += 20;
                } 
            

        
    }



    console.log(flushes + ' флешей, ' +
        fHouses + ' фул хаузов, ' + cares + ' каре, ' +
        sFlush + ' стрит флешей, ' + rFlush + ' роял флешей');

        console.log(dq + ' раз у дилера старше чем пара четверок');
    console.log('Баланс за 10.000 игр при начальной ставке 10: ' + simBalance);
}

//simulateGamesServer();



//#endregion









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
    10: new THREE.Vector3(1, .8, 0), // Синий для 25
    5: new THREE.Vector3(.1, .8, .8), // Зеленый для 10
    2: new THREE.Vector3(.2, .35, .7), // Красный для 5
    1: new THREE.Vector3(.8, .8, .8) // Белый для 1
};

const rimColors = {
    10: new THREE.Vector3(0, .8, 1),
    5: new THREE.Vector3(.5, .1, .3), 
    2: new THREE.Vector3(.2, .35, .7), 
    1: new THREE.Vector3(.8, .8, .8) 
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
            var ranX = Math.random()*0.01;
            var ranZ = Math.random()*0.01;
            chipShadowsArray.push(plane);


            chip.scale.set(.055,.055,.055);

            chip.position.set(xPos + ranX, i * 0.05 -1.2, 1.5 + ranZ);
            chip.rotation.y = (0.5 - Math.random()) * 0.45;
            plane.position.set(xPos + ranX, i * 0.05 -1.2, 1.5 + ranZ);
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

    for (let i = 0; i< cardObjects.length; i++)
        scene.remove(cardObjects[i]);
    cardObjects = [];
     cardsIndexes = [];
     for(let i =0; i < 52; i++){
        cardsIndexes.push(i);
    }

    
    console.log('p table');


    document.getElementById("games-container").style.bottom = '-50vh';
   /*  document.getElementById("bank-button").classList.remove("action-button-active");
    document.getElementById("bank-button").classList.add("action-button-inactive");
    document.getElementById("bet-button").classList.remove("action-button-inactive");
    document.getElementById("bet-button").classList.add("action-button-active"); */
    document.getElementById("bank-button").style.display = 'none';
    document.getElementById("bet-button").style.display = '';
    document.getElementsByClassName("slidershell")[0].style.display = '';
    //document.getElementById("footer-menu").style.bottom = '-50vh';
    document.getElementById("betslidercontainer").style.display = '';
    document.getElementById('main-nav').classList.add('hidden');
    setValue(bet, 1, false);
    //document.getElementById("play-poker-button").style.display = 'none';
    
    rotationAnim.kill();
    setTimeout(()=>placeChips(bet), 400);
    //gsap.to(pokerTableModel.rotation, { y: pokerTableModel.rotation.y + .3, duration: 1, repeat: 0, ease: "power2.Out" });
    gsap.to(pokerTableModel.rotation, {x: 0, y: -Math.PI/2, duration: 1, repeat: 0, ease: "power2.Out" });
    gsap.to(pokerTableModel.position, { z: -1, y: -1.3, duration: .5, repeat: 0, ease: "power2.inOut" });

    gsap.to(camera.position, { x: 0, z: 3, y: .7, duration: .5, repeat: 0, ease: "power2.inOut" });
    //gsap.to(camera.rotation, { x: -1.3, z : -.5, duration: .5, repeat: 0, ease: "power2.inOut" });
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

var balance =500;

var bet = 10;


function makeBet(){
    canFold = true;
    bet = document.getElementById('slider1').value;
    console.log(bet);
    balance -= bet;
    document.getElementById('balance-f').innerHTML = balance + '$';
    document.getElementById('fold-button').style.opacity = '1';

    document.getElementById('fold-button').style.pointerEvents = 'none';
    setTimeout(()=>{
        document.getElementById('fold-button').style.pointerEvents = '';
    }, 3000);


    document.getElementById("bet-button").style.display = 'none';
    document.getElementById("turn-button").style.display = '';


    document.getElementById('turn-button').style.pointerEvents = 'none';
    setTimeout(()=>{
        document.getElementById('turn-button').style.pointerEvents = '';
    }, 3000);


    setTimeout(()=>{playCardSound()}, 500);
    setTimeout(()=>{playCardSound()}, 1000);
    setTimeout(()=>{playCardSound()}, 1500);
    setTimeout(()=>{playCardSound()}, 2000);
    setTimeout(()=>{playCardSound()}, 2500);
    console.log('flop bet');

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
    
    cardP1.scale.set(.051, .051, .051);
    cardP1.rotation.set (Math.PI, 0, 0);
    cardP1.position.set (3, -1.29, 0);
    gsap.to(cardP1.position, { x: -.34, z: .73, duration: .3, repeat: 0, ease: "power2.inOut", delay: .5 });
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

    cardObjects.push(cardP1);
    scene.add(cardP1);    
    //#endregion 

    //#region card player 2
    rank = getCardSuitRank(cardsIndexes[1]).rank;
    suit = getCardSuitRank(cardsIndexes[1]).suit;
    console.log(rank);
    
    var cardP2 = loadedCard.clone();
    
    cardP2.scale.set(.051, .051, .051);
    cardP2.rotation.set (Math.PI, 0, 0);
    cardP2.position.set (3, -1.29, 0);
    gsap.to(cardP2.position, { x: .34,  z: .73, duration: .3, repeat: 0, ease: "power2.inOut", delay: 1 });
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

                    cardObjects.push(cardP2);
    scene.add(cardP2);    
    //#endregion 

    rank = getCardSuitRank(cardsIndexes[2]).rank;
    suit = getCardSuitRank(cardsIndexes[2]).suit;


    cardD1 = loadedCard.clone();
    
    cardD1.scale.set(.051, .051, .051);
    cardD1.rotation.set (Math.PI, 0, 0);
    cardD1.position.set (3, -1.29, 0);
    gsap.to(cardD1.position, { x: -.34, z: -1.37*2, duration: .3, repeat: 0, ease: "power2.inOut", delay: .75 });
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

                    cardObjects.push(cardD1);
    scene.add(cardD1);    

    rank = getCardSuitRank(cardsIndexes[3]).rank;
    suit = getCardSuitRank(cardsIndexes[3]).suit;
    cardD2 = loadedCard.clone();
    
    cardD2.scale.set(.051, .051, .051);
    cardD2.rotation.set (Math.PI, 0, 0);
    cardD2.position.set (3, -1.29, 0);
    gsap.to(cardD2.position, { x: .34, z: -1.37*2, duration: .3, repeat: 0, ease: "power2.inOut", delay: 1.25 });
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


                    cardObjects.push(cardD2);
    scene.add(cardD2);    





    //#region table 1
    rank = getCardSuitRank(cardsIndexes[4]).rank;
    suit = getCardSuitRank(cardsIndexes[4]).suit;
    console.log(rank);
    
    var cardT1 = loadedCard.clone();
    
    cardT1.scale.set(.051, .051, .051);
    cardT1.rotation.set (Math.PI, 0, 0);
    cardT1.position.set (3,-1.29, -1);
    gsap.to(cardT1.position, { x: -1.36, duration: .3, repeat: 0, ease: "power2.inOut", delay: 1.5 });
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


                    cardObjects.push(cardT1);
    scene.add(cardT1);    
    //#endregion 
    
    //#region table 2
    rank = getCardSuitRank(cardsIndexes[5]).rank;
    suit = getCardSuitRank(cardsIndexes[5]).suit;
    console.log(rank);
    
    var cardT2 = loadedCard.clone();
    
    cardT2.scale.set(.051, .051, .051);
    cardT2.rotation.set (Math.PI, 0, 0);
    cardT2.position.set (3, -1.29, -1);
    gsap.to(cardT2.position, { x: -.7, duration: .3, repeat: 0, ease: "power2.inOut", delay: 2 });
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
    
                    cardObjects.push(cardT2);
                    scene.add(cardT2);    
    //#endregion 

    //#region table 3
    rank = getCardSuitRank(cardsIndexes[6]).rank;
    suit = getCardSuitRank(cardsIndexes[6]).suit;
    console.log(rank);
    
    var cardT3 = loadedCard.clone();
    
    cardT3.scale.set(.051, .051, .051);
    cardT3.rotation.set (Math.PI, 0, 0);
    cardT3.position.set (3, -1.29, -1);
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



                    cardObjects.push(cardT3);
    scene.add(cardT3);    
    //#endregion 
    
}

function betOnTurn(){

}

function betOnReaver(){

}

function getFlop(){

}



function getTurn(){
    canFold = true;
    balance -= bet;
    document.getElementById('balance-f').innerHTML = balance + '$';
    //document.getElementById("turn-but").style.display
    document.getElementById("turn-button").style.display = 'none';
    document.getElementById("river-button").style.display = ''

    document.getElementById('river-button').style.pointerEvents = 'none';
    setTimeout(()=>{
        document.getElementById('river-button').style.pointerEvents = '';
    }, 1000);

    document.getElementById('fold-button').style.pointerEvents = 'none';
    setTimeout(()=>{
        document.getElementById('fold-button').style.pointerEvents = '';
    }, 1000);

    setTimeout(()=>{playCardSound()}, 500);
//#region table 4
    var rank = getCardSuitRank(cardsIndexes[7]).rank;
    var suit = getCardSuitRank(cardsIndexes[7]).suit;
    console.log(rank);
    
    var cardT4 = loadedCard.clone();
    
    cardT4.scale.set(.051, .051, .051);
    cardT4.rotation.set (Math.PI, 0, 0);
    cardT4.position.set (3, -1.29, -1);
    gsap.to(cardT4.position, { x: 0.7, duration: .3, repeat: 0, ease: "power2.inOut", delay: .5 });
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



                    cardObjects.push(cardT4);
    scene.add(cardT4);    
    //#endregion 
}

let canFold = false;

function fold(){
    if (!canFold) return;


    goToPokerTable();
    document.getElementsByClassName("slidershell")[0].style.display = '';
    canFold = false;
    document.getElementById('fold-button').style.opacity = '.0';
    document.getElementById("river-button").style.display = 'none';
    document.getElementById("turn-button").style.display = 'none';
    document.getElementById("bet-button").style.display = '';
    gsap.to(camera.position, { x: 0, z: 3, y: .7, duration: .5, repeat: 0, ease: "power2.inOut" });
}

function getReaver(){
    canFold = false;
    balance -= bet;
    document.getElementById('balance-f').innerHTML = balance + '$';
    document.getElementById('fold-button').style.opacity = '.0';
    document.getElementById("river-button").style.display = 'none';
    document.getElementById("bet-button").style.display = '';
    
    //document.getElementById("turn-button").style.display = '';

    setTimeout(()=>{playCardSound()}, 500);
//#region table 5
    var rank = getCardSuitRank(cardsIndexes[8]).rank;
    var suit = getCardSuitRank(cardsIndexes[8]).suit;
    console.log(rank);
    
    var cardT5 = loadedCard.clone();
    
    cardT5.scale.set(.051, .051, .051);
    cardT5.rotation.set (Math.PI, 0, 0);
    cardT5.position.set (3, -1.29, -1);
    gsap.to(cardT5.position, { x: 1.36, duration: .3, repeat: 0, ease: "power2.inOut", delay: .5 });
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



    cardObjects.push(cardT5);
    scene.add(cardT5);    


    gsap.to(cardD1.rotation, { x: 0, duration: .3, repeat: 0, ease: "power2.inOut", delay: 1.25 });
    gsap.to(cardD2.rotation, { x: 0, duration: .3, repeat: 0, ease: "power2.inOut", delay: 1.5 });

     //собираем стол
     var table = [ 
        cardsIndexes[4],
        cardsIndexes[5],
        cardsIndexes[6],
        cardsIndexes[7],
        cardsIndexes[8]];

    //собираем карты игрока
    var player = [
        cardsIndexes[0],
        cardsIndexes[1]
    ];

    //собираем карты дилера
    var dealer = [
        cardsIndexes[2],
        cardsIndexes[3]
    ];
    console.log("player: "+ handDisplay(player));
    console.log("dealer: "+ handDisplay(dealer));
    console.log("table: "+ handDisplay(table));

    var playerHand = findBestHandTexasHoldEm(player, table);
    console.log(playerHand);

    

            

    var dealerHand = findBestHandTexasHoldEm(dealer, table);




    var result = playerHand[0].rankValue - dealerHand[0].rankValue;

    if (result > 0 ) {
        setTimeout(()=>{
            document.getElementById("game-result").innerHTML = 'win +' + bet*5 + '$';
            document.getElementById("game-result").style.opacity = '1';
            document.getElementById("game-result").style.color = 'green';
            setTimeout(()=>{document.getElementById("game-result").style.opacity = '0'}, 1000);
            balance += bet*5;
    document.getElementById('balance-f').innerHTML = balance + '$';

        }, 1000);
        
    }

    if (result === 0 ) {

        setTimeout(()=>{
            document.getElementById("game-result").innerHTML = 'draw +' + bet*3 + '$';
            document.getElementById("game-result").style.opacity = '1';
            document.getElementById("game-result").style.color = 'grey';
            setTimeout(()=>{document.getElementById("game-result").style.opacity = '0'}, 1000);


        }, 1000);

        balance += bet*3;
    document.getElementById('balance-f').innerHTML = balance + '$';
    }

    if (result < 0 ) {
        setTimeout(()=>{
            document.getElementById("game-result").innerHTML = 'lose -' + bet*3 + '$';
            document.getElementById("game-result").style.opacity = '1';
            document.getElementById("game-result").style.color = 'red';
            setTimeout(()=>{document.getElementById("game-result").style.opacity = '0'}, 1000);


        }, 1000);
    }

    setTimeout(()=>{gsap.to(camera.position, { x: 0, z: 3, y: .7, duration: .5, repeat: 0, ease: "power2.inOut" });
goToPokerTable();}, 4000);


document.getElementById('bet-button').style.pointerEvents = 'none';
setTimeout(()=>{
    document.getElementById('bet-button').style.pointerEvents = '';
}, 4000);

}













    

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
