const express = require('express');

const profileController = require('../controller/profileController');

const router = express.Router();

router.get(
  '/:userId/getAllUserCollection',
  profileController.getAllUserCollection
);

module.exports = router;
