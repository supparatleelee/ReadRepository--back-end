module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    'Book',
    {
      bookOlid: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );

  Book.associate = (db) => {
    Book.hasOne(db.Review, {
      foreignKey: {
        name: 'bookId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Book.hasOne(db.UserCollection, {
      foreignKey: {
        name: 'bookId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Book.hasOne(db.UserNote, {
      foreignKey: {
        name: 'bookId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Book.hasMany(db.BookGenre, {
      foreignKey: {
        name: 'bookId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    // Book.belongsTo(db.Author, {
    //   foreignKey: {
    //     name: 'authorId',
    //     allowNull: false,
    //   },
    //   onDelete: 'RESTRICT',
    //   onUpdate: 'RESTRICT',
    // });
  };

  return Book;
};
