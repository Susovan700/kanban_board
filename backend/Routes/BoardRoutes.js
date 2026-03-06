import express from 'express';
import{ getBoard } from '../Controller/BoardController.js';

const router = express.Router();

router.get('/', getBoard);

export default router;