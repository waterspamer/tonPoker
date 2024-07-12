function goToSlots(){
    console.log('slot mode');
    document.getElementById("betslidercontainer").style.display = '';
    document.getElementById("games-container").style.bottom = '-50vh';
    document.getElementById("spin-button").style.display = '';
    document.getElementById("bank-button").style.display = 'none';

    const textureNewLoader = new THREE.TextureLoader();
            const slotTexture = textureNewLoader.load('resources/slotTexture.jpg');

            //tableTopMaterial.uniforms.cardTexture = slotTexture;
            tableTopMaterial.needsUpdate = true;
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

const pairM = 0;
const pairTenM = 2;
const twoPairM = 3;
const setM = 5;
const streetM = 10;
const flushM = 20;
const fullM = 50;
const quadM = 100;
const strflM = 1000;
const rflM = 10000;



function downloadCSV(data, filename) {
    const header = '"id","SimBalance" \n';
    const rows = data.map(value => `${value}\n`).join('');
    const csvContent = header + rows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

async function simulateSlots() {
    var bonusGames = 0;
    var playerCount = 100;
    var gamesCount = 50;

    var pairs = 0;
    var startBet = 1;
    var pairsTen = 0;
    var tPairs = 0;
    var sets = 0;
    var streets = 0;
    var flushes = 0;
    var fHouses = 0;
    var cares = 0;
    var sFlush = 0;
    var rFlush = 0;

    var pairsTenStreak = 0;
    var playerPlus = 0;
    var casinoMoney = 0;
    var mostSuccess = 0;
    var mostLoss = 0;

    let simBalances = [];

    for (let k = 0; k < playerCount; k++) {
        var simBalance = 0;
        for (let j = 0; j < gamesCount; j++) {
            let deck = [];

            for (let i = 0; i < 52; i++)
                deck.push(i);
            shuffleArray(deck);

            var table = rankHand([
                deck[0],
                deck[1],
                deck[2],
                deck[3],
                deck[4]]
            );
            simBalance -= startBet;

            if (table.rankValue > 2008000000) {
                pairsTenStreak++;
                if (pairsTenStreak > 2) {
                    bonusGames++;
                    pairsTenStreak = 0;
                }
            } else pairsTenStreak = 0;

            if (table.rankDescription === 'Pair') {
                if (table.rankValue > 2008000000) {
                    pairsTen++;
                    simBalance += startBet * pairTenM;
                } else {
                    simBalance += startBet * pairM;
                    pairs++;
                }
            } else if (table.rankDescription === 'Two Pairs') {
                simBalance += startBet * twoPairM;
                tPairs++;
            } else if (table.rankDescription === 'Trips') {
                simBalance += startBet * setM;
                sets++;
            } else if (table.rankDescription === 'Straight') {
                simBalance += startBet * streetM;
                streets++;
            } else if (table.rankDescription === 'Flush') {
                simBalance += startBet * flushM;
                flushes++;
            } else if (table.rankDescription === 'Full House') {
                simBalance += startBet * fullM;
                fHouses++;
            } else if (table.rankDescription === 'Quads') {
                simBalance += startBet * quadM;
                cares++;
            } else if (table.rankDescription === 'Straight Flush') {
                simBalance += startBet * strflM;
                sFlush++;
            } else if (table.rankDescription === 'Royal Flush') {
                simBalance += startBet * rflM;
                rFlush++;
            }
        }

        simBalances.push(k + ',' + simBalance);

        console.log('Игрок ' + k);
        console.log(pairs + ' слабых пар, ' +
            pairsTen + ' пар десяток и выше, ' + tPairs + ' двойных пар,' + sets + " сетов, " +
            streets + ' стритов, ' + flushes + ' флешей, ' +
            fHouses + ' фул хаузов, ' + cares + ' каре, ' +
            sFlush + ' стрит флешей, ' + rFlush + ' роял флешей');

        console.log('Бонусок было бы запущено: ' + bonusGames);
        if (simBalance > 0) {
            playerPlus++;
            if (mostSuccess < simBalance) mostSuccess = simBalance;
        }
        if (simBalance < 0) {
            if (mostLoss > simBalance) mostLoss = simBalance;
        }
        casinoMoney -= simBalance;
        console.log('Баланс за ' + gamesCount + ' игр при начальной ставке 1: ' + simBalance);
    }

    console.log('Начальная ставка ' + startBet);
    console.log('Из ' + playerCount + ' игроков за ' + gamesCount + ' игр в плюс вышло ' + playerPlus + ' игроков');
    console.log('Самый везучий заработал ' + mostSuccess);
    console.log('Самый невезучий проиграл ' + mostLoss);
    console.log('Казино заработало ' + casinoMoney);

    //downloadCSV(simBalances, 'simBalance.csv');
}






function simulatePlayBonus(){
    let bonusSpinsCount = 10;
    let sBet = 1;
    let totalPlayerProfit = 0;
    let bonusPriceMult = 20;
    let playerCount = 10000;
    let totalMult = 0;
    var pairsTenStreak = 0;
    var oneRetriggerCount = 0;
    var twoRetriggerCount = 0;
    var threeRetriggerCount = 0;
    let totalRetriggerCount = 0;
    let playersWon = 0;
    let mults = [];
    let maxMult = 1;


    for(let k = 0; k< playerCount; k++){
        let multiplier = 1.0;
        let retriggerCount = 0;
        let wonCombo = '';
        for (let i = 0; i < bonusSpinsCount; i++){
            let deck = [];
    
                for (let i = 0; i < 52; i++)
                    deck.push(i);
                shuffleArray(deck);
    
                var table = rankHand([
                    deck[0],
                    deck[1],
                    deck[2],
                    deck[3],
                    deck[4]]
                );
    
                
                if (table.rankValue > 2008000000) {
                    wonCombo += table.rankDescription + ' ';
                    pairsTenStreak++;
                    if (pairsTenStreak > 2) {
                        retriggerCount++;
                        i-=5;
                        pairsTenStreak = 0;
                    }
                } else pairsTenStreak = 0;
    
                if (table.rankDescription === 'Pair') {
                    if (table.rankValue > 2008000000) {//старшая пара
                        multiplier+=4; 
                    } else {
                        //multiplier+=0.5;
                    }
                } else if (table.rankDescription === 'Two Pairs') {
                    multiplier+=5;
                } else if (table.rankDescription === 'Trips') {
                    multiplier+=7;
                } else if (table.rankDescription === 'Straight') {
                    multiplier+=10;
                } else if (table.rankDescription === 'Flush') {
                    multiplier+=15;
                } else if (table.rankDescription === 'Full House') {
                    multiplier+=30;
                } else if (table.rankDescription === 'Quads') {
                    multiplier+=80;
                } else if (table.rankDescription === 'Straight Flush') {
                    multiplier+=500;
                } else if (table.rankDescription === 'Royal Flush') {
                    multiplier+=10000;
                }
    
    
        }
        if (retriggerCount === 1) oneRetriggerCount++;
        if (retriggerCount === 2) twoRetriggerCount++;
        if (retriggerCount > 3) threeRetriggerCount++;
        totalRetriggerCount+= retriggerCount;
        if (multiplier > maxMult) maxMult = multiplier;
        totalMult+= multiplier;
        mults.push(k + ',' + multiplier);
        if (multiplier > sBet * bonusPriceMult)playersWon++;
        totalPlayerProfit += multiplier*sBet;
        if (multiplier < bonusPriceMult)
            console.log(wonCombo + '%c итого x'+multiplier, 'color: red');
        if (multiplier >= bonusPriceMult && multiplier < 100)
            console.log(wonCombo + '%c итого x'+multiplier, 'color: green');
        if (multiplier >= 100)
            console.log(wonCombo + '%c итого x'+multiplier, 'color: aqua');

    }
    var profit = sBet*bonusPriceMult * playerCount -totalPlayerProfit;
    console.log('Средний бонус за ' + playerCount + ' фриспинов по'+ ' ' + bonusSpinsCount +' спинов: х' + totalMult/playerCount);
    console.log('Один ретриггер за прокрут у ' + oneRetriggerCount + " игроков");
    console.log('Два ретриггера за прокрут у ' + twoRetriggerCount + " игроков");
    console.log('Три и больше ретриггера за прокрут у ' + threeRetriggerCount + " игроков");
    console.log('В среднем у игроков '+ totalRetriggerCount/playerCount+ ' ретриггеров за прокрут');
    console.log('Самый большой множитель: х'+ maxMult);
    console.log('В плюсе '+ playersWon + ' игроков');
    console.log('При стоимости прокрута х' + bonusPriceMult + ' от ставки, при ставке '+ sBet + ' казино заработало: '+ profit);
    //downloadCSV(mults, 'mults.csv');
}


//simulatePlayBonus();
//simulateSlots();