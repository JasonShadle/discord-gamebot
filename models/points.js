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
            type: DataTypes.BIGINT,
            allowNull: false
        }

    },{});
    points.associate = function(models) {
        // associations
    };
    return points;
};