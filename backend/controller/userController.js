import User from '../model/userModel.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


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
            password:hashedPassword
            
        });

        const newUser = await newUserData.save();

        //generating jwt tokens for managing user sessions
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({success: true, message: 'User registered successfully!', token});



    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'User Registration failed!' });
    }
}


const loginUser = async (req, res) => {

    try {
        
        const { email, password } = req.body;

        // Validating the input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please fill all the fields!' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email!' });
        }

        // Check if the user exists in db
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'User does not exist!' });
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: 'Incorrect Password!' });
        }

        //generating jwt tokens for managing user sessions
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ success: true, message: `${existingUser.role} logged in successfully!`, token });


    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ success: false, message: 'User Login failed!' });
    }
}


const getUserProfile = async (req, res) => {

    try {
        
        const userId = req.user.id;

        //check if the user exists in db
        //since password is sensitive data we are not sending it to the client
        const existingUser = await User.findById(userId).select('-password');
        if(!existingUser) {
            return res.status(400).json({ success: false, message: 'User does not exist!' });
        }

        res.json({ success: true, message: 'User Profile fetched successfully!', user: existingUser });

    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ success: false, message: 'User Profile fetching failed!' });
    }
}















export { registerUser , loginUser , getUserProfile }