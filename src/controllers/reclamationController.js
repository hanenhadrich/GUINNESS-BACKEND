import Reclamation from '../models/reclamationModel.js';
import { reclamationValidator } from '../validators/reclamationValidator.js';


export const createReclamation = async (req, res) => {
  
  const { error } = reclamationValidator.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.reduce((acc, err) => {
      acc[err.context.key] = err.message;
      return acc;
    }, {});
    return res.status(400).json(errors);
  }

  try {
    const reclamation = new Reclamation(req.body);
    await reclamation.save();
    res.status(201).json(reclamation);
  } catch (err) {
    console.error('Erreur lors de la création de la réclamation :', err.message);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


export const getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find().sort({ createdAt: -1 });
    res.status(200).json(reclamations);
  } catch (err) {
    console.error('Erreur lors de la récupération des réclamations :', err.message);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

//PAS ENCORE TRAVAILLER DANS LE FRONT
export const getReclamationById = async (req, res) => {
  try {
    const reclamation = await Reclamation.findById(req.params.id);
    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }
    res.status(200).json(reclamation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


export const deleteReclamation = async (req, res) => {
  try {
    const deleted = await Reclamation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }
    res.status(200).json({ message: 'Réclamation supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: err.message });
  }
};

export const markReclamationAsRead = async (req, res) => {
  try {
    const updated = await Reclamation.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la réclamation :', err.message);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

