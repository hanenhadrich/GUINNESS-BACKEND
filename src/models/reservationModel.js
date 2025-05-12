import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  title: {type: String, required: true },
  completed: {type: Boolean,default: false}
 
}, { timestamps: true }); 


const Reservation = mongoose.model('Reservation', ReservationSchema);

export default Reservation;
