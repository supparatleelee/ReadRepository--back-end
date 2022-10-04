const axios = require('axios');

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
