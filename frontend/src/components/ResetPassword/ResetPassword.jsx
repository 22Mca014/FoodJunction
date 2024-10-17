import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // useNavigate for redirection
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets'
 
 import  "./ResetPassword.css"

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate(); // useNavigate to handle navigation

    // State to store passwords
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // Extract token from URL query parameters
    const query = new URLSearchParams(location.search);
    const token = query.get('token'); // Get the token from URL

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if passwords match
        if (newPassword !== confirmNewPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            // Send new password and token to backend
            const response = await axios.post('https://foodjunction.onrender.com/api/user/reset-password', {
                token,
                newPassword
            });

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/'); // Redirect to login after successful password reset
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Something went wrong, please try again.");
        }
    }

    // Function to redirect to the home page when the cross icon is clicked
    const handleClose = () => {
        navigate('/'); // Redirect to the home page
    }

    return (
        <div className="reset-password-container">
            <div className="container">

            <div className="reset-password-header">
                <h2>Reset Your Password</h2>
                <img src={assets.cross_icon} alt="close" onClick={handleClose} className="close-icon" />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            </div>
        </div>
    );
};

export default ResetPassword;
