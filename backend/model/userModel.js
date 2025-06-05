import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  submissionsCount: {
    type: Number,
    default: 0
  },
  profileImage:{
    type: String,
    default: ''
  },
  solvedProblems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }
  ],
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }
  ],
});

const User = mongoose.model('User', userSchema);

export default User;
