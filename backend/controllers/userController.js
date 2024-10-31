import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

// Create JWT token for authentication and reset password
// Create JWT token for authentication with a 5-minute expiration
const createToken = (id, expiresIn = '1h') => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
}


// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);

        // Check if the user is an admin
        if (user.role === 'ADMIN') {
            return res.status(200).json({ success: true, token, redirectUrl: process.env.ADMIN_URL });
        }

        // For non-admin users
        res.status(200).json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}



// Register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();
        const token = createToken(user._id);

        
        
   await sendEmail(
    user.email,                    // Recipient's email
    "Welcome to Our Service!",      // Dynamic subject
    `Hi ${user.name},\n\nWelcome to our platform! We are excited to have you on board.\n\nBest regards,\nFood Junction`
);


        res.status(201).json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// Forgot password
// Forgot password function in the backend
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        // Generate the reset token (assuming you're using JWT or another method)
        const resetToken = createToken(user._id, '15m');  // Token valid for 15 minutes
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        // Send reset email
        await sendEmail(user.email, "Password Reset Request", `Reset your password using the link below:\n\n${resetLink}`);

        res.status(200).json({ success: true, message: "Password reset link sent to email" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// Reset password
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid token" });
        }

        // Validate the new password
        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: "Password has been reset successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error resetting password" });
    }
}

//Admin log in
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: "User does not exist" });
      }
  
      // Check if the password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }
  
      // Check if the user is an admin
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: "Access denied. Admins only." });
      }
  
      // Generate token if user is an admin
      const token = createToken(user._id);
      return res.status(200).json({ success: true, message: "Thank you for logging in", token });
  
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

export { loginUser, registerUser, forgotPassword, resetPassword,adminLogin };
