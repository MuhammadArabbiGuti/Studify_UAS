const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

router.get('/', enrollmentController.getAllEnrollments);
router.post('/', enrollmentController.enrollStudent);
router.put('/:id', enrollmentController.updateEnrollmentStatus);
router.delete('/:id', enrollmentController.deleteEnrollment);
router.get('/student/:studentId', enrollmentController.getClassesByStudent);
router.get('/lecturer/:lecturerId', enrollmentController.getClassesByLecturer);

module.exports = router;
