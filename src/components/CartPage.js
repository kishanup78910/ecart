import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';
import Swal from 'sweetalert2'; 

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState('fixed'); 

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const calculateSubtotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const applyDiscount = (subtotal) => {
    if (discountType === 'fixed') {
      return Math.max(0, subtotal - discount).toFixed(2);
    } else if (discountType === 'percentage') {
      return (subtotal - (subtotal * (discount / 100))).toFixed(2);
    }
    return subtotal;
  };

  const subtotal = calculateSubtotal();
  const total = applyDiscount(subtotal);

  const handleCheckout = () => {
    Swal.fire({
      title: 'Order Confirmed',
      text: 'Your order has been placed successfully!',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
       
        dispatch(clearCart());

        
        window.location.href = '/';
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg shadow-md">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover mr-4 rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600 mb-2">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity === 1}
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded-l-lg hover:bg-gray-400"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    className="w-12 text-center border rounded-lg mx-1"
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  />
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded-r-lg hover:bg-gray-400"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="bg-red-500 text-white px-4 py-2 ml-4 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Subtotal:</span>
              <span className="text-lg">${subtotal}</span>
            </div>
            <div className="flex flex-col space-y-2 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="discountType"
                  value="fixed"
                  checked={discountType === 'fixed'}
                  onChange={() => setDiscountType('fixed')}
                  className="mr-2"
                />
                Fixed Discount
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="discountType"
                  value="percentage"
                  checked={discountType === 'percentage'}
                  onChange={() => setDiscountType('percentage')}
                  className="mr-2"
                />
                Percentage Discount
              </label>
              <input
                type="text"
                placeholder={discountType === 'fixed' ? 'Enter discount amount' : 'Enter discount percentage'}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="border rounded-lg p-2"
              />
            </div>
            <div className="flex justify-between text-xl font-bold mb-4">
              <span>Total:</span>
              <span>${total}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
