import React from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const handleLogout = () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Remove the token from localStorage
      localStorage.removeItem('token');

      // Show a Toastify notification
      toast.info("You are logged out");

      // Refresh the page to show the login page
      setTimeout(() => {
        window.location.reload(); // or navigate to login page if using a router
      }, 1000);
    }
  };

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="Logo" />
      <img
        className='profile'
        src={assets.profile_image}
        alt="Profile"
        onClick={handleLogout}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
};

export default Navbar;
