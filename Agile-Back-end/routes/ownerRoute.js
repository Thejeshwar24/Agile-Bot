// routes/ownerRoutes.js
import express from 'express';
import { getOwners } from '../controllers/ownersController.js';

const router = express.Router();

router.get('/', getOwners);

export default router;
