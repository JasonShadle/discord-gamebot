const config = require('./config/config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const Sequelize = require('sequelize');
const SequelizeModels = require('./models');
const slots = require('./slots.js');
const db = require('./database.js')


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
  let admin = false;
  console.log(`${authorName}: ${message}`);
  
  // check if bot admin
  if (config.admin.includes(authorID)) {
    admin = true;
  }

  if (message.startsWith('!slots ')) {
    let arg = message.split(' ')[1].trim();
    let bet = parseInt(arg, 10);
    // user is making a bet
    if (Number.isInteger(bet)) {
      if (bet >= 1) {
        // check that bet <= points
        db.getUserPoints(authorID)
        .then(response => {
          // have enough points
          if (response == null) {
            db.addUserPoints(authorID, authorName, 2000)
            .then(response => {
              if (bet <= 2000) {
                slots(authorID, bet, channel);
              } else {
                channel.send(`${authorMention}: You don't have enough points.`);
              }
            })
          }
          else {
            if (response.points >= bet) {
              slots(authorID, bet, channel);
            } else if (response.points < bet) {
              channel.send(`${authorMention}: You don't have enough points.`);
            }
          }
        }).catch(console.error);
      }
      else {
        channel.send(`${authorMention}: You must bet a positive number`);
      }
    }
    else if (arg == 'help') {
      let embed = new Discord.RichEmbed()
      .setTitle('Slots Help')
      .addField('!points','See your current balance')
      .addField('!slots [bet]','Spin the slots')
      .addField(':apple: = x1', '\u200b')
      .addField(':strawberry: = x2', '\u200b')
      .addField(':tangerine: = x3', '\u200b')
      .addField(':eggplant: = x5', '\u200b')
      .addField(':peach: = x10', '\u200b');

      channel.send(`${authorMention}:`, embed=embed);
    }
  } 
  else if (message == '!points') {
    db.getUserPoints(authorID)
    .then(response => {
      if (response != null) {
        channel.send(`${authorMention}: You have ${response.points} points`);
      }
      else {
        db.addUserPoints(authorID, authorName, 2000)
        .catch(console.error)
        .then(response => {
          channel.send(`${authorMention}: You have 2000 points`);
        });
      }
    });
  }
  else if (message.startsWith('!points ')) {
    let arg = message.split(' ')[1].trim();
    
    if (arg == 'set') {
      if (admin) {
        let user = message.split(' ')[2].trim();
        let pointAmount = parseInt(message.split(' ')[3].trim(), 10);
  
        // turn mention in only id
        if (user.startsWith('<@') && user.endsWith('>')) {
          // get the id
          user= user.slice(2, -1);
    
          // has a nickname
          if (user.startsWith('!')) {
            user = user.slice(1);
          }
    
          if (Number.isInteger(pointAmount) && pointAmount >= 0) {
            db.setUserPoints(user, pointAmount)
            .catch(console.error)
            .then(response => {
              channel.send(`${authorMention}: <@${user}> now has ${pointAmount} points.`);
            })
          }
        }
      }
    }
    else if (arg.startsWith('<@') && arg.endsWith('>')) {
      let mention = arg;
      // get the id
      mention = mention.slice(2, -1);

      // has a nickname
      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }

      db.getUserPoints(mention)
      .catch(console.error)
      .then(points => {
        channel.send(`${authorMention}: <@${mention}> has ${points.points} points.`);
      })
    }
    else if (arg == 'top') {
      // leaderboards
    }
  }
})

client.login(config.token);