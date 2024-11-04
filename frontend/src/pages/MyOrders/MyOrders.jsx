import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]); // Orders data
  const [subscriptions, setSubscriptions] = useState([]); // Subscription data
  const [bookTable, setBookTable] = useState([]); // Booked table data

  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [activeTab, setActiveTab] = useState('orders'); // Tab state
  const { url, token, currency } = useContext(StoreContext);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, {
        headers: { token },
      });
      setData(response.data.data || []);
      setError(null); // Reset error state
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url + "/api/order/subscriptionDetails", {
        headers: { token },
      });
      setSubscriptions(response.data.data || []);
      setError(null); // Reset error state
    } catch (err) {
      setError('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookTable = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url + "/api/bookings/book-table-user", {
        headers: { token },
      });
      setBookTable(response.data.data || []);
      setError(null); // Reset error state
    } catch (error) {
      setError('Failed to fetch booked tables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      if (activeTab === 'orders') {
        fetchOrders();
      } else if (activeTab === 'subscriptions') {
        fetchSubscriptions();
      } else if (activeTab === 'bookedTable') {
        fetchBookTable();
      }
    }
  }, [activeTab, token]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>
      <div className="tabs">
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          My Orders
        </button>
        <button
          className={activeTab === 'subscriptions' ? 'active' : ''}
          onClick={() => setActiveTab('subscriptions')}
        >
          Subscription Details
        </button>
        <button
          className={activeTab === 'bookedTable' ? 'active' : ''}
          onClick={() => setActiveTab('bookedTable')}
        >
          Booked Tables
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="my-orders">
          <h2>My Orders</h2>
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
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="subscription">
          <h2>Subscription Details</h2>
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
      )}

      {activeTab === 'bookedTable' && (
        <div className="booked-table">
          <h2>Booked Tables</h2>
          {bookTable.length === 0 ? (
            <p>No booked tables found</p>
          ) : (
            bookTable.map((booking, index) => (
              <div key={index} className="subscription-item">
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Table Type:</strong> {booking.tableType}</p>
                <p><strong>Quantity:</strong> {booking.quantity}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
