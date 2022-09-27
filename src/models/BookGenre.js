module.exports = (sequelize, DataTypes) => {
  const BookGenre = sequelize.define(
    'BookGenre',
    {
      BookGenreTitle: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );

  BookGenre.associate = (db) => {
    BookGenre.belongsTo(db.Book, {
      foreignKey: {
        name: 'bookId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    BookGenre.hasOne(db.UserBookGenre, {
      foreignKey: {
        name: 'bookGenreId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return BookGenre;
};
