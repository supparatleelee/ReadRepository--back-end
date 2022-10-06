const { UserCollection, User, Book } = require('../models');
const AppError = require('../utility/appError');

exports.getAllUserCollection = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
      attributes: { exclude: 'password' },
    });

    if (!user) {
      throw new AppError('user not found', 400);
    }

    const allUserCollection = await UserCollection.findAll({
      where: { userId: req.params.userId },
      atrributes: { exclude: 'userId' },
      include: [
        { model: User, attributes: { exclude: 'password' } },
        { model: Book },
      ],
    });

    const totalCollection = allUserCollection.length;

    res
      .status(200)
      .json({
        getAllUserCollection: [
          { total: totalCollection },
          { collectionLists: allUserCollection },
        ],
      });
  } catch (err) {
    next(err);
  }
};
