import express from 'express';
import { bookTable, fetchBooking, fetchBookTable } from '../../controllers/TableBookController/bookingController.js';
import authMiddleware from '../../middleware/auth.js';



const BookRouter = express.Router();
BookRouter.post('/book',authMiddleware,bookTable);
BookRouter.get('/book-table',fetchBooking);
BookRouter.get('/book-table-user',authMiddleware,fetchBookTable);




export default BookRouter;