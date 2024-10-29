import express from 'express';
import { bookTable } from '../../controllers/TableBookController/bookingController.js';

const router = express.Router();

router.post('/book', bookTable);

export default router;
