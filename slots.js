/*------------- Stats -------------
  Spins: 1000000
  Average gain per roll: -0.299738
  Win %: 47.442099999999996
  x1 occurance: 425618
  x1 rate: 0.425618
  x2 occurance: 166438
  x2 rate: 0.166438
  x3 occurance: 49591
  x3 rate: 0.049591
  x5 occurance: 6006
  x5 rate: 0.006006
  x10 occurance: 3206
  x10 rate: 0.003206
*/

const Discord = require("discord.js");
const SequelizeModels = require('./models');
const winMultiplier = [1,2,3,5,10];
const itemWeights = [40, 70, 90, 100, 108];
const slotEmotes = [':apple:', ':strawberry:', ':tangerine:', ':eggplant:', ':peach:'];
const db = require("./database.js")

function randomInt(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min);
}

function pickItemWeight() {
  let num = randomInt(0, itemWeights[4]);

  if (num <= itemWeights[0]) {
    return 0;
  } else if (num <= itemWeights[1]) {
    return 1;
  } else if (num <= itemWeights[2]) {
    return 2;
  } else if (num <= itemWeights[3]) {
    return 3;
  } else {
    return 4;
  }
}

function getPrintEmbed(roll, mult, pointsWon, currPoints, win) {
  let color = 'RED';
  if (win) {
    color = 'GREEN'
  }
  return new Promise(function(resolve, reject) {
    let embed = new Discord.RichEmbed()
    .setColor(color)
    .setTitle('**Slots Bot Roll**')
    .setDescription('Good luck!')
    .addField('\u200b',`${slotEmotes[roll[0]]} ${slotEmotes[roll[1]]} ${slotEmotes[roll[2]]} **Win Multiplier**: ${mult}`)
    .addField('\u200b',`${slotEmotes[roll[3]]} ${slotEmotes[roll[4]]} ${slotEmotes[roll[5]]} **Points Won**: ${pointsWon}`)
    .addField('\u200b',`${slotEmotes[roll[6]]} ${slotEmotes[roll[7]]} ${slotEmotes[roll[8]]} **Current Points**: ${currPoints}`)
    resolve(embed);
  });
}

function spinSlots(userID, bet) {
  bet = parseInt(bet);
  let thisWinMultiplier = 0;
  let slotRoll = [];
  let pointChange = 0;

  for (i = 0; i < 9; i++) {
    slotRoll[i] = pickItemWeight();
  }

  // check row 1
  if (slotRoll[0] == slotRoll[1] && slotRoll[0] == slotRoll[2]) {
    thisWinMultiplier += winMultiplier[slotRoll[0]];
  }

  // check row 2
  if (slotRoll[3] == slotRoll[4] && slotRoll[3] == slotRoll[5]) {
    thisWinMultiplier += winMultiplier[slotRoll[3]];
  }

  // check row 3
  if (slotRoll[6] == slotRoll[7] && slotRoll[6] == slotRoll[8]) {
    thisWinMultiplier += winMultiplier[slotRoll[6]];
  }

  // check col 1
  if (slotRoll[0] == slotRoll[3] && slotRoll[0] == slotRoll[6]) {
    thisWinMultiplier += winMultiplier[slotRoll[0]];
  }

  // check col 2
  if (slotRoll[1] == slotRoll[4] && slotRoll[1] == slotRoll[7]) {
    thisWinMultiplier += winMultiplier[slotRoll[1]];
  }

  // check col 3
  if (slotRoll[2] == slotRoll[5] && slotRoll[2] == slotRoll[8]) {
    thisWinMultiplier += winMultiplier[slotRoll[2]];
  }

  /* check diag 1
      o x x
      x o x
      x x o
  */

  if (slotRoll[0] == slotRoll[4] && slotRoll[0] == slotRoll[8]) {
    thisWinMultiplier += winMultiplier[slotRoll[0]];
  }

  /* check diag 2
      x x o
      x o x
      o x x
  */

  if (slotRoll[2] == slotRoll[4] && slotRoll[2] == slotRoll[6]) {
    thisWinMultiplier += winMultiplier[slotRoll[2]];
  }

  // TODO: figure out why I have to parseInt when both are ints
  let pointsWon = parseInt(bet) * parseInt(thisWinMultiplier);
  pointChange = parseInt(pointsWon,10) - parseInt(bet,10);
  return {slots: slotRoll, pointChange: pointChange, win: pointChange >= 0,
          pointsWon: pointsWon, winMultiplier: thisWinMultiplier}
}
module.exports = function slots(userID, bet, channel) {
  let pointChange = 0;
  let slots = [];
  let multiplier = 0;
  let embed = [];
  let pointsWon = 0;
  let win = false;
  let p = new Promise((resolve, reject) => {
    let data = spinSlots(userID, bet);
    if (data != undefined) {
      resolve(data);
    } else {
      reject('Error with spinSlots');
    }
  });

  p.then(data => {
    pointChange = data.pointChange;
    slots = data.slots;
    multiplier = data.winMultiplier;
    pointsWon = data.pointsWon;
    win = data.win;

    db.getUserPoints(userID)
    .then(points => {
      let newPoints = points + pointChange;
      db.setUserPoints(userID, newPoints)
      .then(response => {
        getPrintEmbed(slots, multiplier, pointsWon, newPoints, win)
        .then(embed => {
          channel.send(`<@${userID}>:`, embed=embed)
        }).catch(console.error())
      }).catch(console.error())
    }).catch(console.error())
  }).catch(console.error())
}