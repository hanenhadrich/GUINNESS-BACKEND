import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; 
import bodyParser from 'body-parser';
import cors from 'cors';

// Importation des routes
import todoRoutes from './src/routes/todoRoutes.js'; 
import reservationRoutes from './src/routes/reservationRoutes.js'; 
import adherentRoutes from './src/routes/adherentRoutes.js';
import subscriptionRoutes from './src/routes/subscriptionRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

// Chargement des variables d'environnement depuis .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;

// Middleware pour gérer les CORS et analyser les données
app.use(cors()); // Permet les requêtes provenant d'autres domaines
app.use(express.json()); // Pour analyser les requêtes JSON

// Connexion à MongoDB (avec les options obsolètes supprimées)
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    // Démarrer le serveur si la connexion réussie
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch(error => {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1); // Arrêter l'application si la connexion échoue
  });

// Route de test (s'assurer que l'API fonctionne)
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// Intégration des routes principales
app.use('/todos', todoRoutes);
app.use('/reservations', reservationRoutes);
app.use('/adherents', adherentRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/users', userRoutes);

// Si aucune des routes ci-dessus ne correspond, renvoyer une erreur 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
