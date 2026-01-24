const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const analyticsController = require('../controllers/analyticsController');

// GET /api/students/analytics - Get aggregated analytics data
router.get('/analytics', analyticsController.getAnalytics);

// GET /api/students/risk - Get all students with risk assessments
router.get('/risk', studentController.getStudentsWithRisk);

// GET /api/students/:id - Get single student by ID
router.get('/:id', studentController.getStudentById);

module.exports = router;
