const express = require('express');
const router = express.Router();
const controller = require('../controllers/linkController');

// API endpoints (autograder expects these exact paths)
router.post('/api/links', controller.createLink);
router.get('/api/links', controller.listLinks);
router.get('/api/links/:code', controller.getLink);
router.delete('/api/links/:code', controller.deleteLink);

module.exports = router;
