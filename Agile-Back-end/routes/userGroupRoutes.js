import express from 'express';
import { createUserGroup, getUserGroups } from '../controllers/userGroupController.js';

const router = express.Router();

router.post('/', createUserGroup);
router.get('/', getUserGroups);

export default router;
