import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Table.css';

function Table() {
  const [formData, setFormData] = useState({
    tableType: 'couple',
    quantity: 1,
    date: '',
  });
  const backendURL = 'https://foodjunction.onrender.com'; // Replace with your backend URL
  const [availableTables, setAvailableTables] = useState(null);
  const [loading, setLoading] = useState(false);

  // Define today and max date (7 days from today)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch table availability when date or table type changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (formData.date && formData.tableType) {
        setLoading(true);
        try {
          const response = await axios.post(`${backendURL}/api/tables/available`, {
            date: formData.date,
            tableType: formData.tableType,
          });
          setAvailableTables(response.data.availableCount);
        } catch (error) {
          console.error("Error fetching availability:", error);
          setAvailableTables('N/A');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAvailability();
  }, [formData.date, formData.tableType]);

  // Handle booking submission with validation checks
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please log in to book a table.', { autoClose: 3000 });
      return;
    }

    if (availableTables === 0) {
      toast.error('No tables available for the selected date and type.', { autoClose: 3000 });
      return;
    }

    if (availableTables < formData.quantity) {
      toast.error(`Only ${availableTables} table(s) available. Adjust the quantity.`, { autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.post(
        `${backendURL}/api/bookings/book`,
        {
          ...formData,
        },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success('Table booked successfully!', { autoClose: 3000 });
        setAvailableTables((prev) => prev - formData.quantity);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error booking table', { autoClose: 3000 });
    }
  };

  return (
    <div className="booking-container">
      <h2>Table Booking</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <label>
          Table Type:
          <select name="tableType" value={formData.tableType} onChange={handleChange}>
            <option value="couple">Couple Table (2 seats)</option>
            <option value="family">Family Table (4 seats)</option>
          </select>
        </label>

        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            min="1"
            max={availableTables || 1}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            min={today}
            max={maxDateString}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" style={{ background: '#008cba' }}>Book Table</button>
      </form>

      <div className="availability">
        <h3>Available Tables</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>
            {availableTables !== null
              ? availableTables === 'N/A'
                ? 'Unable to fetch availability. Please try again later.'
                : availableTables
              : 'Select a date and table type to check availability'}
          </p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Table;