const express = require('express');

const bookController = require('../controller/bookController');
const noteController = require('../controller/noteController');

const router = express.Router();

router.post('/:olid', bookController.showBookInfo);

router.post('/:olid/addToList', bookController.addBookToList);

router.post('/:olid/note', noteController.createNote);
router.delete('/:olid/note', noteController.deleteNote);

module.exports = router;
