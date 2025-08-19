import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

//import { getJobs, createJob } from '../controllers/job.controller.js'; //testing 
const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);


// Get all jobs with optional salary filter
//router.get('/', getJobs);

// Create a new job
//router.post('/post', createJob);
export default router;

