import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import sendEmail from "../utils/sendEmail.js";  // Assuming sendEmail is in utils folder
import Subscription  from "../models/subscriptionModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = 'http://localhost:5173';

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge",
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: "payment",
        });

        // Get the user's email from the database
        const user = await userModel.findById(req.body.userId);

        // Prepare the email details
        const subject = 'Order Details';
        const text = `Your order has been placed successfully. Here are the details:\n\n
            Order ID: ${newOrder._id}\n
            Name: ${newOrder.address.firstName} ${newOrder.address.lastName}\n
            Address: ${newOrder.address.street}, ${newOrder.address.city}, ${newOrder.address.state}, ${newOrder.address.zipcode}, ${newOrder.address.country}\n
            Items: ${newOrder.items.map(item => `${item.name} (x${item.quantity})`).join(", ")}\n
            Total Amount: ${newOrder.amount}`;

        // Send the email
        await sendEmail(user.email, subject, text);

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Placing User Order for Frontend using COD
const placeOrderCod = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Get the user's email from the database
        const user = await userModel.findById(req.body.userId);

        // Prepare the email details
        const subject = 'Your Order Confirmation - Food Junction';
        const text = `Thank you for ordering with us! Your order has been placed successfully. Here are the details of your order:\n\n
        Order ID: ${newOrder._id}\n
        Name: ${newOrder.address.firstName} ${newOrder.address.lastName}\n
        Delivery Address: 
        ${newOrder.address.street}, 
        ${newOrder.address.city}, ${newOrder.address.state}, 
        ${newOrder.address.zipcode}, ${newOrder.address.country}\n
        -----------------------------------------
        Items Ordered:
        -----------------------------------------
        ${newOrder.items.map(item => `• ${item.name} (x${item.quantity})`).join("\n")}
        -----------------------------------------
        Total Amount (including delivery): ${currency}${newOrder.amount}\n
        -----------------------------------------
        
        Your food will be delivered soon! You can track your order in your account.
        
        Thanks for choosing Food Junction!
        If you have any questions or concerns, feel free to contact our support team.
        
        Bon appétit! 🍽️
        Food Junction Team
        `;
        
        // Send the email
        await sendEmail(user.email, subject, text);

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        res.json({ success: false, message: "Not Verified" });
    }
};


//subcription controller


const createSubscription = async (req, res) => {
  try {
    const { userId, subcriptionPayment, subscriptionType, subscriptionStartDate } = req.body;
    console.log(req.body)
    // Validate required fields
    if (!userId || !subcriptionPayment || !subscriptionType || !subscriptionStartDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Determine subscription duration based on the subscription type
    const subscriptionDuration = subscriptionType === '7 days' ? 7 : 30;
    const startDate = new Date(subscriptionStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + subscriptionDuration);
    console.log('jane de');
    

    // Create a new subscription document
    const newSubscription = new Subscription({
      userId,
      subscriptionType,
      subscriptionPayment: subcriptionPayment,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
      paymentStatus: 'pending',
    });
console.log("david0");

    // Save the subscription to the database
    await newSubscription.save();

    // Create Stripe line items
    const line_items = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: subscriptionType, // Name of the subscription plan
          },
          unit_amount: subcriptionPayment * 100, // Stripe expects the amount in cents
        },
        quantity: 1,
      },
    ];

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&subscriptionId=${newSubscription._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&subscriptionId=${newSubscription._id}`,
    });
    console.log('david');
    

    // Get the user's email from the database
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send subscription details via email
    const subject = 'Subscription Details';
    const text = `Your subscription has been initiated. Subscription ID: ${newSubscription._id}`;
    await sendEmail(user.email, subject, text);

    // Respond with success and the Stripe session URL
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    // Log error details for debugging
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod ,createSubscription};
