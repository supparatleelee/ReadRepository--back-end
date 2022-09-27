module.exports = (sequelize, DataTypes) => {
  const UserBookGenre = sequelize.define(
    'UserBookGenre',
    {},
    { underscored: true }
  );

  UserBookGenre.associate = (db) => {
    UserBookGenre.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    UserBookGenre.belongsTo(db.BookGenre, {
      foreignKey: {
        name: 'bookGenreId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return UserBookGenre;
};
