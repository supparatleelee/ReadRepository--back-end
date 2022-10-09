const express = require('express');

const bookController = require('../controller/bookController');
const noteController = require('../controller/noteController');

const router = express.Router();

router.post('/:olid', bookController.showBookInfo);

router.post('/:olid/addToList', bookController.addBookToList);
router.delete('/:olid/deleteFromList', bookController.deleteAddToList);

router.post('/:olid/note', noteController.createNote);
router.delete('/:olid/note', noteController.deleteNote);
router.patch('/:olid/note', noteController.updateNote);

router.patch('/:olid/readingActivity', bookController.readingActivity);

module.exports = router;
