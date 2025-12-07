const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.get('/', assignmentController.getAllAssignments);
router.get('/:id', assignmentController.getAssignmentById);
router.get('/class/:classId', assignmentController.getAssignmentsByClass);
router.post('/', assignmentController.createAssignment);
router.put('/:id', assignmentController.updateAssignment);
router.delete('/:id', assignmentController.deleteAssignment);
router.post('/submit', assignmentController.submitAssignment);
router.put('/submission/:submissionId/grade', assignmentController.gradeSubmission);
router.get('/student/:studentId/submissions', assignmentController.getSubmissionsByStudent);

module.exports = router;
