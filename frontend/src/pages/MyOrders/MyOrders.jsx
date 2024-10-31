import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);        // Orders data
  const [subscriptions, setSubscriptions] = useState([]);  // Subscription data
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);      // Error state
  const { url, token, currency } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, {
        headers: { token },
      });
      setData(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(url + "/api/order/subscriptionDetails", {
        headers: { token },
      });
      setSubscriptions(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch subscriptions');
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchSubscriptions();
    }
  }, [token]);

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container" style={{"maxWidth": "1200px"}}>
      <div className="my-orders">
        <h2>My Orders</h2>
        
        <div className="container" style={{ maxWidth: "1200px" }}>
          {data.length === 0 ? (
            <p>No orders found</p>
          ) : (
            data.map((order, index) => (
              <div key={index} className="my-orders-order">
                <img src={assets.parcel_icon} alt="Order Icon" />
                <p>{order.items.map((item, idx) => (
                  idx === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                ))}</p>
                <p>{currency}{order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                <button onClick={fetchOrders}>Track Order</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Subscription Details Section */}
      <div className="subscription">
        <h2>Subscription Details</h2>
        
        <div className="container" style={{ maxWidth: "1200px" }}>
          {subscriptions.length === 0 ? (
            <p>No subscriptions found</p>
          ) : (
            subscriptions.map((subscription, index) => (
              <div key={index} className="subscription-item">
                <p><strong>Subscription Type:</strong> {subscription.subscriptionType}</p>
                <p><strong>Start Date:</strong> {new Date(subscription.subscriptionStartDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(subscription.subscriptionEndDate).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
