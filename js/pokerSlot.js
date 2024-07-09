function goToSlots(){
    console.log('slot mode');
    document.getElementById("betslidercontainer").style.display = '';
    document.getElementById("games-container").style.bottom = '-50vh';
    document.getElementById("spin-button").style.display = '';
    document.getElementById("bank-button").style.display = 'none';
    gsap.to(pokerTableModel.rotation, {x: 0, y: -Math.PI/2, duration: 1, repeat: 0, ease: "power2.Out" });
    gsap.to(pokerTableModel.position, { z: -1, y: -1.3, duration: .5, repeat: 0, ease: "power2.inOut" });
    rotationAnim.kill();
    gsap.to(camera.position, { x: 0, z: 1, y: 2.1, duration: .5, repeat: 0, ease: "power2.inOut" });
    gsap.to(camera.rotation, { x: -1.5, z: 0, y: 0, duration: .5, repeat: 0, ease: "power2.inOut" });
    document.getElementsByClassName("slidershell")[0].style.display = '';
    document.getElementById("combo-info").style.display = '';
}



let currentCardsOnDeck = [];

function playSingleTime(){

    bet = document.getElementById('slider1').value;
    balance -= bet;
    document.getElementById('balance-f').innerHTML = balance + '$';

    for (let i = 0; i< cardObjects.length; i++)
        scene.remove(cardObjects[i]);
    cardObjects = [];

    var card1 = loadedCard.clone();
    var card2 = loadedCard.clone();
    var card3 = loadedCard.clone();
    var card4 = loadedCard.clone();
    var card5 = loadedCard.clone();

    shuffleArray(cardsIndexes);

    var rank = getCardSuitRank(cardsIndexes[0]).rank;
    var suit = getCardSuitRank(cardsIndexes[0]).suit;
    
    
    card1.scale.set(.0, .0, .0);
    gsap.to(card1.scale, { x: .053,y:.053, z: .053, duration: .1, repeat: 0, ease: "power2.inOut", delay: .0 });
    gsap.to(card1.scale, { x: .051,y:.051, z: .051, duration: .05, repeat: 0, ease: "power2.inOut", delay: .1 });
    card1.rotation.set (0, 0, 0);
    card1.position.set (-1.36, -1.29, -1);
    
    

    card1.traverse(function (child) {
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

    cardObjects.push(card1);
    scene.add(card1);    

    var rank = getCardSuitRank(cardsIndexes[1]).rank;
    var suit = getCardSuitRank(cardsIndexes[1]).suit;
    var card2 = loadedCard.clone();
    
    card2.scale.set(.0, .0, .0);
    gsap.to(card2.scale, { x: .053,y:.053, z: .053, duration: .1, repeat: 0, ease: "power2.inOut", delay: .1 });
    gsap.to(card2.scale, { x: .051,y:.051, z: .051, duration: .05, repeat: 0, ease: "power2.inOut", delay: .2 });
    card2.rotation.set (0, 0, 0);
    card2.position.set (-.68, -1.29, -1);
    
    

    card2.traverse(function (child) {
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

    cardObjects.push(card2);
    scene.add(card2);   

    var rank = getCardSuitRank(cardsIndexes[2]).rank;
    var suit = getCardSuitRank(cardsIndexes[2]).suit;
    var card3 = loadedCard.clone();
    
    card3.scale.set(.0, .0, .0);
    gsap.to(card3.scale, { x: .051,y:.051, z: .051, duration: .1, repeat: 0, ease: "power2.inOut", delay: .2});
    card3.rotation.set (0, 0, 0);
    card3.position.set (0, -1.29, -1);
    
    

    card3.traverse(function (child) {
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

    cardObjects.push(card3);
    scene.add(card3);   

    var rank = getCardSuitRank(cardsIndexes[3]).rank;
    var suit = getCardSuitRank(cardsIndexes[3]).suit;
    var card4 = loadedCard.clone();
    
    card4.scale.set(.0, .0, .0);
    gsap.to(card4.scale, { x: .051,y:.051, z: .051, duration: .1, repeat: 0, ease: "power2.inOut", delay: 0.3 });
    card4.rotation.set (0, 0, 0);
    card4.position.set (.68, -1.29, -1);
    
    

    card4.traverse(function (child) {
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

    cardObjects.push(card4);
    scene.add(card4);   

    var rank = getCardSuitRank(cardsIndexes[4]).rank;
    var suit = getCardSuitRank(cardsIndexes[4]).suit;
    var card5 = loadedCard.clone();
    
    card5.scale.set(.0, .0, .0);
    gsap.to(card5.scale, { x: .051,y:.051, z: .051, duration: .1, repeat: 0, ease: "power2.inOut", delay: 0.4 });
    card5.rotation.set (0, 0, 0);
    card5.position.set (1.36, -1.29, -1);
    
    

    card5.traverse(function (child) {
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

    cardObjects.push(card5);
    scene.add(card5);   

    var table = rankHand([
        cardsIndexes[0],
        cardsIndexes[1],
        cardsIndexes[2],
        cardsIndexes[3],
        cardsIndexes[4]]
    );

    
    setTimeout(()=>{
        if (table.rankDescription === 'Pair') {
            balance += bet*pairM;
            document.getElementById('1').style.scale = '3.5';
            document.getElementById('1').style.color = 'green';
            document.getElementById('1').style.fontSize = '800';
            setTimeout(()=>{
                document.getElementById('1').style.scale = '1';
                document.getElementById('1').style.color = 'white';
            },1000);

        } 
        else if (table.rankDescription === 'Two Pairs') {
            balance += bet*twoPairM;
            document.getElementById('2').style.scale = '3.5';
            document.getElementById('2').style.color = 'green';
            setTimeout(()=>{
                document.getElementById('2').style.scale = '1';
                document.getElementById('2').style.color = 'white';
            },1000);

        } 
        else if (table.rankDescription === 'Trips') {
            balance += bet*setM;
            document.getElementById('3').style.scale = '3.5';
            document.getElementById('3').style.color = 'green';
            setTimeout(()=>{
                document.getElementById('3').style.scale = '1';
                document.getElementById('3').style.color = 'white';
            },1000);
        }  
        else if (table.rankDescription === 'Straight') {
            balance += bet*streetM;
            document.getElementById('4').style.scale = '3.5';
            document.getElementById('4').style.color = 'green';
            setTimeout(()=>{
                document.getElementById('4').style.scale = '1';
                document.getElementById('4').style.color = 'white';
            },1000);
        } 
        else if (table.rankDescription === 'Flush') {
            balance += bet*flushM;
            document.getElementById('5').style.scale = '3.5';
            document.getElementById('5').style.color = 'green';
            setTimeout(()=>{
                document.getElementById('5').style.scale = '1';
                document.getElementById('5').style.color = 'white';
            },1000);

        } else if (table.rankDescription === 'Full House') {
            balance += bet*fullM;
            document.getElementById('6').style.scale = '3.5';
            document.getElementById('6').style.color = 'green';
            setTimeout(()=>{
                document.getElementById('6').style.scale = '1';
                document.getElementById('6').style.color = 'white';
            },1000);

        } else if (table.rankDescription === 'Quads') {
            balance += bet*quadM;
            document.getElementById('7').style.scale = '3.5';
            document.getElementById('7').style.color = 'green';
            setTimeout(()=>{
                document.getElementById('7').style.scale = '1';
                document.getElementById('7').style.color = 'white';
            },1000);

        } else if (table.rankDescription === 'Straight Flush') {
            balance += bet*strflM;
            document.getElementById('8').style.scale = '3.5';
            document.getElementById('8').style.color = 'green';
            setTimeout(()=>{
                document.getElementById('8').style.scale = '1';
                document.getElementById('8').style.color = 'white';
            },1000);

        } else if (table.rankDescription === 'Royal Flush') {
            balance += bet*rflM;
            document.getElementById('9').style.scale = '3.5';
            document.getElementById('9').style.color = 'green';
            setTimeout(()=>{
                document.getElementById('9').style.scale = '1';
                document.getElementById('9').style.color = 'white';
            },1000);

        }

        document.getElementById('balance-f').innerHTML = Math.round(balance) + '$';
    }, 1000);



    gsap.to(card1.scale, { x: .0,y:.0, z: .0, duration: .1, repeat: 0, ease: "power2.inOut", delay: 1.0 });
    gsap.to(card2.scale, { x: .0,y:.0, z: .0, duration: .1, repeat: 0, ease: "power2.inOut", delay: 1.1 });
    gsap.to(card3.scale, { x: .0,y:.0, z: .0, duration: .1, repeat: 0, ease: "power2.inOut", delay: 1.2 });
    gsap.to(card4.scale, { x: .0,y:.0, z: .0, duration: .1, repeat: 0, ease: "power2.inOut", delay: 1.3 });
    gsap.to(card5.scale, { x: .0,y:.0, z: .0, duration: .1, repeat: 0, ease: "power2.inOut", delay: 1.4 });



}


const pairM = 1.3;
const twoPairM = 2;
const setM = 3;
const streetM = 5;
const flushM = 10;
const fullM = 15;
const quadM = 50;
const strflM = 200;
const rflM = 500;



function simulateSlots() {
    var balance = 500;

    var bet = 10;
    var pairs = 0;
    var tPairs = 0;
    var sets = 0;
    var streets = 0;
    var flushes = 0;
    var fHouses = 0;
    var cares = 0;
    var sFlush = 0;
    var rFlush = 0;

    for (let j = 0; j < 50000; j++) {
        let deck = [];

            for (let i = 0; i < 52; i++)
                deck.push(i);
            //deck = data; // Assuming the response contains a "deck" property with the shuffled deck array
            shuffleArray(deck);

            // соберем стол
            var table = rankHand([
                deck[0],
                deck[1],
                deck[2],
                deck[3],
                deck[4]]
            );
            simBalance -= startBet;

            console.log(j);
            console.log(table.display);

            if (table.rankDescription === 'Pair') {
                balance += bet*pairM;
                pairs++;
            } 
            else if (table.rankDescription === 'Two Pairs') {
                balance += bet*twoPairM;
                tPairs++;
            } 
            else if (table.rankDescription === 'Trips') {
                balance += bet*setM;
                sets++;
            }  
            else if (table.rankDescription === 'Straight') {
                balance += bet*streetM;
                streets++;
            } 
            else if (table.rankDescription === 'Flush') {
                balance += bet*flushM;
                flushes++;
            } else if (table.rankDescription === 'Full House') {
                balance += bet*fullM;
                fHouses++;
            } else if (table.rankDescription === 'Quads') {
                balance += bet*quadM;
                cares++;
            } else if (table.rankDescription === 'Straight Flush') {
                balance += bet*strflM;
                sFlush++;
            } else if (table.rankDescription === 'Royal Flush') {
                balance += bet*rflM;
                rFlush++;
            }
            

          
                
            
            

                 
            

        
    }



    console.log(
        pairs + ' пар, ' + tPairs + ' двойных пар,' + sets + " сетов, " +
        streets+ ' стритов, ' + flushes + ' флешей, ' +
        fHouses + ' фул хаузов, ' + cares + ' каре, ' +
        sFlush + ' стрит флешей, ' + rFlush + ' роял флешей');

    console.log('Баланс за 50.000 игр при начальной ставке 10: ' + simBalance);
}


//simulateSlots();