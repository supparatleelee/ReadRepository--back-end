const AppError = require('../utility/appError');
const { Author, Book } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const { authorsName, bookOlid, title, subtitle, publishDate } = req.body;

    if (!bookOlid) {
      throw new AppError('Need bookOlid for bookId in the Book Table', 401);
    }

    if (!title) {
      throw new AppError('Need title for bookName in the Book Table', 401);
    }

    authorsName.map(async (item) => await Author.create({ authorName: item }));
    const newBook = await Book.create({
      id: bookOlid,
      bookName: title,
      description: subtitle,
      publishYear: publishDate,
    });

    req.book = newBook;
    next();
  } catch (err) {
    next(err);
  }
};
