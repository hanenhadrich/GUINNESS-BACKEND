import express from 'express';
import {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo
} from '../controllers/todoController.js'; 

const router = express.Router();

router.get('/', getAllTodos);
router.post('/', createTodo);
router.put('/:todoId', updateTodo);
router.delete('/:todoId', deleteTodo);

export default router;
