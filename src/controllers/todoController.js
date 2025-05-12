import Todo from '../models/todoModel.js';
import { listValidator } from '../validators/listValidator.js';


export const getAllTodos = async (req, res) => {
  try {
    console.log("Requête reçue pour obtenir les todos...");
    const todos = await Todo.find();  
    res.json(todos); 
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createTodo = async (req, res) => {

  const { error } = listValidator.validate(req.body);

  if (error) {
    return res.status(400).json({ message: 'Données invalides', details: error.details });
  }

  const { title, description, dueDate, priority } = req.body;

  const newTodo = new Todo({
    title,
    description,
    dueDate,
    priority,
    completed: false, 
  });

  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la tâche', error: error.message });
  }
};

export const updateTodo = async (req, res) => {
  const { todoId } = req.params;


  const { error } = listValidator.validate(req.body);

  if (error) {
    return res.status(400).json({ message: 'Données invalides', details: error.details });
  }

  const { title, description, dueDate, priority, completed } = req.body;

  try {
    const todo = await Todo.findById(todoId);
    if (!todo) return res.status(404).json({ message: 'Tâche non trouvée' });

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.dueDate = dueDate || todo.dueDate;
    todo.priority = priority || todo.priority;
    todo.completed = completed !== undefined ? completed : todo.completed;

    const updatedTodo = await todo.save();
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche', error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  const { todoId } = req.params;

  try {
    const todo = await Todo.findByIdAndDelete(todoId);
    if (!todo) return res.status(404).json({ message: 'Tâche non trouvée' });

    res.status(200).json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la tâche', error: error.message });
  }
};
