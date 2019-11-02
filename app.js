const token = require('./config/config.json').token;
const Discord = require('discord.js');
const client = new Discord.Client();
const Sequelize = require('sequelize');
const SequelizeModels = require('./models');
const slots = require('./slots.js');
const config = require('./config/config');

const SequelizeConnect = new Sequelize({
  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4'
  },
  pool: {
    max: 20,
    min: 0,
    idle: 10000
  },
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true
  },
  logging: false
});


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
  let message = msg.content;
  let authorMention = msg.author;
  let authorID = authorMention.id;
  let channel = msg.channel;
  let authorName = authorMention.username;
  console.log(`${authorName}: ${message}`);
  
  if (message.startsWith('!slots ')) {
    let betStr = message.split(' ')[1].trim();
    let bet = parseInt(betStr, 10);
    console.log(`Bet: ${bet}`);
    // user is making a bet
    if (Number.isInteger(bet) && bet > 0) {
      // check that bet <= points
      SequelizeModels.points.findOne({
        where: {
          id: authorID
        }
      })
      .then(response => {
        // have enough points
        if (response.points >= bet) {
          slots(authorID,bet, channel);
        } else {
          channel.send(`${authorMention}: You don't have enough points.`);
        }
      }).catch(console.error);

      
    }
  } else if (message == '!points') {
    SequelizeModels.points.findOne({
      where: {
        id: authorID
      }
    }).then(response => {
      let points = 0;
      // if response == null, need to add to database
      if (response == null) {
        SequelizeModels.points.create({
          id: authorID,
          name: authorName,
          points: 2000
        }).then(pointsUpdate => {
          points = 2000;
          channel.send(`${authorMention}: You have ${points} points.`);
        }).catch(console.error);
      } else {
        points = response.points;
        channel.send(`${authorMention}: You have ${points} points.`);
      }
      
    })
  }
})

client.login(token);