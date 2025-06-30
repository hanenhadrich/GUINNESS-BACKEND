import mongoose from 'mongoose';
import Subscription from '../models/subscriptionModel.js';
import { subscriptionValidator } from '../validators/subscriptionValidator.js';
import Adherent from '../models/adherentModel.js'; 


const formatJoiErrors = (details) => {
  const errors = {};
  details.forEach((err) => {
    const field = err.context.key;
    errors[field] = err.message;
  });
  return errors;
};

// calculer la date de fin d’un abonnement
const calculateEndDate = (startDate, duration, type) => {
  const endDate = new Date(startDate);
  if (type === 'semaine') {
    endDate.setDate(endDate.getDate() + duration * 7);
  } else if (type === 'mois') {
    endDate.setMonth(endDate.getMonth() + duration);
  } else if (type === 'an') {
    endDate.setFullYear(endDate.getFullYear() + duration);
  }
  return endDate;
};

export const getAllSubscriptions = async (req, res) => {
  try {
    let { nomPrenom, startDate } = req.query;

    if (nomPrenom) {
      nomPrenom = nomPrenom.replace(/^["']|["']$/g, '');
    }

    let filter = {};

    if (startDate) {
      const parsedDate = new Date(startDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'Date de début invalide' });
      }
      filter.startDate = {
        $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(parsedDate.setHours(23, 59, 59, 999)),
      };
    }

    let subscriptions = await Subscription.find(filter).populate({
      path: 'adherent',
      select: 'nom prenom email',
    });

    if (nomPrenom) {
      const search = nomPrenom.toLowerCase().trim();
      subscriptions = subscriptions.filter((sub) => {
        if (!sub.adherent) return false;
        const fullName = `${sub.adherent.nom} ${sub.adherent.prenom}`.toLowerCase();
        return fullName.includes(search);
      });
    } else {
      subscriptions = subscriptions.filter((sub) => sub.adherent !== null);
    }

    res.status(200).json(subscriptions);
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnements:', error.message);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};

export const createSubscription = async (req, res) => {
  const { error } = subscriptionValidator.validate(req.body); // Validation Joi
  if (error) {
    return res.status(400).json(formatJoiErrors(error.details));
  }

  try {
    let { adherent, startDate, duration, type } = req.body;

    if (!mongoose.Types.ObjectId.isValid(adherent)) {
      return res.status(400).json({ adherent: "ID adhérent invalide" });
    }

    
    const existingAdherent = await Adherent.findById(adherent);
    if (!existingAdherent) {
      return res.status(404).json({ message: "Adhérent non trouvé" });
    }

    
    const normalizedStartDate = new Date(startDate);
    normalizedStartDate.setHours(0, 0, 0, 0);

    
    if (isNaN(normalizedStartDate.getTime())) {
      return res.status(400).json({ startDate: "Date de début invalide" });
    }

    
    const existing = await Subscription.findOne({ adherent });
    if (existing && existing.endDate >= new Date()) {
      return res.status(409).json({
        adherentId: "Un abonnement actif existe déjà pour cet adhérent.",
      });
    }

    
    const endDate = calculateEndDate(normalizedStartDate, duration, type);

    
    const newSubscription = new Subscription({
      adherent,
      startDate: normalizedStartDate,
      duration,
      type,
      endDate,
    });

    
    const savedSubscription = await newSubscription.save();
    res.status(201).json(savedSubscription);
  } catch (error) {
    console.error("Erreur lors de la création de l'abonnement:", error.message);
    res.status(500).json({
      message: "Erreur lors de la création de l'abonnement",
      error: error.message,
    });
  }
};

export const updateSubscription = async (req, res) => {
  const { subscriptionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
    return res.status(400).json({ message: "ID d'abonnement invalide" });
  }

  const { error } = subscriptionValidator.validate(req.body);
  if (error) {
    return res.status(400).json(formatJoiErrors(error.details));
  }

  try {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Abonnement non trouvé" });
    }

    const { adherent, startDate, duration, type } = req.body; 
    if (!adherent) {
      return res.status(400).json({ adherent: "Adhérent requis" });
    }

   
    const existingAdherent = await Adherent.findById(adherent);
    if (!existingAdherent) {
      return res.status(404).json({ message: "Adhérent non trouvé" });
    }

    
    const normalizedStartDate = new Date(startDate);
    normalizedStartDate.setHours(0, 0, 0, 0);

    if (isNaN(normalizedStartDate.getTime())) {
      return res.status(400).json({ startDate: "Date de début invalide" });
    }

    const endDate = calculateEndDate(normalizedStartDate, duration, type);

    
    const duplicate = await Subscription.findOne({
      _id: { $ne: subscriptionId }, 
      adherent: adherent,
      type: type,
      $or: [
        { 
          startDate: { $lte: endDate }, 
          endDate: { $gte: normalizedStartDate }
        }
      ],
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Un abonnement pour cet adhérent avec ce type existe déjà sur cette période."
      });
    }

    
    subscription.adherent = adherent;
    subscription.startDate = normalizedStartDate;
    subscription.duration = duration;
    subscription.type = type;
    subscription.endDate = endDate;

    const updatedSubscription = await subscription.save();
    res.status(200).json(updatedSubscription);

  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'abonnement:", error.message);
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'abonnement",
      error: error.message,
    });
  }
};

export const deleteSubscription = async (req, res) => {
  const { subscriptionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
    return res.status(400).json({ message: "ID d'abonnement invalide" });
  }

  try {
    const subscription = await Subscription.findByIdAndDelete(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    res.status(200).json({ message: 'Abonnement supprimé avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'abonnement:", error.message);
    res.status(500).json({
      message: "Erreur lors de la suppression de l'abonnement",
      error: error.message
    });
  }
};
