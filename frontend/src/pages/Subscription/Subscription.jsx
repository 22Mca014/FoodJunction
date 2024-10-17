import React, { useState, useEffect } from 'react';
import './Subscription.css';
import axios from 'axios';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState('7 days');
  const [showMenu, setShowMenu] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // New state for button loading
  const [message, setMessage] = useState(''); // New state for showing messages
  const [subscriptionStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Backend URL
  const backendUrl = 'http://localhost:4000';

  // Fetch token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
  }, []);

  // Fetch menu data from backend
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/menu/menu`);
        setMenuData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu:', err.response ? err.response.data : err.message);
        setError('Failed to fetch menu');
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handlePurchaseClick = async () => {
    const token = localStorage.getItem('token'); // Only fetch the token
    if (!token) {
      alert('User not logged in or invalid token');
      return;
    }

    const subscriptionPayment = selectedPlan === '7 days' ? 1500 : 4500;
    
    // Set processing state to true when the purchase button is clicked
    setIsProcessing(true);
    setMessage('Just a moment...');

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/subscription`,
        {
          subcriptionPayment: subscriptionPayment,
          subscriptionType: selectedPlan,
          subscriptionStartDate,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        window.location.href = response.data.session_url; // Redirect to Stripe payment
      }
    } catch (error) {
      console.error('Error creating subscription:', error.response ? error.response.data : error.message);
      alert('Failed to initiate purchase');
    } finally {
      // After processing, set isProcessing back to false and reset message
      setIsProcessing(false);
      setMessage('');
    }
  };

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="subscription-container">
      <h1 className="heading">Welcome to Food Junction</h1>
      <p className="description">
        We offer subscription plans for our customers. Choose between a 7-day or 30-day plan to enjoy delicious meals.
      </p>
      
      <div className="slidbar">
        <div className="left">
          <button onClick={() => handlePlanChange('7 days')}>7 Day Plan</button>
          <button onClick={() => handlePlanChange('30 days')}>30 Day Plan</button>
        </div>

        <div className="divider"></div>

        <div className="right">
          <div className="button-row">
            <button onClick={handleMenuClick}>Weekly Menu</button>
            {/* Purchase button will show 'Processing...' when isProcessing is true */}
            <button onClick={handlePurchaseClick} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Purchase'}
            </button>
          </div>

          {message && <p>{message}</p>} {/* Display message when set */}

          {selectedPlan === '7 days' && (
            <div className="plan-details">
              <h3>7 Day Plan</h3>
              <p>Enjoy daily meals for a week. You can get 3 meals per day for only 1500.</p>
            </div>
          )}
          {selectedPlan === '30 days' && (
            <div className="plan-details">
              <h3>30 Day Plan</h3>
              <p>Get meals delivered for an entire month, with 3 meals per day for only 4500.</p>
            </div>
          )}

          {showMenu && (
            <div className="menu-section">
              <h1>Weekly Bengali Menu</h1>
              <table border="1">
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
      </div>
    </div>
  );
};

export default Subscription;
