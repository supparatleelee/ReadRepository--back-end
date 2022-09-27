// const sequelize = new (require('sequelize').Sequelize)();
// const DataTypes = require('sequelize').DataTypes;

// module.exports = () => {
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
    {
      review: {
        type: DataTypes.TEXT('long'),
      },
      rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5,
        },
      },
    },
    { underscored: true }
  );

  Review.associate = (db) => {
    Review.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Review.hasMany(db.Like, {
      foreignKey: {
        name: 'reviewId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Review.hasMany(db.Comment, {
      foreignKey: {
        name: 'reviewId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Review.belongsTo(db.Book, {
      foreignKey: {
        name: 'bookId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Review;
};
