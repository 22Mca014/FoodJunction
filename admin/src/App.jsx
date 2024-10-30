import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Discount from './pages/Discount/Discount'
import MenuSetter from './pages/MenuSetter/MenuSetter'
import AddTable from './pages/AddTable/AddTable'



const App = () => {
  return (
    <div className='app'>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
          <Route path='/discount' element={<Discount />} />
          <Route path='/menusetter' element={<MenuSetter/>} />
          <Route path='/addTable' element={<AddTable/>} />


        </Routes>
      </div>
    </div>
  )
}

export default App