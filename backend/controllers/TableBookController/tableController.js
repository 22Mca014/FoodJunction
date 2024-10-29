import Table from '../../models/TableBookModel/Tablemodel.js';

export const initTables = async (req, res) => {
  try {
    const tables = [
      { type: 'couple', capacity: 2, count: 10 },
      { type: 'family', capacity: 4, count: 5 },
    ];
    await Table.insertMany(tables);
    res.status(201).send('Tables initialized successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
};
