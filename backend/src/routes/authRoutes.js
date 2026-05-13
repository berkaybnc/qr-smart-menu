import express from 'express';
import { registerRootTenant, loginRootTenant } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerRootTenant);
router.post('/login', loginRootTenant);

export default router;
