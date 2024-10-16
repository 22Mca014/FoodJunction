// routes/menuRoutes.js
import express from 'express';
import {
  getAllMenus,
  getMenuByDay,
  createMenu,
  updateMenuByDay,
  deleteMenuByDay,
} from '../controllers/menuController.js';

const menuRouter = express.Router();

// GET: Retrieve all menu items
menuRouter.get('/menu', getAllMenus);

// GET: Retrieve a specific day's menu
menuRouter.get('/menu/:day', getMenuByDay);

// POST: Add a new day's menu
menuRouter.post('/add', createMenu);

// PUT: Update a specific day's menu
menuRouter.put('/menu/:day', updateMenuByDay);

// DELETE: Remove a specific day's menu
menuRouter.delete('/menu/:day', deleteMenuByDay);

export default menuRouter;
