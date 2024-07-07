const NUM_CARDS_IN_DECK = 52;
const NUM_VALUES_IN_DECK = 13;
const NUM_SUITS_IN_DECK = 4;
const NUM_CARDS_IN_HAND = 5;
const ACE_VALUE = Math.pow(2, 13);
const STRAIGHT_LOW_ACE_INDICATOR = parseInt("10000000011110", 2);
const TEN_CARD_POSITION = 8;
const RANK_BASE_VALUE = Math.pow(10, 9);


const buildDeck = () => {
    let deck = Array.from(new Array(NUM_CARDS_IN_DECK), (_, index) => index);
    let count = NUM_CARDS_IN_DECK + 1;
    while ((count -= 1)) {
      deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
    }
    return deck;
  };


  const handDisplay = (hand) => {
    const values = "23456789TJQKA";
    const suits = [`♠︎`, `♥︎`, `♣`, `♦︎`];
    return hand
      .reduce((obj, item) => {
        obj.push(
          `${values[item % NUM_VALUES_IN_DECK]}${
            suits[Math.floor(item / NUM_VALUES_IN_DECK)]
          }`
        );
        return obj;
      }, [])
      .join(" ");
  };
  const rankHand = (hand) => {
    const suits = new Array(NUM_SUITS_IN_DECK).fill(0);
    const values = new Array(NUM_VALUES_IN_DECK).fill(0);
    hand.forEach((card) => {
      suits[Math.floor(card / NUM_VALUES_IN_DECK)] += 1;
      values[card % NUM_VALUES_IN_DECK] += 1;
    });
    let rankValue = values.reduce(
      (total, val, index) =>
        (total +=
          ((val === 1 && Math.pow(2, index + 1)) || 0) +
          ((val > 1 && Math.pow(2, index + 1) * ACE_VALUE * val) || 0)),
      0
    );
    const firstCardIndex = values.findIndex((index) => index === 1);
    const ranks = {
      royal_flush: false,
      straight_flush: false,
      quads: values.some((count) => count === 4),
      full_house: values.filter(Boolean).length === 2,
      flush: suits.some((count) => count === NUM_CARDS_IN_HAND),
      straight:
        values
          .slice(firstCardIndex, firstCardIndex + NUM_CARDS_IN_HAND)
          .filter((count) => count === 1).length === 5 ||
        rankValue === STRAIGHT_LOW_ACE_INDICATOR,
      trips: values.some((count) => count === 3),
      two_pairs: values.filter((count) => count === 2).length === 2,
      pair: values.filter((count) => count === 2).length === 1,
      high_card: true,
    };
    ranks.straight_flush = ranks.flush && ranks.straight;
    ranks.royal_flush =
      ranks.straight_flush && firstCardIndex === TEN_CARD_POSITION;
    let rankIndex = 0;
    let rankDescription = "";
    Object.keys(ranks).every((key, index) => {
      rankIndex = 10 - index;
      rankDescription = key;
      return !ranks[key];
    });
    const fh_pair_index = values.findIndex((count) => count === 2) + 1;
    rankValue +=
      rankIndex * RANK_BASE_VALUE -
      ((rankValue === STRAIGHT_LOW_ACE_INDICATOR && ACE_VALUE - 1) || 0) -
      ((ranks.full_house &&
        Math.pow(2, fh_pair_index) * ACE_VALUE * 2 + fh_pair_index) ||
        0);
    rankDescription = rankDescription
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return {
      hand,
      suits,
      values,
      rankValue,
      ranks,
      rankDescription,
      display: handDisplay(hand),
    };
  };




  const compareHands = (hands) => {
    return hands
      .map((hand) => rankHand(hand))
      .sort((handA, handB) => handB.rankValue - handA.rankValue);
  };



  const dealCards = (numPlayers, numCardsPerPlayer) => {
    const deck = buildDeck();
    const table = Array.from(new Array(numPlayers), () => []);
    const board = [];
    for (let card = 0; card < numCardsPerPlayer; card += 1) {
      for (let player = 0; player < numPlayers; player += 1) {
        table[player].push(deck.pop());
      }
    }
    deck.pop();
    board.push(deck.pop());
    board.push(deck.pop());
    board.push(deck.pop());
    deck.pop();
    board.push(deck.pop());
    deck.pop();
    board.push(deck.pop());
    return {
      table,
      board,
    };
  };



  const findBestHandTexasHoldEm = (holeCards, board) => {
    const hands = [];
    hands.push(board);
    for (let c = 0; c < 2; c += 1) {
      for (let b = 0; b < 5; b += 1) {
        const newHand = [...board];
        newHand[b] = holeCards[c];
        hands.push(newHand);
      }
    }
    for (let b = 0; b < 4; b += 1) {
      for (let r = b + 1; r < 5; r += 1) {
        const newHand = [...board];
        newHand[b] = holeCards[0];
        newHand[r] = holeCards[1];
        hands.push(newHand);
      }
    }
    return compareHands(hands);
  };


  const dealRound = ({ numPlayers, holeCards, findBestHand }) => {
    const game = dealCards(numPlayers, holeCards);
    const players = game.table.map((hole, index) => {
      return {
        name: `Player ${index + 1}`,
        hole,
        board: game.board,
        bestHand: {},
      };
    });
    players.forEach((player) => {
      player.bestHand = findBestHand(player.hole, game.board)[0];
      player.board = handDisplay(player.board);
      player.hole = handDisplay(player.hole);
    });
    const rankPlayers = players.sort(
      (a, b) => b.bestHand.rankValue - a.bestHand.rankValue
    );
    return rankPlayers;
  };


  const dealTexasHoldEm = (numPlayers) => {
    const round = dealRound({
      numPlayers,
      holeCards: 2,
      findBestHand: findBestHandTexasHoldEm,
    });
    console.log(JSON.stringify(round, null, 2));
  };