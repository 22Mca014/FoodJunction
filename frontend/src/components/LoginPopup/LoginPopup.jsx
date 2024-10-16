import React, { useContext, useState, useEffect } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import validator from "validator"; // For client-side validation

const LoginPopup = ({ setShowLogin }) => {
  const { setToken, url, loadCartData } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login"); // Sign Up, Login, Forgot Password, Reset Password
  const [loading, setLoading] = useState(false); // For managing loading state
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    resetToken: "",
    newPassword: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      setCurrState("Reset Password");
      setData((prevData) => ({ ...prevData, resetToken: token }));
    }
  }, [location]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  // Client-side validation
  const validateForm = () => {
    if (currState === "Sign Up" || currState === "Login") {
      if (!data.email || !validator.isEmail(data.email)) {
        toast.error("Please enter a valid email.");
        return false;
      }
      if (!data.password || data.password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Validate form before proceeding

    let new_url = url;
    let requestData = {};

    if (currState === "Login") {
      new_url += "/api/user/login";
      requestData = { email: data.email, password: data.password };
    } else if (currState === "Sign Up") {
      new_url += "/api/user/register";
      requestData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
    } else if (currState === "Forgot Password") {
      new_url += "/api/user/forgot-password";
      requestData = { email: data.email };
    } else if (currState === "Reset Password") {
      new_url += "/api/user/reset-password";
      requestData = { token: data.resetToken, newPassword: data.newPassword };
    }

    setLoading(true); // Set loading state
    try {
      const response = await axios.post(new_url, requestData);
      if (response.data.success) {
        if (currState === "Login") {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          loadCartData({ token: response.data.token });
          toast.success("Login successful!");
          setShowLogin(false); // Close the login popup
          
          // Redirect if user is admin
          if (response.data.redirectUrl) {
            window.location.href = response.data.redirectUrl; // Redirect to admin URL
          } else {
            navigate("/"); // Redirect to home page for non-admin users
          }

        } else if (currState === "Sign Up") {
          toast.success("Registration successful! You can now log in.");
          setCurrState("Login"); // Change state to Login after successful registration
        } else if (currState === "Forgot Password") {
          toast.success("Reset password email sent! Please check your inbox.");
        } else if (currState === "Reset Password") {
          toast.success("Password reset successful! You can now log in.");
          setCurrState("Login"); // Change back to login after password reset
          setShowLogin(false); // Close the popup
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Server error");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false); // Reset loading state
      setData({ ...data, password: "", newPassword: "" }); // Clear password fields
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          {(currState === "Sign Up" ||
            currState === "Login" ||
            currState === "Forgot Password") && (
            <input
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder="Your email"
              required
            />
          )}
          {(currState === "Sign Up" || currState === "Login") && (
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder="Password"
              required
            />
          )}
          {currState === "Reset Password" && (
            <input
              name="newPassword"
              onChange={onChangeHandler}
              value={data.newPassword}
              type="password"
              placeholder="New Password"
              required
            />
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : 
            currState === "Login"
            ? "Login"
            : currState === "Sign Up"
            ? "Create account"
            : currState === "Forgot Password"
            ? "Send reset link"
            : "Reset Password"}
        </button>

        {currState !== "Forgot Password" && currState !== "Reset Password" && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
        )}

        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : currState === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        ) : currState === "Forgot Password" ? (
          <p>
            Remembered your password?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}

        {currState !== "Forgot Password" && currState !== "Reset Password" && (
          <p>
            Forgot your password?{" "}
            <span onClick={() => setCurrState("Forgot Password")}>
              Click here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
