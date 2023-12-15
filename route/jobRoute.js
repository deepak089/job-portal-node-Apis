const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/authMiddleware');
const { createJobController, getAllJobsController, editJobController, deleteJobController, jobStatsController } = require('../controller/jobController');

router.post("/job/create",createJobController);
router.get("/jobs",getAllJobsController);
router.put("/jobs/:id",editJobController);
router.delete("/jobs/:id",deleteJobController);
router.delete("/job/stats",jobStatsController);


module.exports = router;
