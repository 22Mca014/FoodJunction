import React, { useEffect, useState } from 'react';
import './Discount.css';

const Discount = () => {
  const [promoCodes, setPromoCodes] = useState([]); // State to store fetched promo codes
  const [promoCodeInput, setPromoCodeInput] = useState(''); // State for promo code input
  const [message, setMessage] = useState(''); // State to display success/error messages

  // Fetch promo codes from the backend when the component loads
  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const response = await fetch('http://localhost:5174/api/promocodes'); // Adjust URL based on your backend
        const data = await response.json();
        setPromoCodes(data); // Set fetched promo codes to state
      } catch (error) {
        console.error('Error fetching promo codes:', error);
      }
    };

    fetchPromoCodes();
  }, []);

  // Handle form submission to send a new promo code to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5174/api/submit-promo', { // Adjust URL based on your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promoCode: promoCodeInput }), // Send the promo code entered by the user
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Promo code submitted successfully!');
        setPromoCodes([...promoCodes, { code: promoCodeInput }]); // Add new promo code to the list
        setPromoCodeInput(''); // Clear the input field
      } else {
        setMessage(result.message || 'Failed to submit promo code.');
      }
    } catch (error) {
      setMessage('An error occurred while submitting the promo code.');
    }
  };

  return (
    <div className="discount-container">
      <h2>Submit Your Promo Code</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value)}
            placeholder="Enter promo code"
            required
          />
          <button type="submit">Submit</button>
        </div>
      </form>
      {message && <p className="message">{message}</p>}

      {/* Display fetched promo codes */}
      <h3>Available Promo Codes</h3>
      <ul>
        {promoCodes.map((promo, index) => (
          <li key={index}>
            <strong>{promo.code}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Discount;
