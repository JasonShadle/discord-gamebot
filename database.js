const SequelizeModels = require('./models');

function getUserPoints(id) {
  return new Promise(function(resolve, reject) {
    SequelizeModels.points.findOne({
      where: {
        id: id
      }
    })
    .catch(console.error)
    .then(response => {
      if (response == null) {
        resolve(null);
      }
      else {
        resolve({points: response.points, highscore: response.highscore});
      }
    });
  });
}

function setUserPoints(id, points) {
  let newPoints = parseInt(points);
  return new Promise(function(resolve, reject) {
    SequelizeModels.points.update({
      points: newPoints
    }, {
      where: {
       id: id
      }
    })
    .catch(console.error)
    .then(response => {
      getUserPoints(id)
      .catch(console.error)
      .then(dbResult => {
        if (newPoints > dbResult.highscore) {
          setUserHighscore(id, newPoints)
          .catch(console.error)
          .then(response => {
            resolve(true);
          })
        } else {
          resolve(true);
        }
      })
    });
  });
}

function addUserPoints(id, name, points) {
  return new Promise(function(resolve, reject) {
    SequelizeModels.points.create({
      id: id,
      name: name,
      points: points,
      highscore: points
    })
    .catch(console.error)
    .then(response => {
      resolve(true);
    });
  });
}

function setUserHighscore(id, points) {
  return new Promise(function(resolve, reject) {
    SequelizeModels.points.update({
      highscore: points
    }, {
      where: {
        id: id
      }
    })
    .catch(console.error)
    .then(response => {
      resolve(true);
    })
  })
}

function getHighscores() {
  return new Promise(function(resolve, reject) {
    SequelizeModels.points.findAll({
      raw: true,
      limit: 5,
      order: [
        ['highscore', 'desc']
      ]
    })
    .catch(console.error)
    .then(response => {
      resolve(response);
    })
  })
}
function getActiveBJHand(userID) {
  return new Promise(function(resolve, reject) {
    SequelizeModels.blackjack.findOne({
      where: {
        userID: userID,
        active: true
      }
    })
    .catch(console.error)
    .then(response => {
      if (response === null) {
        resolve(null);
      }
      else {
        resolve({pCards: response.playerCards, dCards: response.dealerCards, bet: response.bet, gameID: response.gameID})
      }
    })
  })
}
function setBJHand(gameID, pHand, dHand, active) {
  return new Promise(function(resolve, reject) {
    SequelizeModels.blackjack.update({
      playerCards: pHand.toString(),
      dealerCards: dHand.toString(),
      active: active
    }, {
      where: {
        gameID: gameID,
        active: true
      }
    })
    .catch(console.error)
    .then(response => {
      resolve(true)
    })
  })
}
function startBJHand(id, bet, pHand, dHand, active) {
  bet = parseInt(bet)
  return new Promise(function(resolve, reject) {
    SequelizeModels.blackjack.create({
      userID: id,
      bet: bet,
      playerCards: pHand.toString(),
      dealerCards: dHand.toString(),
      active: active
    })
    .catch(console.error)
    .then(response => {
      resolve(response)
    })
  })
}
module.exports = {
  getUserPoints: getUserPoints,
  setUserPoints: setUserPoints,
  addUserPoints: addUserPoints,
  getHighscores: getHighscores,
  setBJHand: setBJHand,
  getActiveBJHand: getActiveBJHand,
  startBJHand: startBJHand
};