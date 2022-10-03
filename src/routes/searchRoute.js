const express = require('express');

const searchController = require('../controller/searchController');

const router = express.Router();

router.post('/', searchController.getBookApi);

module.exports = router;
