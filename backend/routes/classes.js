const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);
router.post('/', classController.createClass);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);
router.post('/assign-lecturer', classController.assignLecturer);
router.delete('/:classID/lecturer/:lecturerID', classController.removeLecturer);

module.exports = router;
