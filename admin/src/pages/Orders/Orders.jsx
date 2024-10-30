import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data && response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      toast.error('Error fetching orders');
    }
  };

  const fetchAllSubscriptions = async () => {
    try {
      const response = await axios.get(`${url}/api/order/subscriptionDetails`);
      if (response.data && response.data.success) {
        setSubscriptions(response.data.data.reverse());
      } else {
        toast.error('Error fetching subscriptions');
      }
    } catch (error) {
      toast.error('Error fetching subscriptions');
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      });
      if (response.data && response.data.success) {
        await fetchAllOrders();
      } else {
        toast.error('Error updating status');
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  useEffect(() => {
    fetchAllOrders();
    fetchAllSubscriptions();
  }, []);

  return (
    <div className="center">
      <div className="order add">
        <h3>Order Page</h3>
        <div className="order-list">
          {orders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="Order Icon" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, index) => (
                    index === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `
                  ))}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + ' ' + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + ','}</p>
                  <p>
                    {order.address.city + ', ' + order.address.state + ', ' + order.address.country + ', ' + order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>{currency}{order.amount}</p>
              <select onChange={(e) => statusHandler(e, order._id)} value={order.status} name="" id="">
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Details Section */}
      <div className="subscription add">
        <h1>Subscription Details</h1>
        <div className="order-list">
          {subscriptions.map((subscription, index) => (
            <div key={index} className="order-item">
              <div className="address">
                <p className="pinnumber">Pincode: {subscription.pincode || 'N/A'}</p>
                <p className="address">Address: {subscription.deliveryAddress || 'N/A'}</p>
                <p className="phone">Phone: {subscription.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="order-item-food">Subscription Type: {subscription.subscriptionType}</p>
                <p className="order-item-name">User Name: {subscription.user?.name || 'N/A'}</p>
                <p className="order-item-name">User Email: {subscription.user?.email || 'N/A'}</p>
                <div className="order-item-address">
                  <p>Start Date: {new Date(subscription.subscriptionStartDate).toLocaleDateString()}</p>
                  <p>End Date: {new Date(subscription.subscriptionEndDate).toLocaleDateString()}</p>
                </div>
                <p className="order-item-phone">Payment Status: {subscription.paymentStatus}</p>
              </div>
              <p>Amount: {currency}{subscription.subscriptionPayment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
