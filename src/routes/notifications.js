const express = require('express');
const notificationController = require('../controllers/Notification');
const router = express.Router();

router.get('/getNotifications', notificationController.getNotifications);

module.exports = router;