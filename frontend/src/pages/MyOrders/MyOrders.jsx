import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);  // Ensure data is initialized as an empty array
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);      // Error state
  const { url, token, currency } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, {
        headers: { token },
      });
      setData(response.data.data || []);  // Ensure data is always an array
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);  // Stop loading after the request is done
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return <div className="loading">Loading your orders...</div>;  // Loading message
  }

  if (error) {
    return <div className="error">{error}</div>;  // Error message
  }

  return (
    <div className="my-orders" >

      <h2>My Orders</h2>
      
      <div className="container" style={{"maxWidth": "1200px"}}>
        {data.length === 0 ? (  // Display a message if there are no orders
          <p>No orders found</p>
        ) : (
          data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
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
  );
};

export default MyOrders;
