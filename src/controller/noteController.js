const { UserNote, Book, User } = require('../models');

exports.createNote = async (req, res, next) => {
  try {
    const { noteContent } = req.body;

    const existBookOlid = await Book.findOne({
      where: { bookOlid: req.params.olid },
    });

    if (!existBookOlid) {
      const newBook = await Book.create({ bookOlid: req.params.olid });

      const newNote = await UserNote.create({
        note: noteContent,
        bookId: newBook.id,
        userId: req.user.id,
      });

      const note = await UserNote.findOne({
        where: { id: newNote.id },
        atrributes: { exclude: 'userId' },
        include: [
          { model: User, attributes: { exclude: 'password' } },
          { model: Book },
        ],
      });

      return res.status(201).json({ note });
    }

    const existUserNote = await UserNote.findOne({
      where: {
        userId: req.user.id,
        bookId: existBookOlid.id,
      },
    });

    if (existUserNote) {
      await UserNote.update(
        { note: noteContent },
        { where: { id: existUserNote.id } }
      );

      const note = await UserNote.findOne({
        where: { id: existUserNote.id },
        atrributes: { exclude: 'userId' },
        include: [
          { model: User, attributes: { exclude: 'password' } },
          { model: Book },
        ],
      });

      return res.status(201).json({ note });
    }

    const newNote = await UserNote.create({
      note: noteContent,
      bookId: existBookOlid.id,
      userId: req.user.id,
    });

    const note = await UserNote.findOne({
      where: { id: newNote.id },
      atrributes: { exclude: 'userId' },
      include: [
        { model: User, attributes: { exclude: 'password' } },
        { model: Book },
      ],
    });
    res.status(201).json({ note });
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const existBookOlid = await Book.findOne({
      where: { bookOlid: req.params.olid },
    });

    const note = await UserNote.findOne({
      where: { userId: req.user.id, bookId: existBookOlid.id },
    });

    if (!note) {
      return res.status(400).json({
        message: 'note with this user id and bookOlid does not exists',
      });
    }

    if (note.userId !== req.user.id) {
      res.status(400).json({ message: 'cannot delete note' });
    }

    await UserNote.destroy({
      where: { userId: req.user.id, bookId: existBookOlid.id },
    });

    res
      .status(200)
      .json({ message: 'success delete user note with this book' });
  } catch (err) {
    next(err);
  }
};
