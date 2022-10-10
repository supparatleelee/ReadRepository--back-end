const axios = require('axios');
const AppError = require('../utility/appError');
const { User, Book, UserCollection, UserNote } = require('../models');

exports.showBookInfo = async (req, res, next) => {
  try {
    const { olid } = req.params;
    const bookInfo = await axios.get(
      `https://openlibrary.org/works/${olid}.json`
    );

    const existBookOlid = await Book.findOne({
      where: { bookOlid: olid },
    });

    if (existBookOlid) {
      const isAddedBookToList = await UserCollection.findOne({
        where: { userId: req.user.id, bookId: existBookOlid.id },
        atrributes: { exclude: 'userId' },
        include: [
          { model: User, attributes: { exclude: 'password' } },
          { model: Book },
        ],
      });

      const isCreatedNote = await UserNote.findOne({
        where: {
          userId: req.user.id,
          bookId: existBookOlid.id,
        },
        atrributes: { exclude: 'userId' },
        include: [
          { model: User, attributes: { exclude: 'password' } },
          { model: Book },
        ],
      });

      if (isAddedBookToList && !isCreatedNote) {
        const readingProgress =
          (isAddedBookToList.onPage / isAddedBookToList.totalPage) * 100;

        return res.status(200).json({
          bookInfo: bookInfo.data,
          bookStatus: isAddedBookToList.bookStatus,
          bookReadingActivity: readingProgress,
        });
      }

      if (isCreatedNote && !isAddedBookToList) {
        return res.status(200).json({
          bookInfo: bookInfo.data,
          userNote: isCreatedNote.note,
          userNoteUpdatedAt: isCreatedNote.updatedAt,
        });
      }

      if (isAddedBookToList && isCreatedNote) {
        const readingProgress =
          (isAddedBookToList.onPage / isAddedBookToList.totalPage) * 100;

        return res.status(200).json({
          bookInfo: bookInfo.data,
          bookStatus: isAddedBookToList.bookStatus,
          userNote: isCreatedNote.note,
          userNoteUpdatedAt: isCreatedNote.updatedAt,
          bookReadingActivity: readingProgress,
        });
      }
    }

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

exports.deleteAddToList = async (req, res, next) => {
  try {
    const existOlid = await Book.findOne({
      where: { bookOlid: req.params.olid },
    });

    if (!existOlid) {
      throw new AppError(
        'Cannot delete this book from your list as there is no such book',
        400
      );
    }

    const existBookCollectionRecord = await UserCollection.findOne({
      where: {
        userId: req.user.id,
        bookId: existOlid.id,
      },
    });

    if (!existBookCollectionRecord) {
      throw new AppError(
        "You haven't add this book to your collection yet",
        400
      );
    }

    await UserCollection.destroy({
      where: { id: existBookCollectionRecord.id },
    });

    res
      .status(200)
      .json({ message: 'success delete this book from your collection' });
  } catch (err) {
    next(err);
  }
};

exports.readingActivity = async (req, res, next) => {
  try {
    const { currentPage, totalPage } = req.body;

    const existOlid = await Book.findOne({
      where: { bookOlid: req.params.olid },
    });

    const bookCollection = await UserCollection.findOne({
      where: { userId: req.user.id, bookId: existOlid.id },
    });

    await UserCollection.update(
      { onPage: currentPage, totalPage: totalPage },
      { where: { id: bookCollection.id } }
    );

    const readingProgress =
      (bookCollection.onPage / bookCollection.totalPage) * 100;

    res.status(200).json({ readingProgress, bookCollection });
  } catch (err) {
    next(err);
  }
};
