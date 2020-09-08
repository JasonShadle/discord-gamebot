module.exports = (sequelize, DataTypes) => {
    const blackjack = sequelize.define('blackjack', {
        gameID: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bet: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        playerCards: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dealerCards: {
            type: DataTypes.STRING,
            allowNull: false
        },
        active: {
            type: DataTypes.TINYINT
        }
    },{
        timestamps: false,
        logging: false,
        freezeTableName: true
    });
    blackjack.associate = function(models) {
        // associations
    };
    return blackjack;
};