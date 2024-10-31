import express from 'express';
import { bookTable, fetchBooking } from '../../controllers/TableBookController/bookingController.js';
import authMiddleware from '../../middleware/auth.js';



const BookRouter = express.Router();
BookRouter.post('/book',authMiddleware,bookTable);
BookRouter.get('/book-table',fetchBooking);



export default BookRouter;