module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {}, { underscored: true });

  Like.associate = (db) => {
    Like.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Like.belongsTo(db.Review, {
      foreignKey: {
        name: 'reviewId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Like;
};
