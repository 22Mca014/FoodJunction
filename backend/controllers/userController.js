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
  const createAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;
  
    try {
      // Validate required fields
      if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
  
      // Ensure the role is 'ADMIN'
      if (role !== "ADMIN") {
        return res.status(400).json({ success: false, message: "Invalid role. Only 'ADMIN' is allowed." });
      }
  
      // Check if the email already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already exists." });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the admin user
      const newAdmin = new userModel({
        name,
        email,
        password: hashedPassword,
        role,
      });
  
      // Save the admin to the database
      await newAdmin.save();
  
      res.status(201).json({
        success: true,
        message: "Admin user created successfully!",
        data: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      });
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  };
  //fetch all admin users
  const fetchAdmins = async (req, res) => {
    try {
      // Fetch users with role "ADMIN" and select only name, email, and role
      const admins = await userModel.find({ role: "ADMIN" }).select("name email role");
  
      // If no admins found, return a message
      if (admins.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No admin users found.",
        });
      }
  
      // Return the list of admins
      res.status(200).json({
        success: true,
        message: "Admin users fetched successfully.",
        data: admins,
      });
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
  

export { loginUser, registerUser, forgotPassword, resetPassword,adminLogin,createAdmin,fetchAdmins };
