const axios = require('axios');
const { User, Book, UserCollection } = require('../models');

exports.showBookInfo = async (req, res, next) => {
  try {
    const { olid } = req.params;
    const bookInfo = await axios.get(
      `https://openlibrary.org/works/${olid}.json`
    );
    console.log(bookInfo);
    res.status(200).json({ bookInfo: bookInfo.data });
  } catch (err) {
    next(err);
  }
};

exports.addBookToList = async (req, res, next) => {
  try {
    const { readingStatus } = req.body;

    const existOlid = await Book.findOne({
      where: { bookOlid: req.params.olid },
    });

    if (!existOlid) {
      const newBook = await Book.create({ bookOlid: req.params.olid });

      const newBookCollection = await UserCollection.create({
        bookStatus: readingStatus,
        userId: req.user.id,
        bookId: newBook.id,
      });

      const bookCollection = await UserCollection.findOne({
        where: { id: newBookCollection.id },
        atrributes: { exclude: 'userId' },
        include: [
          { model: User, attributes: { exclude: 'password' } },
          { model: Book },
        ],
      });

      return res.status(201).json({ bookCollection });
    }

    const existBookCollectionRecord = await UserCollection.findOne({
      where: {
        userId: req.user.id,
        bookId: existOlid.id,
      },
    });
    if (existBookCollectionRecord) {
      await UserCollection.update(
        { bookStatus: readingStatus },
        { where: { id: existBookCollectionRecord.id } }
      );

      const bookCollection = await UserCollection.findOne({
        where: { id: existBookCollectionRecord.id },
        atrributes: { exclude: 'userId' },
        include: [
          { model: User, attributes: { exclude: 'password' } },
          { model: Book },
        ],
      });

      return res.status(201).json({ bookCollection });
    }

    const newBookCollection = await UserCollection.create({
      bookStatus: readingStatus,
      userId: req.user.id,
      bookId: existOlid.id,
    });

    const bookCollection = await UserCollection.findOne({
      where: { id: newBookCollection.id },
      atrributes: { exclude: 'userId' },
      include: [
        { model: User, attributes: { exclude: 'password' } },
        { model: Book },
      ],
    });

    res.status(201).json({ bookCollection });
  } catch (err) {
    next(err);
  }
};