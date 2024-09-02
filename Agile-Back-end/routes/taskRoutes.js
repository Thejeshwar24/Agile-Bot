import express from 'express';
import { createTask, getTasks,getTaskById,updateTask,deleteTask ,getTasksByUserId} from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTask);
router.get('/', getTasks);
//
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

//
router.get('/user/:userId', getTasksByUserId);

export default router;
