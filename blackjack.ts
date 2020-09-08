//@ts-ignore
const db = require('./database.js') 
const nums = [2,3,4,5,6,7,8,9,10,10,10,10,11]
const suits = ['♣','♦','♥','♠'];
const names = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
const dealerStand = 17
let deck:string[] = []
let playerHand:string[] = []
let dealerHand:string[] = []
let bet = 0
let gameID = -1
async function drawCard(player:boolean, amount:number) {
    return new Promise((resolve, reject) => {
        for (let i=0; i < amount; i++) {
            let cardNum = Math.round(Math.random() * (deck.length - 1));
            player ? playerHand.push(deck[cardNum]) : dealerHand.push(deck[cardNum])
            deck.splice(cardNum,1)
        }
        resolve(true)
    })
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
            deck.splice(deck.indexOf(element),1)

        });
        dealerHand.forEach(element => {
            deck.splice(deck.indexOf(element),1)
        });
        resolve(deck);
    })
}
async function getValue(hand:string[]) {
    return new Promise((resolve, reject) => {
        console.log(`hand: ${hand}`)
        let total = 0;

        hand.forEach(card => {
            let cardNum = card.slice(0,-1);
            if (!isNaN(cardNum as any)) {
                total += +cardNum;
            }
            else if (['K','Q','J'].includes(cardNum)) {
                total += 10
            }
            else {
                total += 11
            }
        });
        if (total === 21 && hand.length === 2) {
            resolve('blackjack');
        }
        else if (total > 21) {
            hand.forEach(card => {
                let cardNum = card.slice(0,-1);
                if (cardNum === 'A') {
                    total -= 10;
                    if (total <= 21) {
                        resolve(total)
                    }
                }
            });
        }
        resolve(total);
    })
}
// return true if keep going, false if not
async function evaluateHands(playerTurn:boolean) {
    let pTotal = await getValue(playerHand);
    let dTotal = await getValue(dealerHand);
    // console.log(`pTotal: ${pTotal}`)
    // console.log(`dTotal: ${dTotal}`)
    return new Promise((resolve, reject) => {
        // blackjack check
        if (dTotal === 'blackjack' || pTotal === 'blackjack') {
            if (dTotal === pTotal) {
                // push
            }
            else if (dTotal === 'blackjack') {
                // dealer wins on blackjack
            }
            else {
                // player wins on blackjack
            }
        }
        else if (playerTurn) {
    
        }
        resolve(true)
    })
    
}
async function hit(id:string, player:boolean) {
    await loadGame(id)
    await makeDeck()
    await drawCard(player ? true : false, 1)
    await saveGame(true)
}
async function stand() {
}
async function double() {
}
async function split() {
}

async function newGame(pID:string, bet:number, channel:string) {
    await makeDeck();
    // console.log('makeDeck done')
    await drawCard(true, 2)
    await drawCard(false, 2)
    // console.log(`playerHand: ${playerHand}`)
    // console.log(`dealerHand: ${dealerHand}`)
    if (await evaluateHands(true) === true) {
        db.startBJHand(pID,bet,playerHand,dealerHand,true)
        .catch(console.error)
        //TODO:print result function
        .then(console.log('db save'))
        .catch(console.error)
    }
}
async function saveGame(active:boolean) {
    let success = await db.setBJHand(gameID, playerHand, dealerHand, active)
}
async function loadGame(id:string) {
    let state = await db.getActiveBJHand(id)
    return new Promise((resolve, reject) => {
        playerHand = state.pCards.split(',')
        dealerHand = state.dCards.split(',')
        bet = state.bet
        gameID = state.gameID
        resolve(true)
    })

}
// playerHand = ['A♥', '4♥', 'Q♥','A♥','A♥']
// makeDeck(playerHand,dealerHand).then(_ => {
//     getValue(playerHand).then(total => {
//         console.log(total)
//     })
// })

module.exports = {
    newGame, hit, stand
}