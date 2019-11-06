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
        resolve(response.points);
      }
    });
  });
}

function setUserPoints(id, points) {
  return new Promise(function(resolve, reject) {
    SequelizeModels.points.update({
      points: points
    }, {
      where: {
       id: id
      }
    })
    .catch(console.error)
    .then(response => {
      resolve(true);
    });
  });
}

function addUserPoints(id, name, points) {
  return new Promise(function(resolve, reject) {
    SequelizeModels.points.create({
      id: id,
      name: name,
      points: points
    })
    .catch(console.error)
    .then(response => {
      resolve(true);
    });
  });
}

module.exports = {
  getUserPoints: getUserPoints,
  setUserPoints: setUserPoints,
  addUserPoints: addUserPoints
};