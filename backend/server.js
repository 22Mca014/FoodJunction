import express from "express";
import cors from 'cors';
import connectToDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import 'dotenv/config';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import menuRouter from "./routes/menuRoute.js";


import TableRouter from "./routes/TableBookRoutes/tableRoutes.js";
import BookRouter from "./routes/TableBookRoutes/bookingRoutes.js";


// App config
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
// app.use(cors());
app.use(cors());

// DB connection
connectToDB();


// API endpoints
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));  // Serving static files from 'uploads' folder
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/menu",menuRouter);

//Table booking
app.use('/api/tables', TableRouter);
app.use('/api/bookings', BookRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
