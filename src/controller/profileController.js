const { UserCollection, User, Book } = require('../models');
const axios = require('axios');
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

    const pureAllUserCollection = JSON.parse(JSON.stringify(allUserCollection));

    for (const userCollection of pureAllUserCollection) {
      const res = await axios.get(
        `https://openlibrary.org/works/${userCollection.Book.bookOlid}.json`
      );
      userCollection.Book.bookData = res.data;
    }

    res.status(200).json({
      getAllUserCollection: [
        { total: totalCollection },
        { collectionLists: pureAllUserCollection },
      ],
    });
  } catch (err) {
    next(err);
  }
};
