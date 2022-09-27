const {
  WANT_TO_READ_BOOK,
  CURRENTLY_READING_BOOK,
  READ_BOOK,
} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const UserCollection = sequelize.define(
    'UserCollection',
    {
      bookStatus: {
        type: DataTypes.ENUM(
          WANT_TO_READ_BOOK,
          CURRENTLY_READING_BOOK,
          READ_BOOK
        ),
        defaultValue: WANT_TO_READ_BOOK,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      onPage: DataTypes.INTEGER, // if have value -> currently reading status. if done, read status.
      totalPage: DataTypes.INTEGER,
    },
    { underscored: true }
  );

  UserCollection.associate = (db) => {
    UserCollection.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    UserCollection.belongsTo(db.Book, {
      foreignKey: {
        name: 'bookId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    UserCollection.hasMany(db.UserCollectionList, {
      foreignKey: {
        name: 'userCollectionId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return UserCollection;
};
