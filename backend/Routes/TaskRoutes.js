import express from 'express';
import { getTasks, addTask, moveTask, deleteTaskController } from '../Controller/TaskController.js';

const router = express.Router();

router.get('/',getTasks);
router.post('/add', addTask);
router.delete('/:id', deleteTaskController);
router.patch('/move/:id',moveTask);

export default router;