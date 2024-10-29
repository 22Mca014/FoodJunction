import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Table.css'; // Assuming you have a CSS file for styling

function Table() {
  const [formData, setFormData] = useState({
    tableType: 'couple',
    quantity: 1,
    date: '',
  });
  const [availableTables, setAvailableTables] = useState(null);
  const [message, setMessage] = useState('');

  // Handles changes to form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch available tables whenever date or table type changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (formData.date && formData.tableType) {
        try {
          const response = await axios.get(`http://localhost:4000/api/tables/availability`, {
            params: { date: formData.date, tableType: formData.tableType },
          });
          setAvailableTables(response.data.available); // Update available tables count
        } catch (error) {
          setAvailableTables('N/A'); // In case of error, show N/A
          console.error("Error fetching availability:", error);
        }
      }
    };
    fetchAvailability();
  }, [formData.date, formData.tableType]);

  // Handles form submission for booking a table
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/bookings/book', {
        ...formData,
        userId: '64b0b7f5f9c51a5d5f5a1234', // Replace with actual user ID
      });
      setMessage(response.data); // Show success message
      setAvailableTables((prev) => prev - formData.quantity); // Update availability after booking
    } catch (error) {
      setMessage(error.response ? error.response.data : 'Error booking table');
      console.error("Error booking table:", error);
    }
  };

  return (
    <div className="booking-container">
      <h2>Book a Table</h2>
      <div className="form-and-availability">
        <form onSubmit={handleSubmit} className="booking-form">
          <label>
            Select Table Type:
            <select name="tableType" value={formData.tableType} onChange={handleChange}>
              <option value="couple">Couple Table (2 people)</option>
              <option value="family">Family Table (4 people)</option>
            </select>
          </label>

          <label>
            Number of Tables:
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              min="1"
              max="5"
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Select Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Book Table</button>
        </form>

        <div className="availability">
          <h3>Available Tables</h3>
          <p>
            {formData.tableType === 'couple' ? 'Couple' : 'Family'} Tables Available:{" "}
            {availableTables !== null ? availableTables : 'Select date and table type'}
          </p>
        </div>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Table;
