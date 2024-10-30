import express from 'express';
import { bookTable } from '../../controllers/TableBookController/bookingController.js';
import authMiddleware from '../../middleware/auth.js';



const BookRouter = express.Router();
BookRouter.post('/book',authMiddleware,bookTable);


export default BookRouter;