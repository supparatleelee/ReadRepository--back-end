// const sequelize = new (require('sequelize').Sequelize)();
// const DataTypes = require('sequelize').DataTypes;

// module.exports = () => {
module.exports = (sequelize, DataTypes) => {
  const UserNote = sequelize.define(
    'UserNote',
    {
      note: DataTypes.TEXT('long'),
    },
    { underscored: true }
  );

  UserNote.associate = (db) => {
    UserNote.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    UserNote.belongsTo(db.Book, {
      foreignKey: {
        name: 'bookId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return UserNote;
};
