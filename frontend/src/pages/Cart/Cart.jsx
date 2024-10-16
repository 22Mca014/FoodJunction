import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, currency, deliveryCharge, discountCode } = useContext(StoreContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState(""); // State for promo code
  const [discountApplied, setDiscountApplied] = useState(false); // State for discount application

  const handlePromoCodeSubmit = () => {
    if (promoCode === discountCode) {
      setDiscountApplied(true);
    } else {
      alert("Invalid Promo Code");
    }
  };

  const calculateDiscountedTotal = () => {
    const totalAmount = getTotalCartAmount();
    if (discountApplied) {
      return totalAmount * 0.9; // Apply 10% discount
    }
    return totalAmount;
  };

  // Delivery charge condition: Free delivery for order value greater than 300
  const deliveryFee = getTotalCartAmount() > 300 ? 0 : deliveryCharge;

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{currency}{item.price}</p>
                  <div>{cartItems[item._id]}</div>
                  <p>{currency}{item.price * cartItems[item._id]}</p>
                  <p className='cart-items-remove-icon' onClick={() => removeFromCart(item._id)}>x</p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{currency}{deliveryFee}</p>
            </div>
            {getTotalCartAmount() > 300 && (
              <p className="free-delivery-message">🎉 Free delivery on orders above ₹300!</p>
            )}
            <hr />
            {discountApplied && (
              <div className="cart-total-details"><p>Discount (10%)</p><p>-{currency}{(getTotalCartAmount() * 0.1).toFixed(2)}</p></div>
            )}
            <div className="cart-total-details">
              <b>Total</b>
              <b>{currency}{getTotalCartAmount() === 0 ? 0 : (calculateDiscountedTotal() + deliveryFee)}</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input 
                type="text" 
                placeholder='Promo code' 
                value={promoCode} 
                onChange={(e) => setPromoCode(e.target.value)} 
              />
              <button onClick={handlePromoCodeSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
