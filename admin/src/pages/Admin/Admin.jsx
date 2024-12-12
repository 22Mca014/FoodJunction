import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });

  const [message, setMessage] = useState("");
  const [admins, setAdmins] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://foodjunction.onrender.com/api/user/admin-create",
        formData
      );
      if (response.data.success) {
        setMessage("Admin user created successfully!");
        setFormData({ name: "", email: "", password: "", role: "ADMIN" });
        fetchAdmins(); // Fetch updated admin list
      } else {
        setMessage(response.data.message || "Failed to create user.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  // Fetch admin users
  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        "https://foodjunction.onrender.com/api/user/admin-fatch"
      );
      if (response.data.success) {
        setAdmins(response.data.data);
      } else {
        setMessage(response.data.message || "Failed to fetch admin users.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-form">
        <h2>Create Admin</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled
            >
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn">
            Create Admin
          </button>
        </form>
      </div>

      <div className="admin-list">
        <h2>Admin Users</h2>
        {admins.length > 0 ? (
          <ul>
            {admins.map((admin) => (
              <li key={admin._id}>
                <strong>{admin.name}</strong> - {admin.email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No admin users found.</p>
        )}
      </div>
    </div>
  );
};

export default CreateAdmin;
