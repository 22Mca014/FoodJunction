import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    items: { type: Array, required: true},
    amount: { type: Number, required: true},
    address: {type: Object, required: true},
    status: {type: String, default: "Food Processing"},
    date: {type: Date, default: Date.now()},
    payment: {type: Boolean, default: false},
    subscriptionType: { 
        type: String, 
        enum: ["7 days", "30 days"], // Subscription can be for 7 days or 30 days
    },
    subcriptionPayment:{type:Boolean,default:false},
    subscriptionStartDate: {
        type: Date,
         
    },
    subscriptionEndDate: {
        type: Date,
        
    }
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
