import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import './Verify.css';

const Verifysubscription = () => {
  const { url } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const subscriptionId = searchParams.get("subscriptionId"); // Fixed extra space

  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${url}/api/order/verifysubscription`, { success, subscriptionId });
      if (response.data.success) {
        navigate("/myorders"); // Redirect to 'myorders' on success
      } else {
        navigate("/"); // Redirect to home if not successful
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      navigate("/"); // Redirect to home in case of error
    }
  };

  useEffect(() => {
    verifyPayment(); // Call verification function on component mount
  }, [verifyPayment]); // Add verifyPayment as a dependency

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  );
};

export default Verifysubscription;
