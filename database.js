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

module.exports = {
  getUserPoints: getUserPoints,
  setUserPoints: setUserPoints,
  addUserPoints: addUserPoints
};