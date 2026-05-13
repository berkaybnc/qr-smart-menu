import express from 'express';
import { getPublicMenu } from '../controllers/menuController.js';

const router = express.Router();

router.get('/:slug', getPublicMenu);

export default router;
