# Discord Gamebot
A gaming bot for Discord

## Purpose
I decided to make a bot that could play slots, and later on, also play Blackjack. The points have no monetary value and you are given points daily (at least on my implementation)

## Instructions
1. First, you will need to install MySQL, NodeJS, and Yarn (my dependancy manager of choice)
2. You will need to make the MySQL table. Choose your database, then make a table. This is what I used for the fields and with Sequelize:

  ```
  create table points (
    id varchar(64) not null,
    name varchar(32) not null,
    points bigint unsigned not null,
    primary key (id)
  );
  ```
3. Clone the repository
4. Perform `yarn` in the directory to install the modules
5. Edit the config found at `config/_config.json`. Instructions are located in that file.
6. Should be able to run it with `node app.js`
