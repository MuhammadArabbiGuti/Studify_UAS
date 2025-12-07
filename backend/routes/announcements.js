const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

router.get('/', announcementController.getAllAnnouncements);
router.get('/:id', announcementController.getAnnouncementById);
router.get('/class/:classId', announcementController.getAnnouncementsByClass);
router.post('/', announcementController.createAnnouncement);
router.put('/:id', announcementController.updateAnnouncement);
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;
