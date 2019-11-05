const Discord = require("discord.js");
const SequelizeModels = require('./models');
const winMultiplier = [2,3,5,10];
//need to adjust, stole Mike's values
const itemWeights = [40, 70, 90, 100, 108];
const slotEmotes = [':apple:', ':strawberry:', ':tangerine:', ':eggplant:', ':peach:'];

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

function updateUserPoints(userID, pointsChange) {
    let currentPoints = 0;
    // get current points
    SequelizeModels.points.findOne({
      where: {
        id: userID
      }
    })
    .then(response => {
      currentPoints = parseInt(response.points,10) + pointsChange;
      SequelizeModels.points.update({
        points: currentPoints
      }, {
        where: {
          id: userID
        }
      })
    })
    .catch(console.error)
    

  return currentPoints;
}

function printResult(roll, mult, pointsWon, currPoints) {
  let embed = new Discord.RichEmbed()
    .setTitle('**Slots Bot Roll**')
    .addField('\u200b',`${slotEmotes[roll[0]]} ${slotEmotes[roll[1]]} ${slotEmotes[roll[2]]} **Win Multiplier**: ${mult}`)
    .addField('\u200b',`${slotEmotes[roll[3]]} ${slotEmotes[roll[4]]} ${slotEmotes[roll[5]]} **Points Won**: ${pointsWon}`)
    .addField('\u200b',`${slotEmotes[roll[6]]} ${slotEmotes[roll[7]]} ${slotEmotes[roll[8]]} **Current Points**: ${currPoints}`)
  return embed;
}

function spinSlots(userID, bet) {
  bet = parseInt(bet);
  console.log(`spinslots bet: ${bet}`);
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
  return {slots: slotRoll, pointChange: pointChange, 
          pointsWon: pointsWon, winMultiplier: thisWinMultiplier}
}
module.exports = function slots(userID, bet, channel) {
  let pointChange = 0;
  let slots = [];
  let multiplier = 0;
  let embed = [];
  let pointsWon = 0;
  let p = new Promise((resolve, reject) => {
    let data = spinSlots(userID, bet);
    if (data != undefined) {
      resolve(data);
    } else {
      reject('Error with spinSlots');
    }
  });

  p.then(data => {
    console.log('1');
    pointChange = data.pointChange;
    slots = data.slots;
    multiplier = data.winMultiplier;
    pointsWon = data.pointsWon;
    return updateUserPoints(userID, data.pointChange);
  }).catch(console.error())

  .then(newPoints => {
    console.log(newPoints);
    return printResult(slots, multiplier, pointsWon, newPoints);
  }).catch(console.error())

  .then(embed => {
    channel.send(`<@${userID}>:`, embed=embed);
  }).catch(console.error());
}