import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Définition du schéma de l'utilisateur
const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  { timestamps: true }
);

// Hachage du mot de passe avant sauvegarde
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode de comparaison de mot de passe
UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Export du modèle utilisateur
export default mongoose.model('User', UserSchema);
