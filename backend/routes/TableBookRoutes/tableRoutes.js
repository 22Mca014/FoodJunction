import express from 'express';
import {  checkAvailability, getTableDetails, updateTableCounts } from '../../controllers/TableBookController/tableController.js';


const TableRouter = express.Router();

// Route to add or update a single table (either couple or family)


// Route to get all table details
TableRouter.get('/details', getTableDetails);
TableRouter.post('/available', checkAvailability);


// Route to update counts for both couple and family tables together
TableRouter.put('/updateCounts', updateTableCounts);

export default TableRouter;
