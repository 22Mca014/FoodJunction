import React, { useState } from 'react';
import axios from 'axios';
import './AddTable.css';

const AddTable = () => {
  const [coupleCount, setCoupleCount] = useState(0);
  const [familyCount, setFamilyCount] = useState(0);
  const [date, setDate] = useState('');
  const [tables, setTables] = useState([]);

  // Get today's date in the required format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(new Date().setDate(new Date().getDate() + 30))
    .toISOString()
    .split('T')[0];

  // Get all table details
  const fetchTableDetails = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/tables/details');
      setTables(response.data.data);
    } catch (error) {
      console.error('Error fetching table details:', error);
    }
  };

  // Update couple and family table counts
  const handleUpdateTableCounts = async () => {
    try {
      const response = await axios.put('http://localhost:4000/api/tables/updateCounts', {
        coupleCount,
        familyCount,
        date
      });
      alert(response.data.message);
      fetchTableDetails();
    } catch (error) {
      console.error('Error updating table counts:', error);
    }
  };

  return (
    <div className="add-table-container">
      <h2>Update Table Counts</h2>
      <div className="input-group">
        <p>Couple Table Count</p>
        <input
          type="number"
          placeholder="Couple Table Count"
          value={coupleCount}
          onChange={(e) => setCoupleCount(e.target.value)}
        />
        <p>Family Table Count</p>
        <input
          type="number"
          placeholder="Family Table Count"
          value={familyCount}
          onChange={(e) => setFamilyCount(e.target.value)}
        />
        <p>Select Date (Today to 30 Days Ahead)</p>
        <input
          type="date"
          placeholder="Date"
          value={date}
          min={today} // Set minimum date to today
          max={maxDate} // Set maximum date to 30 days from today
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="button-group">
        <button onClick={handleUpdateTableCounts}>Update Counts</button>
        <button onClick={fetchTableDetails}>Fetch Table Details</button>
      </div>

      <h2>All Tables</h2>
      <ul className="table-list">
        {tables.map((table, index) => (
          <li key={index}>
            <strong>Table Type:</strong> {table.type === 'couple' ? 'Couple Table' : 'Family Table'} <br />
            <strong>Capacity:</strong> {table.capacity} <br />
            <strong>Count:</strong> {table.count} <br />
            <strong>Date:</strong> {table.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddTable;
