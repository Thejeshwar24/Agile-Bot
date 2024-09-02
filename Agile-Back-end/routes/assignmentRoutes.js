import express from 'express';
import { getUserAssignments } from '../controllers/assignmentController.js';

const router = express.Router();

// Route to get user assignments (tasks and stories)
router.get('/assignments/:userId', getUserAssignments);

export default router;
