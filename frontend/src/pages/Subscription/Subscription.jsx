import React, { useState, useEffect } from 'react';
import './Subscription.css';
import axios from 'axios';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null); // Track selected plan
  const [showMenu, setShowMenu] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({ phoneNumber: '', address: '', pincode: '' });
  const [formErrors, setFormErrors] = useState({});
  const backendUrl = 'http://localhost:4000';

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/menu/menu`);
        setMenuData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch menu');
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Enter a valid 10-digit phone number';
    }
    if (!formData.address) {
      errors.address = 'Delivery address is required';
    }
    if (!formData.pincode || !/^\d{5,6}$/.test(formData.pincode)) {
      errors.pincode = 'Enter a valid 5 or 6-digit pincode';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handlePurchaseClick = async () => {
    // Validate form data before proceeding
    if (!validateForm()) {
      console.log('Form validation failed', formErrors);
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not logged in or invalid token');
      return;
    }
  
    const subscriptionPayment = selectedPlan === '7 days' ? 1500 : 4500;
    setIsProcessing(true);
    setMessage('Just a moment...');
  
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/subscription`,
        {
          subcriptionPayment: subscriptionPayment,
          subscriptionType: selectedPlan,
          subscriptionStartDate: new Date().toISOString().split('T')[0],
          phoneNumber: formData.phoneNumber,
          deliveryAddress: formData.address,
          pincode: formData.pincode,
        },
        { headers: { token } }
      );
  
      console.log('Response from server:', response);
      if (response.data.success) {
        window.location.href = response.data.session_url;
      } else {
        setMessage('Failed to initiate purchase');
        console.error('Purchase initiation failed');
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      setMessage('Failed to initiate purchase');
    } finally {
      setIsProcessing(false);
    }
  };
  

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="subscription-container">
      <h1>Welcome to Food Junction</h1>
      <p className="description">
        Choose between a 7-day or 30-day plan, and enjoy delicious meals delivered to your doorstep.
      </p>

      {/* Plan Selection */}
      <div className="plan-selection">
        <button
          className={`plan-button ${selectedPlan === '7 days' ? 'active' : ''}`}
          onClick={() => handlePlanChange('7 days')}
        >
          7 Day Plan - ₹1500
        </button>
        <button
          className={`plan-button ${selectedPlan === '30 days' ? 'active' : ''}`}
          onClick={() => handlePlanChange('30 days')}
        >
          30 Day Plan - ₹4500
        </button>
        <button className="menu-button" onClick={handleMenuClick}>
          View Weekly Menu
        </button>
      </div>

      {/* Plan Details and Form */}
      {selectedPlan && (
        <div className="plan-details">
          <h3>{selectedPlan === '7 days' ? '7 Day Plan' : '30 Day Plan'}</h3>
          <p>
            {selectedPlan === '7 days'
              ? 'Enjoy daily meals for a week. Get 3 meals per day for only ₹1500.'
              : 'Get meals delivered for an entire month, with 3 meals per day for only ₹4500.'}
          </p>

          <div className="delivery-form">
            <label>
              Phone Number:
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleFormChange}
                placeholder="Enter phone number"
                required
              />
              {formErrors.phoneNumber && <span className="error">{formErrors.phoneNumber}</span>}
            </label>
            <label>
              Delivery Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Enter delivery address"
                required
              />
              {formErrors.address && <span className="error">{formErrors.address}</span>}
            </label>
            <label>
              Pincode:
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleFormChange}
                placeholder="Enter pincode"
                required
              />
              {formErrors.pincode && <span className="error">{formErrors.pincode}</span>}
            </label>
            <button
              className="purchase-button"
              onClick={handlePurchaseClick}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Purchase'}
            </button>
          </div>

          {message && <p className="message">{message}</p>}
        </div>
      )}

      {/* Weekly Menu */}
      {showMenu && (
        <div className="menu-section">
          <h2>Weekly Bengali Menu</h2>
          <table className="menu-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {menuData.map((menu, index) => (
                <tr key={index}>
                  <td>{menu.day}</td>
                  <td>{menu.breakfast}</td>
                  <td>{menu.lunch}</td>
                  <td>{menu.dinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Subscription;
