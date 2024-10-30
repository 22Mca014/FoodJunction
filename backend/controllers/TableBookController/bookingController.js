import Table from '../../models/TableBookModel/Tablemodel.js';
import Booking from '../../models/TableBookModel/bookModel.js';
import moment from 'moment';

export const bookTable = async (req, res) => {
  const { userId, date, tableType, quantity } = req.body;
  console.log(userId + date+ tableType +quantity);
  console.log("David ");
  
  

  try {
    const table = await Table.findOne({ type: tableType });
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table type not found' });
    }

    const formattedDate = moment(date).format('YYYY-MM-DD');
    const availableCount = table.available.get(formattedDate) || table.count;

    // Check if there are enough available tables and prevent negative counts
    if (availableCount <= 0) {
      return res.status(400).json({
        success: false,
        message: `No ${tableType} tables available for ${formattedDate}`,
        available: availableCount,
      });
    }

    if (availableCount < quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough ${tableType} tables available for ${formattedDate}`,
        available: availableCount,
      });
    }

    // Deduct the quantity from available count without going negative
    table.available.set(formattedDate, availableCount - quantity);
    await table.save();

    // Create and save booking
    const booking = new Booking({ userId, date: formattedDate, tableType, quantity });
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Table booked successfully',
      bookingDetails: { userId, date: formattedDate, tableType, quantity },
    });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ success: false, message: 'Error booking table', error: err.message });
  }
};
