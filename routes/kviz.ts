import express, { Router } from 'express';
import {
    historyHandler,
    geographicHandler,
    socialHandler,
    musicHandler,
} from '../httpHandlers';

const router = Router();

router.get('/history', historyHandler);
router.get('/geographic', geographicHandler);
router.get('/social', socialHandler);
router.get('/music', musicHandler);

export default router;
