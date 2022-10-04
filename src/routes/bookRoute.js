const express = require('express');

const bookController = require('../controller/bookController');

const router = express.Router();

router.post('/:olid', bookController.showBookInfo);
// router.post('/', bookController.addBookToList);

module.exports = router;
