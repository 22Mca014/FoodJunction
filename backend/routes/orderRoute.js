import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { listOrders, placeOrder,updateStatus,userOrders, verifyOrder, placeOrderCod,  createSubscription, verifySubscription, getSubscribedUsers, getSubscribedUsersForAdmin } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get("/list",listOrders);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/status",updateStatus);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/verifysubscription",verifySubscription);

orderRouter.post("/placecod",authMiddleware,placeOrderCod);
orderRouter.post("/subscription",authMiddleware,createSubscription);

//subscription details
orderRouter.get("/subscriptionDetails",authMiddleware,getSubscribedUsers);
orderRouter.get("/subscriptionDetailsforadmin", getSubscribedUsersForAdmin);






export default orderRouter;