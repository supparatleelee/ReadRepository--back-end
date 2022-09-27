module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define(
    'Author',
    {
      authorName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      profileImage: DataTypes.STRING,
    },
    { underscored: true }
  );

  Author.associate = (db) => {
    Author.hasMany(db.Book, {
      foreignKey: {
        name: 'authorId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Author;
};
