import React, { useState, useEffect } from 'react';
import './Subscription.css';
import axios from 'axios';


const Subscription = ({ url }) => {
  const [selectedPlan, setSelectedPlan] = useState('7 days');
  const [showMenu, setShowMenu] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [clientData, setClientData] = useState(null); // State to hold client-specific data
  const [subscriptionStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch token from localStorage and decode userId
  useEffect(() => {
    const token = localStorage.getItem('token'); // Fetch token from localStorage
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setUserId(decodedToken.userId);  // Assuming userId is part of the token payload
        fetchClientData(token, decodedToken.userId); // Fetch client-specific data
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, []);

  // Function to fetch client-specific data
  const fetchClientData = async (token, userId) => {
    try {
      const response = await axios.get(`${url}/api/client/data`, {
        headers: { token }, // Pass the token in the request headers
        params: { userId }, // Optional: You can pass userId in params if needed
      });
      setClientData(response.data); // Store the client-specific data
    } catch (error) {
      console.error('Error fetching client data:', error.response ? error.response.data : error.message);
    }
  };

  // Fetch menu data from backend
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get(`${url}/api/menu/menu`);
        setMenuData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu:', err.response ? err.response.data : err.message);
        setError('Failed to fetch menu');
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [url]);

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handlePurchaseClick = async () => {
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      alert('User not logged in or invalid token');
      return;
    }

    console.log('User ID:', userId);

    const subscriptionPayment = selectedPlan === '7 days' ? 1500 : 4500;
    try {
      const response = await axios.post(
        `${url}/api/order/subscription`,
        {
          userId,
          subscriptionPayment,
          subscriptionType: selectedPlan,
          subscriptionStartDate,
        },
        {
          headers: { token },  // Send token in headers for authentication
        }
      );

      if (response.data.success) {
        window.location.href = response.data.session_url;  // Redirect to Stripe payment
      }
    } catch (error) {
      console.error('Error creating subscription:', error.response ? error.response.data : error.message);
      alert('Failed to initiate purchase');
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
      
      {/* Display client-specific data */}
      {clientData && (
        <div className="client-details">
          <h3>Client Data</h3>
          <p>Welcome, {clientData.name}</p>
          <p>Your current subscription: {clientData.currentSubscription}</p>
        </div>
      )}
      
      <div className="slidbar">
        <div className="left">
          <button onClick={() => handlePlanChange('7 days')}>7 Day Plan</button>
          <button onClick={() => handlePlanChange('30 days')}>30 Day Plan</button>
        </div>

        <div className="divider"></div>

        <div className="right">
          <div className="button-row">
            <button onClick={handleMenuClick}>Weekly Menu</button>
            <button onClick={handlePurchaseClick}>Purchase</button>
          </div>

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
