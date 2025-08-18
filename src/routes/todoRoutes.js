import express from 'express';
import {
  getAllTodos,
  createTodo,
  deleteTodo,
  updateTodo
} from '../controllers/todoController.js'; 

const router = express.Router();

router.get('/', getAllTodos);
router.post('/', createTodo);
router.delete('/:todoId', deleteTodo);
router.put('/:todoId', updateTodo); 

export default router;
