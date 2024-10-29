import Table from '../../models/TableBookModel/Tablemodel.js';
import Booking from '../../models/TableBookModel/bookModel.js';
import moment from 'moment';

export const bookTable = async (req, res) => {
  const { userId, date, tableType, quantity } = req.body;

  try {
    const table = await Table.findOne({ type: tableType });
    if (!table) return res.status(404).send('Table type not found');

    const formattedDate = moment(date).format('YYYY-MM-DD');
    const available = table.available.get(formattedDate) || table.count;

    if (available < quantity) {
      return res.status(400).send('Not enough tables available for this date');
    }

    table.available.set(formattedDate, available - quantity);
    await table.save();

    const booking = new Booking({ userId, date: formattedDate, tableType, quantity });
    await booking.save();

    res.status(200).send('Table booked successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
};
