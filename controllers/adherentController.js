import Adherent from '../models/adherentModel.js';
import { adherentValidator } from '../validators/adherentValidator.js';


const capitalizeFirstWord = (text) => {
  if (!text) return '';
  const words = text.split(' ');
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase(); 
  return words.join(' ');
};

export const getAllAdherents = async (req, res) => {
    try {
    const { nom, prenom, email } = req.query;
    let query = {};

    if (nom) {
      query.nom = { $regex: nom, $options: 'i' };
    }

    if (prenom) {
      query.prenom = { $regex: prenom, $options: 'i' };
    }

    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }

    const adherents = await Adherent.find(query);
    res.json(adherents);
  } catch (error) {
    console.error("Erreur lors de la récupération des adhérents:", error);
    res.status(500).json({
      message: 'Erreur interne du serveur',
      error: error.message,
      stack: error.stack
    });
  }
};


export const createAdherent = async (req, res) => {

  const { error } = adherentValidator.validate(req.body, { abortEarly: false });

  const allErrors = {};

  if (error) {
    error.details.forEach(detail => {
      const key = detail.path[0];
      if (!allErrors[key]) allErrors[key] = [];
      allErrors[key].push(detail.message);
    });
  }

  try {
    
    req.body.nom = capitalizeFirstWord(req.body.nom);
    req.body.prenom = capitalizeFirstWord(req.body.prenom);
    req.body.email = capitalizeFirstWord(req.body.email);

    const existingEmail = await Adherent.findOne({ email: req.body.email });
    if (existingEmail) {
      if (!allErrors.email) allErrors.email = [];
      allErrors.email.push('Cet email est déjà utilisé par un autre adhérent.');
    }

    const existingTelephone = await Adherent.findOne({ telephone: req.body.telephone });
    if (existingTelephone) {
      if (!allErrors.telephone) allErrors.telephone = [];
      allErrors.telephone.push('Ce numéro de téléphone est déjà utilisé par un autre adhérent.');
    }

    if (Object.keys(allErrors).length > 0) {
      return res.status(400).json(allErrors);
    }

    const newAdherent = new Adherent(req.body);
    const savedAdherent = await newAdherent.save();
    res.status(201).json(savedAdherent);
  } catch (error) {
    console.error("Erreur lors de la création de l'adhérent:", error);
    res.status(500).json({
      message: "Erreur lors de la création de l'adhérent",
      error: error.message,
      stack: error.stack
    });
  }
};

export const updateAdherent = async (req, res) => {
  const { adherentId } = req.params;
  const { error } = adherentValidator.validate(req.body, { abortEarly: false });

  const allErrors = {};

  if (error) {
    error.details.forEach(detail => {
      const key = detail.path[0];
      if (!allErrors[key]) allErrors[key] = [];
      allErrors[key].push(detail.message);
    });
  }

  try {
    const adherent = await Adherent.findById(adherentId);
    if (!adherent) {
      return res.status(404).json({ message: 'Adhérent non trouvé' });
    }

    req.body.nom = capitalizeFirstWord(req.body.nom);
    req.body.prenom = capitalizeFirstWord(req.body.prenom);
    req.body.email = capitalizeFirstWord(req.body.email);

    const existingEmail = await Adherent.findOne({ email: req.body.email, _id: { $ne: adherentId } });
    if (existingEmail) {
      if (!allErrors.email) allErrors.email = [];
      allErrors.email.push('Cet email est déjà utilisé par un autre adhérent.');
    }

    const existingTelephone = await Adherent.findOne({ telephone: req.body.telephone, _id: { $ne: adherentId } });
    if (existingTelephone) {
      if (!allErrors.telephone) allErrors.telephone = [];
      allErrors.telephone.push('Ce numéro de téléphone est déjà utilisé par un autre adhérent.');
    }

    if (Object.keys(allErrors).length > 0) {
      return res.status(400).json(allErrors);
    }

    Object.assign(adherent, req.body);
    const updatedAdherent = await adherent.save();
    res.status(200).json(updatedAdherent);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'adhérent:", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'adhérent",
      error: error.message,
      stack: error.stack
    });
  }
};



export const deleteAdherent = async (req, res) => {
  const { adherentId } = req.params;

  try {
    const adherent = await Adherent.findByIdAndDelete(adherentId);
    if (!adherent) {
      return res.status(404).json({ message: 'Adhérent non trouvé' });
    }

    res.status(200).json({ message: 'Adhérent supprimé avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'adhérent:", error);
    res.status(500).json({
      message: "Erreur lors de la suppression de l'adhérent",
      error: error.message,
      stack: error.stack
    });
  }
};
