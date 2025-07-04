import User from '../model/userModel.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cloudinary from '../config/cloudinary.js'
import sendEmail from '../service/sendEmail.js'
import Problem from '../model/problemModel.js'
import fs from 'fs'

const registerUser = async (req, res) => {

    try {
        
        const {username, email, password} = req.body;

        // Validating the input
        if(!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please fill all the fields!' });
        }
        if(!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email!' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Please choose a strong password!' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists!' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUserData = new User({
            username,
            email,
            password:hashedPassword,
            profileImage:'https://res.cloudinary.com/ddxajykw2/image/upload/v1748023679/user_zvyqyd.png'
            
        });

        const newUser = await newUserData.save();

        //generating jwt tokens for managing user sessions
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '3h' });

        res.json({success: true, message: 'User registered successfully!', token});



    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: error.message || 'User Registration failed!' });
    }
}


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(" Login attempt for:", email);

    // 1. Empty field check
    if (!email || !password) {
      console.log(" Missing email or password");
      return res.status(400).json({ success: false, message: 'Please fill all the fields!' });
    }

    // 2. Invalid email format
    if (!validator.isEmail(email)) {
      console.log(" Invalid email format");
      return res.status(400).json({ success: false, message: 'Please enter a valid email!' });
    }

    // 3. Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      console.log(" No user found with email:", email);
      return res.status(400).json({ success: false, message: 'User does not exist!' });
    }

    // 4. Password verification
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      console.log("Incorrect password for user:", email);
      return res.status(400).json({ success: false, message: 'Incorrect Password!' });
    }

    const role = existingUser.role;
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '3h' });

    console.log(" Login successful:", { email, role });

    return res.json({
      success: true,
      message: `${existingUser.role} logged in successfully!`,
      token,
      role
    });
  } catch (error) {
    console.error(" Login Error:", error);
    return res.status(500).json({ success: false, message: 'User Login failed!' });
  }
};



const getUserProfile = async (req, res) => {

    try {
        
        const userId = req.user.id;

        //check if the user exists in db
        //since password is sensitive data we are not sending it to the client
        const existingUser = await User.findById(userId).select('-password').populate('solvedProblems', 'title');
        if(!existingUser) {
            return res.status(400).json({ success: false, message: 'User does not exist!' });
        }

        res.json({ success: true, message: 'User Profile fetched successfully!', user: existingUser });

    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ success: false, message: 'User Profile fetching failed!' });
    }
}

 const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { username, email } = req.body;

    const updatedData = { username, email };

    if (req.file) {
      updatedData.profileImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ userId: user._id }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '10m' });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail(email, 'Password Reset', `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" style="color:blue;">Reset Password</a>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${resetLink}</p>
    `);

    res.status(200).json({success:true , message: 'Reset email sent!' });
  } catch (err) {
    res.status(500).json({success:false , message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    res.json({success:true , message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({success:false , message: 'Invalid or expired token' });
  }
};

const addBookmark = async (req, res) => {
  const { problemId } = req.body;
  try {
    const userId = req.user.id;

    // Check if the problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) { 
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }   
    // Check if the user already bookmarked the problem
    const user = await User.findById(userId);
    if (user.bookmarks.includes(problemId)) {
      return res.status(400).json({ success: false, message: 'Problem already bookmarked' });
    }
    // Add the problem to the user's bookmarks
    user.bookmarks.push(problemId);
    await user.save();
    res.status(200).json({ success: true, message: 'Problem bookmarked successfully' });
  }
  catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ success: false, message: 'Failed to bookmark problem' });
  }
}

export { registerUser , loginUser , getUserProfile , updateUserProfile , forgotPassword , resetPassword, addBookmark}