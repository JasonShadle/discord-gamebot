const token = require('./config/config.json').token;
const Discord = require('discord.js');
const client = new Discord.Client();
const Sequelize = require('sequelize');

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
    }
});


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
    console.log(`${msg.author}: ${msg.content}`);

})

client.login(token);