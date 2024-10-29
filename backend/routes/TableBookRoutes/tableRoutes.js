import express from 'express';
import { initTables } from '../../controllers/TableBookController/tableController.js';
import Table from '../../models/TableBookModel/Tablemodel.js';

const router = express.Router();

router.post('/init', initTables);

router.get('/availability', async (req, res) => {
  const { date, tableType } = req.query;

  try {
    const table = await Table.findOne({ type: tableType });
    if (!table) {
      return res.status(404).json({ available: 'N/A' });
    }

    // Check availability for the given date
    const formattedDate = new Date(date).toISOString().split('T')[0];
    const availableCount = table.available[formattedDate] ?? table.count;

    res.json({ available: availableCount });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Error fetching availability' });
  }
});

export default router;
