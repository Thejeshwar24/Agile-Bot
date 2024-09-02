import express from 'express';
import { createEpic, getEpics,getEpicById,updateEpic,deleteEpic } from '../controllers/epicController.js';

const router = express.Router();

router.post('/', createEpic);
router.get('/', getEpics);
//
router.get('/:id', getEpicById);
router.put('/:id', updateEpic);
router.delete('/:id', deleteEpic);



export default router;
