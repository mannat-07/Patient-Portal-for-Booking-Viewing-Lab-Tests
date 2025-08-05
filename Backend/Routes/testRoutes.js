const express = require('express');
const router = express.Router();
const testController = require('../Controllers/testController');

router.get('/', testController.getAllTests);
router.get('/:id', testController.getTestById);

module.exports = router;
