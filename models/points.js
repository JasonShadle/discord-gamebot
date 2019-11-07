module.exports = (sequelize, DataTypes) => {
    const points = sequelize.define('points', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        name : {
            type: DataTypes.STRING,
            allowNull: false
        },
        points: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        highscore: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        }

    },{
        timestamps: false,
        logging: false
    });
    points.associate = function(models) {
        // associations
    };
    return points;
};