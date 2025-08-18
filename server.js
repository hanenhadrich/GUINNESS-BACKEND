import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; 
import cors from 'cors';
//ROUTES
import todoRoutes from './routes/todoRoutes.js'; 
import reservationRoutes from './routes/reservationRoutes.js'; 
import adherentRoutes from './routes/adherentRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import userReclamations from './routes/reclamationRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;

app.use(cors()); 
app.use(express.json()); 


mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch(error => {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1);
  });

//TEST 
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

//ROUTES
app.use('/todos', todoRoutes);
app.use('/reservations', reservationRoutes);
app.use('/adherents', adherentRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/users', userRoutes);
app.use('/reclamations', userReclamations);


app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
