import Subscription from '../models/subscriptionModel.js';
import { subscriptionValidator } from '../validators/subscriptionValidator.js';


export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate('adherent', 'nom prenom email');
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnements:", error.message);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};


export const createSubscription = async (req, res) => {
  const { error } = subscriptionValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Données invalides', details: error.details });
  }

  try {
    const { adherent, startDate, duration, type } = req.body;

   
    let endDate;
    if (type === 'semaine') {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + duration * 7);
    } else if (type === 'mois') {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + duration); 
    } else if (type === 'an') {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + duration); 
    }

    const newSubscription = new Subscription({
      adherent,
      startDate,
      duration,
      type,
      endDate
    });

    const savedSubscription = await newSubscription.save();
    res.status(201).json(savedSubscription);
  } catch (error) {
    console.error("Erreur lors de la création de l'abonnement:", error.message);
    res.status(500).json({ message: "Erreur lors de la création de l'abonnement", error: error.message });
  }
};


export const updateSubscription = async (req, res) => {
  const { subscriptionId } = req.params;
  const { error } = subscriptionValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Données invalides', details: error.details });
  }

  try {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    const { startDate, duration, type } = req.body;


    let endDate;
    if (type === 'semaine') {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + duration * 7);
    } else if (type === 'mois') {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + duration);
    } else if (type === 'an') {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + duration);
    }


    subscription.startDate = startDate;
    subscription.duration = duration;
    subscription.type = type;
    subscription.endDate = endDate;

    const updatedSubscription = await subscription.save();
    res.status(200).json(updatedSubscription);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'abonnement:", error.message);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'abonnement", error: error.message });
  }
};


export const deleteSubscription = async (req, res) => {
  const { subscriptionId } = req.params;

  try {
    const subscription = await Subscription.findByIdAndDelete(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Abonnement non trouvé' });
    }

    res.status(200).json({ message: 'Abonnement supprimé avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'abonnement:", error.message);
    res.status(500).json({ message: "Erreur lors de la suppression de l'abonnement", error: error.message });
  }
};
