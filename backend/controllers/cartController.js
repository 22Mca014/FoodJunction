import userModel from "../models/userModel.js";

// Add to user cart  
const addToCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.body.userId);
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      let cartData = userData.cartData || {}; // Ensure cartData is initialized

      if (!cartData[req.body.itemId]) {
         cartData[req.body.itemId] = 1;
      } else {
         cartData[req.body.itemId] += 1;
      }

      await userModel.findByIdAndUpdate(req.body.userId, { cartData });
      res.status(200).json({ success: true, message: "Added to Cart" });
   } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
   }
};

// Remove food from user cart
const removeFromCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.body.userId);
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      let cartData = userData.cartData || {};

      if (cartData[req.body.itemId] > 0) {
         cartData[req.body.itemId] -= 1;

         // If the item quantity becomes zero, you might want to remove it entirely from the cart
         if (cartData[req.body.itemId] === 0) {
            delete cartData[req.body.itemId];
         }
      }

      await userModel.findByIdAndUpdate(req.body.userId, { cartData });
      res.status(200).json({ success: true, message: "Removed from Cart" });
   } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
   }
};

// Get user cart
const getCart = async (req, res) => {
   try {
      const userData = await userModel.findById(req.body.userId);
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      let cartData = userData.cartData || {}; // Ensure cartData is initialized
      res.status(200).json({ success: true, cartData });
   } catch (error) {
      console.error("Error retrieving cart:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
   }
};

export { addToCart, removeFromCart, getCart };
