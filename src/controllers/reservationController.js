import Reservation from '../models/ReservationModel.js';
import { listValidator } from '../validators/listValidator.js';  

export const getAllReservations = async (req, res) => {
  try {
    console.log("Requête reçue pour obtenir les réservations...");
    const reservations = await Reservation.find();  
    res.json(reservations); 
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createReservation = async (req, res) => {

  const { error } = listValidator.validate(req.body);

  if (error) {
    return res.status(400).json({ message: 'Données invalides', details: error.details });
  }

  const { title, description, dueDate, priority } = req.body;

  const newReservation = new Reservation({
    title,
    description,
    dueDate,
    priority,
    completed: false, 
  });

  try {
    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la réservation', error: error.message });
  }
};

export const updateReservation = async (req, res) => {
  const { reservationId } = req.params;
  const { error } = listValidator.validate(req.body);

  if (error) {
    return res.status(400).json({ message: 'Données invalides', details: error.details });
  }

  const { title, description, dueDate, priority, completed } = req.body;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

    reservation.title = title || reservation.title;
    reservation.description = description || reservation.description;
    reservation.dueDate = dueDate || reservation.dueDate;
    reservation.priority = priority || reservation.priority;
    reservation.completed = completed !== undefined ? completed : reservation.completed;

    const updatedReservation = await reservation.save();
    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la réservation', error: error.message });
  }
};

export const deleteReservation = async (req, res) => {
  const { reservationId } = req.params;

  try {
    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json({ message: 'Réservation supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la réservation', error: error.message });
  }
};
