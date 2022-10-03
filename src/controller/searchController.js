const axios = require('axios');

exports.getBookApi = async (req, res, next) => {
  try {
    const { bookTitle } = req.body;
    // console.log(bookTitle);
    const searchQueryString = bookTitle.replace(' ', '+');
    const bookslist = await axios.get(
      `https://openlibrary.org/search.json?title=${searchQueryString}`
    );
    res.status(200).json({ searchBooksList: bookslist.data });
  } catch (err) {
    next(err);
  }
};
