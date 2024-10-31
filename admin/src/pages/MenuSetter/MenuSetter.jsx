import './Menusetter.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MenuSetter = () => {
  const [menuData, setMenuData] = useState([]); // State to store all menu data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error handling
  const [isEditing, setIsEditing] = useState(false); // Track if we are editing a menu
  const [editingDay, setEditingDay] = useState(''); // Track which day is being edited
  const [newMenu, setNewMenu] = useState({
    day: '',
    breakfast: '',
    lunch: '',
    dinner: '',
  });

  useEffect(() => {
    // Fetch menu data when the component mounts
    fetchMenuData();
  }, []);

  // Fetch all menu data
  const fetchMenuData = async () => {
    try {
      const response = await axios.get('https://foodjunction.onrender.com/api/menu/menu');
      setMenuData(response.data); // Set the fetched data to state
      setLoading(false); // Stop the loading state
    } catch (error) {
      setError('Failed to load menu data');
      setLoading(false);
    }
  };

  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMenu({ ...newMenu, [name]: value });
  };

  // Add a new menu or update an existing one
  const handleAddOrUpdateMenu = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // If editing, send a PUT request to update the menu
        const response = await axios.put(`https://foodjunction.onrender.com/api/menu/menu/${editingDay}`, newMenu); // Use 'editingDay'
        console.log('Menu updated:', response.data); // Log the updated menu data
        setIsEditing(false); // Reset editing state
        setEditingDay(''); // Clear the day being edited
      } else {
        // If not editing, send a POST request to add a new menu
        const response = await axios.post('https://foodjunction.onrender.com/api/menu/add', newMenu);
        console.log('Menu added:', response.data); // Log the added menu data
      }
      fetchMenuData(); // Refresh the menu data after adding/updating
      setNewMenu({ day: '', breakfast: '', lunch: '', dinner: '' }); // Reset the form
    } catch (error) {
      console.error('Error during add/update menu:', error.response ? error.response.data : error.message); // Log the error
      setError('Failed to add/update menu');
    }
  };

  // Delete a menu
  const handleDeleteMenu = async (day) => {
    try {
      await axios.delete(`http://localhost:4000/api/menu/menu/${day}`);
      fetchMenuData(); // Refresh the menu data after deletion
    } catch (error) {
      setError(`Failed to delete menu for ${day}`);
    }
  };

  // Edit a menu
  const handleEditMenu = (menu) => {
    // Fill the form with the data of the menu being edited
    setNewMenu(menu);
    setIsEditing(true); // Set editing mode to true
    setEditingDay(menu.day); // Set the day being edited
  };

  // Check if a day already has a menu
  const isDayAlreadyAdded = (day) => {
    return menuData.some((menu) => menu.day === day);
  };

  if (loading) return <p>Loading menus...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-panel">
      <h1>Admin Panel - Manage Weekly Menu</h1>

      {/* Add or Edit Menu Form */}
      <div className="add-menu-form">
        <h2>{isEditing ? 'Edit Menu' : 'Add New Menu'}</h2>
        <form onSubmit={handleAddOrUpdateMenu}>
          <div>
            <label>Day:</label>
            <select
              name="day"
              value={newMenu.day}
              onChange={handleInputChange}
              disabled={isEditing} // Disable changing the day while editing
              required
            >
              <option value="" disabled>Select a day</option>
              {daysOfWeek.map((day) => (
                <option
                  key={day}
                  value={day}
                  style={{ color: isDayAlreadyAdded(day) ? 'red' : 'black' }}
                >
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Breakfast:</label>
            <input
              type="text"
              name="breakfast"
              value={newMenu.breakfast}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Lunch:</label>
            <input
              type="text"
              name="lunch"
              value={newMenu.lunch}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Dinner:</label>
            <input
              type="text"
              name="dinner"
              value={newMenu.dinner}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">{isEditing ? 'Update Menu' : 'Add Menu'}</button>
        </form>
      </div>

      {/* Menu Table */}
      <h2>Weekly Menu</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Day</th>
            <th>Breakfast</th>
            <th>Lunch</th>
            <th>Dinner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuData.map((menu, index) => (
            <tr key={index}>
              <td>{menu.day}</td>
              <td>{menu.breakfast}</td>
              <td>{menu.lunch}</td>
              <td>{menu.dinner}</td>
              <td>
                <button onClick={() => handleEditMenu(menu)}>Edit</button>
                <button onClick={() => handleDeleteMenu(menu.day)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuSetter;
