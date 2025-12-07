const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');

router.get('/', lecturerController.getAllLecturers);
router.get('/:id', lecturerController.getLecturerById);
router.post('/', lecturerController.createLecturer);
router.put('/:id', lecturerController.updateLecturer);
router.delete('/:id', lecturerController.deleteLecturer);

module.exports = router;
