module.exports = (sequelize, DataTypes) => {
  const UserCollectionList = sequelize.define(
    'UserCollectionList',
    {
      collectionName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );

  UserCollectionList.associate = (db) => {
    UserCollectionList.belongsTo(db.UserCollection, {
      foreignKey: {
        name: 'userCollectionId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return UserCollectionList;
};
