import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import StoreContextProvider from './Context/StoreContext'
import ResetPassword from './components/ResetPassword/ResetPassword.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
    </StoreContextProvider>
  </BrowserRouter>
);
