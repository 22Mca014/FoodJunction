// controllers/menuController.js
import WeeklyMenu from '../models/weaklymenu.js';

// GET all menu items
export const getAllMenus = async (req, res) => {
  try {
    const menu = await WeeklyMenu.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a specific day's menu
export const getMenuByDay = async (req, res) => {
  const day = req.params.day.charAt(0).toUpperCase() + req.params.day.slice(1);
  try {
    const menu = await WeeklyMenu.findOne({ day: day });
    if (!menu) return res.status(404).json({ message: `No menu found for ${day}` });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST: Add a new day's menu
export const createMenu = async (req, res) => {
  const { day, breakfast, lunch, dinner } = req.body;
  const newMenu = new WeeklyMenu({ day, breakfast, lunch, dinner });

  try {
    const savedMenu = await newMenu.save();
    res.status(201).json(savedMenu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT: Update a specific day's menu
export const updateMenuByDay = async (req, res) => {
  const day = req.params.day.charAt(0).toUpperCase() + req.params.day.slice(1); // Capitalize the first letter of the day
  
  try {
    // Find and update the menu for the specific day
    const updatedMenu = await WeeklyMenu.findOneAndUpdate(
      { day: day },
      {
        breakfast: req.body.breakfast,
        lunch: req.body.lunch,
        dinner: req.body.dinner,
      },
      { new: true, runValidators: true } // 'new: true' returns the updated document, 'runValidators' enforces schema validation
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: `No menu found for ${day}` });
    }

    // Return the updated menu
    res.status(200).json(updatedMenu);
  } catch (err) {
    // Return error message with status 400 if something goes wrong
    res.status(400).json({ message: `Failed to update menu for ${day}: ${err.message}` });
  }
};


// DELETE: Remove a specific day's menu
export const deleteMenuByDay = async (req, res) => {
  const day = req.params.day.charAt(0).toUpperCase() + req.params.day.slice(1);
  try {
    const deletedMenu = await WeeklyMenu.findOneAndDelete({ day: day });
    if (!deletedMenu) return res.status(404).json({ message: `No menu found for ${day}` });
    res.json({ message: `${day}'s menu deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
