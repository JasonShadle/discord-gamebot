const db = require('./database.js');
const nums = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
const suits = ['♣', '♦', '♥', '♠'];
const names = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const dealerStand = 17;
let deck = [];
let playerHand = [];
let dealerHand = [];
let bet = 0;
let gameID = -1;
async function drawCard(player, amount) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < amount; i++) {
            let cardNum = Math.round(Math.random() * (deck.length - 1));
            player ? playerHand.push(deck[cardNum]) : dealerHand.push(deck[cardNum]);
            deck.splice(cardNum, 1);
        }
        resolve(true);
    });
}
async function makeDeck() {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < nums.length; j++) {
                let cardName = names[j] + suits[i];
                deck.push(cardName);
            }
        }
        playerHand.forEach(element => {
            deck.splice(deck.indexOf(element), 1);
        });
        dealerHand.forEach(element => {
            deck.splice(deck.indexOf(element), 1);
        });
        resolve(deck);
    });
}
async function getValue(hand) {
    return new Promise((resolve, reject) => {
        console.log(`hand: ${hand}`);
        let total = 0;
        hand.forEach(card => {
            let cardNum = card.slice(0, -1);
            if (!isNaN(cardNum)) {
                total += +cardNum;
            }
            else if (['K', 'Q', 'J'].includes(cardNum)) {
                total += 10;
            }
            else {
                total += 11;
            }
        });
        if (total === 21 && hand.length === 2) {
            resolve('blackjack');
        }
        else if (total > 21) {
            hand.forEach(card => {
                let cardNum = card.slice(0, -1);
                if (cardNum === 'A') {
                    total -= 10;
                    if (total <= 21) {
                        resolve(total);
                    }
                }
            });
        }
        resolve(total);
    });
}
async function evaluateHands(playerTurn) {
    let pTotal = await getValue(playerHand);
    let dTotal = await getValue(dealerHand);
    return new Promise((resolve, reject) => {
        if (dTotal === 'blackjack' || pTotal === 'blackjack') {
            if (dTotal === pTotal) {
            }
            else if (dTotal === 'blackjack') {
            }
            else {
            }
        }
        else if (playerTurn) {
        }
        resolve(true);
    });
}
async function hit(id, player) {
    await loadGame(id);
    await makeDeck();
    await drawCard(player ? true : false, 1);
    await saveGame(true);
}
async function stand() {
}
async function double() {
}
async function split() {
}
async function newGame(pID, bet, channel) {
    await makeDeck();
    await drawCard(true, 2);
    await drawCard(false, 2);
    if (await evaluateHands(true) === true) {
        db.startBJHand(pID, bet, playerHand, dealerHand, true)
            .catch(console.error)
            .then(console.log('db save'))
            .catch(console.error);
    }
}
async function saveGame(active) {
    let success = await db.setBJHand(gameID, playerHand, dealerHand, active);
}
async function loadGame(id) {
    let state = await db.getActiveBJHand(id);
    return new Promise((resolve, reject) => {
        playerHand = state.pCards.split(',');
        dealerHand = state.dCards.split(',');
        bet = state.bet;
        gameID = state.gameID;
        resolve(true);
    });
}
module.exports = {
    newGame, hit, stand
};
