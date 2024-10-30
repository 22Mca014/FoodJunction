import Table from '../../models/TableBookModel/Tablemodel.js';

import moment from 'moment';

// Get table details
export const getTableDetails = async (req, res) => {
  try {
    const tables = await Table.find({});
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving table details', error });
  }
};

// Update table count for both couple and family tables
export const updateTableCounts = async (req, res) => {
  const { coupleCount, familyCount, date } = req.body;

  try {
    // Update or create couple table
    let coupleTable = await Table.findOne({ type: 'couple', date });
    if (coupleTable) {
      coupleTable.count = coupleCount;
      await coupleTable.save();
    } else {
      coupleTable = new Table({ type: 'couple', capacity: 2, count: coupleCount, date });
      await coupleTable.save();
    }

    // Update or create family table
    let familyTable = await Table.findOne({ type: 'family', date });
    if (familyTable) {
      familyTable.count = familyCount;
      await familyTable.save();
    } else {
      familyTable = new Table({ type: 'family', capacity: 4, count: familyCount, date });
      await familyTable.save();
    }

    res.status(200).json({ success: true, message: 'Table counts updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating table counts', error });
  }
};







// Check table availability
export const checkAvailability = async (req, res) => {
  const { tableType, date } = req.body; // tableType should be 'couple' or 'family'

  try {
    // Format the date to match the storage format
    const formattedDate = moment(date).format('YYYY-MM-DD');

    // Find the table document for the specified type and date
    const table = await Table.findOne({ type: tableType, date: formattedDate });

    if (table) {
      // Retrieve the available count for the formatted date
      const availableCount = table.available.get(formattedDate) ?? table.count;

      // Respond with the available count
      if (availableCount > 0) {
        res.status(200).json({ 
          success: true, 
          available: true, 
          availableCount: availableCount, // Return available count for the date
          message: `Tables of type ${tableType} are available on ${date}` 
        });
      } else {
        res.status(200).json({ 
          success: true, 
          available: false, 
          availableCount: 0, 
          message: `No ${tableType} tables available on ${date}` 
        });
      }
    } else {
      res.status(404).json({ success: false, message: 'Table type not found for the specified date' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error checking table availability', error });
  }
};